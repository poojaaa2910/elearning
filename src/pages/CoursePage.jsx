import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { useAdaptiveSettings } from '../hooks/useAdaptiveSettings';
import { BoltIcon, CheckCircleIcon, PlayIcon, ClipboardDocumentCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourse = async () => {
      const fetchedCourse = await courseService.getCourseFromFirestore(courseId);
      setCourse(fetchedCourse);
      setLoading(false);
    };
    fetchCourse();
  }, [courseId]);
  
  const { progress, isMilestoneCompleted, getProgressPercentage, completeMilestone, loading: progressLoading } = useCourseProgress(user?.uid, courseId);
  const { fontSize, simplifiedMode, colorBlindMode, cognitiveMode } = useAdaptiveSettings();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 text-center py-12">
        <div className="w-12 h-12 border-4 border-[#537A5A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-5xl mx-auto px-4 text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course not found</h1>
        <Link to="/fields" className="text-primary hover:underline mt-4 inline-block">
          Back to Courses
        </Link>
      </div>
    );
  }

  const nextMilestone = course.milestones?.find(m => !isMilestoneCompleted(m.id));

  const handleStartLearning = () => {
    if (nextMilestone) {
      navigate(`/milestone/${courseId}/${nextMilestone.id}`);
    } else if (course.milestones?.length > 0) {
      navigate(`/milestone/${courseId}/${course.milestones[0].id}`);
    }
  };

  const fieldIcon = course.field === 'coding' ? '💻' : course.field === 'management' ? '👔' : '🏛️';
  const totalMilestones = course.milestones?.length || 0;
  const progressPercent = getProgressPercentage(totalMilestones);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link to={`/field/${course.field}`} className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary mb-6">
        ← Back to {course.field}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-64 object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Course' }}
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-white/90 dark:bg-black/70 px-3 py-1 rounded-full text-sm font-medium">
                  {fieldIcon} {course.field}
                </span>
                {(fontSize !== 'normal' || simplifiedMode || cognitiveMode || colorBlindMode) && (
                  <span className="bg-[#189D91]/90 px-3 py-1 rounded-full text-sm font-medium text-white flex items-center gap-1">
                    <BoltIcon className="w-4 h-4" />
                    Adaptive
                  </span>
                )}
              </div>
              {course.notes !== undefined && course.notes !== '' && (
                <div className="absolute top-4 right-4 z-10">
                  <Link
                    to={`/course/${courseId}/notes`}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F29F29] hover:bg-[#e8931f] text-white rounded-full text-sm font-medium shadow-lg transition-all hover:scale-105"
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                    Notes
                  </Link>
                </div>
              )}
            </div>
            
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{course.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <span>🎬</span>
                  <span>Video included</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <span>📄</span>
                  <span>{course.milestones?.length || 0} Milestones</span>
                </div>
              </div>

              <Button onClick={handleStartLearning} size="lg" className="w-full md:w-auto">
                {progressPercent > 0 ? 'Continue Learning' : 'Start Learning'}
              </Button>
              {course.notes !== undefined && course.notes !== '' && (
                <Link
                  to={`/course/${courseId}/notes`}
                  className="ml-3 inline-flex items-center gap-2 px-4 py-2 border-2 border-[#F29F29] text-[#F29F29] rounded-lg font-medium hover:bg-[#F29F29] hover:text-white transition-colors"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  View Notes
                </Link>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Progress</h3>
            <ProgressBar value={progressPercent} max={100} className="mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {progress?.milestonesCompleted?.length || 0} of {course.milestones?.length || 0} milestones completed
              </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Milestones</h3>
            <div className="space-y-3">
              {course.milestones.map((milestone, index) => {
                const completed = isMilestoneCompleted(milestone.id);
                return (
                  <Link
                    key={milestone.id}
                    to={`/milestone/${courseId}/${milestone.id}`}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      completed 
                        ? 'bg-green-50 dark:bg-green-900/20' 
                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      {completed ? '✓' : index + 1}
                    </span>
                    <span className={`font-medium ${
                      completed 
                        ? 'text-green-700 dark:text-green-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {milestone.title}
                    </span>
                  </Link>
                );
              })}
              {progressPercent === 100 && (
                <Link
                  to={`/quiz/${courseId}`}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-[#F29F29]/10 hover:bg-[#F29F29]/20 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-[#F29F29] text-white flex items-center justify-center">
                    <ClipboardDocumentCheckIcon className="w-5 h-5" />
                  </span>
                  <span className="font-medium text-[#F29F29]">Take Quiz</span>
                </Link>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;