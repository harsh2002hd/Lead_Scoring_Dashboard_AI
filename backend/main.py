from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional
import joblib
import pandas as pd
import numpy as np
import re
from datetime import datetime
import os

# Initialize FastAPI app
app = FastAPI(
    title="AI Lead Scoring Dashboard API",
    description="API for lead scoring using ML model and LLM reranker",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model and encoders
try:
    model = joblib.load('../model/lead_scoring_model.pkl')
    label_encoders = joblib.load('../model/label_encoders.pkl')
    feature_columns = joblib.load('../model/feature_columns.pkl')
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    label_encoders = None
    feature_columns = None

# In-memory storage for leads
leads_storage = []

# Pydantic models for request/response
class LeadData(BaseModel):
    age: int
    job: str
    marital: str
    education: str
    default: str
    balance: float
    housing: str
    loan: str
    contact: str
    duration: int
    campaign: int
    pdays: int
    previous: int
    poutcome: str
    comments: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    consent: bool
    
    @validator('age')
    def validate_age(cls, v):
        if v < 18 or v > 100:
            raise ValueError('Age must be between 18 and 100')
        return v
    
    @validator('balance')
    def validate_balance(cls, v):
        if v < 0:
            raise ValueError('Balance cannot be negative')
        return v
    
    @validator('consent')
    def validate_consent(cls, v):
        if not v:
            raise ValueError('Consent is required')
        return v

class LeadScore(BaseModel):
    email: str
    initial_score: float
    reranked_score: float
    comments: str
    timestamp: str

class ScoreResponse(BaseModel):
    initial_score: float
    reranked_score: float
    message: str

# LLM-inspired reranker function
def llm_reranker(initial_score: float, comments: str) -> float:
    """
    Rule-based reranker that simulates LLM behavior by analyzing comments
    and adjusting the initial score based on keywords and sentiment.
    """
    if not comments:
        return initial_score
    
    comments_lower = comments.lower()
    adjustment = 0
    
    # Positive keywords that indicate high intent
    positive_keywords = {
        'urgent': 15,
        'interested': 10,
        'ready': 10,
        'immediately': 12,
        'asap': 15,
        'need': 8,
        'want': 8,
        'looking': 5,
        'considering': 5,
        'planning': 5,
        'definitely': 10,
        'sure': 8,
        'yes': 5,
        'positive': 8,
        'good': 5,
        'great': 8,
        'excellent': 10,
        'perfect': 12,
        'investment': 8,
        'financial': 5,
        'money': 5,
        'savings': 5,
        'future': 5,
        'family': 5,
        'children': 5,
        'retirement': 8,
        'buy': 10,
        'purchase': 10,
        'apply': 10,
        'sign': 10,
        'proceed': 10
    }
    
    # Negative keywords that indicate low intent
    negative_keywords = {
        'not interested': -20,
        'no interest': -15,
        'not ready': -10,
        'later': -8,
        'maybe': -5,
        'unsure': -8,
        'uncertain': -8,
        'doubt': -10,
        'expensive': -8,
        'costly': -8,
        'too much': -10,
        'cannot afford': -15,
        'no money': -15,
        'poor': -8,
        'bad': -8,
        'terrible': -10,
        'worried': -8,
        'concerned': -5,
        'risk': -5,
        'scared': -10,
        'fear': -8,
        'anxious': -5,
        'stress': -5,
        'debt': -10,
        'owe': -10,
        'loan': -5,
        'credit': -5,
        'bankrupt': -20,
        'struggling': -10,
        'difficult': -5,
        'hard': -5,
        'impossible': -15,
        'never': -15,
        'no way': -15,
        'forget': -10,
        'ignore': -10,
        'delete': -10,
        'unsubscribe': -15,
        'stop': -10,
        'quit': -10,
        'leave': -8,
        'exit': -8
    }
    
    # Check for positive keywords
    for keyword, score in positive_keywords.items():
        if keyword in comments_lower:
            adjustment += score
            print(f"Positive keyword '{keyword}' found: +{score}")
    
    # Check for negative keywords
    for keyword, score in negative_keywords.items():
        if keyword in comments_lower:
            adjustment += score
            print(f"Negative keyword '{keyword}' found: {score}")
    
    # Sentiment analysis based on exclamation marks and question marks
    exclamation_count = comments.count('!')
    question_count = comments.count('?')
    
    if exclamation_count > 0:
        adjustment += exclamation_count * 2  # Each exclamation adds 2 points
        print(f"Exclamation marks found: +{exclamation_count * 2}")
    
    if question_count > 0:
        adjustment -= question_count * 1  # Each question subtracts 1 point
        print(f"Question marks found: -{question_count * 1}")
    
    # Calculate final score
    final_score = initial_score + adjustment
    
    # Ensure score is within 0-100 range
    final_score = max(0, min(100, final_score))
    
    return final_score

def predict_lead_score(lead_data: dict) -> float:
    """
    Predict lead score using the trained ML model.
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Prepare features
    features = []
    for col in feature_columns:
        if col in lead_data:
            value = lead_data[col]
            
            # Handle categorical variables
            if col in label_encoders:
                # Convert to string and encode
                value_str = str(value)
                if value_str in label_encoders[col].classes_:
                    value = label_encoders[col].transform([value_str])[0]
                else:
                    # If unknown category, use most common
                    value = 0
            
            features.append(value)
        else:
            features.append(0)  # Default value
    
    # Make prediction
    prediction_proba = model.predict_proba([features])[0]
    
    # Return probability of positive class (high intent) scaled to 0-100
    return prediction_proba[1] * 100

@app.post("/score", response_model=ScoreResponse)
async def score_lead(lead_data: LeadData):
    """
    Score a lead using ML model and LLM reranker.
    """
    try:
        # Convert lead data to dictionary
        lead_dict = lead_data.dict()
        
        # Get initial score from ML model
        initial_score = predict_lead_score(lead_dict)
        
        # Apply LLM reranker
        reranked_score = llm_reranker(initial_score, lead_data.comments)
        
        # Store lead data
        lead_record = LeadScore(
            email=lead_data.email or "anonymous@example.com",
            initial_score=round(initial_score, 2),
            reranked_score=round(reranked_score, 2),
            comments=lead_data.comments,
            timestamp=datetime.now().isoformat()
        )
        leads_storage.append(lead_record)
        
        # Keep only last 100 leads in memory
        if len(leads_storage) > 100:
            leads_storage.pop(0)
        
        return ScoreResponse(
            initial_score=round(initial_score, 2),
            reranked_score=round(reranked_score, 2),
            message="Lead scored successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scoring lead: {str(e)}")

@app.get("/leads", response_model=List[LeadScore])
async def get_leads():
    """
    Get all scored leads.
    """
    return leads_storage

@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "leads_count": len(leads_storage)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 