# GitHub Deployment Guide

## 🚀 Complete Setup for GitHub Pages Deployment

### Step 1: Prepare Your Repository

1. **Create a new GitHub repository**
2. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

### Step 2: Deploy Backend First

#### Option A: Render (Recommended)
1. Go to [render.com](https://render.com)
2. Create account and connect GitHub
3. Create new **Web Service**
4. Connect your repository
5. Configure settings:
   - **Name**: `ai-lead-scoring-backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3
6. Deploy and copy the URL (e.g., `https://your-app.onrender.com`)

#### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Deploy automatically
4. Copy the generated URL

### Step 3: Update Frontend Configuration

1. **Update the API URL** in `frontend/src/App.js`:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
   ```

2. **Update homepage** in `frontend/package.json`:
   ```json
   "homepage": "https://your-username.github.io/your-repo-name"
   ```

3. **Set GitHub Secrets**:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add new repository secret:
     - **Name**: `REACT_APP_API_URL`
     - **Value**: `https://your-backend-url.onrender.com`

### Step 4: Enable GitHub Pages

1. Go to repository Settings
2. Scroll to "Pages" section
3. Source: "Deploy from a branch"
4. Branch: "gh-pages" (will be created by GitHub Actions)
5. Save

### Step 5: Deploy Frontend

#### Option A: GitHub Actions (Automatic)
- The workflow will automatically deploy when you push to main
- Check Actions tab for deployment status

#### Option B: Manual Deployment
```bash
cd frontend
npm install
npm run deploy
```

### Step 6: Test Your Deployment

1. **Backend**: Test at `https://your-backend-url.onrender.com/health`
2. **Frontend**: Test at `https://your-username.github.io/your-repo-name`

## 🔧 Configuration Files Added

### Backend Files:
- `backend/Procfile` - For Render deployment
- `backend/runtime.txt` - Python version specification

### Frontend Files:
- `frontend/public/_redirects` - For Netlify SPA routing
- `frontend/package.json` - Updated with GitHub Pages config
- `.github/workflows/deploy.yml` - GitHub Actions workflow

### Environment Variables:
- `REACT_APP_API_URL` - Set in GitHub Secrets

## 📋 Deployment Checklist

- [ ] Backend deployed to Render/Railway
- [ ] Backend URL copied
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] GitHub Secrets configured
- [ ] GitHub Pages enabled
- [ ] Frontend deployed
- [ ] Both URLs working

## 🐛 Troubleshooting

### Backend Issues:
- Check Render/Railway logs
- Verify `requirements.txt` is in backend folder
- Ensure `main.py` is in backend folder

### Frontend Issues:
- Check GitHub Actions logs
- Verify `REACT_APP_API_URL` secret is set
- Ensure `homepage` in package.json is correct

### CORS Issues:
- Backend should allow all origins in production
- Check if API URL is correct in frontend

## 🎯 Final URLs

- **Frontend**: `https://your-username.github.io/your-repo-name`
- **Backend**: `https://your-backend-url.onrender.com`
- **API Docs**: `https://your-backend-url.onrender.com/docs`

## 📧 Submission

Once deployed, update your PDF report with:
- Frontend URL: `https://your-username.github.io/your-repo-name`
- Backend URL: `https://your-backend-url.onrender.com`
- GitHub repository: `https://github.com/your-username/your-repo-name` 