import { collection, addDoc, query, where, getDocs, orderBy, limit, getDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const feedbackService = {
  async submitFeedback(courseId, userId, rating, feedback = '') {
    const feedbackData = {
      courseId,
      userId,
      rating,
      feedback,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'courseFeedback'), feedbackData);
    return { id: docRef.id, ...feedbackData };
  },

  async getUserFeedbackForCourse(userId, courseId) {
    const q = query(
      collection(db, 'courseFeedback'),
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  },

  async getFeedbackByCourse(courseId) {
    const q = query(
      collection(db, 'courseFeedback'),
      where('courseId', '==', courseId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getAllFeedback(limitCount = 50) {
    const q = query(
      collection(db, 'courseFeedback'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getFeedbackStats() {
    const snapshot = await getDocs(collection(db, 'courseFeedback'));
    const allFeedback = snapshot.docs.map(doc => doc.data());
    
    if (allFeedback.length === 0) {
      return { total: 0, averageRating: 0, distribution: {} };
    }
    
    const totalRatings = allFeedback.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = totalRatings / allFeedback.length;
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allFeedback.forEach(f => {
      if (distribution[f.rating] !== undefined) {
        distribution[f.rating]++;
      }
    });
    
    return {
      total: allFeedback.length,
      averageRating: Math.round(averageRating * 10) / 10,
      distribution
    };
  },

  async getFeedbackStatsByCourse(courseId) {
    const feedbackList = await this.getFeedbackByCourse(courseId);
    
    if (feedbackList.length === 0) {
      return { total: 0, averageRating: 0 };
    }
    
    const totalRatings = feedbackList.reduce((sum, f) => sum + f.rating, 0);
    return {
      total: feedbackList.length,
      averageRating: Math.round((totalRatings / feedbackList.length) * 10) / 10
    };
  },

  async deleteFeedback(feedbackId) {
    await deleteDoc(doc(db, 'courseFeedback', feedbackId));
  }
};