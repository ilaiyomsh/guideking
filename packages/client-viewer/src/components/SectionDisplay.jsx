import React from 'react'

function SectionDisplay({ section }) {
  return (
    <details className="group" style={{ borderTop: '1px solid #d0d4e4' }}>
      <summary className="monday-hover-bg" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}>
        <span style={{
          fontSize: '1.125rem',
          fontWeight: '500',
          color: '#323338'
        }}>
          {section.title}
        </span>
        <svg 
          className="arrow" 
          style={{
            width: '1.25rem',
            height: '1.25rem',
            color: '#676879',
            transition: 'transform 0.2s ease'
          }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </summary>
      <div style={{
        padding: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid #d0d4e4',
        color: '#676879',
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6'
      }}>
        {section.content}
      </div>
    </details>
  )
}

export default SectionDisplay
