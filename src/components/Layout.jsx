import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useAdaptiveSettings } from '../hooks/useAdaptiveSettings';
import Chatbot from './Chatbot';
import { 
  HomeIcon, 
  BookOpenIcon, 
  SunIcon, 
  MoonIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { darkMode, toggleDarkMode } = useAdaptiveSettings();
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 transition-colors duration-300">
      {showNav && (
        <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-[#E5E7EB] dark:border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/dashboard" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#537A5A] rounded-xl flex items-center justify-center">
                    <AcademicCapIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-xl text-[#1F2937] dark:text-white">
                    AdaptiveLearn
                  </span>
                </Link>
                
                {/* Nav Links */}
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

              {/* Right Side */}
              <div className="flex items-center gap-4">
                {/* Dark Mode Toggle - Slider Style */}
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

                {/* Settings Link */}
                <button
                  onClick={() => navigate('/onboarding', { state: { from: 'dashboard' } })}
                  className="p-2.5 rounded-xl text-[#6B7280] hover:text-[#537A5A] hover:bg-[#537A5A]/10 transition-all"
                  title="Settings"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                </button>

                {/* User Menu */}
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
      <Chatbot />
    </div>
  );
};

export default Layout;
