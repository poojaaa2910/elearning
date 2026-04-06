import { useState, useRef, useEffect } from 'react';

const API_KEY = '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';
const MODEL_NAME = 'google/gemini-2.0-flash-001';
const API_URL = 'https://openrouter.ai/api/v1';
const SITE_URL = 'https://elearning-1fn.pages.dev';
const SITE_NAME = 'AdaptiveLearn';
const STORAGE_KEY = 'adaptiveLearn_chatHistory';

const SYSTEM_PROMPT = `You are an AI learning assistant for an e-learning platform called AdaptiveLearn. Your role is to help students with their learning journey.

You can help with:
1. Explaining concepts from courses (Coding, Management, Philosophy)
2. Answering questions about the platform and its features
3. Providing study tips and learning strategies
4. Helping with course-related doubts
5. Guiding users through the platform navigation

Context about the platform:
- AdaptiveLearn is an adaptive learning platform with three main fields: Coding, Management, and Philosophy
- The platform adapts to user preferences including font size, dark mode, color blind mode, and cognitive mode
- Users can track their progress through milestones in each course
- There are video, audio, and reading materials available
- The platform has an onboarding process to set learning preferences

When a user is struggling (visiting a section multiple times), be extra patient and offer to explain concepts in different ways.

Always be helpful, concise, and encouraging. If you don't know something, admit it and suggest where the user might find the answer.`;

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading chat history:', e);
  }
  return null;
};

const saveToStorage = (msgs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch (e) {
    console.error('Error saving chat history:', e);
  }
};

const defaultMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm LearnMate, your AI learning assistant. I can help you with any questions about our courses, platform features, or learning concepts. What would you like to know?",
  timestamp: Date.now()
};

const useChatbot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [courseContext, setCourseContext] = useState(null);
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState(() => {
    const saved = loadFromStorage();
    return saved && saved.length > 0 ? saved : [defaultMessage];
  });

  useEffect(() => {
    saveToStorage(messages);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const messagesForAPI = messages.map(m => ({ role: m.role, content: m.content }));
      
      let systemWithContext = SYSTEM_PROMPT;
      if (courseContext) {
        systemWithContext += `\n\nCurrent Course Context:\n${courseContext}`;
      }

      const response = await fetch(`${API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': SITE_URL,
          'X-Title': SITE_NAME
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            { role: 'system', content: systemWithContext },
            ...messagesForAPI,
            { role: 'user', content }
          ]
        })
      });

      if (response.status === 429) {
        throw new Error('rate_limit');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      let errorContent = "I apologize, but I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
      
      if (error.message === 'rate_limit') {
        errorContent = "I'm currently receiving too many requests. Please wait a moment and try again.";
      } else if (error.message.includes('API key')) {
        errorContent = "There's an issue with the API key. Please check the configuration.";
      }
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([defaultMessage]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    messagesEndRef,
    courseContext,
    setCourseContext
  };
};

export default useChatbot;
