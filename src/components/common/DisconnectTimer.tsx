import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'

export function DisconnectTimer() {
  const { wifiStatus, disconnectTimer } = useStore()

  if (wifiStatus !== 'disconnected' || disconnectTimer === null) return null

  const minutes = Math.floor(disconnectTimer / 60)
  const seconds = disconnectTimer % 60
  const isUrgent = disconnectTimer <= 60
  const progress = disconnectTimer / 300

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        {/* Progress bar */}
        <div className="h-1" style={{ background: 'var(--color-bg)' }}>
          <motion.div
            className="h-full transition-colors"
            style={{
              width: `${progress * 100}%`,
              background: isUrgent ? 'var(--color-alert)' : 'var(--color-accent)',
            }}
          />
        </div>

        <div
          className="px-5 py-4 glass border-t"
          style={{ borderColor: isUrgent ? 'rgba(217,79,79,0.3)' : 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div className="flex items-center gap-3">
              <motion.span
                className="text-2xl"
                animate={isUrgent ? { scale: [1, 1.3, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.6 }}
              >
                {isUrgent ? '⚠️' : '📡'}
              </motion.span>
              <div>
                <p className="text-sm font-medium" style={{ color: isUrgent ? 'var(--color-alert)' : 'var(--color-accent)' }}>
                  WiFi 연결이 끊어졌어요
                </p>
                <p className="mono text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {minutes}:{seconds.toString().padStart(2, '0')} 후 채팅이 종료됩니다
                </p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-lg text-sm font-medium btn-primary"
            >
              연장하기
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
