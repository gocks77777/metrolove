import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWifiDetection } from '@/hooks/useWifiDetection'
import { usePresence } from '@/hooks/usePresence'
import { BoardingAnimation } from '@/components/landing/BoardingAnimation'
import { useAuth } from '@/hooks/useAuth'
import { useStore } from '@/store/useStore'

export function LandingPage() {
  const navigate = useNavigate()
  const { wifiStatus, simulateConnect } = useWifiDetection()
  const { joinPresence } = usePresence()
  const { signOut } = useAuth()
  const { user } = useStore()

  const handleBoarded = () => {
    joinPresence()
    navigate('/map')
  }

  if (wifiStatus === 'connected') {
    return <BoardingAnimation onComplete={handleBoarded} />
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 relative overflow-hidden mx-auto" style={{ background: 'var(--color-bg)', maxWidth: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center relative z-10"
      >
        {/* Metro icon */}
        <motion.div
          className="text-6xl mb-8"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          🚇
        </motion.div>

        {/* Title */}
        <h1 className="display text-[36px] font-bold mb-3" style={{ color: 'var(--color-text)' }}>
          MetroLove
        </h1>

        <p className="text-base mb-1" style={{ color: 'var(--color-text-secondary)' }}>
          재미없는 퇴근길에
        </p>
        <p className="text-lg font-semibold mb-10" style={{ color: 'var(--color-text)' }}>
          우연히 찾은 내 운명
        </p>

        {/* WiFi scanning indicator */}
        <div
          className="flex items-center justify-center gap-2 mb-8 mono text-[12px]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--color-accent)' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          WiFi 신호 탐색 중...
        </div>

        {/* Board button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={simulateConnect}
          className="btn-primary px-8 py-3.5 rounded-lg text-sm font-semibold"
          aria-label="탑승하기"
        >
          🚇 탑승하기
        </motion.button>

        {/* User info */}
        {user && (
          <p className="mt-4 mono text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
            {user.nickname}님, 안녕하세요
          </p>
        )}

        {/* Sign out */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={signOut}
          className="btn-ghost mt-3 text-xs"
        >
          로그아웃
        </motion.button>
      </motion.div>
    </div>
  )
}
