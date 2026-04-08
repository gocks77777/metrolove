import { motion, AnimatePresence } from 'framer-motion'
import type { ActiveUser } from '@/types'

export interface Station {
  id: string
  name: string
  x: number
  y: number
}

export interface GhostUser {
  id: string
  segment: string
  boarded_at: string
  avatar_emoji: string
  nickname: string
}

interface SubwayLineMapProps {
  lineNumber: number
  lineColor: string
  stations: Station[]
  activeUsers: ActiveUser[]
  ghostUsers: GhostUser[]
  currentStation: string | null
  onUserTap: (user: ActiveUser) => void
  onGhostTap?: (ghost: GhostUser) => void
}

const MAP_WIDTH = 360
const MAP_HEIGHT = 200
const PADDING_X = 30
const TRACK_Y = 100

function getStationX(index: number, total: number): number {
  const usableWidth = MAP_WIDTH - PADDING_X * 2
  return PADDING_X + (usableWidth / (total - 1)) * index
}

function getPositionBySegment(
  segment: string,
  stations: Station[],
  offset: number = 0
): { x: number; y: number } {
  const [fromId, toId] = segment.split('-')
  const fromIdx = stations.findIndex((s) => s.id === fromId || s.name === fromId)
  const toIdx = stations.findIndex((s) => s.id === toId || s.name === toId)
  if (fromIdx === -1) return { x: MAP_WIDTH / 2, y: TRACK_Y - 35 }
  const fromX = getStationX(fromIdx, stations.length)
  const toX = toIdx !== -1 ? getStationX(toIdx, stations.length) : fromX + 30
  const midX = (fromX + toX) / 2 + offset * 18
  return { x: midX, y: TRACK_Y - 35 }
}

function getPositionByStation(
  stationName: string,
  stations: Station[],
  offset: number = 0
): { x: number; y: number } {
  const idx = stations.findIndex((s) => s.id === stationName || s.name === stationName)
  if (idx === -1) return { x: MAP_WIDTH / 2, y: TRACK_Y - 35 }
  const x = getStationX(idx, stations.length) + offset * 22
  return { x, y: TRACK_Y - 35 }
}

export function SubwayLineMap({
  lineNumber,
  lineColor,
  stations,
  activeUsers,
  ghostUsers,
  currentStation,
  onUserTap,
  onGhostTap,
}: SubwayLineMapProps) {
  return (
    <div
      className="card p-4"
      role="img"
      aria-label={`${lineNumber}호선 노선도. ${stations.length}개 역, ${activeUsers.length}명 탑승 중`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {lineNumber}호선 실시간
        </span>
        <span
          className="text-xs font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {activeUsers.length}명 탑승 중
        </span>
      </div>

      {/* SVG Map */}
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="w-full"
        aria-hidden="true"
      >
        {/* Track line */}
        <line
          x1={getStationX(0, stations.length)}
          y1={TRACK_Y}
          x2={getStationX(stations.length - 1, stations.length)}
          y2={TRACK_Y}
          stroke={lineColor}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Station dots */}
        {stations.map((station, i) => {
          const x = getStationX(i, stations.length)
          const isCurrent = station.id === currentStation
          return (
            <g key={station.id}>
              {/* Current station glow */}
              {isCurrent && (
                <motion.circle
                  cx={x}
                  cy={TRACK_Y}
                  r={12}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth={2}
                  opacity={0.3}
                  animate={{ r: [12, 16, 12], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              {/* Station circle */}
              <circle
                cx={x}
                cy={TRACK_Y}
                r={8}
                fill={isCurrent ? lineColor : 'var(--color-surface-raised)'}
                stroke={lineColor}
                strokeWidth={3}
              />
              {/* Station name */}
              <text
                x={x}
                y={TRACK_Y + 24}
                textAnchor="middle"
                fontSize={11}
                fill={
                  isCurrent
                    ? 'var(--color-text)'
                    : 'var(--color-text-secondary)'
                }
                fontWeight={isCurrent ? 700 : 500}
              >
                {station.name}
              </text>
            </g>
          )
        })}

        {/* Ghost users (behind active users) */}
        <AnimatePresence>
          {ghostUsers.map((ghost, i) => {
            const pos = getPositionBySegment(ghost.segment, stations, i * 0.5)
            return (
              <motion.g
                key={`ghost-${ghost.id}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.35, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={() => onGhostTap?.(ghost)}
                style={{ cursor: onGhostTap ? 'pointer' : 'default' }}
              >
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={9}
                  fill="var(--color-text-secondary)"
                  animate={{ opacity: [0.25, 0.45, 0.25] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize={10}
                >
                  {ghost.avatar_emoji}
                </text>
                {/* Timestamp */}
                <text
                  x={pos.x}
                  y={pos.y - 14}
                  textAnchor="middle"
                  fontSize={8}
                  fill="var(--color-text-tertiary)"
                >
                  {formatTimeAgo(ghost.boarded_at)}
                </text>
              </motion.g>
            )
          })}
        </AnimatePresence>

        {/* Active users */}
        <AnimatePresence>
          {activeUsers.map((user, i) => {
            const pos = getPositionByStation(user.station ?? '', stations, i * 0.8)
            return (
              <motion.g
                key={user.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={() => onUserTap(user)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`${user.nickname}, ${user.station}역`}
              >
                {/* Pulse ring */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={14}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  animate={{
                    r: [14, 20, 14],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                {/* User dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={13}
                  fill="var(--color-accent)"
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize={12}
                >
                  {user.avatar_url ?? '🧑'}
                </text>
              </motion.g>
            )
          })}
        </AnimatePresence>
      </svg>
    </div>
  )
}

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  return `${hours}시간 전`
}
