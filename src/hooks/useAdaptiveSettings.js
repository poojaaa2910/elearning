import { useEffect } from 'react';
import { useAdaptiveStore } from '../stores/useAdaptiveStore';
import { useAuthStore } from '../stores/useAuthStore';

export const useAdaptiveSettings = () => {
  const user = useAuthStore((state) => state.user);
  const {
    fontSize,
    contrastMode,
    simplifiedMode,
    colorBlindMode,
    darkMode,
    cognitiveMode,
    dyslexiaMode,
    applyUserSettings,
    setDarkMode,
    toggleDarkMode,
    setSimplifiedMode,
    setColorBlindMode,
    setFontSize,
    setDyslexiaMode,
    toggleDyslexiaMode,
    reset
  } = useAdaptiveStore();

  // Apply settings when user preferences load
  useEffect(() => {
    console.log('User data for adaptive settings:', user);
    if (user) {
      applyUserSettings({
        visionDifficulty: user.visionDifficulty,
        readingSpeed: user.readingSpeed,
        colorBlindMode: user.colorBlindMode,
        cognitiveMode: user.cognitiveMode
      });
    }
  }, [user]);

  // Apply dark mode on mount and when it changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  return {
    fontSize,
    contrastMode,
    simplifiedMode,
    colorBlindMode,
    darkMode,
    cognitiveMode,
    dyslexiaMode,
    setDarkMode,
    toggleDarkMode,
    setSimplifiedMode,
    setColorBlindMode,
    setFontSize,
    setDyslexiaMode,
    toggleDyslexiaMode,
    reset
  };
};