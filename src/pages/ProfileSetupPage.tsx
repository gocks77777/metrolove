import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'

export function ProfileSetupPage() {
  const navigate = useNavigate()
  const { setUser } = useStore()
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [gender, setGender] = useState<string>('')
  const [age, setAge] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!nickname.trim()) return
    setLoading(true)

    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.id,
        nickname: nickname.trim(),
        bio: bio.trim() || null,
        gender: (gender || null) as 'male' | 'female' | 'other' | null,
        age: age ? parseInt(age) : null,
        avatar_url: (authUser.user_metadata?.avatar_url as string) || null,
      })
      .select()
      .single()

    if (!error && data) {
      setUser(data)
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-dvh flex flex-col px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto"
      >
        <h1 className="text-2xl font-bold text-metro-text mb-2">프로필 설정</h1>
        <p className="text-metro-muted mb-8">다른 승객에게 보여질 정보예요</p>

        <div className="space-y-5">
          {/* Nickname */}
          <div>
            <label className="block text-sm text-metro-muted mb-2">닉네임 *</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="퇴근길 고양이"
              maxLength={12}
              className="w-full bg-metro-card border border-white/5 rounded-xl px-4 py-3 text-metro-text placeholder:text-metro-muted/50 focus:outline-none focus:border-metro-primary/50 transition-colors"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm text-metro-muted mb-2">한줄 소개</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="2호선 매일 타는 사람 🐱"
              maxLength={30}
              className="w-full bg-metro-card border border-white/5 rounded-xl px-4 py-3 text-metro-text placeholder:text-metro-muted/50 focus:outline-none focus:border-metro-primary/50 transition-colors"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-metro-muted mb-2">성별 (선택)</label>
            <div className="flex gap-2">
              {[
                { value: 'male', label: '남성' },
                { value: 'female', label: '여성' },
                { value: 'other', label: '기타' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setGender(gender === opt.value ? '' : opt.value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm transition-all ${
                    gender === opt.value
                      ? 'bg-metro-primary text-white'
                      : 'bg-metro-card text-metro-muted border border-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm text-metro-muted mb-2">나이 (선택)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              min={18}
              max={100}
              className="w-full bg-metro-card border border-white/5 rounded-xl px-4 py-3 text-metro-text placeholder:text-metro-muted/50 focus:outline-none focus:border-metro-primary/50 transition-colors"
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!nickname.trim() || loading}
          className="w-full mt-8 py-3.5 rounded-xl font-medium text-white bg-gradient-to-r from-metro-primary to-metro-secondary disabled:opacity-40 transition-opacity"
        >
          {loading ? '저장 중...' : '탑승 준비 완료!'}
        </motion.button>
      </motion.div>
    </div>
  )
}
