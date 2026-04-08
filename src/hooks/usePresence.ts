import { useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { ActiveUser } from '@/types'

export function usePresence() {
  const { user, currentLine, currentStation, currentSegment, setActiveUsers } = useStore()
  const channelRef = useRef<RealtimeChannel | null>(null)

  const joinPresence = useCallback(() => {
    if (!user || !currentLine || channelRef.current) return

    const channelName = `metro-line-${currentLine}`
    const channel = supabase.channel(channelName, {
      config: { presence: { key: user.id } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<ActiveUser & { segment?: string }>()
        const users: ActiveUser[] = []
        for (const [, presences] of Object.entries(state)) {
          for (const p of presences) {
            if (p.id !== user.id) {
              users.push(p)
            }
          }
        }
        setActiveUsers(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: user.id,
            nickname: user.nickname,
            avatar_url: user.avatar_url,
            line: currentLine,
            station: currentStation,
            segment: currentSegment,
            online_at: new Date().toISOString(),
          })
        }
      })

    channelRef.current = channel
  }, [user, currentLine, currentStation, currentSegment, setActiveUsers])

  const leavePresence = useCallback(async () => {
    if (channelRef.current) {
      await channelRef.current.untrack()
      await supabase.removeChannel(channelRef.current)
      channelRef.current = null
      setActiveUsers([])
    }
  }, [setActiveUsers])

  const updatePresence = useCallback(async (station: string | null, segment?: string) => {
    if (channelRef.current && user) {
      await channelRef.current.track({
        id: user.id,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        line: currentLine,
        station,
        segment: segment ?? currentSegment,
        online_at: new Date().toISOString(),
      })
    }
  }, [user, currentLine, currentSegment])

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [])

  return { joinPresence, leavePresence, updatePresence }
}
