import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { usePresence } from '@/hooks/usePresence'
import { useMatching } from '@/hooks/useMatching'
import { MatchNotification } from '@/components/matching/MatchNotification'

export function MatchPage() {
  const navigate = useNavigate()
  const { activeUsers, chatRooms, wifiStatus } = useStore()
  const { joinPresence } = usePresence()
  const { swipe } = useMatching()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [newMatch, setNewMatch] = useState<string | null>(null)

  useEffect(() => {
    joinPresence()
  }, [joinPresence])

  const prevMatchCount = useMemo(() => chatRooms.length, [chatRooms.length])
  useEffect(() => {
    if (chatRooms.length > prevMatchCount && chatRooms.length > 0) {
      setNewMatch(chatRooms[0].partner.nickname)
      setTimeout(() => setNewMatch(null), 3000)
    }
  }, [chatRooms.length, chatRooms, prevMatchCount])

  const currentProfile = activeUsers[currentIndex]
  const nextProfile = activeUsers[currentIndex + 1]

  const handleSwipe = async (dir: 'left' | 'right') => {
    if (!currentProfile) return
    setDirection(dir)

    if (dir === 'right') {
      await swipe(currentProfile.id, 'like')
    } else {
      await swipe(currentProfile.id, 'pass')
    }

    setTimeout(() => {
      setDirection(null)
      setCurrentIndex((prev) =>
        prev + 1 >= activeUsers.length ? 0 : prev + 1
      )
    }, 300)
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) handleSwipe('right')
    else if (info.offset.x < -100) handleSwipe('left')
  }

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden mx-auto" style={{ background: "var(--color-bg)", maxWidth: "100%" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🚇</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            {wifiStatus === 'connected' ? '2호선' : '오프라인'}
          </span>
          {wifiStatus === 'connected' && (
            <span className="w-2 h-2 rounded-full animate-wifi-dot" style={{ background: 'var(--color-success)' }} />
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="mono text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {activeUsers.length}명
          </span>
          <button onClick={() => navigate('/map')} className="w-9 h-9 card rounded-full flex items-center justify-center text-sm">
            🗺
          </button>
          <button onClick={() => navigate('/chat')} className="relative w-9 h-9 card rounded-full flex items-center justify-center text-sm">
            💬
            {chatRooms.length > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
                style={{ background: 'var(--color-accent)', color: '#1A1A1A' }}
              >
                {chatRooms.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center px-5 pb-4 relative z-10">
        {activeUsers.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <motion.div className="text-6xl mb-5" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
              🔍
            </motion.div>
            <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              주변에 탑승 중인 승객이 없어요
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
              같은 노선에 다른 승객이 탑승하면 알려줄게요
            </p>
          </motion.div>
        ) : currentProfile ? (
          <div className="relative w-full max-w-sm aspect-[3/4]">
            {nextProfile && (
              <div className="absolute inset-x-3 inset-y-2 card opacity-50 scale-[0.95]" style={{ borderRadius: 'var(--radius-xl)' }} />
            )}

            <AnimatePresence>
              <motion.div
                key={currentProfile.id}
                className="absolute inset-0 card overflow-hidden cursor-grab active:cursor-grabbing"
                style={{ borderRadius: 'var(--radius-xl)' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{
                  scale: 1, opacity: 1, y: 0,
                  x: direction === 'left' ? -350 : direction === 'right' ? 350 : 0,
                  rotate: direction === 'left' ? -18 : direction === 'right' ? 18 : 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* Avatar */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
                    style={{ background: 'var(--color-bg)', border: '3px solid var(--color-border-strong)' }}
                  >
                    {currentProfile.avatar_url || currentProfile.nickname.charAt(0)}
                  </div>
                </div>

                {/* Info overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6"
                  style={{ background: 'linear-gradient(to top, var(--color-surface-raised) 0%, transparent 100%)' }}
                >
                  <h2 className="display text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                    {currentProfile.nickname}
                  </h2>
                  {currentProfile.station && (
                    <p className="mono text-sm flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-line-2)' }} />
                      {currentProfile.station}역 근처
                    </p>
                  )}
                </div>

                {/* Swipe labels */}
                <AnimatePresence>
                  {direction === 'right' && (
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-10 left-8 px-5 py-2.5 border-[3px] rounded-xl -rotate-12"
                      style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>
                      <span className="font-black text-2xl">LIKE</span>
                    </motion.div>
                  )}
                  {direction === 'left' && (
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-10 right-8 px-5 py-2.5 border-[3px] rounded-xl rotate-12"
                      style={{ borderColor: 'var(--color-alert)', color: 'var(--color-alert)' }}>
                      <span className="font-black text-2xl">NOPE</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}
      </div>

      {/* Action buttons */}
      {activeUsers.length > 0 && currentProfile && (
        <div className="flex items-center justify-center gap-5 pb-8 relative z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl border-2"
            style={{ borderColor: 'var(--color-alert)', color: 'var(--color-alert)', background: 'var(--color-surface-raised)' }}
            aria-label="패스"
          >
            ✕
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
            className="w-[68px] h-[68px] rounded-full flex items-center justify-center text-3xl"
            style={{ background: 'var(--color-accent)', color: '#1A1A1A' }}
            aria-label="좋아요"
          >
            💛
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/chat')}
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl border-2"
            style={{ borderColor: 'var(--color-connection)', color: 'var(--color-connection)', background: 'var(--color-surface-raised)' }}
            aria-label="채팅"
          >
            💬
          </motion.button>
        </div>
      )}

      <MatchNotification nickname={newMatch} />
    </div>
  )
}
