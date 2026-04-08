import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SubwayLineMap, type Station } from '@/components/map/SubwayLineMap'

const STATIONS: Station[] = [
  { id: 'gyodae', name: '교대', x: 0, y: 0 },
  { id: 'gangnam', name: '강남', x: 0, y: 0 },
  { id: 'yeoksam', name: '역삼', x: 0, y: 0 },
]

describe('SubwayLineMap', () => {
  it('renders station names', () => {
    render(
      <SubwayLineMap
        lineNumber={2}
        lineColor="#00A84D"
        stations={STATIONS}
        activeUsers={[]}
        ghostUsers={[]}
        currentStation={null}
        onUserTap={vi.fn()}
      />
    )
    expect(screen.getByText('교대')).toBeInTheDocument()
    expect(screen.getByText('강남')).toBeInTheDocument()
    expect(screen.getByText('역삼')).toBeInTheDocument()
  })

  it('shows rider count', () => {
    render(
      <SubwayLineMap
        lineNumber={2}
        lineColor="#00A84D"
        stations={STATIONS}
        activeUsers={[
          { id: 'u1', nickname: '테스트', avatar_url: '🎧', line: 2, station: '강남', online_at: '' },
        ]}
        ghostUsers={[]}
        currentStation={null}
        onUserTap={vi.fn()}
      />
    )
    expect(screen.getByText('1명 탑승 중')).toBeInTheDocument()
  })

  it('shows line header', () => {
    render(
      <SubwayLineMap
        lineNumber={2}
        lineColor="#00A84D"
        stations={STATIONS}
        activeUsers={[]}
        ghostUsers={[]}
        currentStation={null}
        onUserTap={vi.fn()}
      />
    )
    expect(screen.getByText('2호선 실시간')).toBeInTheDocument()
  })

  it('has accessible label', () => {
    render(
      <SubwayLineMap
        lineNumber={2}
        lineColor="#00A84D"
        stations={STATIONS}
        activeUsers={[]}
        ghostUsers={[]}
        currentStation={null}
        onUserTap={vi.fn()}
      />
    )
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('2호선 노선도')
    )
  })

  it('renders ghost users with timestamp', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    render(
      <SubwayLineMap
        lineNumber={2}
        lineColor="#00A84D"
        stations={STATIONS}
        activeUsers={[]}
        ghostUsers={[
          { id: 'g1', segment: 'gangnam-yeoksam', boarded_at: twoHoursAgo, avatar_emoji: '🌙', nickname: '야근러' },
        ]}
        currentStation={null}
        onUserTap={vi.fn()}
      />
    )
    expect(screen.getByText('2시간 전')).toBeInTheDocument()
  })
})
