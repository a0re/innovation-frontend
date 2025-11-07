import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from '@/components/layout'
import { routes } from '@/config/routes'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          ))}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
