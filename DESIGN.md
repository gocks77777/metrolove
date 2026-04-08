# Design System — MetroLove

## Product Context
- **What this is:** 지하철 WiFi 기반 실시간 매칭/채팅 서비스 (PWA)
- **Who it's for:** 서울 지하철 통근자 + FE 직무 면접관 (포트폴리오)
- **Space/industry:** 데이팅/소셜, 위치 기반 매칭
- **Project type:** 모바일 웹앱 (PWA, max-width 430px)

## Aesthetic Direction
- **Direction:** Industrial/Utilitarian — "서울 지하 (Seoul Underground)"
- **Decoration level:** Intentional — 지하철 안내판 스타일의 미묘한 텍스처, 노선 색상 액센트
- **Mood:** 실제 서울 지하철의 물성에서 끌어온 디자인. 콘크리트 벽, 스테인리스 손잡이, 환승 통로 안내판. 낭만적이지 않으면서 따뜻한 공적 공간. "형광등 아래에서 우연히 눈이 마주쳤을 때"의 느낌.
- **Key principle:** 모든 디자인 선택이 "실제 서울 지하철"이라는 하나의 물성에서 나옴. 사이버펑크 코스튬이 아니라 contextual design.

## Typography
- **Display/Hero:** Gmarket Sans Bold — 한국적 편의점 간판/역 출구 번호의 대담함. 핵심 순간에만 사용.
- **Body:** Pretendard Variable — 한글 최적화, 지하철 안내 시스템의 신뢰감
- **UI/Labels:** Pretendard Variable (same as body)
- **Data/Tables:** IBM Plex Mono — 시간/거리/역명에 트랜짓 데이터 느낌. tabular-nums 지원.
- **Code:** IBM Plex Mono
- **Loading:**
  - Pretendard: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css`
  - Gmarket Sans: `https://cdn.jsdelivr.net/gh/webfontworld/gmarket/GmarketSans.css`
  - IBM Plex Mono: Google Fonts `IBM+Plex+Mono:wght@400;500;600`
- **Scale:**
  - Hero: 32px (2rem) — Gmarket Sans Bold
  - Title: 24px (1.5rem) — Gmarket Sans Bold
  - Subtitle: 18px (1.125rem) — Pretendard SemiBold
  - Body: 15px (0.9375rem) — Pretendard Regular
  - Caption: 12px (0.75rem) — Pretendard Regular
  - Micro: 10px (0.625rem) — IBM Plex Mono
- **Line height:** 1.6 (body), 1.2 (display)

## Color
- **Approach:** Restrained — 안전선 노란색 하나가 주인공, 나머지는 절제
- **Light Mode (기본):**
  - Background: `#F2F0EB` — 콘크리트 벽
  - Surface: `#E8E4DD` — 스테인리스 패널
  - Surface Raised: `#FFFEF9` — 카드/컨테이너
  - Text Primary: `#1A1A1A` — 안내문 블랙
  - Text Secondary: `#8C8880` — 플랫폼 그레이
  - Text Tertiary: `#B0A99E` — placeholder, 비활성
  - Border: `rgba(26,26,26,0.08)` — 기본 구분선
  - Border Strong: `rgba(26,26,26,0.15)` — 강조 구분선
- **Accent:**
  - Primary: `#F2C94C` — 안전선 노란색 ("선을 넘으세요"의 긴장감)
  - Hover: `#E5BC3F`
- **Semantic:**
  - Success: `#3CB371` — 안전 초록 (매칭 성공)
  - Warning: `#F2C94C` 배경 15% opacity — WiFi 약해짐
  - Error: `#D94F4F` — 비상 빨간 (하차, 연결 끊김)
  - Info: `#4A7FB5` — 환승 통로 파란 (커넥션, 정보)
- **Dark Mode:**
  - Background: `#1A1A2E`
  - Surface: `#222236`
  - Surface Raised: `#2A2A42`
  - Text Primary: `#F2F0EB`
  - Text Secondary: `#9E9A94`
  - Accent: `#D9B340` (채도 20% 감소)
  - 전체 semantic 색상 채도 10-20% 감소
