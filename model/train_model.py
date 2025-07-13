import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def train_lead_scoring_model():
    """
    Train a gradient boosting model for lead scoring using the bank dataset.
    """
    print("Loading dataset...")
    
    # Load the dataset
    df = pd.read_csv('../data/bank.csv')
    
    print(f"Dataset shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
    
    # Prepare features for lead scoring
    # We'll use relevant features for predicting lead intent
    feature_columns = [
        'age', 'job', 'marital', 'education', 'default', 
        'balance', 'housing', 'loan', 'contact', 'duration',
        'campaign', 'pdays', 'previous', 'poutcome'
    ]
    
    # Target variable - we'll use 'deposit' as our lead intent indicator
    target_column = 'deposit'
    
    # Prepare features
    X = df[feature_columns].copy()
    y = df[target_column]
    
    # Handle categorical variables
    categorical_columns = ['job', 'marital', 'education', 'default', 'housing', 'loan', 'contact', 'poutcome']
    
    label_encoders = {}
    for col in categorical_columns:
        if col in X.columns:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
            label_encoders[col] = le
    
    # Convert target to binary
    y = (y == 'yes').astype(int)
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Test set size: {X_test.shape[0]}")
    
    # Train the model
    print("Training Gradient Boosting Classifier...")
    model = GradientBoostingClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Model Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model and encoders
    print("Saving model and encoders...")
    joblib.dump(model, 'lead_scoring_model.pkl')
    joblib.dump(label_encoders, 'label_encoders.pkl')
    joblib.dump(feature_columns, 'feature_columns.pkl')
    
    # Save feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nFeature Importance:")
    print(feature_importance)
    
    print("\nModel training completed successfully!")
    print("Files saved:")
    print("- lead_scoring_model.pkl")
    print("- label_encoders.pkl")
    print("- feature_columns.pkl")

if __name__ == "__main__":
    train_lead_scoring_model() 