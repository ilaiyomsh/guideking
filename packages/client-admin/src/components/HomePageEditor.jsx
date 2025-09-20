import React from 'react';

function HomePageEditor({ homePage, onUpdate }) {
  const handleTitleChange = (e) => {
    onUpdate({ ...homePage, title: e.target.value });
  };

  const handleContentChange = (e) => {
    onUpdate({ ...homePage, content: e.target.value });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg shadow-sm border border-blue-200 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        <h3 className="text-lg font-semibold text-blue-800">עמוד הבית</h3>
        <span className="text-sm text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
          מה שהמשתמשים יראו ראשונים
        </span>
      </div>
      
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-2">
            כותרת עמוד הבית
          </label>
          <input
            type="text"
            value={homePage?.title || ''}
            onChange={handleTitleChange}
            className="w-full text-xl font-bold bg-white/80 backdrop-blur-sm border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="כותרת לעמוד הבית..."
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-2">
            תוכן עמוד הבית
          </label>
          <textarea
            value={homePage?.content || ''}
            onChange={handleContentChange}
            rows={6}
            className="w-full bg-white/80 backdrop-blur-sm border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="תוכן עמוד הבית - הסבר על המדריך, הוראות שימוש, וכו'..."
          />
        </div>

        <div className="text-sm text-blue-600 bg-blue-100/50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <strong>טיפ:</strong> עמוד הבית הוא הדבר הראשון שהמשתמשים יראו. 
              השתמש בו כדי להסביר מה המדריך מכיל ואיך להשתמש בו.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePageEditor;
