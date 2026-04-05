import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useAdaptiveSettings } from '../hooks/useAdaptiveSettings';
import { courseService } from '../services/courseService';
import { userService } from '../services/userService';

// Heroicons
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  TrophyIcon,
  SunIcon,
  MoonIcon,
  ArrowRightIcon,
  UserIcon,
  Cog6ToothIcon,
  EyeIcon,
  SparklesIcon,
  SignalIcon,
  BoltIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { fontSize, contrastMode, simplifiedMode, colorBlindMode, darkMode, toggleDarkMode, cognitiveMode, setSimplifiedMode, setFontSize, dyslexiaMode, setDyslexiaMode } = useAdaptiveSettings();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const allCourses = courseService.getAllCourses();

  const handleAdjustSettings = () => {
    navigate('/onboarding', { state: { from: 'dashboard' } });
  };

  const handleViewProfile = () => {
    navigate('/onboarding', { state: { from: 'dashboard' } });
  };

  useEffect(() => {
    const fetchProgress = async () => {
      if (user?.uid) {
        try {
          const enrolled = [];
          for (const course of allCourses) {
            const progress = await userService.getCourseProgress(user.uid, course.id);
            if (progress?.milestonesCompleted?.length > 0) {
              enrolled.push({ ...course, progress });
            }
          }
          setEnrolledCourses(enrolled);
        } catch (error) {
          console.error('Error fetching progress:', error);
        }
      }
      setIsLoading(false);
    };
    fetchProgress();
  }, [user?.uid]);

  const totalMilestones = enrolledCourses.reduce((acc, c) => acc + (c.progress?.milestonesCompleted?.length || 0), 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getSmartAdjustments = () => {
    const adjustments = [];
    
    if (fontSize !== 'normal') {
      adjustments.push({
        icon: EyeIcon,
        color: 'text-[#537A5A]',
        bg: 'bg-[#537A5A]/10',
        message: fontSize === 'xlarge' ? 'Font size increased for better readability' : 'Font size adjusted for your vision'
      });
    }
    
    if (simplifiedMode || cognitiveMode) {
      adjustments.push({
        icon: SparklesIcon,
        color: 'text-[#9AE19D]',
        bg: 'bg-[#9AE19D]/10',
        message: 'Simplified content enabled for easier learning'
      });
    }
    
    if (user?.preferredLearning === 'audio') {
      adjustments.push({
        icon: SignalIcon,
        color: 'text-[#9333EA]',
        bg: 'bg-[#9333EA]/10',
        message: 'Audio content prioritized based on your preference'
      });
    }
    
    if (colorBlindMode) {
      adjustments.push({
        icon: BoltIcon,
        color: 'text-[#9333EA]',
        bg: 'bg-[#9333EA]/10',
        message: 'Color-blind friendly palette enabled'
      });
    }
    
    return adjustments;
  };

  const smartAdjustments = getSmartAdjustments();

  const fields = [
    { 
      id: 'coding', 
      name: 'Coding', 
      icon: BookOpenIcon, 
      bgColor: '#537A5A',
      description: 'Programming & Web Development'
    },
    { 
      id: 'management', 
      name: 'Management', 
      icon: AcademicCapIcon, 
      bgColor: '#9333EA',
      description: 'Leadership & Skills'
    },
    { 
      id: 'philosophy', 
      name: 'Philosophy', 
      icon: SparklesIcon, 
      bgColor: '#9AE19D',
      description: 'Wisdom & Ethics'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-gray-400 mb-2">
            <span>Dashboard</span>
            <span>-</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl font-bold text-[#1F2937] dark:text-white">
            {getGreeting()}, {user?.displayName?.split(' ')[0] || 'Learner'}!
          </h1>
          <p className="mt-3 text-lg text-[#6B7280] dark:text-gray-400 max-w-2xl">
            Ready to continue your learning journey? Pick up where you left off or explore new topics.
          </p>
        </div>

        {/* Smart Adjustments Banner */}
        {smartAdjustments.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BoltIcon className="w-5 h-5 text-[#F29F29]" />
              <h2 className="text-lg font-bold text-[#1F2937] dark:text-white">Smart Adjustments Applied</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {smartAdjustments.map((adjustment, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-[#E5E7EB] dark:border-slate-700 shadow-sm"
                >
                  <div className={`p-2 rounded-lg ${adjustment.bg}`}>
                    <adjustment.icon className={`w-5 h-5 ${adjustment.color}`} />
                  </div>
                  <p className="text-sm text-[#1F2937] dark:text-gray-200">{adjustment.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Learning Profile Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-[#E5E7EB] dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#189D91]/10 flex items-center justify-center">
                  <UserIcon className="w-7 h-7 text-[#189D91]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#6B7280] dark:text-gray-400">Your Adaptive Profile</p>
                  <p className="text-xl font-bold text-[#1F2937] dark:text-white">Active and Learning</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-slate-700">
              <p className="text-sm text-[#6B7280] dark:text-gray-400">
                Profile focus: Vision & Simplified Layout
              </p>
              <button onClick={handleViewProfile} className="text-sm text-[#189D91] font-medium hover:underline mt-1 inline-block">
                View Detailed Profile
              </button>
            </div>
          </div>

          {/* Courses in Progress Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-[#E5E7EB] dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F0624C]/10 flex items-center justify-center">
                  <BookOpenIcon className="w-7 h-7 text-[#F0624C]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#6B7280] dark:text-gray-400">Courses in Progress</p>
                  <p className="text-xl font-bold text-[#1F2937] dark:text-white">
                    {enrolledCourses.length > 0 
                      ? `${enrolledCourses.length} course${enrolledCourses.length > 1 ? 's' : ''} underway`
                      : 'No active courses'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-slate-700">
              {enrolledCourses.length > 0 ? (
                <Link to="/fields" className="text-sm text-[#F0624C] font-medium hover:underline">
                  Check My Courses
                </Link>
              ) : (
                <Link to="/fields" className="text-sm text-[#189D91] font-medium hover:underline">
                  Browse Courses
                </Link>
              )}
            </div>
          </div>

          {/* Milestones Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-[#E5E7EB] dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F29F29]/10 flex items-center justify-center">
                  <TrophyIcon className="w-7 h-7 text-[#F29F29]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#6B7280] dark:text-gray-400">Milestones & Achievements</p>
                  <p className="text-xl font-bold text-[#1F2937] dark:text-white">
                    {totalMilestones > 0 
                      ? `${totalMilestones} milestone${totalMilestones !== 1 ? 's' : ''} completed`
                      : 'Start your journey!'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-slate-700">
              <p className="text-sm text-[#F29F29]">Almost to your next big win!</p>
            </div>
          </div>
        </div>

        {/* Continue Learning Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white">Continue Learning</h2>
            {enrolledCourses.length > 0 && (
              <Link to="/fields" className="text-[#189D91] font-medium hover:underline flex items-center gap-1">
                View all <ArrowRightIcon className="w-4 h-4" />
              </Link>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#189D91] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.slice(0, 3).map((course) => {
                const completed = course.progress?.milestonesCompleted?.length || 0;
                const percent = (completed / 5) * 100;
                
                // Get icon based on field
                const getCourseIcon = (field) => {
                  switch(field) {
                    case 'coding': return BookOpenIcon;
                    case 'management': return AcademicCapIcon;
                    case 'philosophy': return SparklesIcon;
                    default: return BookOpenIcon;
                  }
                };
                const CourseIcon = getCourseIcon(course.field);
                
                return (
                  <Link key={course.id} to={`/course/${course.id}`} className="group">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                      <div className="h-32 bg-gray-100 dark:bg-slate-700 relative flex items-center justify-center">
                        <CourseIcon className="w-16 h-16 text-gray-400/50" />
                        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 rounded-full text-xs font-medium text-[#6B7280]">
                          {completed}/5 milestones
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-[#1F2937] dark:text-white mb-3 group-hover:text-[#189D91] transition-colors">
                          {course.title}
                        </h3>
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-[#6B7280]">Progress</span>
                            <span className="font-semibold text-[#189D91]">{percent}%</span>
                          </div>
                          <div className="h-2 bg-[#E5E7EB] dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#189D91] rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm text-[#6B7280]">Resume Course</span>
                          <ArrowRightIcon className="w-4 h-4 text-[#189D91]" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-sm border border-[#E5E7EB] dark:border-slate-700">
              <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-[#6B7280]" />
              <h3 className="text-xl font-bold text-[#1F2937] dark:text-white mb-2">No courses started yet</h3>
              <p className="text-[#6B7280] dark:text-gray-400 mb-6 max-w-md mx-auto">
                Start your learning journey today! Explore our courses and find the perfect topic for you.
              </p>
              <Link 
                to="/fields" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#189D91] text-white font-semibold rounded-xl hover:bg-[#15857d] transition-colors"
              >
                Explore Courses
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>

        {/* Explore Fields */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white mb-6">Explore Fields</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fields.map((field) => (
              <Link key={field.id} to={`/field/${field.id}`} className="group">
                <div className="relative overflow-hidden rounded-2xl h-48 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2" style={{ backgroundColor: field.bgColor }}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8"></div>
                  <div className="relative h-full flex flex-col justify-between p-6">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      {(() => {
                        const Icon = field.icon;
                        return <Icon className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{field.name}</h3>
                      <p className="text-white/80 text-sm">{field.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Smart Settings Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-[#E5E7EB] dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Cog6ToothIcon className="w-6 h-6 text-[#537A5A]" />
            <h3 className="text-xl font-bold text-[#1F2937] dark:text-white">Your Smart Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Auto Simplify */}
            <button 
              onClick={() => setSimplifiedMode(!simplifiedMode)}
              className="flex items-center justify-between p-4 bg-[#F8FAFC] dark:bg-slate-700 rounded-xl group relative min-h-[80px]"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-[#537A5A]/10 rounded-lg flex items-center justify-center shrink-0">
                  <SparklesIcon className="w-5 h-5 text-[#537A5A]" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-[#1F2937] dark:text-white">Auto-Simplify</p>
                    <InformationCircleIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-xs text-[#6B7280] dark:text-gray-300">Based on reading speed</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors shrink-0 ml-2 ${simplifiedMode ? 'bg-[#537A5A]' : 'bg-[#D1D5DB]'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${simplifiedMode ? 'translate-x-6' : ''}`}></div>
              </div>
              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {simplifiedMode ? 'Enabled: Simplified content shown' : 'Disabled: Standard content shown'}
              </div>
            </button>

            {/* Auto Increase Font */}
            <button 
              onClick={() => {
                const newSize = fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xlarge' : 'normal';
                setFontSize(newSize);
              }}
              className="flex items-center justify-between p-4 bg-[#F8FAFC] dark:bg-slate-700 rounded-xl group relative min-h-[80px]"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-[#537A5A]/10 rounded-lg flex items-center justify-center shrink-0">
                  <EyeIcon className="w-5 h-5 text-[#537A5A]" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-[#1F2937] dark:text-white">Auto-Increase Font</p>
                    <InformationCircleIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-xs text-[#6B7280] dark:text-gray-300">Based on vision setting</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors shrink-0 ml-2 ${fontSize !== 'normal' ? 'bg-[#537A5A]' : 'bg-[#D1D5DB]'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${fontSize !== 'normal' ? 'translate-x-6' : ''}`}></div>
              </div>
              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {fontSize === 'large' ? 'Large text enabled' : fontSize === 'xlarge' ? 'Extra large text enabled' : 'Normal text size'}
              </div>
            </button>

            {/* Dyslexia Mode */}
            <button 
              onClick={() => setDyslexiaMode(!dyslexiaMode)}
              className="flex items-center justify-between p-4 bg-[#F8FAFC] dark:bg-slate-700 rounded-xl group relative min-h-[80px]"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-[#9333EA]/10 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpenIcon className="w-5 h-5 text-[#9333EA]" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-[#1F2937] dark:text-white">Dyslexia Mode</p>
                    <InformationCircleIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-xs text-[#6B7280] dark:text-gray-300">OpenDyslexic font & spacing</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors shrink-0 ml-2 ${dyslexiaMode ? 'bg-[#9333EA]' : 'bg-[#D1D5DB]'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${dyslexiaMode ? 'translate-x-6' : ''}`}></div>
              </div>
              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {dyslexiaMode ? 'Enabled: Dyslexia-friendly font' : 'Disabled: Standard font'}
              </div>
            </button>

            {/* Auto Text to Speech */}
            {user?.preferredLearning === 'audio' && (
              <button className="flex items-center justify-between p-4 bg-[#F8FAFC] dark:bg-slate-700 rounded-xl group relative min-h-[80px]">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-[#537A5A]/10 rounded-lg flex items-center justify-center shrink-0">
                    <SignalIcon className="w-5 h-5 text-[#537A5A]" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-[#1F2937] dark:text-white">Auto Text-to-Speech</p>
                      <InformationCircleIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-gray-300">Audio preference enabled</p>
                  </div>
                </div>
                <div className="w-12 h-6 rounded-full p-1 cursor-pointer transition-colors bg-[#537A5A] shrink-0 ml-2">
                  <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-6"></div>
                </div>
                <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Auto-plays audio for your courses
                </div>
              </button>
            )}

            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="flex items-center justify-between p-4 bg-[#F8FAFC] dark:bg-slate-700 rounded-xl group relative min-h-[80px]"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-[#6D28D9]/10 rounded-lg flex items-center justify-center shrink-0">
                  {darkMode ? (
                    <MoonIcon className="w-5 h-5 text-[#6D28D9]" />
                  ) : (
                    <SunIcon className="w-5 h-5 text-[#6D28D9]" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[#1F2937] dark:text-white">Dark Mode</p>
                  <p className="text-xs text-[#F29F29]">Last: Just now</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors shrink-0 ml-2 ${darkMode ? 'bg-[#537A5A]' : 'bg-[#D1D5DB]'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${darkMode ? 'translate-x-6' : ''}`}></div>
              </div>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5E7EB] dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm text-[#F29F29]">
              Last smart adjustment: Font scale adjusted based on your vision setting
            </p>
            <button onClick={handleAdjustSettings} className="text-[#6D28D9] font-medium hover:underline text-sm">
              Adjust Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;