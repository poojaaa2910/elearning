import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const userService = {
  async getUser(uid) {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  },

  async updatePreferences(uid, preferences) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, preferences);
  },

  async setUserProgress(uid, courseId, milestoneId) {
    const progressRef = doc(db, 'progress', `${uid}_${courseId}`);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
      const data = progressDoc.data();
      const milestones = data.milestonesCompleted || [];
      if (!milestones.includes(milestoneId)) {
        await updateDoc(progressRef, {
          milestonesCompleted: [...milestones, milestoneId],
          currentMilestone: Math.max(data.currentMilestone || 0, milestoneId)
        });
      }
    } else {
      await setDoc(progressRef, {
        userId: uid,
        courseId,
        milestonesCompleted: [milestoneId],
        currentMilestone: milestoneId,
        createdAt: new Date().toISOString()
      });
    }
  },

  async getUserProgress(uid) {
    const progressRef = doc(db, 'progress', `${uid}`);
    const progressDoc = await getDoc(progressRef);
    return progressDoc.exists() ? progressDoc.data() : null;
  },

  async getCourseProgress(uid, courseId) {
    const progressRef = doc(db, 'progress', `${uid}_${courseId}`);
    const progressDoc = await getDoc(progressRef);
    return progressDoc.exists() ? progressDoc.data() : null;
  }
};