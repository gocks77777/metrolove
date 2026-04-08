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
    // Set a fake demo user so the app treats us as authenticated
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
      className="min-h-dvh flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--color-bg)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center w-full max-w-sm"
      >
        {/* Hero section with line accent */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <div
            className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-4xl"
            style={{ background: 'var(--color-accent)', boxShadow: '0 0 30px rgba(242,201,76,0.25)' }}
          >
            🚇
          </div>
        </motion.div>

        <h1
          className="display text-[36px] font-bold mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          MetroLove
        </h1>

        <p className="mono text-[11px] tracking-wider mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          SEOUL UNDERGROUND MATCHING
        </p>

        {/* Tagline with line accent */}
        <div className="mb-10">
          <p className="text-base mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            재미없는 퇴근길에
          </p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
            우연히 찾은 내 운명
          </p>
          <div
            className="w-12 h-1 mx-auto mt-4 rounded-full"
            style={{ background: 'var(--color-accent)' }}
          />
        </div>

        {/* Demo button — primary CTA for portfolio visitors */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDemoMode}
          className="w-full py-4 rounded-lg font-semibold text-[15px] mb-3"
          style={{ background: 'var(--color-accent)', color: '#1A1A1A' }}
        >
          🗺 데모로 체험하기
        </motion.button>

        {/* Kakao Login */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleKakaoLogin}
          className="w-full py-4 rounded-lg font-semibold text-[#191919] flex items-center justify-center gap-2.5 text-[15px]"
          style={{ backgroundColor: '#FEE500' }}
        >
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.45 4.08 3.64 5.18-.16.57-.58 2.07-.66 2.39-.1.39.14.39.3.28.12-.08 1.95-1.32 2.74-1.86.63.09 1.28.14 1.98.14 4.42 0 8-2.79 8-6.21C17 3.79 13.42 1 9 1Z"
              fill="#191919"
            />
          </svg>
          카카오로 시작하기
        </motion.button>

        {/* Metro line colors as decoration */}
        <div className="flex justify-center gap-1.5 mt-10">
          {['#0052A4','#00A84D','#EF7C1C','#00A5DE','#996CAC','#CD7C2F','#747F00','#E6186C','#BDB092'].map((color) => (
            <div key={color} className="w-2 h-2 rounded-full" style={{ background: color, opacity: 0.6 }} />
          ))}
        </div>

        <p className="mt-4 text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
          서울 지하철 WiFi 기반 매칭 서비스
        </p>
      </motion.div>
    </div>
  )
}
