import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useAdaptiveSettings } from '../hooks/useAdaptiveSettings';
import { courseService } from '../services/courseService';
import Chatbot from './Chatbot';
import { toast } from 'react-hot-toast';
import { 
  HomeIcon, 
  BookOpenIcon, 
  SunIcon, 
  MoonIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ArrowsPointingOutIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { darkMode, toggleDarkMode } = useAdaptiveSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [chatbotOpen, setChatbotOpen] = useState(true);
  const [chatbotFullscreen, setChatbotFullscreen] = useState(false);
  
  const params = useParams();
  const courseId = params.courseId;
  const [courseData, setCourseData] = useState(null);
  
  useEffect(() => {
    const loadCourseContext = async () => {
      if (courseId) {
        const course = await courseService.getCourseFromFirestore(courseId);
        setCourseData(course);
      } else {
        setCourseData(null);
      }
    };
    loadCourseContext();
  }, [courseId]);

  // Handle chatbot toggle from child components
  useEffect(() => {
    const handleToggleChatbot = (event) => {
      if (event.detail?.open !== undefined) {
        setChatbotOpen(event.detail.open);
      }
    };
    window.addEventListener('toggleChatbot', handleToggleChatbot);
    return () => window.removeEventListener('toggleChatbot', handleToggleChatbot);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const showNav = location.pathname !== '/login';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/fields', label: 'Courses', icon: BookOpenIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 transition-colors duration-300 flex">
      {/* Chatbot Sidebar */}
      {chatbotOpen && !chatbotFullscreen && (
        <div className="w-[25vw] min-w-[280px] max-w-[400px] h-screen sticky top-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hidden lg:flex lg:flex-col">
          <Chatbot courseContext={courseData ? `Course: ${courseData.title}\nDescription: ${courseData.description}\nField: ${courseData.field}` : null} />
        </div>
      )}

      {/* Fullscreen Chatbot Overlay */}
      {chatbotFullscreen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-800">
          <button 
            onClick={() => setChatbotFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <Chatbot courseContext={courseData ? `Course: ${courseData.title}\nDescription: ${courseData.description}\nField: ${courseData.field}` : null} />
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {showNav && (
          <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-[#E5E7EB] dark:border-slate-700/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center gap-4">
                  {chatbotOpen && (
                    <button
                      onClick={() => setChatbotOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-[#6B7280] dark:text-gray-300"
                      title="Close AI Chat"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <Link to="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#537A5A] rounded-xl flex items-center justify-center">
                      <AcademicCapIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl text-[#1F2937] dark:text-white">
                      AdaptiveLearn
                    </span>
                  </Link>
                  
                  <div className="hidden md:flex ml-10 space-x-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          location.pathname === item.path || location.pathname.startsWith(item.path)
                            ? 'bg-[#537A5A]/10 text-[#537A5A]'
                            : 'text-[#6B7280] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-700 hover:bg-[#E5E7EB] dark:hover:bg-slate-600 transition-all"
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? (
                      <MoonIcon className="w-5 h-5 text-[#6D28D9]" />
                    ) : (
                      <SunIcon className="w-5 h-5 text-[#F29F29]" />
                    )}
                    <span className="text-sm font-medium text-[#1F2937] dark:text-white">
                      {darkMode ? 'Dark' : 'Light'}
                    </span>
                    <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-[#537A5A]' : 'bg-[#D1D5DB]'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-5' : ''}`}></div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/onboarding', { state: { from: 'dashboard' } })}
                    className="p-2.5 rounded-xl text-[#6B7280] hover:text-[#537A5A] hover:bg-[#537A5A]/10 transition-all"
                    title="Settings"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                  </button>

                  {!chatbotOpen && (
                    <button
                      onClick={() => setChatbotOpen(true)}
                      className="p-2.5 rounded-xl text-[#537A5A] hover:bg-[#537A5A]/10 transition-all"
                      title="Open AI Chat"
                    >
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    </button>
                  )}

                  {chatbotOpen && !chatbotFullscreen && (
                    <button
                      onClick={() => setChatbotFullscreen(true)}
                      className="p-2.5 rounded-xl text-[#537A5A] hover:bg-[#537A5A]/10 transition-all"
                      title="Fullscreen AI Chat"
                    >
                      <ArrowsPointingOutIcon className="w-5 h-5" />
                    </button>
                  )}

                  {user && (
                    <div className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB] dark:border-slate-700">
                      <div className="hidden sm:block">
                        <p className="text-sm font-medium text-[#1F2937] dark:text-white">{user.displayName}</p>
                        <p className="text-xs text-[#6B7280] dark:text-gray-400 capitalize">{user.preferredLearning || 'Not set'}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[#537A5A] flex items-center justify-center text-white font-bold shadow-lg">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="p-2.5 rounded-xl text-[#6B7280] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        title="Logout"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
        )}
        <main className={showNav ? 'py-8' : ''}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
