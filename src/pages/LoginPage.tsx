import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'

export function LoginPage() {
  const navigate = useNavigate()
  const { setUser, setDemoMode, setWifiStatus, setWifiInfo, setCurrentSegment } = useStore()

  const handleKakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  const handleDemoMode = () => {
    setUser({
      id: 'demo-user',
      nickname: '체험 승객',
      bio: '데모 모드로 체험 중',
      avatar_url: '🚇',
      gender: null,
      age: null,
      created_at: new Date().toISOString(),
    })
    setDemoMode(true)
    setWifiStatus('connected')
    setWifiInfo('Metro Free WiFi', 2, '강남')
    setCurrentSegment('gangnam-yeoksam')
    navigate('/map')
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-between px-6 py-16 mx-auto"
      style={{ background: 'var(--color-bg)', maxWidth: '600px' }}
    >
      {/* Top spacer */}
      <div />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center w-full max-w-sm"
      >
        {/* Big bold metro icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
          className="mb-10"
        >
          <div
            className="w-28 h-28 rounded-3xl mx-auto flex items-center justify-center text-6xl"
            style={{ background: 'var(--color-accent)', boxShadow: '0 8px 40px rgba(242,201,76,0.3)' }}
          >
            🚇
          </div>
        </motion.div>

        {/* Title — big and bold */}
        <h1
          className="display text-5xl font-bold tracking-tight mb-6"
          style={{ color: 'var(--color-text)' }}
        >
          MetroLove
        </h1>

        {/* Tagline */}
        <p className="text-lg mb-1" style={{ color: 'var(--color-text-secondary)' }}>
          재미없는 퇴근길에
        </p>
        <p
          className="display text-2xl font-bold mb-12"
          style={{ color: 'var(--color-text)' }}
        >
          우연히 찾은 내 운명
        </p>

        {/* CTA buttons */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDemoMode}
          className="w-full py-4 rounded-2xl font-bold text-lg mb-3"
          style={{ background: 'var(--color-accent)', color: '#1A1A1A', boxShadow: '0 4px 20px rgba(242,201,76,0.25)' }}
        >
          🗺 데모로 체험하기
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleKakaoLogin}
          className="w-full py-4 rounded-2xl font-bold text-[#191919] flex items-center justify-center gap-2.5 text-base"
          style={{ backgroundColor: '#FEE500' }}
        >
          <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.45 4.08 3.64 5.18-.16.57-.58 2.07-.66 2.39-.1.39.14.39.3.28.12-.08 1.95-1.32 2.74-1.86.63.09 1.28.14 1.98.14 4.42 0 8-2.79 8-6.21C17 3.79 13.42 1 9 1Z"
              fill="#191919"
            />
          </svg>
          카카오로 시작하기
        </motion.button>
      </motion.div>

      {/* Bottom — metro lines + description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <div className="flex justify-center gap-2 mb-4">
          {['#0052A4','#00A84D','#EF7C1C','#00A5DE','#996CAC','#CD7C2F','#747F00','#E6186C','#BDB092'].map((color) => (
            <div key={color} className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
          ))}
        </div>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          서울 지하철 WiFi 기반 매칭 서비스
        </p>
      </motion.div>
    </div>
  )
}
