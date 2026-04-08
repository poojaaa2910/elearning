# AdaptiveLearn - Architecture Overview

## What We Built

AdaptiveLearn is an intelligent e-learning platform that adapts to each student's learning pace and preferences.

---

## Features

### 1. User Authentication
- Firebase Auth for secure signup/login
- Role-based access (student, admin)

### 2. Adaptive Learning Engine
- **Behavior Tracking**: Monitors time spent, scroll depth, and clicks
- **Difficulty Scoring**: Calculates 1-10 score based on engagement
- **Content Recommendations**: Suggests simplified/video/advanced/interactive content

### 3. NLP-Powered User Profiling (Ready-to-use)
- NLTK for text preprocessing (tokenization, stop-word removal, lemmatization)
- TF-IDF vectorization (unigrams + bigrams)
- Naïve Bayes & Logistic Regression models for user preference prediction

### 4. Course Management
- Browse courses by field
- Track progress
- Take quizzes
- Save notes

### 5. Admin Panel
- Course creation/editing
- User management
- Feedback monitoring
- Quiz editor

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + Tailwind |
| Backend | Flask (Python) |
| Database | Firebase Firestore |
| Auth | Firebase Auth |
| Deployment | Cloudflare Pages (Frontend) / Render (Backend) |

---

## How It Works Together

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   User      │ ───► │   Firebase  │ ◄──► │   Backend   │
│   Browser   │      │   Firestore │      │   (Flask)   │
└─────────────┘      └─────────────┘      └─────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
  React UI            User Data             ML Engine
  Components         Course Data           Behavior Analysis
                     Auth State            NLP Models
```

### Data Flow

1. **User visits course** → React tracks behavior (time, scroll, clicks)
2. **Behavior sent to backend** → `/analyze` endpoint calculates difficulty
3. **Recommendation returned** → Frontend adapts content display
4. **NLP Model** (optional) → Can be trained via `/train`, used via `/predict`

---

## Deployment

| Component | Platform | URL Pattern |
|-----------|----------|-------------|
| Frontend | Cloudflare Pages | `*.pages.dev` |
| Backend API | Render | `*.onrender.com` |
| Database | Firebase Firestore | Firebase Console |

### Environment Variables

**Frontend (.env):**
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FASTAPI_URL=https://backend.onrender.com
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Service status |
| `/analyze` | POST | Analyze user behavior → difficulty score |
| `/recommend/<userId>` | GET | Get content recommendations |
| `/train` | POST | Train NLP model (Naive Bayes / Logistic Regression) |
| `/predict` | POST | Predict user preference using trained model |

---

## Project Structure

```
elearning/
├── src/
│   ├── pages/          # React pages (Dashboard, Course, Quiz, etc.)
│   ├── components/     # Reusable UI components
│   ├── services/       # Firebase/auth/API services
│   ├── hooks/          # Custom React hooks (auth, behavior tracking)
│   ├── stores/         # Zustand state management
│   └── firebase/       # Firebase configuration
├── backend/
│   ├── main.py         # Flask API with ML endpoints
│   └── requirements.txt
├── public/             # Static assets
└── dist/              # Built frontend (deployed to Cloudflare)
```

---

## Machine Learning & AI Engine

Our adaptive learning system uses a hybrid approach combining behavioral analytics with NLP-powered user profiling.

### 1. Behavior Analysis Engine

Processes real-time user interactions to calculate engagement levels and content difficulty recommendations.

**Input Features:**
- `time_spent`: Duration on content (seconds)
- `scroll_depth`: Page coverage percentage (0-100%)
- `click_count`: Interactive element interactions

**Algorithm:**
```
time_factor = min(time_spent / 300, 1.0)
scroll_factor = scroll_depth / 100.0  
click_factor = min(click_count / 10, 1.0)

difficulty_score = ((time_factor × 0.4) + ((1 - scroll_factor) × 0.4) + ((1 - click_factor) × 0.2)) × 10
```

**Output:**
- Difficulty score (1-10 scale)
- Recommendation type: simplified / video / advance / interactive / text
- Confidence metric (0.7-0.85)

### 2. NLP User Profiling Pipeline

Extracts user preferences from text data using classical NLP techniques.

#### Text Preprocessing

```
Input Text → Lowercase → Remove Special Chars → Tokenize → Remove Stop-words → Lemmatize → Clean Output
```

- **Tokenization**: NLTK `word_tokenize`
- **Stop-words**: English stop-word corpus (nltk)
- **Lemmatization**: WordNet lemmatizer ("running" → "run")

#### Feature Extraction

**TF-IDF Vectorizer** with:
- Unigrams + Bigrams (`ngram_range=(1,2)`)
- Max 500 features

#### Classification Models

**Multinomial Naïve Bayes**
- Probabilistic classifier for discrete features
- Fast training, low memory footprint
- Ideal for text classification tasks

**Logistic Regression**
- Linear model with L2 regularization
- Outputs probability scores for each class

#### Training & Prediction

```
POST /train
  → Preprocess texts → Fit TF-IDF → Train NB or LR → Store model

POST /predict  
  → Preprocess → Vectorize → Return prediction + probabilities
```

---

## Ready-to-Enable Features

The NLP models are included but not active by default. To enable:

1. **Train the model**: Call `POST /train` with sample texts and labels
2. **Make predictions**: Call `POST /predict` with user text

Example:
```bash
curl -X POST https://your-api.onrender.com/train \
  -H "Content-Type: application/json" \
  -d '{"model_type": "logistic_regression"}'
```