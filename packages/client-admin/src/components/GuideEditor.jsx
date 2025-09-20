import React, { useState } from 'react';
import { useGuide } from '../contexts/GuideContext';
import ChapterEditor from './ChapterEditor';
import HomePageEditor from './HomePageEditor';
import Toast from './Toast';
import { createNewChapter, moveArrayItem } from '../utils/helpers';

function GuideEditor() {
  const { 
    currentGuide, 
    updateCurrentGuide, 
    saveCurrentGuide, 
    loading, 
    error, 
    clearError,
    hasUnsavedChanges 
  } = useGuide();
  
  const [toast, setToast] = useState({ message: '', type: '' });

  if (!currentGuide) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl flex items-center justify-center h-full">
        <div className="text-center">
          <div className="mb-6">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ברוכים הבאים לסטודיו המדריכים</h2>
          <p className="text-gray-600">בחר מדריך מהסיידבר או צור מדריך חדש כדי להתחיל.</p>
        </div>
      </div>
    );
  }

  const handleTitleChange = (e) => {
    updateCurrentGuide({ ...currentGuide, title: e.target.value });
  };

  const handleHomePageUpdate = (updatedHomePage) => {
    updateCurrentGuide({ ...currentGuide, homePage: updatedHomePage });
  };

  const handleCopyLink = async () => {
    if (currentGuide._id) {
      // Use environment variable for viewer URL, fallback to localhost
      const viewerUrl = import.meta.env.VITE_VIEWER_URL || 'http://localhost:3002';
      const link = `${viewerUrl}/guides/${currentGuide._id}`;
      try {
        await navigator.clipboard.writeText(link);
        setToast({ message: 'קישור הועתק ללוח!', type: 'success' });
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setToast({ message: 'קישור הועתק ללוח!', type: 'success' });
      }
    } else {
      setToast({ message: 'שמור את המדריך קודם כדי לקבל קישור', type: 'error' });
    }
  };

  const handleAddChapter = () => {
    const newChapter = createNewChapter();
    const updatedGuide = {
      ...currentGuide,
      chapters: [...currentGuide.chapters, newChapter]
    };
    updateCurrentGuide(updatedGuide);
  };

  const handleUpdateChapter = (chapterIndex, updatedChapter) => {
    const updatedChapters = [...currentGuide.chapters];
    updatedChapters[chapterIndex] = updatedChapter;
    updateCurrentGuide({ ...currentGuide, chapters: updatedChapters });
  };

  const handleDeleteChapter = (chapterIndex) => {
    const confirmed = window.confirm('Are you sure you want to delete this chapter and all its sections?');
    if (confirmed) {
      const updatedChapters = currentGuide.chapters.filter((_, index) => index !== chapterIndex);
      updateCurrentGuide({ ...currentGuide, chapters: updatedChapters });
    }
  };

  const handleMoveChapterUp = (chapterIndex) => {
    if (chapterIndex > 0) {
      const updatedChapters = moveArrayItem(currentGuide.chapters, chapterIndex, chapterIndex - 1);
      updateCurrentGuide({ ...currentGuide, chapters: updatedChapters });
    }
  };

  const handleMoveChapterDown = (chapterIndex) => {
    if (chapterIndex < currentGuide.chapters.length - 1) {
      const updatedChapters = moveArrayItem(currentGuide.chapters, chapterIndex, chapterIndex + 1);
      updateCurrentGuide({ ...currentGuide, chapters: updatedChapters });
    }
  };

  const handleSave = async () => {
    const success = await saveCurrentGuide();
    if (success) {
      setToast({ message: 'Guide saved successfully!', type: 'success' });
    } else {
      setToast({ message: 'Failed to save guide. Please try again.', type: 'error' });
    }
  };

  const handlePreview = () => {
    console.log('Preview clicked, currentGuide:', currentGuide); // Debug log
    if (currentGuide && currentGuide._id) {
      // Use environment variable for viewer URL, fallback to localhost
      const viewerUrl = import.meta.env.VITE_VIEWER_URL || 'http://localhost:3002';
      const previewUrl = `${viewerUrl}/guides/${currentGuide._id}`;
      console.log('Opening preview URL:', previewUrl); // Debug log
      window.open(previewUrl, '_blank');
    } else {
      console.log('No guide ID found, current guide:', currentGuide); // Debug log
      setToast({ message: 'שמור את המדריך קודם כדי לצפות בו', type: 'error' });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 flex-1">
          <input 
            type="text" 
            value={currentGuide.title} 
            onChange={handleTitleChange}
            className="text-3xl font-bold bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 w-full"
            placeholder="כותרת המדריך..."
          />
          {currentGuide._id && (
            <div className="text-xs text-gray-500 mt-1">
              ID: {currentGuide._id}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-yellow-600 text-sm font-medium">
              שינויים לא נשמרו
            </span>
          )}
          
          <button
            className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition flex items-center gap-2"
            onClick={handleCopyLink}
            disabled={!currentGuide._id}
            title={!currentGuide._id ? "שמור את המדריך קודם כדי לקבל קישור" : "העתק קישור לצפייה"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            העתק קישור
          </button>
          
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
            onClick={handlePreview}
            disabled={!currentGuide._id}
            title={!currentGuide._id ? "שמור את המדריך קודם כדי לצפות" : "פתח בצפייה"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            תצוגה מקדימה
          </button>
          
          <button
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                שומר...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                שמור שינויים
              </>
            )}
          </button>
        </div>
      </header>

      {/* Home Page Editor */}
      <HomePageEditor
        homePage={currentGuide.homePage || { title: '', content: '' }}
        onUpdate={handleHomePageUpdate}
      />

      {/* Chapters Container */}
      <div id="chapters-container" className="space-y-6">
        {currentGuide.chapters.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">אין פרקים עדיין</h3>
            <p className="text-gray-500 mb-4">התחל לבנות את המדריך שלך על ידי הוספת הפרק הראשון.</p>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
              onClick={handleAddChapter}
            >
              הוסף את הפרק הראשון
            </button>
          </div>
        ) : (
          currentGuide.chapters.map((chapter, index) => (
            <ChapterEditor
              key={chapter.id}
              chapter={chapter}
              onUpdate={(updatedChapter) => handleUpdateChapter(index, updatedChapter)}
              onDelete={() => handleDeleteChapter(index)}
              onMoveUp={() => handleMoveChapterUp(index)}
              onMoveDown={() => handleMoveChapterDown(index)}
              canMoveUp={index > 0}
              canMoveDown={index < currentGuide.chapters.length - 1}
            />
          ))
        )}
      </div>

      {/* Add Chapter Button */}
      <div className="mt-8">
        <button
          className="w-full bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 text-gray-500 py-3 rounded-lg transition font-bold"
          onClick={handleAddChapter}
        >
          + הוסף פרק חדש
        </button>
      </div>

      {/* Toast notifications */}
      <Toast
        message={toast.message || error}
        type={error ? 'error' : toast.type}
        onClose={() => {
          setToast({ message: '', type: '' });
          if (error) clearError();
        }}
      />
    </div>
  );
}

export default GuideEditor;
