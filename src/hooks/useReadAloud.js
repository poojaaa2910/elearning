import { useState, useCallback, useRef, useEffect } from 'react';

export const useReadAloud = () => {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [currentVoice, setCurrentVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [error, setError] = useState(null);
  const [ttsMethod, setTtsMethod] = useState('browser'); // 'browser', 'extension', 'external'
  const synthRef = useRef(null);
  const rvLoaded = useRef(false);

  // Initialize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = synthRef.current?.getVoices() || [];
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setCurrentVoice(availableVoices[0]);
        setTtsMethod('browser');
      } else {
        // Try external TTS
        setTtsMethod('external');
      }
    };

    loadVoices();
    synthRef.current.onvoiceschanged = loadVoices;

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = useCallback((text) => {
    setError(null);
    setSpeaking(true);

    // Method 1: Browser TTS
    if (ttsMethod === 'browser' && synthRef.current) {
      synthRef.current.cancel();
      const availableVoices = synthRef.current.getVoices();
      
      if (availableVoices.length > 0) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = availableVoices[0];
        utterance.rate = rate;
        
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => { setSpeaking(false); setPaused(false); };
        utterance.onerror = (e) => {
          console.error('Browser TTS error:', e);
          tryExternalTTS(text);
        };

        synthRef.current.speak(utterance);
        return;
      }
    }

    // Method 2: Try external TTS
    tryExternalTTS(text);
  }, [rate, ttsMethod]);

  const tryExternalTTS = async (text) => {
    try {
      // Check if ResponsiveVoice is already loaded
      if (!rvLoaded.current) {
        // Load ResponsiveVoice script
        if (!document.querySelector('script[src*="responsivevoice"]')) {
          const script = document.createElement('script');
          script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=demo';
          script.async = true;
          document.head.appendChild(script);
          
          // Wait for script to load
          await new Promise((resolve, reject) => {
            script.onload = () => { rvLoaded.current = true; resolve(); };
            script.onerror = reject;
            setTimeout(() => reject(new Error('Timeout')), 5000);
          });
        }
      }

      if (window.responsiveVoice) {
        window.responsiveVoice.speak(text, 'English US', {
          rate: rate,
          onstart: () => setSpeaking(true),
          onend: () => { setSpeaking(false); setPaused(false); },
          onerror: (e) => {
            console.error('ResponsiveVoice error:', e);
            setError('Could not play audio');
            setSpeaking(false);
          }
        });
        return;
      }

      throw new Error('ResponsiveVoice not available');
    } catch (err) {
      console.error('External TTS failed:', err);
      // Last resort: try browser again
      tryBrowserTTS(text);
    }
  };

  const tryBrowserTTS = (text) => {
    if (!synthRef.current) return;
    
    // Force browser to try TTS even without voices
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => { setSpeaking(false); setPaused(false); };
    utterance.onerror = (e) => {
      console.error('All TTS methods failed');
      setError('Text-to-speech unavailable. Install system voices or use Chrome.');
      setSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const pause = useCallback(() => {
    if (synthRef.current?.speaking) {
      synthRef.current.pause();
      setPaused(true);
    } else if (window.responsiveVoice) {
      window.responsiveVoice.pause();
      setPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (synthRef.current?.paused) {
      synthRef.current.resume();
      setPaused(false);
    } else if (window.responsiveVoice) {
      window.responsiveVoice.unpause();
      setPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
    }
    setSpeaking(false);
    setPaused(false);
  }, []);

  const toggle = useCallback((text) => {
    if (speaking && !paused) {
      pause();
    } else if (paused) {
      resume();
    } else {
      speak(text);
    }
  }, [speaking, paused, pause, resume, speak]);

  return {
    speaking,
    paused,
    voices,
    currentVoice,
    rate,
    error,
    ttsMethod,
    setCurrentVoice,
    setRate,
    speak,
    pause,
    resume,
    stop,
    toggle
  };
};

export default useReadAloud;
