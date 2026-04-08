import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

const EMOJI_OPTIONS = ['🎧', '📚', '☕', '🎮', '🐱', '🌙', '🎵', '✨', '🏃', '🍜', '💻', '🌸']

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, setUser, demoMode } = useStore()
  const { signOut } = useAuth()
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState(user?.nickname ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [avatarEmoji, setAvatarEmoji] = useState(user?.avatar_url ?? '🧑')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!user || !nickname.trim()) return
    setSaving(true)

    if (demoMode) {
      setUser({ ...user, nickname: nickname.trim(), bio: bio.trim() || null, avatar_url: avatarEmoji })
      setEditing(false)
      setSaving(false)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ nickname: nickname.trim(), bio: bio.trim() || null, avatar_url: avatarEmoji })
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setUser(data)
      setEditing(false)
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    if (demoMode) {
      setUser(null)
      useStore.getState().setDemoMode(false)
      navigate('/')
      return
    }
    await signOut()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="min-h-dvh pb-24" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-5 flex items-center justify-between">
        <button onClick={() => navigate('/map')} className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
          ←
        </button>
        <h1 className="display text-xl font-bold" style={{ color: 'var(--color-text)' }}>내 프로필</h1>
        <div className="w-8" />
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 card p-6"
      >
        {/* Avatar */}
        <div className="text-center mb-6">
          {editing ? (
            <div>
              <div
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl"
                style={{ background: 'var(--color-accent)', boxShadow: '0 4px 20px rgba(242,201,76,0.3)' }}
              >
                {avatarEmoji}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setAvatarEmoji(emoji)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all"
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
          ) : (
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl"
              style={{ background: 'var(--color-accent)', boxShadow: '0 4px 20px rgba(242,201,76,0.3)' }}
            >
              {user.avatar_url ?? '🧑'}
            </div>
          )}

          {editing ? (
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={12}
              className="input text-center text-xl font-bold"
              placeholder="닉네임"
            />
          ) : (
            <h2 className="display text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {user.nickname}
            </h2>
          )}

          {!editing && (
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              2호선 탑승자
            </p>
          )}
        </div>

        {/* Bio / Commute thought */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ background: 'var(--color-surface)', borderLeft: '3px solid var(--color-accent)' }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            오늘의 출근 생각
          </p>
          {editing ? (
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={40}
              className="input"
              placeholder="오늘 퇴근길에 무슨 생각 했어요?"
            />
          ) : (
            <p className="text-base" style={{ color: 'var(--color-text)' }}>
              {user.bio || '아직 작성하지 않았어요'}
            </p>
          )}
        </div>

        {/* Stats */}
        {!editing && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: '탑승', value: '12회', icon: '🚇' },
              { label: '매칭', value: '3회', icon: '💛' },
              { label: '채팅', value: '27건', icon: '💬' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-3 rounded-xl"
                style={{ background: 'var(--color-surface)' }}
              >
                <span className="text-xl block mb-1">{stat.icon}</span>
                <p className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{stat.value}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        {editing ? (
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(false)}
              className="flex-1 py-3 rounded-xl text-base font-semibold btn-secondary"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={!nickname.trim() || saving}
              className="flex-1 py-3 rounded-xl text-base font-semibold btn-primary disabled:opacity-40"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="w-full py-3 rounded-xl text-base font-semibold btn-primary"
          >
            프로필 수정
          </button>
        )}
      </motion.div>

      {/* Sign out */}
      <div className="mx-5 mt-4">
        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl text-base font-medium"
          style={{ color: 'var(--color-alert)', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)' }}
        >
          {demoMode ? '데모 종료' : '로그아웃'}
        </button>
      </div>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 inset-x-0 max-w-md mx-auto flex justify-around py-3 pb-6 border-t"
        style={{ background: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}
      >
        <NavItem icon="🗺" label="노선" onClick={() => navigate('/map')} />
        <NavItem icon="💬" label="채팅" onClick={() => navigate('/chat')} />
        <NavItem icon="📡" label="근처" onClick={() => navigate('/match')} />
        <NavItem icon="👤" label="프로필" active onClick={() => {}} />
      </nav>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }: { icon: string; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 text-xs font-medium" style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>
      <span className="text-2xl">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
