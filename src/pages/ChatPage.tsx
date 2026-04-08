import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import type { Message } from '@/types'

const DEMO_REPLIES = [
  '안녕하세요! 반가워요 😊',
  '오 같은 노선이네요!',
  '퇴근길 어디서 내리세요?',
  '저도 비슷한 생각했어요 ㅋㅋ',
  '역삼역 근처 좋은 카페 알아요!',
  '다음에 같이 커피 한잔 어때요?',
]

export function ChatPage() {
  const navigate = useNavigate()
  const { matchId } = useParams<{ matchId: string }>()
  const { user, chatRooms, disconnectTimer, demoMode } = useStore()
  const { messages: realtimeMessages, sendMessage: realtimeSend, isTyping, sendTyping } = useRealtimeChat(demoMode ? null : (matchId ?? null))
  const [input, setInput] = useState('')
  const [demoMessages, setDemoMessages] = useState<Message[]>([])
  const [demoTyping, setDemoTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const replyIndexRef = useRef(0)

  const room = chatRooms.find((r) => r.match_id === matchId)
  const messages = demoMode ? demoMessages : realtimeMessages
  const typing = demoMode ? demoTyping : isTyping

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Demo: timer
  const [demoTimer, setDemoTimer] = useState(300)
  useEffect(() => {
    if (!demoMode) return
    const interval = setInterval(() => {
      setDemoTimer((t) => {
        if (t <= 0) { clearInterval(interval); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [demoMode])

  const sendDemoReply = useCallback(() => {
    setDemoTyping(true)
    const delay = 1000 + Math.random() * 2000
    setTimeout(() => {
      setDemoTyping(false)
      const reply = DEMO_REPLIES[replyIndexRef.current % DEMO_REPLIES.length]
      replyIndexRef.current++
      setDemoMessages((prev) => [
        ...prev,
        {
          id: `demo-reply-${Date.now()}`,
          match_id: matchId ?? '',
          sender_id: room?.partner.id ?? 'partner',
          content: reply,
          created_at: new Date().toISOString(),
          read_at: null,
        },
      ])
    }, delay)
  }, [matchId, room?.partner.id])

  const handleSend = async () => {
    if (!input.trim()) return

    if (demoMode) {
      setDemoMessages((prev) => [
        ...prev,
        {
          id: `demo-msg-${Date.now()}`,
          match_id: matchId ?? '',
          sender_id: user?.id ?? 'me',
          content: input.trim(),
          created_at: new Date().toISOString(),
          read_at: null,
        },
      ])
      setInput('')
      sendDemoReply()
    } else {
      await realtimeSend(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const timer = demoMode ? demoTimer : disconnectTimer
  const timerColor = timer !== null && timer < 60 ? 'var(--color-alert)' : 'var(--color-accent)'

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* Header */}
      <header
        className="flex items-center gap-3 px-5 py-3 border-b sticky top-0 z-10"
        style={{ background: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}
      >
        <button onClick={() => navigate('/chat')} className="text-xl" style={{ color: 'var(--color-text-secondary)' }} aria-label="뒤로가기">
          ←
        </button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: 'var(--color-surface)' }}>
          {room?.partner.avatar_url || '🧑'}
        </div>
        <div className="flex-1">
          <p className="font-bold text-base" style={{ color: 'var(--color-text)' }}>
            {room?.partner.nickname || '...'}
          </p>
          <p className="text-xs" style={{ color: typing ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>
            {typing ? '입력 중...' : '2호선 탑승 중'}
          </p>
        </div>

        {timer !== null && (
          <div className="text-right">
            <p className="text-xl font-bold" style={{ color: timerColor, fontVariantNumeric: 'tabular-nums' }}>
              {formatTimer(timer)}
            </p>
            <p className="text-[10px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              하차까지
            </p>
          </div>
        )}
      </header>

      {/* Timer warning */}
      {timer !== null && timer < 60 && (
        <div className="mx-4 mt-2 alert-warning rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          ⚠️ WiFi 신호 약해지는 중... 하차 {formatTimer(timer)} 전
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--color-text-tertiary)' }}>
            <p className="text-4xl mb-3">💬</p>
            <p className="text-base">첫 메시지를 보내보세요!</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.sender_id === user?.id
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i < 20 ? i * 0.03 : 0 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[75%] px-4 py-3"
                style={{
                  background: isMe ? 'var(--color-accent)' : 'var(--color-surface)',
                  color: isMe ? '#1A1A1A' : 'var(--color-text)',
                  borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: isMe ? 'none' : '1px solid var(--color-border)',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                }}
              >
                <p style={{ fontSize: '15px', lineHeight: '1.5' }}>{msg.content}</p>
                <p style={{ fontSize: '11px', marginTop: '4px', opacity: 0.5 }}>
                  {new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          )
        })}

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: 'var(--color-text-secondary)' }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t" style={{ background: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); if (!demoMode) sendTyping() }}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-2.5 rounded-2xl outline-none"
            style={{ background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border-strong)', fontSize: '15px' }}
            aria-label="메시지 입력"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold disabled:opacity-30 transition-opacity"
            style={{ background: 'var(--color-accent)', color: '#1A1A1A' }}
            aria-label="보내기"
          >
            ↑
          </motion.button>
        </div>
      </div>
    </div>
  )
}
