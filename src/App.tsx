import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoginPage } from '@/pages/LoginPage'
import { ProfileSetupPage } from '@/pages/ProfileSetupPage'
import { LandingPage } from '@/pages/LandingPage'
import { MatchPage } from '@/pages/MatchPage'
import { ChatListPage } from '@/pages/ChatListPage'
import { ChatPage } from '@/pages/ChatPage'
import { MapPage } from '@/pages/MapPage'
import { AdminPage } from '@/pages/AdminPage'

function AppRoutes() {
  const { isAuthenticated, hasProfile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-4xl animate-bounce">🚇</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  if (!hasProfile) {
    return <ProfileSetupPage />
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/match" element={<MatchPage />} />
      <Route path="/chat" element={<ChatListPage />} />
      <Route path="/chat/:matchId" element={<ChatPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-md mx-auto min-h-dvh">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
