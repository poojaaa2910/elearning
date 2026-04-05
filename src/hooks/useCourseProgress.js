import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

export const useCourseProgress = (userId, courseId) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !courseId) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const data = await userService.getCourseProgress(userId, courseId);
        setProgress(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId, courseId]);

  const completeMilestone = useCallback(async (milestoneId) => {
    if (!userId || !courseId) return;
    
    try {
      await userService.setUserProgress(userId, courseId, milestoneId);
      setProgress(prev => ({
        ...prev,
        milestonesCompleted: [...(prev?.milestonesCompleted || []), milestoneId],
        currentMilestone: Math.max(prev?.currentMilestone || 0, milestoneId)
      }));
    } catch (error) {
      console.error('Error completing milestone:', error);
    }
  }, [userId, courseId]);

  const isMilestoneCompleted = useCallback((milestoneId) => {
    return progress?.milestonesCompleted?.includes(milestoneId) || false;
  }, [progress?.milestonesCompleted]);

  const getProgressPercentage = useCallback((totalMilestones = 5) => {
    if (!progress?.milestonesCompleted) return 0;
    return Math.round((progress.milestonesCompleted.length / totalMilestones) * 100);
  }, [progress?.milestonesCompleted]);

  return {
    progress,
    loading,
    completeMilestone,
    isMilestoneCompleted,
    getProgressPercentage,
    currentMilestone: progress?.currentMilestone || 0,
    completedCount: progress?.milestonesCompleted?.length || 0
  };
};