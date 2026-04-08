import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'

const EMOJI_OPTIONS = ['🎧', '📚', '☕', '🎮', '🐱', '🌙', '🎵', '✨', '🏃', '🍜', '💻', '🌸']

export function ProfileSetupPage() {
  const navigate = useNavigate()
  const { setUser } = useStore()
  const [nickname, setNickname] = useState('')
  const [commuteThought, setCommuteThought] = useState('')
  const [avatarEmoji, setAvatarEmoji] = useState('🧑')
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
        bio: commuteThought.trim() || null,
        gender: (gender || null) as 'male' | 'female' | 'other' | null,
        age: age ? parseInt(age) : null,
        avatar_url: avatarEmoji,
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
    <div className="min-h-dvh flex flex-col px-6 py-12" style={{ background: 'var(--color-bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto"
      >
        <h1 className="display text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          프로필 설정
        </h1>
        <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          지하철에서 보여질 당신의 모습이에요
        </p>

        <div className="space-y-6">
          {/* Avatar Emoji */}
          <div>
            <label className="label">아바타</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setAvatarEmoji(emoji)}
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-xl transition-all"
                  style={{
                    background: avatarEmoji === emoji ? 'var(--color-accent)' : 'var(--color-surface)',
                    border: `2px solid ${avatarEmoji === emoji ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Nickname */}
          <div>
            <label className="label">닉네임 *</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="지하철에서 불릴 이름"
              maxLength={12}
              className="input"
            />
          </div>

          {/* Commute Thought */}
          <div>
            <label className="label">오늘의 출근 생각</label>
            <input
              type="text"
              value={commuteThought}
              onChange={(e) => setCommuteThought(e.target.value)}
              placeholder="오늘 퇴근길에 무슨 생각 했어요?"
              maxLength={40}
              className="input"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="label">성별 (선택)</label>
            <div className="flex gap-2">
              {[
                { value: 'male', label: '남성' },
                { value: 'female', label: '여성' },
                { value: 'other', label: '기타' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setGender(gender === opt.value ? '' : opt.value)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: gender === opt.value ? 'var(--color-accent)' : 'var(--color-surface)',
                    color: gender === opt.value ? '#1A1A1A' : 'var(--color-text-secondary)',
                    border: `1px solid ${gender === opt.value ? 'var(--color-accent)' : 'var(--color-border-strong)'}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="label">나이 (선택)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              min={18}
              max={100}
              className="input"
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!nickname.trim() || loading}
          className="w-full mt-8 py-3.5 rounded-lg font-semibold text-sm btn-primary disabled:opacity-40 transition-opacity"
        >
          {loading ? '저장 중...' : '🚇 탑승 준비 완료!'}
        </motion.button>
      </motion.div>
    </div>
  )
}
