import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { useAdaptiveSettings } from '../hooks/useAdaptiveSettings';
import { 
  CodeBracketIcon, 
  UserGroupIcon, 
  SparklesIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

// Helper to get icon for courses
const getCourseIcon = (field) => {
  switch(field) {
    case 'coding': return CodeBracketIcon;
    case 'management': return UserGroupIcon;
    case 'philosophy': return SparklesIcon;
    default: return CodeBracketIcon;
  }
};

const FieldPage = () => {
  const { fieldId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fontSize, simplifiedMode, colorBlindMode, cognitiveMode } = useAdaptiveSettings();

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await courseService.getCoursesByFieldFromFirestore(fieldId);
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, [fieldId]);
  
  const fieldInfo = {
    coding: {
      name: 'Coding',
      icon: CodeBracketIcon,
      description: 'Master programming fundamentals, web development, and software engineering.',
      bgColor: '#537A5A'
    },
    management: {
      name: 'Management',
      icon: UserGroupIcon,
      description: 'Develop leadership skills, time management, and professional communication.',
      bgColor: '#9333EA'
    },
    philosophy: {
      name: 'Philosophy',
      icon: SparklesIcon,
      description: 'Explore wisdom traditions, ethical thinking, and profound life questions.',
      bgColor: '#9AE19D'
    }
  };

  const field = fieldInfo[fieldId];

  if (!field) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1F2937] dark:text-white mb-4">Field not found</h1>
          <Link to="/fields" className="text-[#189D91] hover:underline">Back to Fields</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/fields" 
          className="inline-flex items-center gap-2 text-[#6B7280] dark:text-gray-400 hover:text-[#189D91] mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Fields
        </Link>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl mb-12 p-10 shadow-2xl" style={{ backgroundColor: field.bgColor }}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16"></div>
          <div className="relative flex items-center gap-8">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
              <field.icon className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">{field.name}</h1>
              <p className="text-white/90 text-lg max-w-xl">{field.description}</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium">
                  {courses.length} Courses
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium">
                  5 Milestones Each
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div>
          <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white mb-8">Available Courses</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-[#189D91] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : courses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No courses in this field yet.</p>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Link 
                key={course.id} 
                to={`/course/${course.id}`}
                className="group"
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-[#E5E7EB] dark:border-slate-700 transition-all duration-500 transform hover:-translate-y-2">
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gray-100 dark:bg-slate-700 overflow-hidden">
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.querySelector('.icon-placeholder').style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center icon-placeholder" style={{ display: course.thumbnail ? 'none' : 'flex' }}>
                      {(() => {
                        const Icon = getCourseIcon(course.field);
                        return <Icon className="w-20 h-20 text-gray-300 dark:text-gray-500" />;
                      })()}
                    </div>
                    {/* Adaptive Mode Badge */}
                    {(fontSize !== 'normal' || simplifiedMode || cognitiveMode || colorBlindMode) && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-[#189D91]/90 dark:bg-[#189D91]/80 rounded-full text-xs font-semibold text-white flex items-center gap-1 shadow-md">
                        <BoltIcon className="w-3 h-3" />
                        Adaptive
                      </div>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 rounded-full text-xs font-semibold text-[#6B7280] shadow-md">
                      5 Milestones
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-white/80 text-sm font-medium capitalize">{course.field}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1F2937] dark:text-white mb-3 group-hover:text-[#189D91] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-[#6B7280] dark:text-gray-300 text-sm line-clamp-2 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB] dark:border-slate-700">
                      <span className="text-sm text-[#6B7280]">Start Course</span>
                      <div className="flex items-center gap-1 text-[#189D91] font-semibold group-hover:translate-x-2 transition-transform">
                        <span>Begin</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldPage;