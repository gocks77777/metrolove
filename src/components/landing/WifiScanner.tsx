import { motion } from 'framer-motion'

export function WifiScanner() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-24 h-24">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-neon-pink/20 rounded-full"
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 1.8 + i * 0.4, opacity: 0 }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              delay: i * 0.6,
              ease: 'easeOut',
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-4 h-4 rounded-full glow-pink"
            style={{ background: 'linear-gradient(135deg, #ff006e, #8b5cf6)' }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
      </div>

      <p className="text-text-secondary text-sm">
        지하철 WiFi를 찾고 있어요...
      </p>
    </div>
  )
}
