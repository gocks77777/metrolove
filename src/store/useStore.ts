import { create } from 'zustand'
import type { Profile, WifiStatus, MetroLine, ActiveUser, ChatRoom } from '@/types'
import type { GhostUser } from '@/components/map/SubwayLineMap'

interface AppState {
  // Auth
  user: Profile | null
  setUser: (user: Profile | null) => void

  // WiFi / Ride
  wifiStatus: WifiStatus
  currentSSID: string | null
  currentLine: MetroLine | null
  currentStation: string | null
  currentSegment: string | null
  setWifiStatus: (status: WifiStatus) => void
  setWifiInfo: (ssid: string | null, line: MetroLine | null, station: string | null) => void
  setCurrentSegment: (segment: string | null) => void

  // Matching
  activeUsers: ActiveUser[]
  setActiveUsers: (users: ActiveUser[]) => void

  // Chat
  chatRooms: ChatRoom[]
  setChatRooms: (rooms: ChatRoom[]) => void

  // Disconnect timer
  disconnectTimer: number | null
  setDisconnectTimer: (seconds: number | null) => void

  // Ghost Rides
  ghostUsers: GhostUser[]
  setGhostUsers: (ghosts: GhostUser[]) => void

  // Demo Mode
  demoMode: boolean
  setDemoMode: (enabled: boolean) => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  wifiStatus: 'scanning',
  currentSSID: null,
  currentLine: null,
  currentStation: null,
  currentSegment: null,
  setWifiStatus: (wifiStatus) => set({ wifiStatus }),
  setWifiInfo: (currentSSID, currentLine, currentStation) =>
    set({ currentSSID, currentLine, currentStation }),
  setCurrentSegment: (currentSegment) => set({ currentSegment }),

  activeUsers: [],
  setActiveUsers: (activeUsers) => set({ activeUsers }),

  chatRooms: [],
  setChatRooms: (chatRooms) => set({ chatRooms }),

  disconnectTimer: null,
  setDisconnectTimer: (disconnectTimer) => set({ disconnectTimer }),

  ghostUsers: [],
  setGhostUsers: (ghostUsers) => set({ ghostUsers }),

  demoMode: false,
  setDemoMode: (demoMode) => set({ demoMode }),
}))
