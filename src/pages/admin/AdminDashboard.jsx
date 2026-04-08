import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { feedbackService } from '../../services/feedbackService';
import { 
  BookOpenIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  PlusIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalAdmins: 0,
    totalQuizzes: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackStats, setFeedbackStats] = useState({ total: 0, averageRating: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, coursesData, fbStats] = await Promise.all([
          adminService.getStats(),
          adminService.getAllCourses(),
          feedbackService.getFeedbackStats()
        ]);
        setStats(statsData);
        setRecentCourses(coursesData.slice(0, 5));
        setFeedbackStats({ total: fbStats.total, averageRating: fbStats.averageRating });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Courses', value: stats.totalCourses, icon: BookOpenIcon, color: 'bg-[#537A5A]' },
    { label: 'Total Users', value: stats.totalUsers, icon: UsersIcon, color: 'bg-[#9AE19D]' },
    { label: 'Total Quizzes', value: stats.totalQuizzes, icon: QuestionMarkCircleIcon, color: 'bg-[#537A5A]' },
    { label: 'Total Admins', value: stats.totalAdmins, icon: DocumentTextIcon, color: 'bg-[#537A5A]' },
    { label: 'Feedback', value: feedbackStats.total, icon: StarIcon, color: 'bg-[#F29F29]', subtext: feedbackStats.total > 0 ? `${feedbackStats.averageRating} avg rating` : '' },
  ];

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's an overview of your platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {statCards.map((stat) => (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                {stat.subtext && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.subtext}</p>
                )}
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={async () => {
            if (confirm('This will sync all static courses to Firestore. Continue?')) {
              const result = await adminService.syncAllCoursesToFirestore();
              alert(`Synced ${result.success} courses. ${result.failed} already existed.`);
              window.location.reload();
            }
          }}
          className="flex items-center gap-4 p-6 bg-[#F29F29] rounded-2xl text-white hover:opacity-90 transition-opacity"
        >
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <ArrowPathIcon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Sync Courses</h3>
            <p className="text-white/80">Add default courses to database</p>
          </div>
        </button>

        <Link
          to="/admin/courses/new"
          className="flex items-center gap-4 p-6 bg-[#537A5A] rounded-2xl text-white hover:opacity-90 transition-opacity"
        >
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <PlusIcon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Add New Course</h3>
            <p className="text-white/80">Create a new course with milestones</p>
          </div>
          <ArrowRightIcon className="w-6 h-6 ml-auto" />
        </Link>

        <Link
          to="/admin/courses"
          className="flex items-center gap-4 p-6 bg-[#9AE19D] rounded-2xl text-white hover:opacity-90 transition-opacity"
        >
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <PencilSquareIcon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Manage Courses</h3>
            <p className="text-white/80">Edit, delete or view courses</p>
          </div>
          <ArrowRightIcon className="w-6 h-6 ml-auto" />
        </Link>

        <Link
          to="/admin/feedback"
          className="flex items-center gap-4 p-6 bg-[#189D91] rounded-2xl text-white hover:opacity-90 transition-opacity"
        >
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <StarIconSolid className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold">View Feedback</h3>
            <p className="text-white/80">See course ratings and reviews</p>
          </div>
          <ArrowRightIcon className="w-6 h-6 ml-auto" />
        </Link>
      </div>

      {/* Recent Courses */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Courses</h2>
          <Link to="/admin/courses" className="text-[#189D91] font-medium hover:underline">
            View All
          </Link>
        </div>
        
        {recentCourses.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpenIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No courses yet. Create your first course!</p>
            <Link
              to="/admin/courses/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#189D91] text-white rounded-lg font-medium hover:bg-[#158a7f]"
            >
              <PlusIcon className="w-5 h-5" />
              Add Course
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {recentCourses.map((course) => (
              <Link
                key={course.id}
                to={`/admin/courses/${course.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <BookOpenIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{course.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{course.field}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {course.milestones?.length || 0} milestones
                  </p>
                  <p className="text-xs text-gray-400">
                    {course.quizCount || 0} quiz questions
                  </p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
