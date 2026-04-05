import { useEffect, useCallback, useRef } from 'react';
import { useBehaviorStore } from '../stores/useBehaviorStore';
import { useAuthStore } from '../stores/useAuthStore';

export const useBehaviorTracking = (courseId, milestoneId) => {
  const { user } = useAuthStore();
  const {
    isTracking,
    scrollDepth,
    clickCount,
    recommendation,
    startTracking,
    updateScrollDepth,
    incrementClick,
    stopTracking,
    clearLogs
  } = useBehaviorStore();

  useEffect(() => {
    if (!isTracking && courseId && milestoneId && user?.uid) {
      startTracking();
    }
  }, [courseId, milestoneId, user?.uid]);

  useEffect(() => {
    if (!isTracking) return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollable = documentHeight - windowHeight;
      const depth = scrollable > 0 ? Math.round((scrollTop / scrollable) * 100) : 100;
      updateScrollDepth(Math.min(depth, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTracking, updateScrollDepth]);

  const trackClick = useCallback(() => {
    incrementClick();
  }, [incrementClick]);

  const trackTimeSpent = useCallback(async () => {
    if (!isTracking || !user?.uid || !courseId || !milestoneId) return null;
    return await stopTracking(user.uid, courseId, milestoneId);
  }, [isTracking, user?.uid, courseId, milestoneId, stopTracking]);

  const sendToML = useCallback(async (timeSpent, scroll, clicks) => {
    if (!user?.uid || !courseId) return null;
    const { behaviorService } = await import('../services/behaviorService');
    return await behaviorService.analyzeWithML(
      user.uid, courseId, timeSpent, scroll, clicks
    );
  }, [user?.uid, courseId]);

  return {
    isTracking,
    scrollDepth,
    clickCount,
    recommendation,
    trackClick,
    trackTimeSpent,
    sendToML,
    clearLogs
  };
};