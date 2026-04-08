import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import { useMatching } from '@/hooks/useMatching'
import { DisconnectTimer } from '@/components/common/DisconnectTimer'

export function ChatPage() {
  const navigate = useNavigate()
  const { matchId } = useParams<{ matchId: string }>()
  const { user, chatRooms } = useStore()
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    sendTyping()
  }

  return (
    <div className="min-h-dvh bg-metro-dark flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-metro-surface/80 backdrop-blur-lg sticky top-0 z-10">
        <button
          onClick={() => navigate('/chat')}
          className="text-metro-muted hover:text-metro-text transition-colors"
        >
          ←
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-metro-primary to-metro-secondary flex items-center justify-center text-lg">
          {room?.partner.avatar_url ? (
            <img
              src={room.partner.avatar_url}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            room?.partner.nickname.charAt(0) || '?'
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-metro-text text-sm">
            {room?.partner.nickname || '...'}
          </p>
          <p className="text-xs text-metro-success flex items-center gap-1">
            {isTyping ? (
              <span className="text-metro-accent">입력 중...</span>
            ) : (
              <>
                <span className="w-1.5 h-1.5 bg-metro-success rounded-full" />
                탑승 중
              </>
            )}
          </p>
        </div>
        {matchId && room && !room.is_extended && (
          <button
            onClick={() => extendMatch(matchId)}
            className="px-3 py-1.5 bg-metro-primary/20 border border-metro-primary/30 rounded-full text-xs text-metro-primary"
          >
            연장하기
          </button>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
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
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-metro-primary text-white rounded-br-sm'
                    : 'bg-metro-card text-metro-text rounded-bl-sm'
                }`}
              >
                <p>{msg.content}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    isMe ? 'text-white/40' : 'text-metro-muted/60'
                  }`}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="px-4 py-3 bg-metro-card rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-metro-muted rounded-full"
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
      <div className="px-4 py-3 bg-metro-surface/80 backdrop-blur-lg border-t border-white/5">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-metro-card border border-white/5 rounded-full px-4 py-2.5 text-sm text-metro-text placeholder:text-metro-muted focus:outline-none focus:border-metro-primary/50 transition-colors"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-metro-primary flex items-center justify-center text-white disabled:opacity-30 transition-opacity"
          >
            ↑
          </motion.button>
        </div>
      </div>

      <DisconnectTimer />
    </div>
  )
}
