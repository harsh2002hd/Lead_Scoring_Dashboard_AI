# Vercel Deployment Guide

## 🚨 **Important: Vercel is for Frontend Only**

Vercel is designed for frontend applications and serverless functions. Your FastAPI backend needs to be deployed separately.

## 📋 **Deployment Steps:**

### Step 1: Deploy Backend First

**Use Render (Recommended):**
1. Go to [render.com](https://render.com)
2. Create account and connect GitHub
3. Create new **Web Service**
4. Connect your repository
5. Configure settings:
   - **Name**: `ai-lead-scoring-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3
6. Deploy and copy the URL (e.g., `https://your-app.onrender.com`)

### Step 2: Update Frontend Configuration

1. **Update API URL** in `frontend/src/App.js`:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
   ```

2. **Set Environment Variable** in Vercel:
   - Go to your Vercel project settings
   - Add environment variable:
     - **Name**: `REACT_APP_API_URL`
     - **Value**: `https://your-backend-url.onrender.com`

### Step 3: Deploy Frontend to Vercel

**Option A: Deploy from Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Deploy

**Option B: Deploy from CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel
```

### Step 4: Configure CORS in Backend

Update your backend to allow Vercel domain:

```python
# In backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",  # Add your Vercel domain
        "https://your-username.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔧 **Configuration Files:**

- ✅ `vercel.json` - Root configuration
- ✅ `frontend/vercel.json` - Frontend-specific configuration
- ✅ Environment variables support

## 🐛 **Common Vercel Issues:**

### 1. **Build Errors**
- Ensure `package.json` is in the frontend directory
- Check that all dependencies are in `dependencies` (not `devDependencies`)
- Verify build command is correct

### 2. **API Connection Errors**
- Check if backend URL is correct in environment variables
- Verify CORS is configured properly
- Test backend URL directly

### 3. **Routing Issues**
- Ensure `vercel.json` has proper routes configuration
- Check if SPA routing is working

## 📊 **Final URLs:**

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend-url.onrender.com`
- **API Docs**: `https://your-backend-url.onrender.com/docs`

## ✅ **Deployment Checklist:**

- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Environment variable set in Vercel
- [ ] Frontend deployed to Vercel
- [ ] CORS configured in backend
- [ ] Both URLs working
- [ ] API calls successful

## 🎯 **Testing:**

1. **Test Backend**: `https://your-backend-url.onrender.com/health`
2. **Test Frontend**: `https://your-app.vercel.app`
3. **Test API Call**: Submit a lead form and check if scores are generated

## 📧 **Submission:**

Update your PDF report with:
- Frontend URL: `https://your-app.vercel.app`
- Backend URL: `https://your-backend-url.onrender.com`
- GitHub repository: `https://github.com/your-username/your-repo-name` 