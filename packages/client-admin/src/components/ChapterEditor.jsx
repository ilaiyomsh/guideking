import React from 'react';
import SectionEditor from './SectionEditor';
import { createNewSection, moveArrayItem } from '../utils/helpers';

function ChapterEditor({ 
  chapter, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  canMoveUp, 
  canMoveDown 
}) {
  const handleTitleChange = (e) => {
    onUpdate({ ...chapter, title: e.target.value });
  };

  const handleAddSection = () => {
    const newSection = createNewSection();
    const updatedChapter = {
      ...chapter,
      sections: [...chapter.sections, newSection]
    };
    onUpdate(updatedChapter);
  };

  const handleUpdateSection = (sectionIndex, updatedSection) => {
    const updatedSections = [...chapter.sections];
    updatedSections[sectionIndex] = updatedSection;
    onUpdate({ ...chapter, sections: updatedSections });
  };

  const handleDeleteSection = (sectionIndex) => {
    const confirmed = window.confirm('Are you sure you want to delete this section?');
    if (confirmed) {
      const updatedSections = chapter.sections.filter((_, index) => index !== sectionIndex);
      onUpdate({ ...chapter, sections: updatedSections });
    }
  };

  const handleMoveSectionUp = (sectionIndex) => {
    if (sectionIndex > 0) {
      const updatedSections = moveArrayItem(chapter.sections, sectionIndex, sectionIndex - 1);
      onUpdate({ ...chapter, sections: updatedSections });
    }
  };

  const handleMoveSectionDown = (sectionIndex) => {
    if (sectionIndex < chapter.sections.length - 1) {
      const updatedSections = moveArrayItem(chapter.sections, sectionIndex, sectionIndex + 1);
      onUpdate({ ...chapter, sections: updatedSections });
    }
  };

  return (
    <div className="chapter-block bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {/* Chapter Title */}
      <div className="flex justify-between items-center mb-4">
        <input 
          type="text" 
          value={chapter.title} 
          onChange={handleTitleChange}
          className="text-xl font-semibold bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 w-full"
          placeholder="שם הפרק..."
        />
        <div className="flex gap-1 mr-2">
          <button
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            title="הזז פרק למעלה"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
            </svg>
          </button>
          <button
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            title="הזז פרק למטה"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <button
            className="p-1 text-red-400 hover:text-red-600"
            onClick={onDelete}
            title="מחק פרק"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Sections Container */}
      <div className="sections-container pl-4 border-r-2 border-gray-200 space-y-4">
        {chapter.sections.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-500 mb-2">אין סעיפים עדיין</p>
            <p className="text-sm text-gray-400 mb-4">לחץ "הוסף סעיף חדש" כדי להתחיל</p>
          </div>
        ) : (
          chapter.sections.map((section, index) => (
            <SectionEditor
              key={section.id}
              section={section}
              onUpdate={(updatedSection) => handleUpdateSection(index, updatedSection)}
              onDelete={() => handleDeleteSection(index)}
              onMoveUp={() => handleMoveSectionUp(index)}
              onMoveDown={() => handleMoveSectionDown(index)}
              canMoveUp={index > 0}
              canMoveDown={index < chapter.sections.length - 1}
            />
          ))
        )}
      </div>
      
      {/* Add Section Button */}
      <div className="pl-4 mt-4">
        <button 
          className="w-full bg-slate-100 hover:bg-slate-200 border-2 border-dashed border-gray-300 text-gray-500 py-2 rounded-lg transition text-sm font-semibold"
          onClick={handleAddSection}
        >
          + הוסף סעיף חדש
        </button>
      </div>
    </div>
  );
}

export default ChapterEditor;
