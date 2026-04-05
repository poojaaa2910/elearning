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

  useEffect(() => {
    if (user) {
      applyUserSettings({
        visionDifficulty: user.visionDifficulty,
        readingSpeed: user.readingSpeed,
        colorBlindMode: user.colorBlindMode,
        cognitiveMode: user.cognitiveMode
      });
    }
  }, [user]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    let mounted = true;
    let zoomResetAttempted = false;

    const checkZoom = () => {
      if (!mounted) return;

      const scale = window.visualViewport.scale;
      const zoomPercent = Math.round(scale * 100);
      
      console.log('Visual viewport scale:', scale, 'Zoom:', zoomPercent + '%');

      // If user zooms in beyond 120%
      if (scale > 1.2) {
        const currentFontSize = useAdaptiveStore.getState().fontSize;
        
        if (currentFontSize !== 'xlarge') {
          console.log('Zoom detected:', zoomPercent, '-> setting xlarge font');
          setFontSize('xlarge');
          document.documentElement.classList.remove('font-normal', 'font-large');
          document.documentElement.classList.add('font-xlarge');
        }

        // Try to reset zoom to 100%
        if (!zoomResetAttempted) {
          zoomResetAttempted = true;
          console.log('Attempting to reset zoom to 100%');
          
          // Use visualViewport.offsetLeft to try to compensate
          // Note: This may not work in all browsers due to security restrictions
          if (window.visualViewport) {
            // Calculate the difference needed to bring back to 100%
            const offsetNeeded = (scale - 1) * window.innerWidth / 2;
            // This is a workaround - may not work perfectly
            window.scrollTo(window.scrollX - offsetNeeded, window.scrollY);
          }
        }
      } else if (scale <= 1.1 && zoomResetAttempted) {
        // Reset the flag when zoom goes back to normal
        zoomResetAttempted = false;
      }
    };

    // Use visualViewport resize event for more accurate zoom detection
    window.visualViewport.addEventListener('resize', checkZoom);
    
    // Initial check
    checkZoom();

    // Fallback interval
    const interval = setInterval(checkZoom, 500);

    return () => {
      mounted = false;
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', checkZoom);
      }
      clearInterval(interval);
    };
  }, [setFontSize]);

  const autoZoom = fontSize === 'xlarge';

  return {
    fontSize,
    contrastMode,
    simplifiedMode,
    colorBlindMode,
    darkMode,
    cognitiveMode,
    dyslexiaMode,
    autoZoom,
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
