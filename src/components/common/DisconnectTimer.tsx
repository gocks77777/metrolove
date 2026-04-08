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
        <div className="h-0.5 bg-bg">
          <motion.div
            className={`h-full ${isUrgent ? 'bg-danger' : 'bg-warning'}`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className={`px-5 py-4 glass border-t border-white/5 ${isUrgent ? 'border-t-danger/30' : ''}`}>
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
                <p className={`text-sm font-medium ${isUrgent ? 'text-danger' : 'text-warning'}`}>
                  WiFi 연결이 끊어졌어요
                </p>
                <p className="text-xs text-text-muted">
                  {minutes}:{seconds.toString().padStart(2, '0')} 후 채팅이 종료됩니다
                </p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 btn-gradient rounded-full text-sm font-medium text-white"
            >
              연장하기
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
