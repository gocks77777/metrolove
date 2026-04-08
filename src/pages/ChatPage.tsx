import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import { useMatching } from '@/hooks/useMatching'

export function ChatPage() {
  const navigate = useNavigate()
  const { matchId } = useParams<{ matchId: string }>()
  const { user, chatRooms, disconnectTimer } = useStore()
  const { messages, sendMessage, isTyping, sendTyping } = useRealtimeChat(matchId ?? null)
  const { extendMatch } = useMatching()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const room = chatRooms.find((r) => r.match_id === matchId)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    await sendMessage(input)
    setInput('')
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

  const timerColor = disconnectTimer && disconnectTimer < 60
    ? 'var(--color-alert)'
    : 'var(--color-accent)'

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header
        className="flex items-center gap-3 px-5 py-3 border-b sticky top-0 z-10"
        style={{
          background: 'var(--color-surface-raised)',
          borderColor: 'var(--color-border)',
        }}
      >
        <button
          onClick={() => navigate('/chat')}
          className="text-xl"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="뒤로가기"
        >
          ←
        </button>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
          style={{ background: 'var(--color-surface)' }}
        >
          {room?.partner.avatar_url || '🧑'}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
            {room?.partner.nickname || '...'}
          </p>
          <p className="mono text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
            {isTyping ? '입력 중...' : '2호선 // 역삼역'}
          </p>
        </div>

        {/* Timer */}
        {disconnectTimer !== null && (
          <div className="text-right">
            <p className="mono text-lg font-semibold" style={{ color: timerColor }}>
              {formatTimer(disconnectTimer)}
            </p>
            <p
              className="mono text-[9px] uppercase tracking-wider"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              하차까지
            </p>
          </div>
        )}
      </header>

      {/* Extend button */}
      {matchId && room && !room.is_extended && disconnectTimer !== null && disconnectTimer < 120 && (
        <div className="px-4 py-2">
          <button
            onClick={() => extendMatch(matchId)}
            className="w-full py-2 rounded-lg text-sm font-medium btn-primary"
          >
            연장하기
          </button>
        </div>
      )}

      {/* WiFi warning */}
      {disconnectTimer !== null && disconnectTimer < 60 && (
        <div className="mx-4 mt-2 alert-warning rounded-lg px-4 py-2.5 text-[13px] flex items-center gap-2">
          ⚠️ WiFi 신호 약해지는 중... 하차 {formatTimer(disconnectTimer)} 전
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
        {messages.map((msg, i) => {
          const isMe = msg.sender_id === user?.id
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i < 20 ? i * 0.03 : 0 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed"
                style={{
                  background: isMe ? 'var(--color-accent)' : 'var(--color-surface)',
                  color: isMe ? '#1A1A1A' : 'var(--color-text)',
                  borderRadius: isMe ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  border: isMe ? 'none' : `1px solid var(--color-border)`,
                }}
              >
                <p>{msg.content}</p>
                <p
                  className="mono text-[10px] mt-1"
                  style={{ opacity: 0.5 }}
                >
                  {new Date(msg.created_at).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          )
        })}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div
              className="px-4 py-3 rounded-xl"
              style={{ background: 'var(--color-surface)', border: `1px solid var(--color-border)` }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--color-text-secondary)' }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 border-t"
        style={{
          background: 'var(--color-surface-raised)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); sendTyping() }}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: `1px solid var(--color-border-strong)`,
            }}
            aria-label="메시지 입력"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold disabled:opacity-30 transition-opacity"
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
