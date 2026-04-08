import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { userService } from '../services/userService';
import { feedbackService } from '../services/feedbackService';
import { useAuth } from '../hooks/useAuth';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { useAdaptiveSettings } from '../hooks/useAdaptiveSettings';
import { BoltIcon, CheckCircleIcon, PlayIcon, ClipboardDocumentCheckIcon, DocumentTextIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  useEffect(() => {
    const fetchCourse = async () => {
      const fetchedCourse = await courseService.getCourseFromFirestore(courseId);
      setCourse(fetchedCourse);
      
      if (user?.uid) {
        const existingFeedback = await feedbackService.getUserFeedbackForCourse(user.uid, courseId);
        setFeedbackData(existingFeedback);
      }
      
      setLoading(false);
    };
    fetchCourse();
  }, [courseId, user?.uid]);
  
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
                src={course.thumbnail || `https://img.youtube.com/vi/${course.youtubeId}/maxresdefault.jpg`} 
                alt={course.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  // Try fallback to standard YouTube thumbnail
                  if (e.target.src.includes('maxresdefault.jpg')) {
                    e.target.src = `https://img.youtube.com/vi/${course.youtubeId}/hqdefault.jpg`;
                  } else if (e.target.src.includes('hqdefault.jpg')) {
                    e.target.src = `https://img.youtube.com/vi/${course.youtubeId}/mqdefault.jpg`;
                  } else {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
              <div className="icon-placeholder hidden absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <span className="text-6xl">{fieldIcon}</span>
              </div>
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
              {progress?.completed && !feedbackData && (
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-[#189D91]/10 hover:bg-[#189D91]/20 transition-colors w-full"
                >
                  <span className="w-8 h-8 rounded-full bg-[#189D91] text-white flex items-center justify-center">
                    <StarIcon className="w-5 h-5" />
                  </span>
                  <span className="font-medium text-[#189D91]">Rate this course</span>
                </button>
              )}
              {feedbackData && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <StarIconSolid className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="font-medium text-green-700 dark:text-green-400">You rated this course</span>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        star <= feedbackData.rating ? (
                          <StarIconSolid key={star} className="w-3 h-3 text-yellow-400" />
                        ) : (
                          <StarIcon key={star} className="w-3 h-3 text-gray-300" />
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            {feedbackSubmitted ? (
              <div className="text-center py-8">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Thank You!</h3>
                <p className="text-gray-600 dark:text-gray-400">Your feedback has been submitted.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  How was this course?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your feedback helps us improve the learning experience.
                </p>

                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      {star <= feedbackRating ? (
                        <StarIconSolid className="w-10 h-10 text-yellow-400" />
                      ) : (
                        <StarIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                      )}
                    </button>
                  ))}
                </div>

                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Any additional feedback? (optional)"
                  className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white mb-4 resize-none"
                  rows={3}
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="flex-1 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    Skip
                  </button>
                  <button
                    onClick={async () => {
                      if (feedbackRating === 0) return;
                      await feedbackService.submitFeedback(courseId, user.uid, feedbackRating, feedbackText);
                      setFeedbackSubmitted(true);
                      setFeedbackData({ rating: feedbackRating, feedback: feedbackText });
                      setTimeout(() => {
                        setShowFeedbackModal(false);
                        setFeedbackSubmitted(false);
                      }, 1500);
                    }}
                    disabled={feedbackRating === 0}
                    className="flex-1 py-3 bg-[#189D91] text-white rounded-xl font-medium hover:bg-[#158a7f] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;