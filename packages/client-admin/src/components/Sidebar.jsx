import React, { useState } from 'react';
import { useGuide } from '../contexts/GuideContext';

function Sidebar() {
  const { 
    guides, 
    currentGuide, 
    loading, 
    createNewGuide, 
    loadGuide, 
    deleteGuide,
    hasUnsavedChanges 
  } = useGuide();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleGuideSelect = (guideId) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('יש לך שינויים שלא נשמרו. האם אתה רוצה להמשיך בלי לשמור?');
      if (!confirmed) return;
    }
    loadGuide(guideId);
  };

  const handleNewGuide = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('יש לך שינויים שלא נשמרו. האם אתה רוצה להמשיך בלי לשמור?');
      if (!confirmed) return;
    }
    createNewGuide();
  };

  const handleDeleteGuide = async (guideId, e) => {
    e.stopPropagation();
    const success = await deleteGuide(guideId);
    if (success) {
      setShowDeleteConfirm(null);
    }
  };

  return (
    <aside className="w-72 bg-gray-800 text-white flex flex-col flex-shrink-0 fixed lg:relative inset-y-0 right-0 z-30 transform translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">מדריך.io</h1>
      </div>
      
      {/* New Guide Button */}
      <div className="p-4">
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          onClick={handleNewGuide}
          disabled={loading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>מדריך חדש</span>
        </button>
      </div>

      {/* Guides List */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <p className="text-xs text-gray-400 uppercase font-semibold mb-2 mt-2">
          המדריכים שלי ({guides.length})
        </p>
        
        {loading && guides.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            <div className="spinner mx-auto mb-2"></div>
            <p className="text-sm">טוען מדריכים...</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {guides.length === 0 ? (
              <li className="text-gray-400 text-sm italic py-2">אין מדריכים עדיין</li>
            ) : (
              guides.map(guide => (
                <li key={guide._id} className="relative">
                  <a 
                    href="#" 
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      currentGuide && currentGuide._id === guide._id 
                        ? 'text-white bg-blue-600 font-semibold' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleGuideSelect(guide._id);
                    }}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="truncate">{guide.title}</span>
                  </a>
                  
                  {/* Delete Button */}
                  <button
                    className="absolute top-1 left-1 w-6 h-6 text-gray-400 hover:text-red-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(guide._id);
                    }}
                    title="מחק מדריך"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === guide._id && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-red-500 rounded-lg p-3 z-50 shadow-lg">
                      <p className="text-sm text-gray-300 mb-2">למחוק את המדריך?</p>
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                          onClick={(e) => handleDeleteGuide(guide._id, e)}
                          disabled={loading}
                        >
                          מחק
                        </button>
                        <button
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(null);
                          }}
                        >
                          ביטול
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <img 
            className="h-10 w-10 rounded-full" 
            src="https://placehold.co/100x100/E2E8F0/4A5568?text=מש" 
            alt="User Avatar" 
          />
          <div>
            <p className="font-semibold text-white">משתמש מנהל</p>
            <a href="#" className="text-xs text-gray-400 hover:underline">התנתקות</a>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 left-4 right-72 bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded-lg text-sm z-40">
          ⚠️ יש לך שינויים שלא נשמרו
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
