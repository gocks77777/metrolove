import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useStore } from '@/store/useStore'
import { LoginPage } from '@/pages/LoginPage'
import { ProfileSetupPage } from '@/pages/ProfileSetupPage'
import { LandingPage } from '@/pages/LandingPage'
import { MatchPage } from '@/pages/MatchPage'
import { ChatListPage } from '@/pages/ChatListPage'
import { ChatPage } from '@/pages/ChatPage'
import { MapPage } from '@/pages/MapPage'
import { AdminPage } from '@/pages/AdminPage'
import { ProfilePage } from '@/pages/ProfilePage'

function AppRoutes() {
  const { isAuthenticated, hasProfile, loading } = useAuth()
  const { demoMode, user } = useStore()

  // Demo mode bypasses auth
  const isDemoActive = demoMode && user?.id === 'demo-user'

  if (loading && !isDemoActive) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-4xl animate-bounce">🚇</div>
      </div>
    )
  }

  if (!isAuthenticated && !isDemoActive) {
    return <LoginPage />
  }

  if (!hasProfile && !isDemoActive) {
    return <ProfileSetupPage />
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/match" element={<MatchPage />} />
      <Route path="/chat" element={<ChatListPage />} />
      <Route path="/chat/:matchId" element={<ChatPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      {/* Skip to content for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
        style={{ background: 'var(--color-accent)', color: '#1A1A1A' }}
      >
        본문으로 건너뛰기
      </a>
      <div id="main-content" className="mx-auto min-h-dvh relative" role="main" style={{ maxWidth: '520px' }}>
        <AppRoutes />
      </div>
      {/* Live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="sr-announcer" />
    </BrowserRouter>
  )
}

export default App
