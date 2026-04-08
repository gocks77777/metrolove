import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'

export function ChatListPage() {
  const navigate = useNavigate()
  const { chatRooms } = useStore()

  return (
    <div className="min-h-dvh bg-metro-dark">
      <header className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <button
          onClick={() => navigate('/match')}
          className="text-metro-muted hover:text-metro-text transition-colors"
        >
          ←
        </button>
        <h1 className="font-medium text-metro-text">채팅</h1>
        <span className="text-xs text-metro-muted ml-auto">
          {chatRooms.length}개의 대화
        </span>
      </header>

      {chatRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60dvh] text-center px-6">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-metro-muted">아직 매칭된 대화가 없어요</p>
          <p className="text-metro-muted/60 text-sm mt-2">
            카드를 스와이프해서 매칭을 시작해보세요
          </p>
          <button
            onClick={() => navigate('/match')}
            className="mt-6 px-6 py-2.5 bg-metro-primary/20 border border-metro-primary/30 rounded-full text-metro-primary text-sm"
          >
            매칭하러 가기
          </button>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {chatRooms.map((room, i) => (
            <motion.button
              key={room.match_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/chat/${room.match_id}`)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-colors text-left"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-metro-primary to-metro-secondary flex items-center justify-center text-lg">
                  {room.partner.avatar_url ? (
                    <img
                      src={room.partner.avatar_url}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    room.partner.nickname.charAt(0)
                  )}
                </div>
                {room.is_extended && (
                  <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">♾️</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-metro-text text-sm">
                    {room.partner.nickname}
                  </span>
                  {room.expires_at && !room.is_extended && (
                    <span className="text-[10px] text-metro-warning">
                      {getTimeLeft(room.expires_at)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-metro-muted truncate mt-0.5">
                  {room.last_message || '첫 메시지를 보내보세요!'}
                </p>
              </div>

              {room.unread_count > 0 && (
                <span className="w-5 h-5 bg-metro-secondary rounded-full text-[10px] flex items-center justify-center text-white flex-shrink-0">
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
