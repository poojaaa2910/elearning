import { create } from 'zustand';

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('adaptiveLearn_darkMode');
  if (saved !== null) {
    return JSON.parse(saved);
  }
  // Check system preference
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useAdaptiveStore = create((set, get) => ({
  // State
  fontSize: 'normal',      // normal, large, xlarge
  contrastMode: 'normal',  // normal, high
  simplifiedMode: false,   // true when readingSpeed is slow or cognitiveMode is true
  colorBlindMode: false,   // true when user has color blindness
  cognitiveMode: false,    // true when user prefers simplified content
  darkMode: getInitialDarkMode(),
  dyslexiaMode: false,      // true when user has dyslexia

  // Apply user settings from Firestore preferences
  applyUserSettings: (preferences) => {
    const { visionDifficulty, readingSpeed, colorBlindMode, cognitiveMode, dyslexiaMode } = preferences;
    
    // Vision → font size & contrast
    let fontSize = 'normal';
    let contrastMode = 'normal';
    if (visionDifficulty === 'high') {
      fontSize = 'xlarge';
      contrastMode = 'high';
    } else if (visionDifficulty === 'mild') {
      fontSize = 'large';
    }

    // Reading speed OR cognitive mode → simplified mode
    const simplifiedMode = readingSpeed === 'slow' || cognitiveMode === true;

    // Color blind mode
    const isColorBlind = colorBlindMode === true;

    set({ 
      fontSize, 
      contrastMode, 
      simplifiedMode, 
      colorBlindMode: isColorBlind,
      cognitiveMode: cognitiveMode || false,
      dyslexiaMode: dyslexiaMode || false
    });

    // Apply to DOM
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      const body = document.body;
      
      // Remove old font classes
      html.classList.remove('font-normal', 'font-large', 'font-xlarge');
      
      // Apply font scale to html
      html.classList.add(`font-${fontSize}`);
      
      // Remove old contrast classes
      html.classList.remove('contrast-normal', 'contrast-high');
      
      // Apply contrast mode
      html.classList.add(`contrast-${contrastMode}`);
      
      // Apply simplified mode
      if (simplifiedMode) {
        html.classList.add('simplified-mode');
      } else {
        html.classList.remove('simplified-mode');
      }
      
      // Apply color blind mode
      if (isColorBlind) {
        html.classList.add('colorblind-mode');
      } else {
        html.classList.remove('colorblind-mode');
      }
      
      // Apply dark mode
      if (get().darkMode) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      
      // Apply dyslexia mode
      const isDyslexia = dyslexiaMode === true;
      if (isDyslexia) {
        html.classList.add('dyslexia-mode');
      } else {
        html.classList.remove('dyslexia-mode');
      }
    }
  },

  // Dark mode with localStorage persistence
  setDarkMode: (enabled) => {
    set({ darkMode: enabled });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('adaptiveLearn_darkMode', JSON.stringify(enabled));
    }
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      if (enabled) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  },

  toggleDarkMode: () => {
    const current = get().darkMode;
    get().setDarkMode(!current);
  },

  // Manual override for simplified mode
  setSimplifiedMode: (enabled) => {
    set({ simplifiedMode: enabled });
    if (typeof document !== 'undefined') {
      if (enabled) {
        document.body.classList.add('simplified-mode');
      } else {
        document.body.classList.remove('simplified-mode');
      }
    }
  },

  // Toggle color blind mode (for manual override)
  setColorBlindMode: (enabled) => {
    set({ colorBlindMode: enabled });
    if (typeof document !== 'undefined') {
      if (enabled) {
        document.documentElement.classList.add('colorblind-mode');
      } else {
        document.documentElement.classList.remove('colorblind-mode');
      }
    }
  },

  // Set font size manually
  setFontSize: (size) => {
    const validSizes = ['normal', 'large', 'xlarge'];
    if (!validSizes.includes(size)) return;
    
    set({ fontSize: size });
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.classList.remove('font-normal', 'font-large', 'font-xlarge');
      html.classList.add(`font-${size}`);
    }
  },

  // Reset all settings
  reset: () => {
    set({
      fontSize: 'normal',
      contrastMode: 'normal',
      simplifiedMode: false,
      colorBlindMode: false,
      cognitiveMode: false,
      darkMode: getInitialDarkMode(),
      dyslexiaMode: false
    });
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.classList.remove('font-large', 'font-xlarge', 'contrast-high', 'simplified-mode', 'colorblind-mode', 'dyslexia-mode');
      if (get().darkMode) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  },

  // Toggle dyslexia mode
  setDyslexiaMode: (enabled) => {
    set({ dyslexiaMode: enabled });
    if (typeof document !== 'undefined') {
      if (enabled) {
        document.documentElement.classList.add('dyslexia-mode');
      } else {
        document.documentElement.classList.remove('dyslexia-mode');
      }
    }
  },

  toggleDyslexiaMode: () => {
    const current = get().dyslexiaMode;
    get().setDyslexiaMode(!current);
  }
}));