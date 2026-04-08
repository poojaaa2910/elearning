from flask import Flask, request, jsonify
from flask_cors import CORS

import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import re
import string

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)
try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet', quiet=True)

app = Flask(__name__)
CORS(app)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    tokens = word_tokenize(text)
    tokens = [lemmatizer.lemmatize(token) for token in tokens if token not in stop_words]
    return ' '.join(tokens)

class UserProfileModel:
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=500)
        self.naive_bayes = MultinomialNB()
        self.logistic_regression = LogisticRegression(max_iter=1000)
        self.model = None
        self.is_trained = False
    
    def train(self, texts, labels, model_type='naive_bayes'):
        processed_texts = [preprocess_text(text) for text in texts]
        X = self.tfidf_vectorizer.fit_transform(processed_texts)
        
        if model_type == 'naive_bayes':
            self.model = self.naive_bayes
        else:
            self.model = self.logistic_regression
        
        self.model.fit(X, labels)
        self.is_trained = True
    
    def predict(self, text):
        if not self.is_trained:
            return None
        processed = preprocess_text(text)
        X = self.tfidf_vectorizer.transform([processed])
        return self.model.predict(X)[0]
    
    def predict_proba(self, text):
        if not self.is_trained:
            return None
        processed = preprocess_text(text)
        X = self.tfidf_vectorizer.transform([processed])
        return self.model.predict_proba(X)[0]

user_profile_model = UserProfileModel()

class BehaviorData:
    def __init__(self, userId, courseId, time_spent, scroll_depth, click_count):
        self.userId = userId
        self.courseId = courseId
        self.time_spent = time_spent
        self.scroll_depth = scroll_depth
        self.click_count = click_count

@app.route("/")
def root():
    return jsonify({"status": "ok", "message": "AdaptiveLearn ML Service is running"})

@app.route("/health")
def health_check():
    return jsonify({"status": "healthy"})

@app.route("/analyze", methods=["POST"])
def analyze_behavior():
    try:
        data = request.get_json()
        time_spent = data.get('time_spent', 0)
        scroll_depth = data.get('scroll_depth', 0)
        click_count = data.get('click_count', 0)
        
        time_factor = min(time_spent / 300, 1.0)
        scroll_factor = scroll_depth / 100.0
        click_factor = min(click_count / 10, 1.0)
        
        difficulty_score = (
            (time_factor * 0.4) + 
            ((1 - scroll_factor) * 0.4) + 
            ((1 - click_factor) * 0.2)
        ) * 10
        
        difficulty_score = max(1.0, min(10.0, difficulty_score))
        
        if time_spent > 300 and scroll_depth < 40:
            recommendation_type = "simplified"
        elif time_spent > 180 and click_count < 3:
            recommendation_type = "video"
        elif time_spent < 60 and scroll_depth > 80:
            recommendation_type = "advance"
        elif click_count > 8:
            recommendation_type = "interactive"
        else:
            recommendation_type = "text"
        
        confidence = 0.7 + (0.15 * (1 - abs(difficulty_score - 5) / 5))
        
        return jsonify({
            "difficulty_score": round(difficulty_score, 2),
            "recommendation_type": recommendation_type,
            "confidence": round(confidence, 2)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/recommend/<userId>", methods=["GET"])
def get_recommendations(userId):
    return jsonify({
        "userId": userId,
        "recommendations": [
            {"type": "simplified", "reason": "Low engagement detected"},
            {"type": "video", "reason": "High time spent"}
        ]
    })

@app.route("/train", methods=["POST"])
def train_model():
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        labels = data.get('labels', [])
        model_type = data.get('model_type', 'naive_bayes')
        
        if not texts or not labels:
            sample_texts = [
                "learn python basics programming",
                "advanced machine learning neural networks",
                "simple math addition subtraction",
                "complex data structures algorithms",
                "easy introduction to coding",
                "difficult quantum physics theory"
            ]
            sample_labels = ['beginner', 'advanced', 'beginner', 'advanced', 'beginner', 'advanced']
            user_profile_model.train(sample_texts, sample_labels, model_type)
            return jsonify({
                "status": "trained",
                "model_type": model_type,
                "message": "Trained with sample data"
            })
        
        user_profile_model.train(texts, labels, model_type)
        return jsonify({"status": "trained", "model_type": model_type})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        prediction = user_profile_model.predict(text)
        probabilities = user_profile_model.predict_proba(text)
        
        if prediction is None:
            return jsonify({"error": "Model not trained"}), 400
        
        return jsonify({
            "prediction": prediction,
            "probabilities": probabilities.tolist() if hasattr(probabilities, 'tolist') else list(probabilities)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)