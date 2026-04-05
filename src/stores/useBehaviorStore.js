import { create } from 'zustand';
import { behaviorService } from '../services/behaviorService';

export const useBehaviorStore = create((set, get) => ({
  currentLogs: [],
  isTracking: false,
  startTime: null,
  scrollDepth: 0,
  clickCount: 0,
  recommendation: null,
  loading: false,

  startTracking: () => {
    set({
      isTracking: true,
      startTime: Date.now(),
      scrollDepth: 0,
      clickCount: 0
    });
  },

  updateScrollDepth: (depth) => {
    set({ scrollDepth: depth });
  },

  incrementClick: () => {
    set((state) => ({ clickCount: state.clickCount + 1 }));
  },

  stopTracking: async (userId, courseId, milestoneId) => {
    const { startTime, scrollDepth, clickCount } = get();
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    try {
      await behaviorService.logBehavior(userId, courseId, milestoneId, {
        timeSpent,
        scrollDepth,
        clickCount
      });

      const result = await behaviorService.analyzeWithML(
        userId, courseId, timeSpent, scrollDepth, clickCount
      );
      
      set({ 
        isTracking: false, 
        recommendation: result,
        currentLogs: [...get().currentLogs, { timeSpent, scrollDepth, clickCount, timestamp: new Date() }]
      });

      return { timeSpent, scrollDepth, clickCount, recommendation: result };
    } catch (error) {
      console.error('Error stopping tracking:', error);
      set({ isTracking: false });
      return null;
    }
  },

  setRecommendation: (recommendation) => {
    set({ recommendation });
  },

  clearLogs: () => {
    set({ currentLogs: [], recommendation: null });
  }
}));