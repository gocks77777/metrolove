import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import type { Profile, Match } from '@/types'

interface Stats {
  totalUsers: number
  totalMatches: number
  totalMessages: number
  activeToday: number
}

export function AdminPage() {
  const navigate = useNavigate()
  const { activeUsers } = useStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalMatches: 0, totalMessages: 0, activeToday: 0 })
  const [users, setUsers] = useState<Profile[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [tab, setTab] = useState<'realtime' | 'users' | 'matches'>('realtime')

  const loadData = useCallback(async () => {
    const { data: profileData, count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    setUsers(profileData || [])

    const { count: matchCount } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })

    const { data: matchData } = await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    setMatches(matchData || [])

    const { count: msgCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: activeCount } = await supabase
      .from('wifi_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('connected_at', today.toISOString())

    setStats({
      totalUsers: userCount || 0,
      totalMatches: matchCount || 0,
      totalMessages: msgCount || 0,
      activeToday: activeCount || 0,
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-4xl animate-bounce">⚙️</div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div>
          <h1 className="display font-bold" style={{ color: 'var(--color-text)' }}>Admin</h1>
          <p className="mono text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
            실시간 대시보드
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadData} className="px-3 py-1.5 rounded-lg text-xs btn-primary">
            새로고침
          </button>
          <button onClick={() => navigate('/map')} className="px-3 py-1.5 rounded-lg text-xs btn-secondary">
            앱으로
          </button>
        </div>
      </header>

      {/* Real-time indicator */}
      <div
        className="mx-5 mt-4 rounded-lg px-4 py-3 flex items-center gap-3"
        style={{ background: 'var(--color-surface)' }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full animate-wifi-dot"
          style={{ background: 'var(--color-success)' }}
        />
        <span className="mono text-sm font-medium" style={{ color: 'var(--color-success)' }}>
          {activeUsers.length}명 실시간 탑승 중
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 p-5">
        {[
          { label: '총 유저', value: stats.totalUsers, icon: '👥', color: 'var(--color-connection)' },
          { label: '총 매칭', value: stats.totalMatches, icon: '💛', color: 'var(--color-accent)' },
          { label: '총 메시지', value: stats.totalMessages, icon: '💬', color: 'var(--color-success)' },
          { label: '오늘 접속', value: stats.activeToday, icon: '🚇', color: 'var(--color-text)' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                {stat.label}
              </span>
              <span>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 mb-4">
        {(['realtime', 'users', 'matches'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: tab === t ? 'var(--color-accent)' : 'var(--color-surface)',
              color: tab === t ? '#1A1A1A' : 'var(--color-text-secondary)',
            }}
          >
            {t === 'realtime' ? '실시간' : t === 'users' ? '유저' : '매칭'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 pb-20">
        {tab === 'realtime' && (
          <div className="space-y-3">
            <h3 className="mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
              현재 탑승자
            </h3>
            {activeUsers.length === 0 ? (
              <div className="card p-6 text-center" style={{ color: 'var(--color-text-secondary)' }}>
                현재 탑승자 없음
              </div>
            ) : (
              activeUsers.map((u) => (
                <div key={u.id} className="card p-3 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ background: 'var(--color-surface)' }}
                  >
                    {u.avatar_url || '🧑'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{u.nickname}</p>
                    <p className="mono text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
                      {u.station}역 // {u.line}호선
                    </p>
                  </div>
                  <span
                    className="w-2 h-2 rounded-full animate-wifi-dot"
                    style={{ background: 'var(--color-success)' }}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'users' && (
          <div className="space-y-2">
            <p className="mono text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>총 {users.length}명</p>
            {users.map((u) => (
              <div key={u.id} className="card p-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ background: 'var(--color-surface)' }}
                  >
                    {u.avatar_url || u.nickname.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{u.nickname}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {u.bio || '-'} · {u.gender || '-'} · {u.age || '-'}세
                    </p>
                  </div>
                </div>
                <p className="mono text-[9px] mt-2 truncate" style={{ color: 'var(--color-text-tertiary)' }}>{u.id}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'matches' && (
          <div className="space-y-2">
            <p className="mono text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>최근 20건</p>
            {matches.map((m) => (
              <div key={m.id} className="card p-3">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      background: m.status === 'matched'
                        ? 'rgba(60,179,113,0.1)' : m.status === 'extended'
                        ? 'rgba(74,127,181,0.1)' : 'rgba(217,79,79,0.1)',
                      color: m.status === 'matched'
                        ? 'var(--color-success)' : m.status === 'extended'
                        ? 'var(--color-connection)' : 'var(--color-alert)',
                    }}
                  >
                    {m.status}
                  </span>
                  <span className="mono text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
                    {new Date(m.created_at).toLocaleString('ko-KR')}
                  </span>
                </div>
                <p className="mono text-[9px] mt-1.5 truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                  {m.user_a} ↔ {m.user_b}
                </p>
              </div>
            ))}
            {matches.length === 0 && (
              <p className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>매칭 기록 없음</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
