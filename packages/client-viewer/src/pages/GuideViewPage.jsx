import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchGuide } from '../services/api'
import ChapterNav from '../components/ChapterNav'
import ChapterDisplay from '../components/ChapterDisplay'

function GuideViewPage() {
  const [guide, setGuide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeChapter, setActiveChapter] = useState('home')
  const { guideId } = useParams()

  const handleChapterChange = (chapterId) => {
    setActiveChapter(chapterId)
  }

  useEffect(() => {
    const loadGuide = async () => {
      try {
        setLoading(true)
        setError(null)
        const guideData = await fetchGuide(guideId)
        setGuide(guideData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (guideId) {
      loadGuide()
    }
  }, [guideId])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#676879'
      }}>
        טוען מדריך...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        color: '#d32f2f'
      }}>
        <h1>שגיאה</h1>
        <p>{error}</p>
        <p style={{ color: '#676879', fontSize: '0.9rem' }}>
          מזהה מדריך: {guideId}
        </p>
      </div>
    )
  }

  if (!guide) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#676879'
      }}>
        לא נמצא מדריך
      </div>
    )
  }

  return (
    <div className="guide-layout" style={{ 
      display: 'flex', 
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      {/* Sidebar Navigation */}
      <aside style={{ 
        width: '20rem', 
        backgroundColor: 'white',
        borderLeft: '1px solid #d0d4e4',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <ChapterNav 
          chapters={guide.chapters} 
          guideTitle={guide.title}
          onChapterChange={handleChapterChange}
          activeChapter={activeChapter}
        />
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 2rem'
      }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          
          {/* Home Page */}
          {activeChapter === 'home' && (
            <div id="home" className="content-block">
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #d0d4e4'
              }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: 'bold',
                  color: '#323338',
                  marginBottom: '1rem'
                }}>
                  {guide.homePage?.title || 'ברוכים הבאים למדריך!'}
                </h2>
                <div style={{
                  fontSize: '1.125rem',
                  color: '#676879',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {guide.homePage?.content || 'מדריך זה נועד לסייע לכם בהכרת הנושאים החשובים. הוא מחולק למספר פרקים, וכל אחד מהם מכסה נושא חשוב אחר.\n\nכדי להתחיל, בחרו את הפרק הרצוי מסרגל הניווט בצד שמאל.'}
                </div>
              </div>
            </div>
          )}

          {/* Chapters */}
          {guide.chapters.map(chapter => (
            <ChapterDisplay 
              key={chapter.id} 
              chapter={chapter}
              isVisible={activeChapter === chapter.id}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default GuideViewPage
