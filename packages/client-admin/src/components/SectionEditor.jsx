import React from 'react';

function SectionEditor({ section, onUpdate, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  const handleTitleChange = (e) => {
    onUpdate({ ...section, title: e.target.value });
  };

  const handleContentChange = (e) => {
    onUpdate({ ...section, content: e.target.value });
  };

  return (
    <div className="section-block bg-slate-50 p-4 rounded-lg border">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <input 
          type="text" 
          value={section.title}
          onChange={handleTitleChange}
          placeholder="שם הסעיף..." 
          className="text-lg font-semibold bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 w-full"
        />
        <div className="flex gap-1 mr-2">
          <button
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            title="הזז סעיף למעלה"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
            </svg>
          </button>
          <button
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            title="הזז סעיף למטה"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <button
            className="p-1 text-red-400 hover:text-red-600"
            onClick={onDelete}
            title="מחק סעיף"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-blocks-container space-y-4">
        <div className="content-block relative group p-3 border-2 border-dashed border-transparent hover:border-gray-300 rounded-lg">
          <textarea 
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" 
            placeholder="הקלד את התוכן כאן..."
            value={section.content}
            onChange={handleContentChange}
          />
        </div>
      </div>
      
      {/* Add Content Toolbar */}
      <div className="add-content-toolbar mt-4 pt-4 border-t border-dashed">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button className="px-3 py-2 bg-white border rounded-lg text-sm hover:bg-gray-100 font-semibold text-gray-600">
            + הוסף טקסט
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mt-2">
        ID: {section.id}
      </div>
    </div>
  );
}

export default SectionEditor;
