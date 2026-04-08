import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from '@/store/useStore'

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      user: null,
      wifiStatus: 'scanning',
      currentSSID: null,
      currentLine: null,
      currentStation: null,
      currentSegment: null,
      activeUsers: [],
      chatRooms: [],
      disconnectTimer: null,
      ghostUsers: [],
      demoMode: false,
    })
  })

  it('sets user', () => {
    const profile = {
      id: 'test-1',
      nickname: '테스트유저',
      bio: null,
      avatar_url: '🎧',
      gender: null,
      age: null,
      created_at: new Date().toISOString(),
    }
    useStore.getState().setUser(profile)
    expect(useStore.getState().user).toEqual(profile)
  })

  it('sets wifi info', () => {
    useStore.getState().setWifiInfo('T wifi zone', 2, '강남')
    const state = useStore.getState()
    expect(state.currentSSID).toBe('T wifi zone')
    expect(state.currentLine).toBe(2)
    expect(state.currentStation).toBe('강남')
  })

  it('sets wifi status', () => {
    useStore.getState().setWifiStatus('connected')
    expect(useStore.getState().wifiStatus).toBe('connected')
  })

  it('sets active users', () => {
    const users = [
      { id: 'u1', nickname: '음악좋아', avatar_url: '🎧', line: 2 as const, station: '역삼', online_at: new Date().toISOString() },
    ]
    useStore.getState().setActiveUsers(users)
    expect(useStore.getState().activeUsers).toHaveLength(1)
    expect(useStore.getState().activeUsers[0].nickname).toBe('음악좋아')
  })

  it('sets ghost users', () => {
    const ghosts = [
      { id: 'g1', segment: 'gangnam-yeoksam', boarded_at: new Date().toISOString(), avatar_emoji: '🌙', nickname: '야근러' },
    ]
    useStore.getState().setGhostUsers(ghosts)
    expect(useStore.getState().ghostUsers).toHaveLength(1)
  })

  it('toggles demo mode', () => {
    expect(useStore.getState().demoMode).toBe(false)
    useStore.getState().setDemoMode(true)
    expect(useStore.getState().demoMode).toBe(true)
  })

  it('sets disconnect timer', () => {
    useStore.getState().setDisconnectTimer(120)
    expect(useStore.getState().disconnectTimer).toBe(120)
  })

  it('sets current segment', () => {
    useStore.getState().setCurrentSegment('gangnam-yeoksam')
    expect(useStore.getState().currentSegment).toBe('gangnam-yeoksam')
  })

  it('clears user on null', () => {
    useStore.getState().setUser({ id: '1', nickname: 'test', bio: null, avatar_url: null, gender: null, age: null, created_at: '' })
    useStore.getState().setUser(null)
    expect(useStore.getState().user).toBeNull()
  })
})
