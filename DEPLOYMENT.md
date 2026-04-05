# Deployment Guide

## Frontend: Cloudflare Pages

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/adaptive-learn.git
   git push -u origin main
   ```

### Step 2: Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click "Pages" in the sidebar
3. Click "Connect to Git"
4. Select your GitHub repository
5. Configure build settings:
   - **Project name:** adaptive-learn
   - **Production branch:** main
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Click "Save and Deploy"

### Step 3: Add Environment Variables

In Cloudflare Pages settings, add these environment variables:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FASTAPI_URL=https://your-fastapi.onrender.com
```

### Step 4: Configure Custom Domain (Optional)

1. Go to "Custom domains" in Cloudflare Pages
2. Add your domain
3. Update your DNS records as instructed

---

## Backend: FastAPI on Render

### Step 1: Push Backend Code to GitHub

1. Create a separate repository or add backend folder to existing repo
2. Ensure these files are included:
   - `backend/main.py`
   - `backend/requirements.txt`

### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** adaptive-learn-api
   - **Root Directory:** backend
   - **Environment:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click "Create Web Service"

### Step 3: Get Backend URL

Once deployed, you'll get a URL like:
`https://adaptive-learn-api.onrender.com`

Use this URL to update your frontend's `VITE_FASTAPI_URL` environment variable in Cloudflare.

---

## Testing the Deployment

### Frontend Testing
1. Visit your Cloudflare Pages URL
2. Try signing up a new user
3. Complete onboarding
4. Browse courses

### Backend Testing
1. Test the health endpoint:
   ```
   curl https://your-api.onrender.com/health
   ```
2. Test the analyze endpoint:
   ```bash
   curl -X POST https://your-api.onrender.com/analyze \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "test123",
       "courseId": "js-basics",
       "time_spent": 120,
       "scroll_depth": 80,
       "click_count": 5
     }'
   ```

Expected response:
```json
{
  "difficulty_score": 3.5,
  "recommendation_type": "text",
  "confidence": 0.8
}
```

---

## Important Notes

### CORS Issues
If you get CORS errors, update your FastAPI main.py to allow your Cloudflare domain:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.pages.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Firestore Security
Before going to production:
1. Update Firestore rules (see FIREBASE_SETUP.md)
2. Enable Firebase App Check (optional, for extra security)

### Performance Tips
- Enable caching on Cloudflare Pages
- Use Firebase CDN for static assets
- Consider using Firebase Hosting instead of Cloudflare for better Firebase integration