import { useState, useRef, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

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

Always be helpful, concise, and encouraging. If you don't know something, admit it and suggest where the user might find the answer.`;

const useChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your AI learning assistant. I can help you with any questions about our courses, platform features, or learning concepts. What would you like to know?",
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
      const fullPrompt = `${SYSTEM_PROMPT}\n\nUser question: ${content}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          }
        })
      });

      console.log('Response status:', response.status);

      if (response.status === 429) {
        throw new Error('rate_limit');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to get response from AI');
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response. Please try again.",
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
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm your AI learning assistant. I can help you with any questions about our courses, platform features, or learning concepts. What would you like to know?",
        timestamp: Date.now()
      }
    ]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    messagesEndRef
  };
};

export default useChatbot;
