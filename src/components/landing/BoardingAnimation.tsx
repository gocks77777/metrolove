import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Props {
  onComplete: () => void
}

export function BoardingAnimation({ onComplete }: Props) {
  const [phase, setPhase] = useState<'enter' | 'scan' | 'ready'>('enter')

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('scan'), 800),
      setTimeout(() => setPhase('ready'), 2000),
      setTimeout(() => onComplete(), 3200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div className="min-h-dvh flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,0,110,0.15) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />

      <AnimatePresence mode="wait">
        {phase === 'enter' && (
          <motion.div
            key="enter"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center z-10"
          >
            <div className="text-8xl mb-4">🚇</div>
            <p className="text-text-secondary">연결 중...</p>
          </motion.div>
        )}

        {phase === 'scan' && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="text-center z-10"
          >
            <motion.div
              className="w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center glow-pink"
              style={{ background: 'linear-gradient(135deg, #ff006e, #8b5cf6)' }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255,0,110,0.4)',
                  '0 0 60px rgba(255,0,110,0.6)',
                  '0 0 20px rgba(255,0,110,0.4)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span className="text-5xl">📡</span>
            </motion.div>
            <p className="text-text-primary text-lg font-medium">WiFi 감지됨!</p>
            <p className="text-text-secondary text-sm mt-1">2호선 탑승 확인</p>
          </motion.div>
        )}

        {phase === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-center z-10"
          >
            <motion.div
              className="text-8xl mb-6"
              animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              ⚡
            </motion.div>
            <motion.h2
              className="text-3xl font-bold text-gradient mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              탑승 완료!
            </motion.h2>
            <motion.p
              className="text-text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              주변 승객을 찾고 있어요
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
