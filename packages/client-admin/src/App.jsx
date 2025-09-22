import React, { useState, useEffect } from 'react';
// --- DndProvider ו-HTML5Backend הוסרו ---
import { GuideProvider } from './contexts/GuideContext';
import Sidebar from './components/Sidebar';
import GuideEditor from './components/GuideEditor';
import HomePageEditor from './components/HomePageEditor';
import './index.css';

function App() {
  // State לניהול נראות הסיידבר
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth > 768);

  // פונקציה להצגה/הסתרה של הסיידבר
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // useEffect שמטפל בשינוי גודל החלון
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarVisible(true);
      } else {
        setIsSidebarVisible(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    // GuideProvider נשאר במקומו
    <GuideProvider>
      {/* --- העטיפה של DndProvider הוסרה --- */}
      <button onClick={toggleSidebar} className="sidebar-toggle-button">
        ☰
      </button>
      
      <div className={`app-container ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
        <Sidebar />
        <main className="main-content">
          <HomePageEditor />
          <GuideEditor />
        </main>
      </div>
    </GuideProvider>
  );
}

export default App;
