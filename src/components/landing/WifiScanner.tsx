import { motion } from 'framer-motion'

export function WifiScanner() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-24 h-24">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid rgba(242,201,76,0.2)' }}
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
            className="w-4 h-4 rounded-full"
            style={{ background: 'var(--color-accent)', boxShadow: '0 0 12px rgba(242,201,76,0.4)' }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
      </div>

      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        지하철 WiFi를 찾고 있어요...
      </p>
    </div>
  )
}
