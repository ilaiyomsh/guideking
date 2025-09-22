import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GuideProvider } from './contexts/GuideContext';
import Sidebar from './components/Sidebar';
import GuideEditor from './components/GuideEditor';
import HomePageEditor from './components/HomePageEditor';
import './index.css';

function App() {
  // State to manage sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth > 768);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Effect to handle window resize
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
    <GuideProvider>
      <DndProvider backend={HTML5Backend}>
        {/* Toggle button for sidebar */}
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
      </DndProvider>
    </GuideProvider>
  );
}

export default App;
