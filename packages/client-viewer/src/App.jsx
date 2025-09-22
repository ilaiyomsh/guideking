import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GuideViewPage from './pages/GuideViewPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/guides/:guideId" element={<GuideViewPage />} />
        <Route path="/" element={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Interactive Guides - Viewer</h1>
            <p>Navigate to /guides/:guideId to view a guide</p>
            <p>Example: <a href="/guides/6328a5e9f1a2b3c4d5e6f7a8">/guides/6328a5e9f1a2b3c4d5e6f7a8</a></p>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App
