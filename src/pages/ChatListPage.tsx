import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'

export function ChatListPage() {
  const navigate = useNavigate()
  const { chatRooms } = useStore()

  return (
    <div className="min-h-dvh" style={{ background: 'var(--color-bg)' }}>
      <header
        className="flex items-center gap-3 px-5 py-4 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <button
          onClick={() => navigate('/map')}
          className="text-xl"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          ←
        </button>
        <h1 className="display font-bold" style={{ color: 'var(--color-text)' }}>채팅</h1>
        <span className="mono text-xs ml-auto" style={{ color: 'var(--color-text-secondary)' }}>
          {chatRooms.length}개의 대화
        </span>
      </header>

      {chatRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60dvh] text-center px-6">
          <div className="text-5xl mb-4">💬</div>
          <p style={{ color: 'var(--color-text-secondary)' }}>아직 매칭된 대화가 없어요</p>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
            노선도에서 탑승자를 찾아보세요
          </p>
          <button
            onClick={() => navigate('/map')}
            className="mt-6 px-6 py-2.5 rounded-lg text-sm btn-primary"
          >
            노선도 보기
          </button>
        </div>
      ) : (
        <div>
          {chatRooms.map((room, i) => (
            <motion.button
              key={room.match_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/chat/${room.match_id}`)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left border-b"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ background: 'var(--color-surface)' }}
                >
                  {room.partner.avatar_url || room.partner.nickname.charAt(0)}
                </div>
                {room.is_extended && (
                  <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">♾️</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                    {room.partner.nickname}
                  </span>
                  {room.expires_at && !room.is_extended && (
                    <span className="mono text-[10px]" style={{ color: 'var(--color-accent)' }}>
                      {getTimeLeft(room.expires_at)}
                    </span>
                  )}
                </div>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                  {room.last_message || '첫 메시지를 보내보세요!'}
                </p>
              </div>

              {room.unread_count > 0 && (
                <span
                  className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: 'var(--color-accent)' }}
                >
                  {room.unread_count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}

function getTimeLeft(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return '만료됨'
  const min = Math.floor(diff / 60000)
  if (min < 60) return `${min}분 남음`
  const hr = Math.floor(min / 60)
  return `${hr}시간 남음`
}
