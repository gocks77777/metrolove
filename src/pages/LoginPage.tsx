import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export function LoginPage() {
  const handleKakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: window.location.origin,
      },
    })
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
        <motion.div
          className="text-6xl mb-8"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          🚇
        </motion.div>

        <h1
          className="display text-[36px] font-bold mb-3"
          style={{ color: 'var(--color-text)' }}
        >
          MetroLove
        </h1>

        <p className="text-base mb-1" style={{ color: 'var(--color-text-secondary)' }}>
          재미없는 퇴근길에
        </p>
        <p className="text-lg font-semibold mb-14" style={{ color: 'var(--color-text)' }}>
          우연히 찾은 내 운명
        </p>

        {/* Kakao Login */}
        <motion.button
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

        <p className="mt-8 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          로그인하면 이용약관에 동의하게 됩니다
        </p>
      </motion.div>
    </div>
  )
}
