import React from 'react';
import { GuideProvider } from './contexts/GuideContext';
import Sidebar from './components/Sidebar';
import GuideEditor from './components/GuideEditor';

function App() {
  return (
    <GuideProvider>
      <div className="bg-slate-100">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <GuideEditor />
          </main>
          
          {/* Overlay for mobile sidebar */}
          <div id="sidebar-overlay" className="fixed inset-0 bg-black bg-opacity-50 z-20 hidden lg:hidden"></div>
        </div>
      </div>
    </GuideProvider>
  );
}

export default App;
