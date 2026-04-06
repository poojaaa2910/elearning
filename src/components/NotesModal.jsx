import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

export default function NotesModal({ isOpen, onClose, notes, courseTitle }) {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-transform duration-200 ${isClosing ? 'scale-95' : 'scale-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📝 Course Notes</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{courseTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {notes ? (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown>{notes}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No notes available for this course yet.</p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">Check back later or contact your instructor.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            💡 Tip: Use the scrollbar to navigate through the notes
          </p>
        </div>
      </div>
    </div>
  );
}