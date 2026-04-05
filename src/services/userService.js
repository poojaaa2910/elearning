import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
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
  },

  async markCourseCompleted(uid, courseId, score) {
    const progressRef = doc(db, 'progress', `${uid}_${courseId}`);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
      await updateDoc(progressRef, {
        completed: true,
        completedAt: new Date().toISOString(),
        quizScore: score
      });
    } else {
      await setDoc(progressRef, {
        userId: uid,
        courseId,
        completed: true,
        completedAt: new Date().toISOString(),
        quizScore: score,
        milestonesCompleted: [],
        createdAt: new Date().toISOString()
      });
    }
  },

  async getVisitCount(uid, key) {
    const visitsRef = doc(db, 'visits', uid);
    const visitsDoc = await getDoc(visitsRef);
    const data = visitsDoc.exists() ? visitsDoc.data() : {};
    return data[key] || 0;
  },

  async incrementVisitCount(uid, key) {
    const visitsRef = doc(db, 'visits', uid);
    const visitsDoc = await getDoc(visitsRef);
    
    if (visitsDoc.exists()) {
      await updateDoc(visitsRef, {
        [key]: increment(1)
      });
    } else {
      await setDoc(visitsRef, {
        [key]: 1,
        userId: uid
      });
    }
  }
};