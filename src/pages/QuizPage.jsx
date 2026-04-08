import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { courseService } from '../services/courseService';
import { userService } from '../services/userService';
import { feedbackService } from '../services/feedbackService';
import { useAuth } from '../hooks/useAuth';
import { useAdaptiveSettings } from '../hooks/useAdaptiveSettings';
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const QuizPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { simplifiedMode, fontSize } = useAdaptiveSettings();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [courseId]);

  const loadQuiz = async () => {
    try {
      // Get quiz from course document directly
      const course = await courseService.getCourseFromFirestore(courseId);
      console.log('Course data:', course);
      setQuiz(course?.quiz || []);
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex) => {
    if (submitted) return;
    setSelectedAnswer(optionIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore(newAnswers);
    }
  };

  const calculateScore = async (finalAnswers) => {
    const correct = finalAnswers.filter((ans, idx) => ans === quiz[idx].correctAnswer).length;
    const percentage = (correct / quiz.length) * 100;
    setScore(percentage);
    setSubmitted(true);

    if (user && percentage >= 70) {
      try {
        await userService.setUserProgress(user.uid, courseId, 'quiz-completed');
        await userService.markCourseCompleted(user.uid, courseId, percentage);
        const existingFeedback = await feedbackService.getUserFeedbackForCourse(user.uid, courseId);
        if (!existingFeedback) {
          setShowFeedbackModal(true);
        }
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const handleSubmitFeedback = async () => {
    if (feedbackRating === 0) return;
    try {
      await feedbackService.submitFeedback(courseId, user.uid, feedbackRating, feedbackText);
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackSubmitted(false);
      }, 1500);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const fontSizeClass = fontSize === 'large' ? 'text-lg' : fontSize === 'xlarge' ? 'text-xl' : 'text-base';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#189D91] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quiz || quiz.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Quiz Available</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">This course doesn't have a quiz yet.</p>
        <Link
          to={`/course/${courseId}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#189D91] text-white rounded-xl font-medium hover:bg-[#158a7f]"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Course
        </Link>
      </div>
    );
  }

  const question = quiz[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to={`/course/${courseId}`}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#189D91] mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Exit Quiz
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
        {!submitted ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Question {currentQuestion + 1} of {quiz.length}
              </span>
              <span className="text-sm font-medium text-[#189D91]">
                {Math.round(((currentQuestion) / quiz.length) * 100)}% complete
              </span>
            </div>

            <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full mb-8">
              <div
                className="h-2 bg-[#189D91] rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
              ></div>
            </div>

            <h2 className={`${fontSizeClass} font-semibold text-gray-900 dark:text-white mb-6`}>
              {question.question}
            </h2>

            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={submitted}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                    selectedAnswer === index
                      ? 'border-[#189D91] bg-[#189D91]/10'
                      : 'border-gray-200 dark:border-slate-600 hover:border-[#189D91]'
                  }`}
                >
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    selectedAnswer === index
                      ? 'bg-[#189D91] text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 text-gray-900 dark:text-white">{option}</span>
                  {selectedAnswer === index && (
                    <CheckCircleIcon className="w-6 h-6 text-[#189D91]" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="w-full py-4 bg-[#189D91] text-white rounded-xl font-medium hover:bg-[#158a7f] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === quiz.length - 1 ? 'Submit Quiz' : 'Next Question'}
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              score >= 70 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              {score >= 70 ? (
                <TrophyIcon className="w-12 h-12 text-green-500" />
              ) : (
                <XCircleIcon className="w-12 h-12 text-red-500" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {score >= 70 ? 'Congratulations!' : 'Keep Trying!'}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You scored <span className="font-bold text-gray-900 dark:text-white">{Math.round(score)}%</span>
              {score >= 70 ? ' - You passed!' : ' - You need 70% to pass'}
            </p>

            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{score >= 70 ? '✓' : '✗'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {answers.filter((a, i) => a === quiz[i].correctAnswer).length}/{quiz.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Correct</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                to={`/course/${courseId}`}
                className="flex-1 py-4 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Back to Course
              </Link>
              {score < 70 && (
                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setAnswers([]);
                    setSubmitted(false);
                    setScore(0);
                  }}
                  className="flex-1 py-4 bg-[#189D91] text-white rounded-xl font-medium hover:bg-[#158a7f]"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
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
                    onClick={handleSubmitFeedback}
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

export default QuizPage;
