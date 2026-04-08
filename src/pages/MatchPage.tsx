import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { usePresence } from '@/hooks/usePresence'
import { useMatching } from '@/hooks/useMatching'
import { DisconnectTimer } from '@/components/common/DisconnectTimer'
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
      const latest = chatRooms[0]
      setNewMatch(latest.partner.nickname)
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
    <div className="min-h-dvh flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-pink/5 rounded-full blur-[150px]" />

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🚇</span>
          <span className="text-sm font-semibold text-text-primary">
            {wifiStatus === 'connected' ? '2호선' : '오프라인'}
          </span>
          {wifiStatus === 'connected' && (
            <span className="w-2 h-2 bg-success rounded-full glow-success" />
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-text-secondary">
            {activeUsers.length}명 탑승 중
          </span>
          <button
            onClick={() => navigate('/map')}
            className="w-9 h-9 rounded-full bg-surface border border-white/5 flex items-center justify-center text-sm hover:border-neon-purple/30 transition-colors"
          >
            🗺
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="relative w-9 h-9 rounded-full bg-surface border border-white/5 flex items-center justify-center text-sm hover:border-neon-pink/30 transition-colors"
          >
            💬
            {chatRooms.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-neon-pink rounded-full text-[10px] flex items-center justify-center text-white font-bold glow-pink-sm">
                {chatRooms.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center px-5 pb-4 relative z-10">
        {activeUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              className="text-6xl mb-5"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              🔍
            </motion.div>
            <p className="text-text-secondary font-medium">
              주변에 탑승 중인 승객이 없어요
            </p>
            <p className="text-text-muted text-sm mt-2">
              같은 노선에 다른 승객이 탑승하면 알려줄게요
            </p>
          </motion.div>
        ) : currentProfile ? (
          <div className="relative w-full max-w-sm aspect-[3/4]">
            {/* Background card (depth effect) */}
            {nextProfile && (
              <div className="absolute inset-x-3 inset-y-2 bg-card rounded-3xl border border-white/5 opacity-50 scale-[0.95]" />
            )}

            <AnimatePresence>
              <motion.div
                key={currentProfile.id}
                className="absolute inset-0 bg-card rounded-3xl border border-white/[0.06] overflow-hidden cursor-grab active:cursor-grabbing card-glow"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  x: direction === 'left' ? -350 : direction === 'right' ? 350 : 0,
                  rotate: direction === 'left' ? -18 : direction === 'right' ? 18 : 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* Avatar area */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {currentProfile.avatar_url ? (
                    <img
                      src={currentProfile.avatar_url}
                      alt=""
                      className="w-36 h-36 rounded-full object-cover border-[3px] border-white/10"
                      style={{ boxShadow: '0 0 30px rgba(255,0,110,0.2)' }}
                    />
                  ) : (
                    <div
                      className="w-36 h-36 rounded-full flex items-center justify-center text-6xl"
                      style={{
                        background: 'linear-gradient(135deg, #ff006e, #8b5cf6)',
                        boxShadow: '0 0 40px rgba(255,0,110,0.3)',
                      }}
                    >
                      {currentProfile.nickname.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6"
                  style={{ background: 'linear-gradient(to top, rgba(10,10,20,0.95) 0%, rgba(10,10,20,0.6) 50%, transparent 100%)' }}
                >
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {currentProfile.nickname}
                  </h2>
                  {currentProfile.station && (
                    <p className="text-text-secondary text-sm flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-line-2 rounded-full glow-success" />
                      {currentProfile.station}역 부근
                    </p>
                  )}
                </div>

                {/* Swipe labels */}
                <AnimatePresence>
                  {direction === 'right' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-10 left-8 px-5 py-2.5 border-[3px] border-success rounded-xl -rotate-12"
                    >
                      <span className="text-success font-black text-2xl">LIKE</span>
                    </motion.div>
                  )}
                  {direction === 'left' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-10 right-8 px-5 py-2.5 border-[3px] border-danger rounded-xl rotate-12"
                    >
                      <span className="text-danger font-black text-2xl">NOPE</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}
      </div>

      {/* Action buttons — Tinder style */}
      {activeUsers.length > 0 && currentProfile && (
        <div className="flex items-center justify-center gap-5 pb-8 relative z-10">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full bg-surface border border-danger/20 flex items-center justify-center text-xl text-danger hover:glow-pink-sm transition-all"
          >
            ✕
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-3xl text-white glow-pink"
            style={{ background: 'linear-gradient(135deg, #ff006e, #8b5cf6)' }}
          >
            💜
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/chat')}
            className="w-14 h-14 rounded-full bg-surface border border-neon-purple/20 flex items-center justify-center text-xl hover:glow-purple transition-all"
          >
            💬
          </motion.button>
        </div>
      )}

      <MatchNotification nickname={newMatch} />
      <DisconnectTimer />
    </div>
  )
}
