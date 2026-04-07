# MetroLove - GStack CLI 작업 가이드

> 지하철 와이파이 접속 시 같은 칸/노선 사용자끼리 매칭되는 채팅 서비스

---

## 0. 사전 준비

```bash
# gstack 설치 (최초 1회) - D드라이브에 설치
mkdir -p d:/gstack-skills
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git d:/gstack-skills/gstack
cd d:/gstack-skills/gstack
./setup

# Claude가 gstack을 인식하도록 심볼릭 링크 생성
mkdir -p ~/.claude/skills
# (PowerShell 관리자 권한) 또는 그냥 setup이 알아서 연결해줌

# Bun 설치 (없는 경우)
npm install -g bun

# 프로젝트 디렉토리로 이동
cd d:/metrolove

# gstack 팀 모드 초기화 (프로젝트에 연결)
d:/gstack-skills/gstack/bin/gstack-team-init required
git init && git add . && git commit -m "init: metrolove project with gstack"
```

---

## 1단계: 아이디어 구체화 (생각 정리)

Claude Code에서 아래 명령어를 순서대로 실행:

```
/office-hours
```
> "메트로러브는 지하철 와이파이에 연결된 사용자끼리만 실시간 매칭/채팅할 수 있는 서비스야.
> 핵심 기능: WiFi SSID 감지 → 같은 노선 사용자 풀링 → 프로필 카드 스와이프 → 매칭 시 채팅방 생성 → 하차하면 채팅 종료(또는 연장 선택)"

이 단계에서 gstack이 6가지 강제 질문으로 아이디어를 검증해줌.

---

## 2단계: 계획 수립

```
/autoplan
```
> CEO 리뷰 → 디자인 리뷰 → 엔지니어링 리뷰를 자동으로 연속 실행.
> 산출물: 구현 계획서 (아키텍처, 데이터 모델, API 설계)

또는 단계별로 개별 실행:

```
/plan-ceo-review          # 제품 방향 검증
/plan-design-review       # UI/UX 계획 검토
/plan-eng-review          # 기술 아키텍처 잠금
```

---

## 3단계: 디자인

```
/design-consultation
```
> "모바일 퍼스트 웹앱, 틴더 스타일 카드 스와이프 UI, 채팅 인터페이스, 지하철 노선 테마 컬러"

```
/design-shotgun
```
> 4~6가지 디자인 변형을 한번에 생성해서 비교 선택

```
/design-html
```
> 선택한 디자인을 실제 HTML/CSS로 변환

---

## 4단계: 구현 (핵심 기능별 CLI 프롬프트)

### 4-1. 프로젝트 초기 세팅
```
메트로러브 프로젝트를 세팅해줘.
- 프론트엔드: React + TypeScript + Vite (모바일 웹앱)
- 백엔드: Supabase (Auth, Realtime DB, Edge Functions)
- 스타일링: Tailwind CSS
- 실시간 통신: Supabase Realtime (채팅)
- PWA 지원
```

### 4-2. WiFi 감지 로직
```
지하철 WiFi SSID를 감지하는 로직을 만들어줘.
- NetworkInformation API 또는 Captive Portal 감지 방식
- 서울 지하철 WiFi SSID 패턴: "T wifi zone", "U+zone", "olleh WiFi" 등
- WiFi 연결 상태에 따라 앱 활성/비활성 전환
- 연결 해제 시 세션 타이머 시작 (5분 유예)
```

### 4-3. 사용자 매칭 시스템
```
실시간 매칭 시스템을 구현해줘.
- Supabase Realtime으로 같은 WiFi AP에 연결된 사용자 풀링
- 프로필 카드 스와이프 (좋아요/패스)
- 양방향 좋아요 시 매칭 성립
- 매칭 알림 (브라우저 Push Notification)
```

### 4-4. 채팅 시스템
```
1:1 실시간 채팅을 구현해줘.
- Supabase Realtime Channels 사용
- 메시지 전송/수신/읽음 표시
- 이미지 전송 (Supabase Storage)
- 타이핑 인디케이터
- WiFi 연결 해제 시 "연결이 끊어졌어요" 상태 표시
```

### 4-5. 인증
```
소셜 로그인을 구현해줘.
- Supabase Auth (카카오 로그인 우선)
- 프로필 설정: 닉네임, 한줄 소개, 프로필 사진
- 나이/성별은 선택 입력
```

---

## 5단계: 코드 리뷰 & QA

```
/review                   # 코드 품질 리뷰 (스태프 엔지니어 수준)
/cso                      # 보안 감사 (OWASP Top 10 체크)
/design-review            # 디자인 일관성 검토
/devex-review             # 개발자 경험 검토
```

### 브라우저 테스트
```
/qa http://localhost:5173
```
> Playwright로 실제 브라우저에서 자동 테스트 실행

```
/qa-only http://localhost:5173
```
> 리포트만 생성 (코드 수정 없이)

---

## 6단계: 배포

```
/setup-deploy             # 배포 환경 설정 (Vercel/Netlify 등)
/ship                     # PR 생성 + 코드 리뷰
/land-and-deploy          # PR 머지 → 배포 → 상태 검증
/canary                   # 배포 후 모니터링
```

---

## 7단계: 회고 & 학습

```
/retro                    # 주간 회고 (뭐가 잘됐고 뭐가 안됐는지)
/learn                    # 학습 내용 메모리에 저장
/document-release         # README, 문서 자동 업데이트
```

---

## 자주 쓰는 유틸리티 명령어

| 명령어 | 용도 |
|--------|------|
| `/careful` | 위험한 명령 실행 전 경고 |
| `/freeze src/core/` | 특정 디렉토리 편집 잠금 |
| `/unfreeze src/core/` | 잠금 해제 |
| `/guard` | 안전 모드 (careful + freeze 통합) |
| `/browse <URL>` | 웹 브라우징으로 참고 자료 확인 |
| `/investigate` | 버그 근본 원인 분석 |
| `/benchmark` | 성능 기준선 측정 |
| `/pair-agent` | 다중 에이전트 동시 작업 |

---

## 효과적인 CLI 프롬프트 작성 팁

### DO (이렇게 해라)
```
"WiFi 감지 모듈을 src/hooks/useWifiDetection.ts에 만들어줘.
NetworkInformation API를 사용하고, SSID 패턴은 config에서 관리.
연결 끊기면 5분 타이머 시작. Supabase presence에 상태 업데이트."
```
> 파일 경로 + 기술 선택 + 구체적 동작을 명시

### DON'T (이렇게 하지 마라)
```
"와이파이 기능 만들어줘"
```
> 너무 모호함. gstack이 잘 동작하려면 구체적인 컨텍스트가 필요

### 복잡한 기능은 나눠서 요청
```
# 1번째 요청
"먼저 Supabase 테이블 스키마를 설계해줘: users, matches, messages, wifi_sessions"

# 2번째 요청  
"설계한 스키마를 기반으로 Supabase migration 파일을 만들어줘"

# 3번째 요청
"매칭 로직을 Edge Function으로 구현해줘"
```

---

## 기술 스택 요약

| 영역 | 기술 | 이유 |
|------|------|------|
| 프론트엔드 | React + TypeScript + Vite | 빠른 개발, PWA 지원 |
| 스타일링 | Tailwind CSS | 모바일 반응형, 빠른 프로토타이핑 |
| 백엔드 | Supabase | Auth, DB, Realtime, Storage 올인원 |
| 실시간 | Supabase Realtime | 채팅 + 매칭 상태 동기화 |
| 배포 | Vercel | 무료 티어, 빠른 배포 |
| AI 도구 | GStack + Claude Code | 개발 자동화 |
