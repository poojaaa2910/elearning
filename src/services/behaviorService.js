import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

const FASTAPI_URL = 'https://adaptivelearn-api.onrender.com';

export const behaviorService = {
  async logBehavior(userId, courseId, milestoneId, data) {
    const behaviorData = {
      userId,
      courseId,
      milestoneId,
      timeSpent: data.timeSpent || 0,
      scrollDepth: data.scrollDepth || 0,
      clickCount: data.clickCount || 0,
      timestamp: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'behavior_logs'), behaviorData);
    return docRef.id;
  },

  async getBehaviorLogs(userId, courseId) {
    const q = query(
      collection(db, 'behavior_logs'),
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getRecentBehaviors(userId, courseId, limitCount = 10) {
    const q = query(
      collection(db, 'behavior_logs'),
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async analyzeWithML(userId, courseId, timeSpent, scrollDepth, clickCount) {
    // Rule-based fallback when backend is unavailable
    const timeFactor = Math.min(timeSpent / 300, 1);
    const scrollFactor = scrollDepth / 100;
    const clickFactor = Math.min(clickCount / 10, 1);
    
    const difficulty = (timeFactor * 0.4) + ((1 - scrollFactor) * 0.4) + ((1 - clickFactor) * 0.2);
    const score = Math.max(1, Math.min(10, difficulty * 10));
    
    let recommendation = 'text';
    if (timeSpent > 300 && scrollDepth < 40) {
      recommendation = 'simplified';
    } else if (timeSpent > 180 && clickCount < 3) {
      recommendation = 'video';
    } else if (timeSpent < 60 && scrollDepth > 80) {
      recommendation = 'advance';
    } else if (clickCount > 8) {
      recommendation = 'interactive';
    }

    try {
      const response = await fetch(`${FASTAPI_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          courseId,
          time_spent: timeSpent,
          scroll_depth: scrollDepth,
          click_count: clickCount
        })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('Using local analysis (backend unavailable)');
    }
    
    return { 
      difficulty_score: Math.round(score * 10) / 10, 
      recommendation_type: recommendation,
      confidence: 0.7
    };
  }
};