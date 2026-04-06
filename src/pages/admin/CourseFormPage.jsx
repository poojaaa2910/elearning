import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

export default function CourseFormPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!courseId;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    field: 'coding',
    youtubeId: '',
    thumbnail: '',
    fullContent: '',
    simplifiedContent: '',
    notes: ''
  });

  const [milestones, setMilestones] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [jsonInput, setJsonInput] = useState('');

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormData({
        id: parsed.id || '',
        title: parsed.title || '',
        description: parsed.description || '',
        field: parsed.field || 'coding',
        youtubeId: parsed.youtubeId || '',
        thumbnail: parsed.thumbnail || '',
        fullContent: parsed.fullContent || '',
        simplifiedContent: parsed.simplifiedContent || '',
        notes: parsed.notes || ''
      });
      setMilestones(parsed.milestones || []);
      setQuiz(parsed.quiz || []);
      toast.success('JSON data loaded successfully!');
    } catch (error) {
      toast.error('Invalid JSON format. Please check your input.');
    }
  };

  const addQuizQuestion = () => {
    setQuiz([
      ...quiz,
      {
        id: `new-${Date.now()}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]);
  };

  const updateQuizQuestion = (index, field, value) => {
    const updated = [...quiz];
    if (field === 'options') {
      updated[index].options = value;
    } else {
      updated[index][field] = value;
    }
    setQuiz(updated);
  };

  const deleteQuizQuestion = (index) => {
    setQuiz(quiz.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (isEditing) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const course = await adminService.getCourseById(courseId);
      const quizData = await adminService.getQuiz(courseId);
      
      if (course) {
        setFormData({
          id: course.id || '',
          title: course.title || '',
          description: course.description || '',
          field: course.field || 'coding',
          youtubeId: course.youtubeId || '',
          thumbnail: course.thumbnail || '',
          fullContent: course.fullContent || '',
          simplifiedContent: course.simplifiedContent || '',
          notes: course.notes || ''
        });
        setMilestones(course.milestones || []);
        setQuiz(quizData?.questions || []);
      }
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const courseIdToUse = formData.id || courseId;
      const courseData = {
        ...formData,
        id: courseIdToUse,
        thumbnail: formData.thumbnail || `https://img.youtube.com/vi/${formData.youtubeId}/maxresdefault.jpg`
      };

      if (isEditing) {
        await adminService.updateCourse(courseId, courseData);
        // Update milestones separately
        const currentCourse = await adminService.getCourseById(courseId);
        const existingMilestones = currentCourse?.milestones || [];
        
        // Process milestones
        for (const milestone of milestones) {
          if (milestone.id.toString().startsWith('new-')) {
            await adminService.addMilestone(courseId, { ...milestone, id: undefined });
          } else {
            await adminService.updateMilestone(courseId, milestone.id.toString(), milestone);
          }
        }
        
        // Save quiz from form
        if (quiz.length > 0) {
          await adminService.saveQuiz(courseId, quiz);
        }
      } else {
        // Create new course - use custom ID if provided
        let newCourseId;
        if (formData.id) {
          newCourseId = formData.id;
          // Create with custom ID
          await adminService.createCourseWithId(formData.id, courseData);
        } else {
          newCourseId = await adminService.createCourse(courseData);
        }
        // Add milestones
        for (const milestone of milestones) {
          await adminService.addMilestone(newCourseId, { ...milestone, id: undefined });
        }
        
        // Save quiz from form
        if (quiz.length > 0) {
          await adminService.saveQuiz(newCourseId, quiz);
        }
        
        navigate(`/admin/courses/${newCourseId}`);
        return;
      }

      navigate('/admin/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: `new-${Date.now()}`,
        title: '',
        content: '',
        simplifiedContent: '',
        order: milestones.length + 1
      }
    ]);
  };

  const updateMilestone = (index, field, value) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const deleteMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const extractYouTubeId = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : url;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#189D91] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/admin/courses"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Course' : 'Create Course'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isEditing ? 'Update course details' : 'Add a new course to your platform'}
            </p>
          </div>
        </div>

        {/* JSON Import */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-4">
            <CodeBracketIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Import from JSON</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Paste a full course JSON here to automatically fill all fields (title, milestones, quiz, notes, etc.)
          </p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"id": "course-id", "title": "Course Title", "milestones": [...], "quiz": [...]}'
            className="w-full px-4 py-3 border border-purple-300 dark:border-purple-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
            rows={4}
          />
          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={handleJsonImport}
              disabled={!jsonInput.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load JSON Data
            </button>
            <button
              type="button"
              onClick={() => setJsonInput('')}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., JavaScript Fundamentals"
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#189D91] focus:border-transparent"
              />
            </div>

            {/* ID */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course ID (slug)
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g., coding-js-101"
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#189D91] focus:border-transparent"
              />
            </div>

            {/* Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Field *
              </label>
              <select
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#189D91] focus:border-transparent"
              >
                <option value="coding">Coding</option>
                <option value="management">Management</option>
                <option value="philosophy">Philosophy</option>
              </select>
            </div>

            {/* YouTube URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                YouTube Video URL
              </label>
              <input
                type="text"
                value={formData.youtubeId}
                onChange={(e) => setFormData({ ...formData, youtubeId: extractYouTubeId(e.target.value) })}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#189D91] focus:border-transparent"
              />
              {formData.youtubeId && (
                <div className="mt-2">
                  <img 
                    src={`https://img.youtube.com/vi/${formData.youtubeId}/mqdefault.jpg`} 
                    alt="Video preview" 
                    className="w-32 h-18 object-cover rounded-lg"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the course..."
                rows={3}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#189D91] focus:border-transparent resize-none"
              />
            </div>

            {/* Full Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Content
              </label>
              <textarea
                value={formData.fullContent}
                onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
                placeholder="Detailed course content..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#189D91] focus:border-transparent resize-none"
              />
            </div>

            {/* Simplified Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Simplified Content
              </label>
              <textarea
                value={formData.simplifiedContent}
                onChange={(e) => setFormData({ ...formData, simplifiedContent: e.target.value })}
                placeholder="Simplified version for accessibility..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#189D91] focus:border-transparent resize-none"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comprehensive Notes (Markdown supported)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Detailed notes for slow learners - use markdown for formatting..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#189D91] focus:border-transparent resize-none font-mono text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Supports markdown: **bold**, *italic*, - lists, 1. numbered lists, ## headers, etc.
              </p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Milestones</h2>
            <button
              type="button"
              onClick={addMilestone}
              className="flex items-center gap-2 px-3 py-2 text-[#189D91] font-medium hover:bg-[#189D91]/10 rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Milestone
            </button>
          </div>

          {milestones.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-xl">
              <DocumentTextIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No milestones yet. Add your first milestone.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#189D91] text-white rounded-lg flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                        placeholder="Milestone title..."
                        className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                      <textarea
                        value={milestone.content}
                        onChange={(e) => updateMilestone(index, 'content', e.target.value)}
                        placeholder="Milestone content..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                      />
                      <input
                        type="text"
                        value={milestone.simplifiedContent || ''}
                        onChange={(e) => updateMilestone(index, 'simplifiedContent', e.target.value)}
                        placeholder="Simplified content (optional)..."
                        className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteMilestone(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quiz */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Questions</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Add multiple choice questions for the course</p>
            </div>
            <button
              type="button"
              onClick={addQuizQuestion}
              className="flex items-center gap-2 px-3 py-2 text-yellow-700 dark:text-yellow-400 font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Question
            </button>
          </div>

          {quiz.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-yellow-300 dark:border-yellow-700 rounded-xl">
              <p className="text-gray-500 dark:text-gray-400">No quiz questions yet. Add questions or import from JSON.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quiz.map((q, index) => (
                <div key={q.id} className="p-4 bg-white dark:bg-slate-700 rounded-xl border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-lg flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuizQuestion(index, 'question', e.target.value)}
                        placeholder="Enter question..."
                        className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctAnswer === optIndex}
                              onChange={() => updateQuizQuestion(index, 'correctAnswer', optIndex)}
                              className="w-4 h-4 text-yellow-600"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOptions = [...q.options];
                                newOptions[optIndex] = e.target.value;
                                updateQuizQuestion(index, 'options', newOptions);
                              }}
                              placeholder={`Option ${optIndex + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-600 text-gray-900 dark:text-white placeholder-gray-400"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteQuizQuestion(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            to="/admin/courses"
            className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#189D91] text-white rounded-xl font-medium hover:bg-[#158a7f] disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isEditing ? 'Update Course' : 'Create Course'}
                <ArrowRightIcon className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
