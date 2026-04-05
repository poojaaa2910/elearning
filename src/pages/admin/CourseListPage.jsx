import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

export default function CourseListPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, courseId: null, courseTitle: '' });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await adminService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteCourse(deleteModal.courseId);
      setCourses(courses.filter(c => c.id !== deleteModal.courseId));
      setDeleteModal({ show: false, courseId: null, courseTitle: '' });
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const openDeleteModal = (course) => {
    setDeleteModal({ show: true, courseId: course.id, courseTitle: course.title });
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#189D91] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Courses</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your courses and content</p>
        </div>
        <Link
          to="/admin/courses/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#189D91] text-white rounded-xl font-medium hover:bg-[#158a7f] transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Course
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#189D91] focus:border-transparent"
        />
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No courses found</p>
          <Link
            to="/admin/courses/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#189D91] text-white rounded-lg font-medium hover:bg-[#158a7f]"
          >
            <PlusIcon className="w-5 h-5" />
            Create First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Thumbnail */}
              <div className="h-36 bg-gray-100 dark:bg-slate-700 relative flex-shrink-0">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <DocumentTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-3 py-1 bg-black/50 text-white text-xs font-medium rounded-full capitalize">
                  {course.field}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{course.milestones?.length || 0} milestones</span>
                  <span>•</span>
                  <span>{course.quiz?.length || 0} quiz</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  <Link
                    to={`/admin/courses/${course.id}`}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-[#189D91]/10 text-[#189D91] rounded-lg font-medium hover:bg-[#189D91]/20 transition-colors text-sm"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit
                  </Link>
                  <Link
                    to={`/admin/courses/${course.id}/files`}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-[#9333EA]/10 text-[#9333EA] rounded-lg font-medium hover:bg-[#9333EA]/20 transition-colors text-sm"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    Files
                  </Link>
                  <Link
                    to={`/admin/courses/${course.id}/quiz`}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-[#F29F29]/10 text-[#F29F29] rounded-lg font-medium hover:bg-[#F29F29]/20 transition-colors text-sm"
                  >
                    <QuestionMarkCircleIcon className="w-4 h-4" />
                    Quiz
                  </Link>
                  <button
                    onClick={() => openDeleteModal(course)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Course</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{deleteModal.courseTitle}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, courseId: null, courseTitle: '' })}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
