import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  nickname: string | null
}

export function MatchNotification({ nickname }: Props) {
  return (
    <AnimatePresence>
      {nickname && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Glow background */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(circle at center, rgba(255,0,110,0.2) 0%, rgba(10,10,20,0.95) 70%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          <div className="text-center relative z-10">
            <motion.div
              className="text-8xl mb-8"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              💜
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-gradient mb-3"
            >
              매칭 성공!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-text-secondary text-lg"
            >
              <span className="text-text-primary font-semibold">{nickname}</span>
              님과 연결되었어요
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-text-muted text-sm animate-pulse"
            >
              잠시 후 채팅으로 이동합니다...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
