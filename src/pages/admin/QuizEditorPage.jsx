import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { 
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function QuizEditorPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      const [courseData, quizData] = await Promise.all([
        adminService.getCourseById(courseId),
        adminService.getQuiz(courseId)
      ]);
      setCourse(courseData);
      setQuestions(quizData?.questions || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.saveQuiz(courseId, questions);
      alert('Quiz saved successfully!');
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...questions];
    const options = [...updated[questionIndex].options];
    options[optionIndex] = value;
    updated[questionIndex].options = options;
    setQuestions(updated);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const setCorrectAnswer = (questionIndex, optionIndex) => {
    const updated = [...questions];
    updated[questionIndex].correctAnswer = optionIndex;
    setQuestions(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#189D91] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to={`/admin/courses/${courseId}`}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Editor</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{course?.title}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#189D91] text-white rounded-xl font-medium hover:bg-[#158a7f] disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Save Quiz'
          )}
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
            <QuestionMarkCircleIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No quiz questions yet</p>
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-[#189D91] text-white rounded-xl font-medium hover:bg-[#158a7f]"
            >
              <PlusIcon className="w-5 h-5" />
              Add First Question
            </button>
          </div>
        ) : (
          questions.map((q, qIndex) => (
            <div 
              key={qIndex} 
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#F29F29] text-white rounded-xl flex items-center justify-center font-bold text-lg">
                  {qIndex + 1}
                </div>
                <div className="flex-1 space-y-4">
                  {/* Question */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      placeholder="Enter your question..."
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#189D91] focus:border-transparent"
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Options (select the correct answer)
                    </label>
                    <div className="space-y-2">
                      {q.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-3">
                          <button
                            onClick={() => setCorrectAnswer(qIndex, oIndex)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              q.correctAnswer === oIndex
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            {q.correctAnswer === oIndex ? (
                              <CheckCircleIcon className="w-6 h-6" />
                            ) : (
                              <span className="text-lg">{String.fromCharCode(65 + oIndex)}</span>
                            )}
                          </button>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                            className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#189D91] focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteQuestion(qIndex)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Add Question Button */}
        {questions.length > 0 && (
          <button
            onClick={addQuestion}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400 rounded-xl font-medium hover:border-[#189D91] hover:text-[#189D91] transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Another Question
          </button>
        )}
      </div>

      {/* Info */}
      {questions.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 Quiz will be shown at the end of the course. Students need to score at least 70% to pass.
          </p>
        </div>
      )}
    </div>
  );
}
