import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { feedbackService } from '../../services/feedbackService';
import { courseService } from '../../services/courseService';
import { 
  StarIcon as StarIconOutline,
  ArrowLeftIcon,
  TrashIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [stats, setStats] = useState({ total: 0, averageRating: 0, distribution: {} });
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedbackData, statsData, allCourses] = await Promise.all([
          feedbackService.getAllFeedback(100),
          feedbackService.getFeedbackStats(),
          adminService.getAllCourses()
        ]);

        const coursesMap = {};
        allCourses.forEach(course => {
          coursesMap[course.id] = course.title;
        });

        setFeedbackList(feedbackData);
        setStats(statsData);
        setCourses(coursesMap);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (feedbackId) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      await feedbackService.deleteFeedback(feedbackId);
      setFeedbackList(feedbackList.filter(f => f.id !== feedbackId));
      setStats({ ...stats, total: stats.total - 1 });
    }
  };

  const filteredFeedback = filter === 'all' 
    ? feedbackList 
    : feedbackList.filter(f => f.courseId === filter);

  const uniqueCourses = [...new Set(feedbackList.map(f => f.courseId))];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIconSolid key={star} className="w-4 h-4 text-yellow-400" />
          ) : (
            <StarIconOutline key={star} className="w-4 h-4 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#189D91] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
          <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Feedback</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View ratings and reviews from students</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Feedback</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.averageRating}</p>
            <StarIconSolid className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Rating Distribution</p>
          <div className="flex items-center gap-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{rating}</span>
                  <StarIconSolid className="w-3 h-3 text-yellow-400" />
                </div>
                <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${stats.total > 0 ? (stats.distribution[rating] / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      {uniqueCourses.length > 0 && (
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Courses</option>
            {uniqueCourses.map(courseId => (
              <option key={courseId} value={courseId}>
                {courses[courseId] || courseId}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Feedback List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        {filteredFeedback.length === 0 ? (
          <div className="p-12 text-center">
            <ChatBubbleLeftIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No feedback yet. Students will submit feedback after completing courses.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {filteredFeedback.map((feedback) => (
              <div key={feedback.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {courses[feedback.courseId] || feedback.courseId}
                      </span>
                      {renderStars(feedback.rating)}
                    </div>
                    {feedback.feedback && (
                      <p className="text-gray-600 dark:text-gray-300 mb-2">{feedback.feedback}</p>
                    )}
                    <p className="text-sm text-gray-400">{formatDate(feedback.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(feedback.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete feedback"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}