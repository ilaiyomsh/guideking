import React, { useState, useEffect } from 'react'

function ChapterNav({ chapters, guideTitle, onChapterChange, activeChapter }) {
  const handleChapterClick = (chapterId, e) => {
    e.preventDefault()
    onChapterChange(chapterId)
  }

  const handleHomeClick = (e) => {
    e.preventDefault()
    onChapterChange('home')
  }

  return (
    <nav style={{ 
      position: 'sticky',
      top: '1rem',
      height: 'fit-content'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #d0d4e4',
        marginBottom: '1rem'
      }}>
        <h1 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          color: '#323338',
          marginBottom: '0.25rem'
        }}>
          {guideTitle}
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#676879'
        }}>
          ניווט מהיר בין הפרקים
        </p>
      </div>

      {/* Navigation Links */}
      <div style={{ padding: '0 1rem' }}>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          {/* Home Link */}
          <li>
            <a 
              href="#home"
              className={`chapter-link ${activeChapter === 'home' ? 'active' : ''}`}
              onClick={handleHomeClick}
            >
              עמוד הבית
            </a>
          </li>

          {/* Chapter Links */}
          {chapters.map(chapter => (
            <li key={chapter.id}>
              <a 
                href={`#${chapter.id}`}
                className={`chapter-link ${activeChapter === chapter.id ? 'active' : ''}`}
                onClick={(e) => handleChapterClick(chapter.id, e)}
              >
                {chapter.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default ChapterNav
