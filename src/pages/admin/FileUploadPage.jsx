import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function FileUploadPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ pdf: false, vtt: false });
  const [status, setStatus] = useState({ pdf: null, vtt: null });

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const data = await adminService.getCourseById(courseId);
      setCourse(data);
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (type, file) => {
    if (!file) return;
    
    if (type === 'pdf' && file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }
    if (type === 'vtt' && !file.name.endsWith('.vtt')) {
      alert('Please upload a VTT file');
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));
    setStatus(prev => ({ ...prev, [type]: 'uploading' }));

    try {
      await adminService.uploadFile(courseId, file, type);
      setStatus(prev => ({ ...prev, [type]: 'success' }));
      await loadCourse();
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setStatus(prev => ({ ...prev, [type]: 'error' }));
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
      setTimeout(() => {
        setStatus(prev => ({ ...prev, [type]: null }));
      }, 3000);
    }
  };

  const handleDeleteFile = async (type) => {
    const typeName = type === 'pdf' ? 'PDF' : 'VTT';
    if (!confirm(`Are you sure you want to delete this ${typeName} file?`)) return;
    
    setStatus(prev => ({ ...prev, [type]: 'deleting' }));
    
    try {
      await adminService.deleteFile(courseId, type);
      await loadCourse();
      setStatus(prev => ({ ...prev, [type]: null }));
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      setStatus(prev => ({ ...prev, [type]: null }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#189D91] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to={`/admin/courses/${courseId}`}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Files</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{course?.title}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* PDF Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#F0624C]/10 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-[#F0624C]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Course PDF Notes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Upload a PDF document with course notes or materials
              </p>

              {course?.pdfUrl ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">PDF Uploaded</p>
                    <a 
                      href={course.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-[#189D91] hover:underline"
                    >
                      View PDF
                    </a>
                  </div>
                  <button
                    onClick={() => handleDeleteFile('pdf')}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    disabled={status.pdf === 'deleting'}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload('pdf', e.target.files[0])}
                    disabled={uploading.pdf}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`flex items-center justify-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl transition-colors ${
                    uploading.pdf 
                      ? 'border-gray-300 bg-gray-50' 
                      : 'border-gray-300 dark:border-slate-600 hover:border-[#189D91] hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}>
                    {uploading.pdf ? (
                      <div className="w-5 h-5 border-2 border-[#189D91] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowUpTrayIcon className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-gray-500 dark:text-gray-400">
                      {uploading.pdf ? 'Uploading...' : 'Click to upload PDF'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* VTT Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#9333EA]/10 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-[#9333EA]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">YouTube Captions (VTT)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Upload a VTT file to add custom captions to YouTube videos
              </p>

              {course?.vttUrl ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">VTT Uploaded</p>
                    <a 
                      href={course.vttUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-[#189D91] hover:underline"
                    >
                      View VTT
                    </a>
                  </div>
                  <button
                    onClick={() => handleDeleteFile('vtt')}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    disabled={status.vtt === 'deleting'}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept=".vtt"
                    onChange={(e) => handleFileUpload('vtt', e.target.files[0])}
                    disabled={uploading.vtt}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`flex items-center justify-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl transition-colors ${
                    uploading.vtt 
                      ? 'border-gray-300 bg-gray-50' 
                      : 'border-gray-300 dark:border-slate-600 hover:border-[#9333EA] hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}>
                    {uploading.vtt ? (
                      <div className="w-5 h-5 border-2 border-[#9333EA] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowUpTrayIcon className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-gray-500 dark:text-gray-400">
                      {uploading.vtt ? 'Uploading...' : 'Click to upload VTT'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {(status.pdf === 'success' || status.vtt === 'success') && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="text-sm text-green-600 dark:text-green-400">File uploaded successfully!</p>
        </div>
      )}
      {(status.pdf === 'error' || status.vtt === 'error') && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">Failed to upload file. Please try again.</p>
        </div>
      )}
    </div>
  );
}