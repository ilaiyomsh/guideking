import React from 'react'
import SectionDisplay from './SectionDisplay'

function ChapterDisplay({ chapter, isVisible }) {
  return (
    <div 
      id={chapter.id} 
      className={`content-block ${!isVisible ? 'hidden' : ''}`}
      style={{ marginBottom: '2rem' }}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #d0d4e4'
      }}>
        {/* Chapter Header */}
        <div style={{ padding: '1.5rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#323338'
          }}>
            {chapter.title}
          </h2>
        </div>

        {/* Chapter Description (if needed) */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #d0d4e4',
          color: '#676879'
        }}>
          <p>
            בפרק זה תמצאו מידע חשוב על {chapter.title.toLowerCase()}. 
            לחצו על הסעיפים השונים כדי לקרוא את התוכן המלא.
          </p>
        </div>

        {/* Sections */}
        <div style={{ borderTop: '1px solid #d0d4e4' }}>
          {chapter.sections.map(section => (
            <SectionDisplay key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChapterDisplay
