# MetroLove

서울 지하철 WiFi 기반 실시간 매칭/채팅 PWA

> 재미없는 퇴근길에 우연히 찾은 내 운명

## Live Demo

https://metrolove.vercel.app

로그인 없이 **"데모로 체험하기"** 버튼으로 전체 플로우를 체험할 수 있습니다.

## What is this?

틴더는 의도적으로 켜는 앱입니다. MetroLove는 퇴근길에 우연히 일어나는 앱입니다.

지하철 WiFi에 연결되면 자동으로 매칭 풀에 진입하고, 같은 노선의 다른 탑승자와 매칭됩니다. 하차하면 채팅이 끝납니다. 양쪽이 "연장"을 누르면 대화가 이어집니다.

### Core Features

- **SVG 노선도 UI** - 카드 덱이 아니라 지하철 노선 지도 위에서 실시간 유저가 점으로 나타남
- **Ghost Rides** - 지난 24시간 내 같은 구간을 탄 사람들이 반투명 고스트 점으로 표시. 콜드 스타트를 UX로 해결
- **하차 타이머** - 5분 카운트다운. 시간이 줄어들수록 노란색에서 빨간색으로 전환
- **Demo Mode** - 시뮬레이션된 유저 3명 + 고스트 5명으로 전체 플로우 체험

## Design System: 서울 지하 (Seoul Underground)

네온 사이버펑크가 아니라 실제 서울 지하철의 물성에서 디자인을 가져왔습니다.

- **콘크리트 배경** (`#F2F0EB`) + **안전선 노란색** (`#F2C94C`) 액센트
- **Gmarket Sans Bold** (디스플레이) + **Pretendard** (본문) + **IBM Plex Mono** (데이터)
- 라이트 모드 기본, 다크 모드 지원 (`prefers-color-scheme`)
- 서울교통공사 공식 노선 색상 9개 적용

디자인 상세: [DESIGN.md](./DESIGN.md)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 + CSS Custom Properties |
| Animation | Framer Motion |
| State | Zustand |
| Backend | Supabase (Auth, DB, Realtime, Presence) |
| Routing | React Router v7 |
| Testing | Vitest + React Testing Library (14 tests) |
| PWA | Service Worker + Web App Manifest |
| Deploy | Vercel |

## Architecture

```
Browser (PWA, responsive)
├── React + TypeScript + Vite
├── Framer Motion (animations)
├── Zustand (client state)
├── SVG Route Map (custom)
└── Service Worker (offline)
     │
     ▼
Supabase
├── Auth (Kakao OAuth / Magic Link)
├── Database (PostgreSQL)
│   ├── profiles
│   ├── wifi_sessions (ride history)
│   ├── matches
│   └── messages
├── Realtime
│   ├── Presence: metro-line-{n} (per-line rider tracking)
│   └── Broadcast: chat:{matchId} (chat messages)
└── RPC (ghost queries)
     │
     ▼
Vercel (hosting)
```

## Project Structure

```
src/
├── components/
│   ├── map/           # SVG 노선도, 역/유저/고스트 노드
│   ├── common/        # DisconnectTimer
│   ├── landing/       # BoardingAnimation, WifiScanner
│   └── matching/      # MatchNotification
├── hooks/
│   ├── useAuth.ts         # Supabase 인증
│   ├── usePresence.ts     # 노선별 Presence 채널
│   ├── useMatching.ts     # 매칭/스와이프/연장
│   ├── useRealtimeChat.ts # 실시간 채팅
│   ├── useWifiDetection.ts# WiFi 감지 (수동 시뮬레이션)
│   ├── useGhostRides.ts   # 24시간 내 고스트 라이더
│   └── useDemoMode.ts     # 데모 스냅샷 재생
├── pages/             # 9개 페이지 (Login, Map, Match, Chat, Profile, Admin 등)
├── store/             # Zustand store
├── types/             # TypeScript 타입 + Supabase DB 타입
└── lib/               # Supabase 클라이언트
```

## Getting Started

```bash
# Install
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Supabase project URL and anon key

# Run dev server
npm run dev

# Run tests
npm test

# Build
npm run build
```

## Key Design Decisions

**왜 노선도 UI인가?** 데이팅 앱은 전부 카드 덱입니다. MetroLove는 지도가 인터페이스입니다. 쇼핑이 아니라 탐색.

**왜 Ghost Rides인가?** 유저 50명인 MVP에서 노선 지도가 비어 보이면 아무도 안 씁니다. 고스트는 콜드 스타트를 기능으로 전환합니다.

**왜 라이트 모드 기본인가?** 데이팅 앱 99%가 다크 모드입니다. 라이트로 가면 즉시 차별화. 지하철 형광등 아래 있는 느낌과 일치.

**왜 SVG인가?** react-flow는 플로우차트용이고 5개 역에는 오버킬. 커스텀 SVG + Framer Motion이 더 단순하고 모바일 친화적.

## Roadmap

- [ ] Ghost Ping - 고스트에게 ping, 다음 탑승 시 알림
- [ ] 같은 역 하차 매칭 - 목적지 입력, 같은 역 하차자 우선 매칭
- [ ] WiFi 자동 감지 - T wifi zone 실제 감지로 자동 탑승
- [ ] 음성 메시지 - 지하철에서 타이핑 어려우니까
- [ ] 전체 노선 - Line 2 외 8개 노선 추가
- [ ] 지하철 시간표 연동 - 실제 열차 도착 시간과 타이머 동기화

## License

MIT
