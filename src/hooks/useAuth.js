import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export const useAuth = () => {
  const { 
    user, 
    loading, 
    error, 
    initialized,
    initialize, 
    signInWithGoogle, 
    logout,
    updateUser,
    clearError
  } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    needsOnboarding: !user?.preferredLearning,
    signInWithGoogle,
    logout,
    updateUser,
    clearError
  };
};