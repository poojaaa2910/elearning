import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useAdaptiveSettings } from '../hooks/useAdaptiveSettings';
import { 
  CodeBracketIcon, 
  UserGroupIcon, 
  SparklesIcon,
  LightBulbIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const FieldsPage = () => {
  const user = useAuthStore((state) => state.user);
  const { fontSize } = useAdaptiveSettings();
  
  const getRecommendedField = () => {
    if (!user?.preferredLearning) return null;
    if (user.preferredLearning === 'video') return 'coding';
    if (user.preferredLearning === 'audio') return 'management';
    return null;
  };

  const recommendedField = getRecommendedField();

  const fields = [
    {
      id: 'coding',
      name: 'Coding',
      icon: CodeBracketIcon,
      description: 'Master programming fundamentals, web development, and software engineering principles.',
      courses: 3,
      bgColor: '#537A5A',
      stats: ['JavaScript', 'React', 'Data Structures']
    },
    {
      id: 'management',
      name: 'Management',
      icon: UserGroupIcon,
      description: 'Develop leadership skills, time management, and professional communication.',
      courses: 3,
      bgColor: '#9333EA',
      stats: ['Time Management', 'Leadership', 'Communication']
    },
    {
      id: 'philosophy',
      name: 'Philosophy',
      icon: SparklesIcon,
      description: 'Explore wisdom traditions, ethical thinking, and profound life questions.',
      courses: 3,
      bgColor: '#9AE19D',
      stats: ['Stoicism', 'Existentialism', 'Ethics']
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#537A5A]/10 rounded-full text-[#537A5A] text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-[#537A5A] rounded-full animate-pulse"></span>
            Choose Your Path
          </div>
          <h1 className="text-5xl font-bold text-[#1F2937] dark:text-white mb-4">
            Start Learning Today
          </h1>
          <p className="text-xl text-[#6B7280] dark:text-gray-300 max-w-2xl mx-auto">
            Select a field of study and begin your personalized learning journey with adaptive content.
          </p>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fields.map((field) => (
            <Link key={field.id} to={`/field/${field.id}`} className="group">
              <div className="relative overflow-hidden rounded-3xl h-full min-h-[400px] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2" style={{ backgroundColor: field.bgColor }}>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col p-8">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                    <field.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Title with Recommended Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-3xl font-bold text-white">{field.name}</h2>
                    {recommendedField === field.id && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                        <StarIcon className="w-3 h-3" />
                        Recommended
                      </span>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-white/85 text-lg mb-6 flex-1">{field.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {field.stats.map((stat, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                        {stat}
                      </span>
                    ))}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <span className="text-white/80 font-medium">{field.courses} courses</span>
                    <div className="flex items-center gap-2 text-white font-semibold group-hover:translate-x-2 transition-transform">
                      Start Learning
                      <ArrowRightIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-16 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-[#E5E7EB] dark:border-slate-700">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-[#537A5A]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <LightBulbIcon className="w-8 h-8 text-[#537A5A]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1F2937] dark:text-white mb-2">Adaptive Learning</h3>
              <p className="text-[#6B7280] dark:text-gray-300 text-lg">
                Our platform automatically adapts to your needs. Based on your profile, we'll adjust font size, 
                contrast, and content format to optimize your learning experience. Your preferences are saved and 
                applied across all courses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldsPage;
