import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function NotesPage() {
  const { courseId } = useParams();
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-12 h-12 border-4 border-[#537A5A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading notes...</p>
      </div>
    );
  }

  if (!course || !course.notes) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Notes Available</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">This course doesn't have any notes yet.</p>
        <Link 
          to={`/course/${courseId}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#189D91] text-white rounded-lg hover:bg-[#158a7f]"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Course
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link 
        to={`/course/${courseId}`}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#189D91] mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Course
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            📝 Course Notes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">{course.title}</p>
        </div>

        <div className="p-6">
          <div className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-[#189D91] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-code:bg-gray-100 dark:prose-code:bg-slate-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[#189D91] dark:prose-code:text-[#4ecdc4]
            prose-pre:bg-gray-900 dark:prose-pre:bg-slate-900 prose-pre:text-gray-100
            prose-blockquote:border-l-4 prose-blockquote:border-[#189D91] prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-slate-700 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r
            prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
            prose-li:text-gray-700 dark:prose-li:text-gray-300
            prose-table:w-full prose-table:border-collapse prose-table:my-4
            prose-th:bg-gray-100 dark:prose-th:bg-slate-700 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900 dark:prose-th:text-white prose-th:border prose-th:border-gray-200 dark:prose-th:border-slate-600
            prose-td:p-3 prose-td:border prose-td:border-gray-200 dark:prod-td:border-slate-600 prose-td:text-gray-700 dark:prose-td:text-gray-300
            prose-img:rounded-lg prose-img:shadow-lg
            prose-hr:border-gray-200 dark:prose-hr:border-slate-600
          ">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
            >
              {course.notes}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Study Tip:</strong> Take notes while reading and try to explain concepts in your own words. 
          Use the milestones and quiz to test your understanding!
        </p>
      </div>
    </div>
  );
}