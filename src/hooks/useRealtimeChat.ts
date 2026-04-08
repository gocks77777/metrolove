import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import type { Message } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeChat(matchId: string | null) {
  const { user } = useStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load existing messages
  useEffect(() => {
    if (!matchId) return

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })

      if (data) setMessages(data)
    }

    loadMessages()
  }, [matchId])

  // Subscribe to new messages
  useEffect(() => {
    if (!matchId || !user) return

    const channel = supabase
      .channel(`chat:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const partnerStates = Object.entries(state)
          .filter(([key]) => key !== user.id)
          .flatMap(([, val]) => val)
        const partnerTyping = partnerStates.some(
          (s: Record<string, unknown>) => s.typing === true
        )
        setIsTyping(partnerTyping)
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [matchId, user])

  const sendMessage = useCallback(async (content: string) => {
    if (!matchId || !user || !content.trim()) return

    await supabase.from('messages').insert({
      match_id: matchId,
      sender_id: user.id,
      content: content.trim(),
    })
  }, [matchId, user])

  const sendTyping = useCallback(() => {
    if (!channelRef.current || !user) return

    channelRef.current.track({
      id: user.id,
      typing: true,
    })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      channelRef.current?.track({
        id: user.id,
        typing: false,
      })
    }, 2000)
  }, [user])

  return { messages, sendMessage, isTyping, sendTyping }
}
