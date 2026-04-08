import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { usePresence } from '@/hooks/usePresence'
import { useDemoMode } from '@/hooks/useDemoMode'
import { SubwayLineMap, type Station } from '@/components/map/SubwayLineMap'
import { MatchNotification } from '@/components/matching/MatchNotification'
import type { ActiveUser } from '@/types'

// Line 2 subset for MVP (5 stations, 강남 구간)
const LINE_2_STATIONS: Station[] = [
  { id: '교대', name: '교대', x: 0, y: 0 },
  { id: '강남', name: '강남', x: 0, y: 0 },
  { id: '역삼', name: '역삼', x: 0, y: 0 },
  { id: '선릉', name: '선릉', x: 0, y: 0 },
  { id: '삼성', name: '삼성', x: 0, y: 0 },
]

export function MapPage() {
  const navigate = useNavigate()
  const { activeUsers, ghostUsers, wifiStatus, currentStation, demoMode, setChatRooms, chatRooms } = useStore()
  const { joinPresence } = usePresence()
  const { toggleDemo, startDemo } = useDemoMode()
  const [selectedUser, setSelectedUser] = useState<ActiveUser | null>(null)
  const [matchedUser, setMatchedUser] = useState<string | null>(null)

  useEffect(() => {
    if (demoMode && activeUsers.length === 0) {
      startDemo()
    } else if (wifiStatus === 'connected' && !demoMode) {
      joinPresence()
    }
  }, [wifiStatus, demoMode, activeUsers.length, joinPresence, startDemo])

  return (
    <div className="min-h-dvh" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="display text-4xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
              지금, 2호선
            </h1>
            <p className="text-base mt-2" style={{ color: 'var(--color-text-secondary)' }}>
              {currentStation ? `${currentStation} 구간` : '강남 → 삼성 구간'}
            </p>
          </div>
          {wifiStatus === 'connected' && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(60,179,113,0.12)', color: 'var(--color-success)' }}
            >
              <span className="w-2 h-2 rounded-full animate-wifi-dot" style={{ background: 'var(--color-success)' }} />
              <span className="text-sm font-semibold">탑승 중</span>
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
          className="text-sm font-semibold mb-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          근처 탑승자 · {activeUsers.length}명
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
                className="card flex-shrink-0 w-[140px] p-5 text-center"
              >
                <div
                  className="w-14 h-14 rounded-full mb-3 flex items-center justify-center text-3xl"
                  style={{ background: 'var(--color-surface)', border: '2px solid var(--color-border)' }}
                >
                  {user.avatar_url ?? '🧑'}
                </div>
                <p className="text-base font-bold truncate" style={{ color: 'var(--color-text)' }}>
                  {user.nickname}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
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
            className="fixed inset-x-0 bottom-0 mx-auto z-20"
            style={{ maxWidth: '960px' }}
          >
            <div className="mx-4 mb-4 card p-6 shadow-lg" style={{ background: 'var(--color-surface-raised)' }}>
              {/* Close */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-xl w-8 h-8 flex items-center justify-center rounded-full"
                  style={{ color: 'var(--color-text-secondary)', background: 'var(--color-surface)' }}
                >
                  ✕
                </button>
              </div>

              {/* Profile */}
              <div className="text-center mb-5">
                <div
                  className="w-20 h-20 rounded-full mb-4 flex items-center justify-center text-4xl"
                  style={{ background: 'var(--color-surface)', border: '3px solid var(--color-border-strong)' }}
                >
                  {selectedUser.avatar_url ?? '🧑'}
                </div>
                <h3 className="display text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {selectedUser.nickname}
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedUser.station}역 근처 · {formatTimeAgo(selectedUser.online_at)}
                </p>
              </div>

              {/* Commute thought */}
              <div
                className="rounded-xl p-4 mb-5"
                style={{ background: 'var(--color-surface)', borderLeft: '3px solid var(--color-accent)' }}
              >
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  오늘의 출근 생각
                </p>
                <p className="text-base" style={{ color: 'var(--color-text)' }}>
                  퇴근길에 좋은 사람 만나면 좋겠다 ☺️
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex justify-center gap-5">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2"
                  style={{ borderColor: 'var(--color-alert)', color: 'var(--color-alert)', background: 'var(--color-surface-raised)' }}
                  aria-label="패스"
                >
                  ✕
                </button>
                <button
                  onClick={() => {
                    if (!selectedUser) return
                    const matchId = `demo-match-${Date.now()}`
                    setChatRooms([
                      ...chatRooms,
                      {
                        match_id: matchId,
                        partner: {
                          id: selectedUser.id,
                          nickname: selectedUser.nickname,
                          bio: '퇴근길에 좋은 사람 만나면 좋겠다',
                          avatar_url: selectedUser.avatar_url,
                          gender: null,
                          age: null,
                          created_at: new Date().toISOString(),
                        },
                        last_message: null,
                        unread_count: 0,
                        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                        is_extended: false,
                      },
                    ])
                    setMatchedUser(selectedUser.nickname)
                    setSelectedUser(null)
                    setTimeout(() => {
                      setMatchedUser(null)
                      navigate(`/chat/${matchId}`)
                    }, 2000)
                  }}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{ background: 'var(--color-accent)', color: '#1A1A1A', boxShadow: '0 4px 20px rgba(242,201,76,0.3)' }}
                  aria-label="좋아요"
                >
                  💛
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2"
                  style={{ borderColor: 'var(--color-connection)', color: 'var(--color-connection)', background: 'var(--color-surface-raised)' }}
                  aria-label="메시지"
                >
                  💬
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MatchNotification nickname={matchedUser} />

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
        className="fixed bottom-0 inset-x-0 mx-auto flex justify-around py-3 pb-6 border-t"
        style={{
          maxWidth: '960px',
          background: 'var(--color-surface-raised)',
          borderColor: 'var(--color-border)',
        }}
        role="navigation"
        aria-label="메인 네비게이션"
      >
        <NavItem icon="🗺" label="노선" active onClick={() => {}} />
        <NavItem icon="💬" label="채팅" onClick={() => navigate('/chat')} />
        <NavItem icon="📡" label="근처" onClick={() => navigate('/match')} />
        <NavItem icon="👤" label="프로필" onClick={() => navigate('/profile')} />
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
      className="flex flex-col items-center gap-1 text-xs font-medium"
      style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
    >
      <span className="text-2xl">{icon}</span>
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
