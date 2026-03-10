import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MembersPage from './pages/MembersPage'
import JobLoggerPage from './pages/JobLoggerPage'
import GangBankPage from './pages/GangBankPage'

// Legacy landing page components (kept for the public-facing route)
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Rules from './components/Rules'
import Ranks from './components/Ranks'
import Footer from './components/Footer'

function LandingPage() {
  return (
    <>
      <div className="scanline" />
      <Navbar />
      <Hero />
      <About />
      <Rules />
      <Ranks />
      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected tablet routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <MembersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobLoggerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bank"
            element={
              <ProtectedRoute>
                <GangBankPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
