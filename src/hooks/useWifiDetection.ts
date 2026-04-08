import { useEffect, useCallback, useRef } from 'react'
import { useStore } from '@/store/useStore'
import type { MetroLine } from '@/types'

const METRO_WIFI_PATTERNS: Record<string, MetroLine | null> = {
  'T wifi zone': null,
  'U+zone': null,
  'olleh WiFi': null,
  'Metro Free WiFi': null,
  'Seoul Metro': null,
}

const DISCONNECT_GRACE_SECONDS = 300 // 5 minutes

function detectMetroWifi(ssid: string): { isMetro: boolean; line: MetroLine | null } {
  for (const pattern of Object.keys(METRO_WIFI_PATTERNS)) {
    if (ssid.toLowerCase().includes(pattern.toLowerCase())) {
      return { isMetro: true, line: METRO_WIFI_PATTERNS[pattern] }
    }
  }
  return { isMetro: false, line: null }
}

export function useWifiDetection() {
  const { wifiStatus, setWifiStatus, setWifiInfo, setDisconnectTimer } = useStore()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const graceRef = useRef<number>(DISCONNECT_GRACE_SECONDS)

  const handleOnline = useCallback(() => {
    // In production: check actual SSID via Captive Portal or NetworkInformation API
    // For demo: simulate metro WiFi detection
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setDisconnectTimer(null)
    graceRef.current = DISCONNECT_GRACE_SECONDS
    setWifiStatus('connected')
    setWifiInfo('Metro Free WiFi', 2, null)
  }, [setWifiStatus, setWifiInfo, setDisconnectTimer])

  const handleOffline = useCallback(() => {
    if (wifiStatus !== 'connected') return

    setWifiStatus('disconnected')
    graceRef.current = DISCONNECT_GRACE_SECONDS

    timerRef.current = setInterval(() => {
      graceRef.current -= 1
      setDisconnectTimer(graceRef.current)

      if (graceRef.current <= 0) {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
        setWifiStatus('scanning')
        setWifiInfo(null, null, null)
        setDisconnectTimer(null)
      }
    }, 1000)
  }, [wifiStatus, setWifiStatus, setWifiInfo, setDisconnectTimer])

  // Simulate connection for development
  const simulateConnect = useCallback(() => {
    handleOnline()
  }, [handleOnline])

  const simulateDisconnect = useCallback(() => {
    handleOffline()
  }, [handleOffline])

  useEffect(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial state
    if (navigator.onLine) {
      // In dev mode, don't auto-connect (let user simulate)
      setWifiStatus('scanning')
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [handleOnline, handleOffline, setWifiStatus])

  return {
    wifiStatus,
    simulateConnect,
    simulateDisconnect,
    detectMetroWifi,
  }
}