- **Seoul Metro Lines (공식 색상):**
  - 1호선: `#0052A4`, 2호선: `#00A84D`, 3호선: `#EF7C1C`
  - 4호선: `#00A5DE`, 5호선: `#996CAC`, 6호선: `#CD7C2F`
  - 7호선: `#747F00`, 8호선: `#E6186C`, 9호선: `#BDB092`

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px) 3xl(64px)

## Layout
- **Approach:** Hybrid — 노선도 기반 탐색(홈) + 카드 스타일 프로필(상세)
- **Grid:** 단일 컬럼, 모바일 퍼스트
- **Max content width:** 430px (iPhone 15 Pro Max 기준)
- **Border radius:**
  - sm: 4px (인풋, 작은 요소)
  - md: 8px (버튼, 알럿)
  - lg: 12px (카드, 컨테이너)
  - xl: 16px (모달, 큰 카드)
  - full: 9999px (배지, 태그, 아바타)
- **Bottom nav:** 4탭 (노선, 채팅, 근처, 프로필)
- **Card design:** 프로필 카드에서 틴더 문법 재활용 (좌/우 스와이프)
- **Home:** 현재 탑승 노선의 추상화된 지도 + 탑승자 펄스 인디케이터

## Motion
- **Approach:** Intentional — 의미 있는 전환만, 장식적 애니메이션 없음
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(80ms) short(200ms) medium(350ms) long(500ms)
- **Key animations:**
  - 탑승자 펄스: 2.5s infinite, box-shadow 확장/축소
  - 매칭 성공: 두 점이 노선 위에서 연결되는 라인 애니메이션
  - 카드 전환: spring(stiffness:300, damping:25) — Framer Motion
  - WiFi 감지 진입: subtle fade-in + slide-up, 300ms
  - 하차 타이머: 안전선 노란색 펄스, 긴장감 증가
- **Framer Motion config:**
  - Page transition: `{ opacity: [0,1], y: [20,0] }`, 300ms
  - Card swipe: `spring({ stiffness: 300, damping: 25 })`

## Icons / Emoji
- 시스템 이모지 사용 (별도 아이콘 라이브러리 불필요)
- 핵심: 🗺 💬 📡 👤 🎧 📚 ☕ ← ↑

## CSS Custom Properties
```css
:root {
  /* Colors */
  --bg: #F2F0EB;
  --surface: #E8E4DD;
  --surface-raised: #FFFEF9;
  --text: #1A1A1A;
  --text-secondary: #8C8880;
  --text-tertiary: #B0A99E;
  --accent: #F2C94C;
  --accent-hover: #E5BC3F;
  --alert: #D94F4F;
  --connection: #4A7FB5;
  --success: #3CB371;
  --border: rgba(26,26,26,0.08);
  --border-strong: rgba(26,26,26,0.15);

  /* Typography */
  --font-display: 'GmarketSans', 'Pretendard Variable', sans-serif;
  --font-body: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  /* Spacing */
  --space-2xs: 2px;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(26,26,26,0.06);
  --shadow-md: 0 4px 12px rgba(26,26,26,0.08);
  --shadow-lg: 0 8px 24px rgba(26,26,26,0.1);

  /* Seoul Metro Lines */
  --line-1: #0052A4;
  --line-2: #00A84D;
  --line-3: #EF7C1C;
  --line-4: #00A5DE;
  --line-5: #996CAC;
  --line-6: #CD7C2F;
  --line-7: #747F00;
  --line-8: #E6186C;
  --line-9: #BDB092;
}
```

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-08 | "서울 지하" 방향으로 전면 전환 | 네온 사이버펑크에서 실제 서울 지하철 물성 기반 디자인으로. contextual design이 포트폴리오에서 더 강한 스토리텔링을 만듦 |
| 2026-04-08 | 라이트 모드 기본 | 데이팅 앱 카테고리에서 즉시 차별화. 지하철 형광등 아래 느낌과 일치 |
| 2026-04-08 | 안전선 노란색(#F2C94C) 메인 액센트 | 서울 지하철 타는 사람이면 무의식적으로 인식하는 색. "선을 넘으세요"의 긴장감 |
| 2026-04-08 | Gmarket Sans Bold 디스플레이 폰트 | 한국적 간판/역 출구 번호의 대담함. 카테고리 차별화 |
| 2026-04-08 | 노선도 기반 홈 화면 | 카드 덱 대신 추상화된 지하철 노선 지도. 쇼핑이 아니라 탐색. |
