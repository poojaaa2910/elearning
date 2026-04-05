import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { courseService } from '../services/courseService';
import { useAuth } from '../hooks/useAuth';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { useAdaptiveSettings } from '../hooks/useAdaptiveSettings';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { useReadAloud } from '../hooks/useReadAloud';
import { useCourseVisitTracker } from '../hooks/useCourseVisitTracker';
import { 
  SpeakerWaveIcon, 
  PauseIcon, 
  StopIcon, 
  BookOpenIcon,
  PlayIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import Card from '../components/Card';
import Button from '../components/Button';

const MilestonePage = () => {
  const { courseId, milestoneId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { simplifiedMode } = useAdaptiveSettings();
  const { isMilestoneCompleted, completeMilestone, currentMilestone, completedCount } = useCourseProgress(user?.uid, courseId);
  const { speaking, paused, voices, currentVoice, rate, error, ttsMethod, setCurrentVoice, setRate, speak, pause, resume, stop, toggle } = useReadAloud();
  const { trackMilestoneCompletion, getVisitCount, resetStrugglingForMilestone } = useCourseVisitTracker();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  
  useEffect(() => {
    const fetchVisitCount = async () => {
      if (courseId && milestoneId) {
        resetStrugglingForMilestone(courseId, parseInt(milestoneId));
        const count = await getVisitCount(courseId, parseInt(milestoneId));
        setVisitCount(count);
      }
    };
    fetchVisitCount();
  }, [courseId, milestoneId]);
  
  useEffect(() => {
    const fetchCourse = async () => {
      const fetchedCourse = await courseService.getCourseFromFirestore(courseId);
      setCourse(fetchedCourse);
      setLoading(false);
    };
    fetchCourse();
  }, [courseId]);
  
  const milestone = course?.milestones?.find(m => m.id === parseInt(milestoneId));
  
  const [showSimplified, setShowSimplified] = useState(simplifiedMode);

  const { scrollDepth, clickCount, trackClick, trackTimeSpent } = useBehaviorTracking(courseId, milestoneId);

  useEffect(() => {
    setShowSimplified(simplifiedMode);
  }, [simplifiedMode]);

  const handleReadAloud = useCallback(() => {
    const content = showSimplified ? milestone.simplifiedContent : milestone.content;
    if (!content) return;
    toggle(content);
  }, [showSimplified, milestone, toggle]);

  const handleStopReadAloud = useCallback(() => {
    stop();
  }, [stop]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePrevious = () => {
    if (!course?.milestones) return;
    const currentIndex = course.milestones.findIndex(m => m.id === parseInt(milestoneId));
    if (currentIndex > 0) {
      navigate(`/milestone/${courseId}/${course.milestones[currentIndex - 1].id}`);
    }
  };

  const handleNext = async () => {
    if (!course?.milestones) return;
    await trackTimeSpent();
    const currentIndex = course.milestones.findIndex(m => m.id === parseInt(milestoneId));
    
    if (!isMilestoneCompleted(parseInt(milestoneId))) {
      await completeMilestone(parseInt(milestoneId));
    }
    
    // Track milestone completion attempt
    const result = await trackMilestoneCompletion(courseId, parseInt(milestoneId));
    console.log('Track result:', result);
    
    if (result?.isStruggling) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-[#537A5A] text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4`}>
          <div className="flex-1">
            <p className="font-medium">Struggling with this section?</p>
            <p className="text-sm text-white/80">You've tried {result.count} times - want me to help explain?</p>
          </div>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              window.dispatchEvent(new CustomEvent('openChatbot', { 
                detail: { 
                  message: `I need help understanding: ${milestone?.title || 'this section'}. Can you explain it differently?` 
                } 
              }));
            }}
            className="px-4 py-2 bg-white text-[#537A5A] rounded-lg font-medium hover:bg-white/90"
          >
            Yes, help!
          </button>
        </div>
      ));
    }
    
    if (currentIndex < course.milestones.length - 1) {
      navigate(`/milestone/${courseId}/${course.milestones[currentIndex + 1].id}`);
    } else {
      navigate(`/quiz/${courseId}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 text-center py-12">
        <div className="w-12 h-12 border-4 border-[#537A5A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading course...</p>
      </div>
    );
  }

  if (!course || !milestone) {
    return (
      <div className="max-w-7xl mx-auto px-4 text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Milestone not found</h1>
        <Link to="/fields" className="text-primary hover:underline mt-4 inline-block">
          Back to Courses
        </Link>
      </div>
    );
  }

  const currentIndex = course.milestones.findIndex(m => m.id === parseInt(milestoneId));
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === course.milestones.length - 1;
  const isCompleted = isMilestoneCompleted(parseInt(milestoneId));
  const content = showSimplified ? milestone.simplifiedContent : milestone.content;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to={`/course/${courseId}`} className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary">
          ← Back to {course.title}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <div className="p-6 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Milestone {currentIndex + 1} of 5</p>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{milestone.title}</h1>
                </div>
                {isCompleted && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>

            <div className="p-4">
              {/* Video Player - Supports both YouTube and Custom Video with VTT */}
              <div className="aspect-video bg-gray-900 rounded-lg mb-6 overflow-hidden">
                {course.videoUrl ? (
                  // Custom video with VTT captions
                  <video
                    className="w-full h-full"
                    controls
                    crossOrigin="anonymous"
                  >
                    <source src={course.videoUrl} type="video/mp4" />
                    {course.vttUrl && (
                      <track
                        kind="captions"
                        label="English"
                        srcLang="en"
                        src={course.vttUrl}
                        default
                      />
                    )}
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  // YouTube embed
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${course.youtubeId}?enablejsapi=1`}
                    title={course.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleReadAloud}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      speaking 
                        ? 'bg-[#537A5A] text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {speaking ? (
                      paused ? <PlayIcon className="w-5 h-5" /> : <PauseIcon className="w-5 h-5" />
                    ) : (
                      <SpeakerWaveIcon className="w-5 h-5" />
                    )}
                    <span>{speaking ? (paused ? 'Resume' : 'Pause') : 'Read Aloud'}</span>
                  </button>
                  
                  {speaking && (
                    <button
                      onClick={handleStopReadAloud}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                    >
                      <StopIcon className="w-5 h-5" />
                      <span>Stop</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-lg transition-colors ${
                      showSettings 
                        ? 'bg-[#537A5A]/10 text-[#537A5A]' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="Voice settings"
                  >
                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Error display */}
                {error && (
                  <div className="text-red-500 text-sm mt-2">
                    Error: {error}. Try clicking Read Aloud again.
                  </div>
                )}

                {/* Voice Settings Panel */}
                {showSettings && (
                  <div className="absolute top-full right-0 mt-2 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-50 w-64">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Voice Settings</h4>
                    
                    <div className="mb-2 px-2 py-1 bg-[#537A5A]/10 rounded text-xs text-[#537A5A]">
                      Using: {ttsMethod === 'browser' ? 'Browser TTS' : 'External TTS'}
                    </div>
                    
                    {error && (
                      <p className="text-xs text-red-500 mb-3">
                        {error}
                      </p>
                    )}
                    
                    {voices.length === 0 && !error && (
                      <p className="text-xs text-gray-500 mb-3">
                        Loading voices...
                      </p>
                    )}
                    
                    <div className="mb-3">
                      <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Voice</label>
                      <select 
                        value={currentVoice?.name || ''}
                        onChange={(e) => {
                          const voice = voices.find(v => v.name === e.target.value);
                          setCurrentVoice(voice);
                        }}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white"
                      >
                        {voices.map(voice => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Speed: {rate}x</label>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="2" 
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowSimplified(!showSimplified);
                    trackClick();
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    showSimplified 
                      ? 'bg-[#F29F29] text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <BookOpenIcon className="w-5 h-5" />
                  <span>{showSimplified ? 'Show Full' : 'Simplified'}</span>
                </button>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                  {content}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirst}
              >
                ← Previous
              </Button>
              <Button onClick={handleNext}>
                {isLast ? 'Finish Course' : isCompleted ? 'Next Milestone →' : 'Complete & Next →'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('toggleChatbot', { detail: { open: true } }));
                  window.dispatchEvent(new CustomEvent('openChatbot', { 
                    detail: { 
                      message: `I need help understanding: "${milestone?.title}". Can you explain this concept in a simpler way with examples?` 
                    } 
                  }));
                }}
                className="ml-2"
              >
                🤖 Need Help?
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Course Progress</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-medium text-gray-900 dark:text-white">{completedCount}/5</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${(completedCount / 5) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {completedCount === 5 && (
                <span className="text-green-600 dark:text-green-400">🎉 Congratulations! You completed this course!</span>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">All Milestones</h3>
            <div className="space-y-2">
              {course.milestones.map((m, idx) => (
                <Link
                  key={m.id}
                  to={`/milestone/${courseId}/${m.id}`}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                    m.id === parseInt(milestoneId)
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    isMilestoneCompleted(m.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {isMilestoneCompleted(m.id) ? '✓' : idx + 1}
                  </span>
                  <span className="text-sm">{m.title}</span>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Session Info</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Time spent:</span>
                <span className="font-medium text-gray-900 dark:text-gray-300">
                  {Math.round(scrollDepth / 10)}s (tracked)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Scroll depth:</span>
                <span className="font-medium text-gray-900 dark:text-gray-300">{scrollDepth}%</span>
              </div>
              <div className="flex justify-between">
                <span>Clicks:</span>
                <span className="font-medium text-gray-900 dark:text-gray-300">{clickCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Attempts:</span>
                <span className="font-medium text-gray-900 dark:text-gray-300">{visitCount}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MilestonePage;