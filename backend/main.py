from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(title="AdaptiveLearn ML Service", version="1.0.0")

class BehaviorData(BaseModel):
    userId: str
    courseId: str
    time_spent: float
    scroll_depth: float
    click_count: int

class AnalysisResult(BaseModel):
    difficulty_score: float
    recommendation_type: str
    confidence: float = 0.85

@app.get("/")
async def root():
    return {"status": "ok", "message": "AdaptiveLearn ML Service is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze_behavior(data: BehaviorData) -> AnalysisResult:
    try:
        time_spent = data.time_spent
        scroll_depth = data.scroll_depth
        click_count = data.click_count
        
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
        
        return AnalysisResult(
            difficulty_score=round(difficulty_score, 2),
            recommendation_type=recommendation_type,
            confidence=round(confidence, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommend/{userId}")
async def get_recommendations(userId: str):
    return {
        "userId": userId,
        "recommendations": [
            {"type": "simplified", "reason": "Low engagement detected"},
            {"type": "video", "reason": "High time spent"}
        ]
    }

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)