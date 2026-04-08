export type { Database, Profile, WifiSession, Match, Message, Swipe } from './database'

export type WifiStatus = 'scanning' | 'connected' | 'disconnected'

export type MetroLine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface ActiveUser {
  id: string
  nickname: string
  avatar_url: string | null
  line: MetroLine | null
  station: string | null
  online_at: string
}

export interface ChatRoom {
  match_id: string
  partner: import('./database').Profile
  last_message: string | null
  unread_count: number
  expires_at: string | null
  is_extended: boolean
}
