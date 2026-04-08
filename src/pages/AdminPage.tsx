import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Profile, Match, Message } from '@/types'

const ADMIN_IDS: string[] = [
  '3e313f0f-5fe6-4008-86eb-75c8ec7bf0db',
]

interface Stats {
  totalUsers: number
  totalMatches: number
  totalMessages: number
  activeToday: number
}

export function AdminPage() {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalMatches: 0, totalMessages: 0, activeToday: 0 })
  const [users, setUsers] = useState<Profile[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [recentMessages, setRecentMessages] = useState<(Message & { sender_nickname?: string })[]>([])
  const [tab, setTab] = useState<'overview' | 'users' | 'matches' | 'messages'>('overview')

  const checkAdmin = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/')
      return
    }
    // Allow access if ADMIN_IDS is empty (first setup) or user is in list
    if (ADMIN_IDS.length === 0 || ADMIN_IDS.includes(user.id)) {
      setIsAdmin(true)
    } else {
      navigate('/')
      return
    }
    setLoading(false)
  }, [navigate])

  const loadData = useCallback(async () => {
    // Users
    const { data: profileData, count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
    setUsers(profileData || [])

    // Matches
    const { data: matchData, count: matchCount } = await supabase
      .from('matches')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(50)
    setMatches(matchData || [])

    // Messages
    const { data: msgData, count: msgCount } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (msgData) {
      const enriched = await Promise.all(
        msgData.map(async (msg) => {
          const { data: sender } = await supabase
            .from('profiles')
            .select('nickname')
            .eq('id', msg.sender_id)
            .single()
          return { ...msg, sender_nickname: sender?.nickname }
        })
      )
      setRecentMessages(enriched)
    }

    // Active today
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
  }, [])

  useEffect(() => {
    checkAdmin()
  }, [checkAdmin])

  useEffect(() => {
    if (isAdmin) loadData()
  }, [isAdmin, loadData])

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-4xl animate-bounce">⚙️</div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-metro-dark">
      {/* Header */}
      <header className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-metro-text">MetroLove Admin</h1>
          <p className="text-xs text-metro-muted">관리자 대시보드</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="px-3 py-1.5 bg-metro-primary/20 border border-metro-primary/30 rounded-lg text-xs text-metro-primary"
          >
            새로고침
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 bg-metro-card border border-white/5 rounded-lg text-xs text-metro-muted"
          >
            앱으로
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 p-5">
        {[
          { label: '총 유저', value: stats.totalUsers, icon: '👥' },
          { label: '총 매칭', value: stats.totalMatches, icon: '💜' },
          { label: '총 메시지', value: stats.totalMessages, icon: '💬' },
          { label: '오늘 접속', value: stats.activeToday, icon: '🚇' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-metro-card border border-white/5 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-metro-muted text-xs">{stat.label}</span>
              <span>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-metro-text">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 mb-4">
        {(['overview', 'users', 'matches', 'messages'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              tab === t
                ? 'bg-metro-primary text-white'
                : 'bg-metro-card text-metro-muted'
            }`}
          >
            {t === 'overview' ? '개요' : t === 'users' ? '유저' : t === 'matches' ? '매칭' : '메시지'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 pb-20">
        {tab === 'overview' && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-metro-text">최근 가입</h3>
            {users.slice(0, 5).map((u) => (
              <div key={u.id} className="bg-metro-card border border-white/5 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-metro-primary to-metro-secondary flex items-center justify-center text-sm">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    u.nickname.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-metro-text font-medium">{u.nickname}</p>
                  <p className="text-xs text-metro-muted truncate">{u.bio || '소개 없음'}</p>
                </div>
                <span className="text-[10px] text-metro-muted">
                  {new Date(u.created_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && (
          <div className="space-y-2">
            <p className="text-xs text-metro-muted mb-3">총 {users.length}명</p>
            {users.map((u) => (
              <div key={u.id} className="bg-metro-card border border-white/5 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-metro-primary to-metro-secondary flex items-center justify-center text-sm">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      u.nickname.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-metro-text font-medium">{u.nickname}</p>
                    <p className="text-xs text-metro-muted">{u.bio || '-'} · {u.gender || '-'} · {u.age || '-'}세</p>
                  </div>
                </div>
                <p className="text-[10px] text-metro-muted/50 mt-2 font-mono truncate">{u.id}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'matches' && (
          <div className="space-y-2">
            <p className="text-xs text-metro-muted mb-3">총 {matches.length}건</p>
            {matches.map((m) => (
              <div key={m.id} className="bg-metro-card border border-white/5 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      m.status === 'matched' ? 'bg-metro-success/20 text-metro-success'
                        : m.status === 'extended' ? 'bg-metro-primary/20 text-metro-primary'
                        : 'bg-metro-danger/20 text-metro-danger'
                    }`}>
                      {m.status}
                    </span>
                    <span className="text-xs text-metro-muted">
                      {new Date(m.created_at).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  {m.expires_at && (
                    <span className="text-[10px] text-metro-warning">
                      만료: {new Date(m.expires_at).toLocaleTimeString('ko-KR')}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-metro-muted/50 mt-1.5 font-mono truncate">
                  {m.user_a} ↔ {m.user_b}
                </p>
              </div>
            ))}
            {matches.length === 0 && <p className="text-metro-muted text-sm text-center py-8">매칭 기록 없음</p>}
          </div>
        )}

        {tab === 'messages' && (
          <div className="space-y-2">
            <p className="text-xs text-metro-muted mb-3">최근 50건</p>
            {recentMessages.map((msg) => (
              <div key={msg.id} className="bg-metro-card border border-white/5 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-metro-primary font-medium">
                    {msg.sender_nickname || '알 수 없음'}
                  </span>
                  <span className="text-[10px] text-metro-muted">
                    {new Date(msg.created_at).toLocaleString('ko-KR')}
                  </span>
                </div>
                <p className="text-sm text-metro-text">{msg.content}</p>
                <p className="text-[10px] text-metro-muted/50 mt-1 font-mono truncate">match: {msg.match_id}</p>
              </div>
            ))}
            {recentMessages.length === 0 && <p className="text-metro-muted text-sm text-center py-8">메시지 없음</p>}
          </div>
        )}
      </div>
    </div>
  )
}
