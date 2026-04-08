import { useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import type { Match } from '@/types'

export function useMatching() {
  const { user, setChatRooms } = useStore()

  // Load existing matches
  const loadMatches = useCallback(async () => {
    if (!user) return

    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
      .in('status', ['matched', 'extended'])
      .order('created_at', { ascending: false })

    if (!matches) return

    const rooms = await Promise.all(
      matches.map(async (match) => {
        const partnerId = match.user_a === user.id ? match.user_b : match.user_a
        const { data: partner } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', partnerId)
          .single()

        const { data: lastMsg } = await supabase
          .from('messages')
          .select('content')
          .eq('match_id', match.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        const { count: unread } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('match_id', match.id)
          .neq('sender_id', user.id)
          .is('read_at', null)

        return {
          match_id: match.id,
          partner: partner!,
          last_message: lastMsg?.content || null,
          unread_count: unread || 0,
          expires_at: match.expires_at,
          is_extended: match.status === 'extended',
        }
      })
    )

    setChatRooms(rooms)
  }, [user, setChatRooms])

  // Subscribe to new matches in realtime
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('matches-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
        },
        (payload) => {
          const match = payload.new as Match
          if (match.user_a === user.id || match.user_b === user.id) {
            loadMatches()
          }
        }
      )
      .subscribe()

    loadMatches()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, loadMatches])

  const swipe = useCallback(async (targetId: string, direction: 'like' | 'pass') => {
    if (!user) return

    await supabase.from('swipes').insert({
      swiper_id: user.id,
      swiped_id: targetId,
      direction,
    })
  }, [user])

  const extendMatch = useCallback(async (matchId: string) => {
    if (!user) return

    const { data: match } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single()

    if (!match) return

    const extendedBy: string[] = match.extended_by || []

    if (extendedBy.includes(user.id)) return // already extended

    const newExtendedBy = [...extendedBy, user.id]

    if (newExtendedBy.length >= 2) {
      // Both users extended — keep the match alive
      await supabase
        .from('matches')
        .update({
          status: 'extended',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', matchId)
    } else {
      await supabase
        .from('matches')
        .update({
          status: 'matched',
        })
        .eq('id', matchId)
    }
  }, [user])

  return { swipe, extendMatch, loadMatches }
}
