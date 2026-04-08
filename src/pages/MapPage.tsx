import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { usePresence } from '@/hooks/usePresence'
import { useDemoMode } from '@/hooks/useDemoMode'
import { SubwayLineMap, type Station } from '@/components/map/SubwayLineMap'
import type { ActiveUser } from '@/types'

// Line 2 subset for MVP (5 stations, 강남 구간)
const LINE_2_STATIONS: Station[] = [
  { id: 'gyodae', name: '교대', x: 0, y: 0 },
  { id: 'gangnam', name: '강남', x: 0, y: 0 },
  { id: 'yeoksam', name: '역삼', x: 0, y: 0 },
  { id: 'seolleung', name: '선릉', x: 0, y: 0 },
  { id: 'samsung', name: '삼성', x: 0, y: 0 },
]

export function MapPage() {
  const navigate = useNavigate()
  const { activeUsers, ghostUsers, wifiStatus, currentStation, demoMode } = useStore()
  const { joinPresence } = usePresence()
  const { toggleDemo } = useDemoMode()
  const [selectedUser, setSelectedUser] = useState<ActiveUser | null>(null)

  useEffect(() => {
    if (wifiStatus === 'connected') {
      joinPresence()
    }
  }, [wifiStatus, joinPresence])

  return (
    <div className="min-h-dvh" style={{ background: 'var(--color-bg)' }}>
      {/* Status Bar */}
      <div
        className="flex justify-between items-center px-5 py-3 mono text-[12px]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <span>{new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="text-[10px]">
          {wifiStatus === 'connected' ? 'T wifi zone' : ''}
        </span>
      </div>

      {/* Header */}
      <div className="px-5 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="display text-[28px] font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
              지금, 2호선
            </h1>
            <p className="mono text-[11px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {currentStation ? `${currentStation} 구간` : '강남 → 삼성 구간'}
            </p>
          </div>
          {wifiStatus === 'connected' && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(60,179,113,0.1)', color: 'var(--color-success)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-wifi-dot" style={{ background: 'var(--color-success)' }} />
              <span className="mono text-[11px] font-medium">탑승 중</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Route Map */}
      <div className="px-5 mb-5">
        <SubwayLineMap
          lineNumber={2}
          lineColor="var(--color-line-2)"
          stations={LINE_2_STATIONS}
          activeUsers={activeUsers}
          ghostUsers={ghostUsers}
          currentStation={currentStation}
          onUserTap={(user) => setSelectedUser(user)}
        />
      </div>

      {/* Nearby Users Section */}
      <div className="px-5 mb-5">
        <p
          className="mono text-[11px] uppercase tracking-wider mb-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          근처 탑승자 // {activeUsers.length}명
        </p>
        <div className="flex gap-2.5 overflow-x-auto pb-2">
          {activeUsers.length === 0 ? (
            <div
              className="card p-4 text-center w-full"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <span className="text-2xl block mb-2">🚇</span>
              <span className="text-sm">아직 근처에 탑승자가 없어요</span>
            </div>
          ) : (
            activeUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="card flex-shrink-0 w-[120px] p-4 text-center"
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2.5 flex items-center justify-center text-2xl"
                  style={{ background: 'var(--color-surface)', border: '2px solid var(--color-border)' }}
                >
                  {user.avatar_url ?? '🧑'}
                </div>
                <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                  {user.nickname}
                </p>
                <p className="mono text-[10px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                  {user.station}역
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Selected User Profile Card */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-x-0 bottom-0 max-w-md mx-auto z-20"
          >
            <div className="mx-4 mb-4 card p-5 shadow-lg" style={{ background: 'var(--color-surface-raised)' }}>
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: 'var(--color-surface)' }}
                >
                  {selectedUser.avatar_url ?? '🧑'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="display text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                    {selectedUser.nickname}
                  </h3>
                  <p className="mono text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    {selectedUser.station}역 근처 // {formatTimeAgo(selectedUser.online_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-xl"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  ✕
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex justify-center gap-4 mt-5">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2"
                  style={{ borderColor: 'var(--color-alert)', color: 'var(--color-alert)' }}
                  aria-label="패스"
                >
                  ✕
                </button>
                <button
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: 'var(--color-accent)', color: '#1A1A1A' }}
                  aria-label="좋아요"
                >
                  💛
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2"
                  style={{ borderColor: 'var(--color-connection)', color: 'var(--color-connection)' }}
                  aria-label="메시지"
                >
                  💬
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Mode Toggle */}
      <div className="px-5 mb-20">
        <button
          onClick={toggleDemo}
          className="w-full py-2.5 rounded-lg mono text-[11px] font-medium transition-all"
          style={{
            background: demoMode ? 'var(--color-accent)' : 'var(--color-surface)',
            color: demoMode ? '#1A1A1A' : 'var(--color-text-secondary)',
            border: `1px solid ${demoMode ? 'var(--color-accent)' : 'var(--color-border-strong)'}`,
          }}
          aria-label={demoMode ? 'Demo Mode 끄기' : 'Demo Mode 켜기'}
        >
          {demoMode ? '🟢 DEMO MODE ON — 시뮬레이션 중' : '▶ DEMO MODE — 체험해보기'}
        </button>
      </div>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 inset-x-0 max-w-md mx-auto flex justify-around py-3 pb-6 border-t"
        style={{
          background: 'var(--color-surface-raised)',
          borderColor: 'var(--color-border)',
        }}
        role="navigation"
        aria-label="메인 네비게이션"
      >
        <NavItem icon="🗺" label="노선" active onClick={() => {}} />
        <NavItem icon="💬" label="채팅" onClick={() => navigate('/chat')} />
        <NavItem icon="📡" label="근처" onClick={() => navigate('/match')} />
        <NavItem icon="👤" label="프로필" onClick={() => {}} />
      </nav>
    </div>
  )
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 mono text-[10px]"
      style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '방금'
  if (mins < 60) return `${mins}분 전`
  return `${Math.floor(mins / 60)}시간 전`
}
