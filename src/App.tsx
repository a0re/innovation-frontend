import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ComprehensiveDemo } from './components/ComprehensiveDemo'
import { ModelTest } from './pages/ModelTest'
import { Dashboard } from './pages/Dashboard'
import { Navigation } from './components/Navigation'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<ComprehensiveDemo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/model-test" element={<ModelTest />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
