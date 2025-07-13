# AI Lead Scoring Dashboard

A comprehensive lead scoring system that combines Machine Learning with LLM-inspired reranking to predict lead intent and prioritize high-value prospects.

## Features

- **Machine Learning Model**: Gradient Boosting Classifier trained on bank marketing dataset
- **LLM Reranker**: Rule-based system that analyzes comments for intent keywords
- **Real-time Scoring**: FastAPI backend with <300ms response time
- **Interactive Dashboard**: React frontend with form, table, and charts
- **Data Persistence**: Local storage for leads and browser persistence
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Architecture

```
├── backend/          # FastAPI backend
│   ├── main.py       # API endpoints and LLM reranker
│   └── requirements.txt
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── LeadForm.js
│   │   │   ├── LeadTable.js
│   │   │   └── ScoreChart.js
│   │   └── App.js
│   └── package.json
├── model/            # ML model training
│   └── train_model.py
├── data/             # Dataset
│   └── bank.csv
└── README.md
```

## Dataset

The system uses the Bank Marketing Dataset with 11,163 records containing:
- **Demographics**: Age, job, marital status, education
- **Financial**: Balance, housing loan, personal loan, credit default
- **Campaign**: Contact type, duration, campaign contacts
- **Target**: Deposit (yes/no) - used as lead intent indicator

## ML Model

- **Algorithm**: Gradient Boosting Classifier
- **Features**: 14 relevant features for lead scoring
- **Performance**: Optimized for lead intent prediction
- **Output**: Probability score (0-100) indicating lead intent

## LLM Reranker

The rule-based reranker analyzes comments for:
- **Positive Keywords**: "urgent", "interested", "ready" (+5 to +15 points)
- **Negative Keywords**: "not interested", "expensive", "later" (-5 to -20 points)
- **Sentiment Analysis**: Exclamation marks (+2), question marks (-1)
- **Score Adjustment**: Final score capped at 0-100 range

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Train the ML model**:
   ```bash
   cd ../model
   python train_model.py
   ```

4. **Start the FastAPI server**:
   ```bash
   cd ../backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### Scoring a Lead

1. **Fill out the lead form** with customer information:
   - Demographics (age, job, marital status, education)
   - Financial data (balance, loans, credit default)
   - Campaign information (contact type, duration)
   - Comments (optional - analyzed by LLM reranker)

2. **Submit the form** to get both initial ML score and reranked score

3. **View results** in the table and chart sections

### Understanding Scores

- **0-20**: Very Low Intent (Red)
- **21-40**: Low Intent (Yellow)
- **41-60**: Medium Intent (Blue)
- **61-80**: High Intent (Blue)
- **81-100**: Very High Intent (Green)

### Features

- **Form Validation**: Input validation for all fields
- **Consent Checkbox**: Required for data processing compliance
- **Sortable Table**: Click column headers to sort leads
- **Score Distribution Chart**: Visual representation of score ranges
- **Statistics Dashboard**: Average scores and high-intent rates
- **Local Storage**: Leads persist across browser sessions

## API Endpoints

### POST /score
Score a lead using ML model and LLM reranker

**Request Body**:
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

**Response**:
```json
{
  "initial_score": 65.2,
  "reranked_score": 75.2,
  "message": "Lead scored successfully"
}
```

### GET /leads
Get all scored leads

### GET /health
Health check endpoint

## Deployment

### Backend Deployment (Render)

1. **Create a Render account** and new Web Service
2. **Connect your GitHub repository**
3. **Configure build settings**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Deploy** and get your API URL

### Frontend Deployment (Netlify)

1. **Create a Netlify account** and connect your repository
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Publish Directory: `build`
3. **Update API URL** in `frontend/src/App.js`
4. **Deploy** and get your app URL

## Compliance Features

- **Data Consent**: Required checkbox for data processing
- **Dummy Data**: No real PII collection
- **Local Storage**: Data stored locally in browser
- **Input Validation**: Comprehensive field validation

## Performance Metrics

- **API Latency**: <300ms response time
- **Model Accuracy**: Optimized for lead intent prediction
- **Reranker Effectiveness**: Score adjustments based on comment analysis
- **User Experience**: Responsive design with real-time feedback

## Technical Stack

### Backend
- **FastAPI**: Modern Python web framework
- **scikit-learn**: Machine learning library
- **pandas**: Data manipulation
- **joblib**: Model serialization

### Frontend
- **React**: JavaScript library for UI
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Data visualization
- **Axios**: HTTP client

### Machine Learning
- **Gradient Boosting**: Ensemble learning algorithm
- **Feature Engineering**: 14 relevant features
- **Model Persistence**: Saved as .pkl files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and demonstration purposes.

## Contact

For questions or support, please contact the development team. 