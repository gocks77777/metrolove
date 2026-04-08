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
    <div className="min-h-dvh flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      {/* Ambient glow */}
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(242,201,76,0.15) 0%, transparent 70%)' }}
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
            <div className="text-7xl mb-4">🚇</div>
            <p style={{ color: 'var(--color-text-secondary)' }}>연결 중...</p>
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
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-accent)' }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(242,201,76,0.3)',
                  '0 0 50px rgba(242,201,76,0.5)',
                  '0 0 20px rgba(242,201,76,0.3)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span className="text-4xl">📡</span>
            </motion.div>
            <p className="text-lg font-medium" style={{ color: 'var(--color-text)' }}>WiFi 감지됨!</p>
            <p className="mono text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>2호선 탑승 확인</p>
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
              className="text-7xl mb-6"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              ⚡
            </motion.div>
            <motion.h2
              className="display text-3xl font-bold mb-3"
              style={{ color: 'var(--color-accent)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              탑승 완료!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ color: 'var(--color-text-secondary)' }}
            >
              주변 승객을 찾고 있어요
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
