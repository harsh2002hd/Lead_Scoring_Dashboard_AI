# AI Lead Scoring Dashboard - Deployment Guide

## Current Status

✅ **Backend**: FastAPI server running on http://localhost:8000
✅ **Frontend**: React app running on http://localhost:3000
✅ **ML Model**: Trained and saved (82.98% accuracy)
✅ **LLM Reranker**: Implemented with keyword analysis

## Local Development

### Backend (FastAPI)
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### Frontend (React)
- **URL**: http://localhost:3000
- **Features**: Lead form, scoring table, charts

## API Endpoints

### POST /score
Score a lead using ML model and LLM reranker

**Example Request**:
```json
{
  "age": 25,
  "job": "admin.",
  "marital": "single",
  "education": "secondary",
  "default": "no",
  "balance": 1000.0,
  "housing": "yes",
  "loan": "no",
  "contact": "unknown",
  "duration": 300,
  "campaign": 1,
  "pdays": -1,
  "previous": 0,
  "poutcome": "unknown",
  "comments": "Interested in investment options",
  "email": "john.doe@example.com",
  "phone": "+91-9876543210",
  "consent": true
}
```

**Example Response**:
```json
{
  "initial_score": 65.2,
  "reranked_score": 75.2,
  "message": "Lead scored successfully"
}
```

## Production Deployment

### Backend Deployment (Render)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up and create account

2. **Create New Web Service**
   - Connect GitHub repository
   - Choose "Web Service"

3. **Configure Settings**:
   - **Name**: ai-lead-scoring-backend
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the provided URL

### Frontend Deployment (Netlify)

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up and create account

2. **Deploy from Git**
   - Connect GitHub repository
   - Choose repository

3. **Configure Build Settings**:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Base Directory**: Leave empty

4. **Environment Variables**:
   - Add `REACT_APP_API_URL` with your backend URL

5. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete

### Update API URL

After deploying backend, update the API URL in `frontend/src/App.js`:

```javascript
const API_BASE_URL = 'https://your-backend-url.onrender.com';
```

## Testing the Application

### 1. Test Lead Scoring
- Fill out the lead form with sample data
- Submit and verify scores are generated
- Check that both initial and reranked scores appear

### 2. Test LLM Reranker
- Add comments with positive keywords: "urgent", "interested", "ready"
- Add comments with negative keywords: "not interested", "expensive"
- Verify score adjustments

### 3. Test Features
- Sort table by different columns
- View score distribution chart
- Check local storage persistence
- Test form validation

## Performance Metrics

- **API Response Time**: <300ms
- **Model Accuracy**: 82.98%
- **Feature Importance**: Duration (51%), Contact (9%), Pdays (8.7%)

## Compliance Features

- ✅ Consent checkbox required
- ✅ Input validation
- ✅ Local storage only (no server-side PII storage)
- ✅ Dummy data usage

## Troubleshooting

### Backend Issues
- Check if model files exist in `model/` directory
- Verify all dependencies installed
- Check logs for import errors

### Frontend Issues
- Clear browser cache
- Check console for API errors
- Verify API URL is correct

### Deployment Issues
- Ensure all files committed to Git
- Check build logs for errors
- Verify environment variables set correctly

## Files Structure

```
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   └── App.js          # Main app
│   └── package.json        # Node dependencies
├── model/
│   ├── train_model.py      # ML model training
│   ├── lead_scoring_model.pkl
│   ├── label_encoders.pkl
│   └── feature_columns.pkl
├── data/
│   └── bank.csv           # Dataset
└── README.md
```

## Next Steps

1. **Deploy to production platforms**
2. **Test with real data**
3. **Monitor performance**
4. **Gather user feedback**
5. **Iterate and improve**

## Contact

For support or questions, please contact the development team. 