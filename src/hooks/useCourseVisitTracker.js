import { useState, useRef } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { userService } from '../services/userService';

const VISIT_THRESHOLD = 2;

export const useCourseVisitTracker = () => {
  const user = useAuthStore((state) => state.user);
  const hasShownHelpRef = useRef({});

  const getVisitCount = async (courseId, milestoneId) => {
    if (!user?.uid || !courseId || !milestoneId) return 0;
    try {
      const key = `course_${courseId}_milestone_${milestoneId}`;
      return await userService.getVisitCount(user.uid, key);
    } catch (error) {
      console.error('Error getting visit count:', error);
      return 0;
    }
  };

  const trackMilestoneCompletion = async (courseId, milestoneId) => {
    console.log('trackMilestoneCompletion called:', { courseId, milestoneId, user: user?.uid });
    
    if (!user?.uid || !courseId || !milestoneId) {
      console.log('Missing required params');
      return;
    }

    try {
      const key = `course_${courseId}_milestone_${milestoneId}`;
      console.log('Tracking key:', key);
      
      const currentCount = await userService.getVisitCount(user.uid, key);
      const newCount = currentCount + 1;
      
      await userService.incrementVisitCount(user.uid, key);

      console.log(`📚 Completed milestone #${newCount} times`);

      if (newCount >= VISIT_THRESHOLD && !hasShownHelpRef.current[key]) {
        hasShownHelpRef.current[key] = true;
        return { isStruggling: true, count: newCount };
      }
      
      return { isStruggling: false, count: newCount };
    } catch (error) {
      console.error('Error tracking milestone completion:', error);
    }
  };

  const resetStrugglingForMilestone = (courseId, milestoneId) => {
    const key = `course_${courseId}_milestone_${milestoneId}`;
    hasShownHelpRef.current[key] = false;
  };

  return { trackMilestoneCompletion, getVisitCount, resetStrugglingForMilestone };
};
