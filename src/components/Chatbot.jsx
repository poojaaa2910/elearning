import { useState, useRef, useEffect } from 'react';
import useChatbot from '../hooks/useChatbot';
import ReactMarkdown from 'react-markdown';
import { 
  PaperAirplaneIcon,
  TrashIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const AI_NAME = 'LearnMate';

const Chatbot = ({ courseContext = null }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const { messages, isLoading, sendMessage, clearChat, messagesEndRef, setCourseContext: setChatbotContext } = useChatbot();
  const sendMessageRef = useRef(sendMessage);
  
  // Keep ref updated
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  useEffect(() => {
    if (courseContext) {
      setChatbotContext(courseContext);
    }
  }, [courseContext]);

  useEffect(() => {
    if (messages.length > 0) {
      setIsReady(true);
    }
  }, [messages]);

  useEffect(() => {
    let timeoutId = null;
    let lastMessage = '';
    
    const handleOpenChatbot = (event) => {
      const msg = event.detail?.message;
      if (msg && msg !== lastMessage) {
        lastMessage = msg;
        console.log('openChatbot event received:', msg);
        
        if (timeoutId) clearTimeout(timeoutId);
        
        if (isReady) {
          sendMessageRef.current(msg);
        } else {
          timeoutId = setTimeout(() => sendMessageRef.current(msg), 1500);
        }
      }
    };
    
    window.addEventListener('openChatbot', handleOpenChatbot);
    
    return () => {
      window.removeEventListener('openChatbot', handleOpenChatbot);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isReady]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#537A5A] to-[#456b49]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <AcademicCapIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold">{AI_NAME}</h3>
            <p className="text-white/70 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Online
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          title="Clear chat"
        >
          <TrashIcon className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] px-3 py-2 rounded-xl text-sm ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-[#537A5A] to-[#456b49] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-md border border-slate-200 dark:border-slate-700'
              }`}
            >
              {message.role === 'assistant' ? (
                <ReactMarkdown 
                  components={{
                    p: ({node, ...props}) => <p className="mb-2" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-[#537A5A] dark:text-[#9AE19D]" {...props} />,
                    code: ({node, inline, ...props}) => inline 
                      ? <code className="bg-gray-100 dark:bg-slate-700 px-1 py-0.5 rounded text-xs" {...props} />
                      : <code className="block bg-gray-100 dark:bg-slate-700 p-2 rounded text-xs overflow-x-auto" {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              )}
              <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#537A5A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#9AE19D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#537A5A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask LearnMate..."
            className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#537A5A]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-gradient-to-r from-[#537A5A] to-[#456b49] rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all disabled:opacity-50"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
