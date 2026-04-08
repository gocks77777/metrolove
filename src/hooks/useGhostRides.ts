import { useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import type { GhostUser } from '@/components/map/SubwayLineMap'

const GHOST_LIMIT = 20
const GHOST_WINDOW_HOURS = 24

export function useGhostRides() {
  const { user, currentLine, setGhostUsers } = useStore()

  // Record a ride when user boards
  const recordRide = useCallback(async (fromStation: string, _toStation?: string) => {
    if (!user || !currentLine) return

    await supabase.from('wifi_sessions').insert({
      user_id: user.id,
      ssid: `Metro Line ${currentLine}`,
      line: currentLine,
      station: fromStation,
    })
  }, [user, currentLine])

  // Load ghost riders from the same line segment in the last 24 hours
  const loadGhosts = useCallback(async (segment: string) => {
    if (!user || !currentLine) {
      setGhostUsers([])
      return
    }

    const cutoff = new Date(Date.now() - GHOST_WINDOW_HOURS * 60 * 60 * 1000).toISOString()

    const { data: sessions } = await supabase
      .from('wifi_sessions')
      .select('user_id, station, connected_at')
      .eq('line', currentLine)
      .neq('user_id', user.id)
      .gte('connected_at', cutoff)
      .order('connected_at', { ascending: false })
      .limit(GHOST_LIMIT)

    if (!sessions || sessions.length === 0) {
      setGhostUsers([])
      return
    }

    // Get unique user IDs
    const userIds = [...new Set(sessions.map((s) => s.user_id))]

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nickname, avatar_url')
      .in('id', userIds)

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? [])

    const ghosts: GhostUser[] = sessions
      .filter((s) => profileMap.has(s.user_id))
      .map((s) => {
        const profile = profileMap.get(s.user_id)!
        return {
          id: s.user_id,
          segment,
          boarded_at: s.connected_at,
          avatar_emoji: profile.avatar_url ?? '👻',
          nickname: profile.nickname,
        }
      })
      // Deduplicate by user ID (keep most recent)
      .filter((g, i, arr) => arr.findIndex((x) => x.id === g.id) === i)

    setGhostUsers(ghosts)
  }, [user, currentLine, setGhostUsers])

  const clearGhosts = useCallback(() => {
    setGhostUsers([])
  }, [setGhostUsers])

  return { recordRide, loadGhosts, clearGhosts }
}
