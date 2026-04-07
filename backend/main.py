from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)