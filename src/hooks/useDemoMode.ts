import { useCallback, useRef } from 'react'
import { useStore } from '@/store/useStore'
import type { ActiveUser } from '@/types'
import type { GhostUser } from '@/components/map/SubwayLineMap'

// Pre-defined demo snapshots — replayed as a sequence
const DEMO_USERS: ActiveUser[] = [
  { id: 'demo-1', nickname: '음악좋아', avatar_url: '🎧', line: 2, station: '역삼', online_at: new Date().toISOString() },
  { id: 'demo-2', nickname: '퇴근독서', avatar_url: '📚', line: 2, station: '삼성', online_at: new Date().toISOString() },
  { id: 'demo-3', nickname: '카페인중독', avatar_url: '☕', line: 2, station: '삼성', online_at: new Date().toISOString() },
]

const DEMO_GHOSTS: GhostUser[] = [
  { id: 'ghost-1', segment: 'gangnam-yeoksam', boarded_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), avatar_emoji: '🌙', nickname: '야근러' },
  { id: 'ghost-2', segment: 'yeoksam-seolleung', boarded_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), avatar_emoji: '🎮', nickname: '게임덕후' },
  { id: 'ghost-3', segment: 'gyodae-gangnam', boarded_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), avatar_emoji: '🏃', nickname: '러닝맨' },
  { id: 'ghost-4', segment: 'seolleung-samsung', boarded_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), avatar_emoji: '🌸', nickname: '봄좋아' },
  { id: 'ghost-5', segment: 'gangnam-yeoksam', boarded_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), avatar_emoji: '💻', nickname: '코딩왕' },
]

// Sequence of state changes over time (in ms)
const DEMO_SEQUENCE = [
  { time: 0, users: [], ghosts: DEMO_GHOSTS },
  { time: 1500, users: [DEMO_USERS[0]], ghosts: DEMO_GHOSTS },
  { time: 3000, users: [DEMO_USERS[0], DEMO_USERS[1]], ghosts: DEMO_GHOSTS },
  { time: 5000, users: DEMO_USERS, ghosts: DEMO_GHOSTS },
  // Ghost "solidifies" — remove from ghosts, add to active
  { time: 8000, users: [...DEMO_USERS, { ...DEMO_GHOSTS[0], id: 'ghost-1-real', avatar_url: '🌙', line: 2 as const, station: '역삼', online_at: new Date().toISOString() }], ghosts: DEMO_GHOSTS.slice(1) },
]

export function useDemoMode() {
  const { demoMode, setDemoMode, setActiveUsers, setGhostUsers } = useStore()
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const startDemo = useCallback(() => {
    setDemoMode(true)

    // Clear any existing timers
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    // Schedule each snapshot
    for (const step of DEMO_SEQUENCE) {
      const timer = setTimeout(() => {
        setActiveUsers(step.users)
        setGhostUsers(step.ghosts)
      }, step.time)
      timersRef.current.push(timer)
    }

    // Loop the demo after completion
    const loopTimer = setTimeout(() => {
      if (demoMode) startDemo()
    }, 12000)
    timersRef.current.push(loopTimer)
  }, [demoMode, setDemoMode, setActiveUsers, setGhostUsers])

  const stopDemo = useCallback(() => {
    setDemoMode(false)
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setActiveUsers([])
    setGhostUsers([])
  }, [setDemoMode, setActiveUsers, setGhostUsers])

  const toggleDemo = useCallback(() => {
    if (demoMode) {
      stopDemo()
    } else {
      startDemo()
    }
  }, [demoMode, startDemo, stopDemo])

  return { demoMode, toggleDemo, startDemo, stopDemo }
}
