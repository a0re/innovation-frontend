import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ComprehensiveDemo } from './components/ComprehensiveDemo'
import { ModelTest } from './pages/ModelTest'
import { Dashboard } from './pages/Dashboard'
import { NotFound } from './pages/NotFound'
import { Navigation } from './components/Navigation'


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<ComprehensiveDemo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/model-test" element={<ModelTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
