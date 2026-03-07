# 📋 프로젝트 로드맵

모임 이벤트 관리 MVP - Next.js 15 + Supabase

**최종 업데이트**: 2026-03-07
**프로젝트 상태**: Phase 4 (DB 통합) 진행 중

---

## 📊 진행 상황

### Phase 1: 기본 구조 & 네비게이션 ✅ (4/4)

- ✅ Task 001: 프로젝트 기본 세팅
- ✅ Task 002: 랜딩 페이지 UI
- ✅ Task 003: 대시보드 레이아웃
- ✅ Task 004: 네비게이션 헤더 (로그인/로그아웃)

**완료일**: 2026-02-28

---

### Phase 2: 이벤트 허브 UI/UX (9/13)

#### 완료된 태스크

- ✅ Task 005: 이벤트 생성 폼 (EventForm 컴포넌트)
- ✅ Task 006: 이벤트 수정 폼 (재사용)
- ✅ Task 007: 공개 이벤트 상세 페이지 (/events/share/[token])
- ✅ Task 008: 이벤트 허브 셸 (EventHeader, EventTabNavigation)
- ✅ Task 009: 관리자 대시보드 페이지

#### 진행 중인 태스크

- 🔄 **Recovery Tasks** (Phase 2/4 통합)
  - ✅ P0-A: 대시보드 DB 연동 (app/protected/page.tsx)
    - Supabase 쿼리로 실제 이벤트 목록 조회
    - 주최/참여 이벤트 분리 표시
  - ✅ P0-B: event-header.tsx 삭제 기능 연결
    - deleteEvent Server Action 연결
    - 확인 대화상자 추가
  - ✅ P1-C: 탭 페이지 DB 연동
    - announcements/page.tsx (공지사항)
    - members/page.tsx (참여자 관리)
    - carpool/page.tsx (카풀)
    - settlement/page.tsx (정산)

#### 미완료 태스크

- Task 010: 공지 작성/수정 (Server Actions)
- Task 011: 멤버 승인/거절 (Server Actions)
- Task 012: 카풀 매칭 (Server Actions)
- Task 013: 정산 계산 (Server Actions)

**현재**: Phase 4 DB 통합 (복구) 진행 중

---

### Phase 3: Database Schema & RLS (준비 중)

#### 계획된 태스크

- Task 015: Supabase 테이블 마이그레이션
- Task 016: RLS (Row Level Security) 정책 설정
- Task 017: TypeScript 타입 업데이트

**상태**: DB 스키마 ✅ 완성, 앞의 Phase 복구 완료 후 진행

---

### Phase 4: 실제 DB 통합 & Server Actions

#### 현재 상태 (2026-03-07)

**복구 작업 완료**:

- ✅ 대시보드 → DB 연동 (P0-A)
- ✅ 삭제 기능 → Server Action 연결 (P0-B)
- ✅ 4개 탭 → DB 쿼리 변환 (P1-C)

**다음 단계**:

- Server Actions 구현 (공지, 멤버, 카풀, 정산)
- 실제 테스트 데이터로 검증
- 프로덕션 배포

---

## 🔧 기술 스택

| 카테고리         | 기술                            |
| ---------------- | ------------------------------- |
| **프레임워크**   | Next.js 15.5.3 (App Router)     |
| **언어**         | TypeScript (strict mode)        |
| **데이터베이스** | Supabase (PostgreSQL)           |
| **인증**         | Supabase Auth (이메일 기반)     |
| **스타일링**     | Tailwind CSS                    |
| **UI 컴포넌트**  | shadcn/ui                       |
| **폼 검증**      | Zod, React Hook Form            |
| **상태 관리**    | Server Component, useTransition |

---

## 📁 프로젝트 구조

```
app/
├── auth/                           # 인증 관련 페이지
├── protected/                      # 보호된 라우트
│   ├── page.tsx                   # 대시보드 (✅ DB 연동)
│   └── events/
│       ├── new/                   # 이벤트 생성
│       └── [eventId]/
│           ├── layout.tsx         # 이벤트 상세 레이아웃
│           ├── edit/              # 이벤트 수정
│           ├── announcements/     # ✅ DB 연동
│           ├── members/           # ✅ DB 연동
│           ├── carpool/           # ✅ DB 연동
│           └── settlement/        # ✅ DB 연동
└── page.tsx                       # 랜딩 페이지

lib/
├── supabase/
│   ├── client.ts                 # Browser 클라이언트
│   ├── server.ts                 # Server 클라이언트
│   └── proxy.ts                  # 세션 새로고침
├── schemas/
│   └── events.ts                 # Zod 스키마
└── dummy-data.ts                 # (더 이상 사용 안 함)

components/
├── ui/                           # shadcn/ui 컴포넌트
├── events/
│   ├── event-card.tsx           # 이벤트 카드
│   ├── event-header.tsx         # ✅ 삭제 기능 연결
│   ├── event-form.tsx           # 생성/수정 폼
│   ├── event-tab-navigation.tsx # 탭 네비게이션
│   └── ...
└── auth/                         # 인증 관련

types/
└── database.ts                   # Supabase TypeScript 타입
```

---

## 🗂️ 데이터베이스 테이블

| 테이블                | 설명           | 상태       |
| --------------------- | -------------- | ---------- |
| `events`              | 이벤트 정보    | ✅ 사용 중 |
| `profiles`            | 사용자 프로필  | ✅ 사용 중 |
| `event_members`       | 이벤트 참여자  | ✅ 사용 중 |
| `announcements`       | 공지사항       | ✅ 사용 중 |
| `carpool_drivers`     | 카풀 드라이버  | ✅ 사용 중 |
| `carpool_passengers`  | 카풀 승객      | ✅ 사용 중 |
| `settlements`         | 정산 정보      | ✅ 사용 중 |
| `settlement_items`    | 정산 항목      | ✅ 사용 중 |
| `settlement_payments` | 정산 납부 현황 | ✅ 사용 중 |

---

## ⚙️ 주요 개선 사항 (2026-03-07)

### 문제점 해결

- **대시보드**: 더미 데이터 → 실제 DB 쿼리로 변환
  - hostedEvents: `events.host_id = user.id`
  - participatedEvents: `event_members.user_id = user.id` JOIN

- **삭제 기능**: console.log → `deleteEvent` Server Action 연결
  - 확인 대화상자 추가
  - useTransition으로 로딩 상태 관리

- **탭 페이지**: 하드코딩된 더미 데이터 → 실제 DB 쿼리
  - 공지사항: announcements 테이블 + profiles JOIN
  - 참여자: event_members 테이블 + 상태별 분류
  - 카풀: carpool_drivers/carpool_passengers 조회
  - 정산: settlements/settlement_items/settlement_payments 조회

### 아키텍처 일관성

- 모든 페이지가 Server Component로 DB 쿼리 수행
- TypeScript strict mode 유지
- 권한 확인: 각 페이지에서 `event.host_id === user.id` 검증
- Empty State 처리: 데이터 없을 때 명시적 메시지 표시

---

## ✨ 다음 마일스톤

### 단기 (1주)

- [ ] Server Actions 구현 (공지, 멤버, 카풀, 정산)
- [ ] E2E 테스트 작성
- [ ] 실제 테스트 데이터로 검증

### 중기 (2주)

- [ ] 권한/보안 강화 (RLS 정책)
- [ ] 성능 최적화 (캐싱, 인덱싱)
- [ ] 에러 처리 개선

### 장기 (1개월)

- [ ] 모바일 최적화
- [ ] 실시간 기능 (Realtime)
- [ ] 알림 시스템
- [ ] 프로덕션 배포

---

## 🎯 성공 기준

- ✅ Phase 1 완료: 기본 UI 구축
- ✅ Phase 2 UI: 모든 페이지 디자인 (부분 진행 중)
- ✅ Phase 3 DB: 스키마 설계 및 마이그레이션 (진행 중)
- ⏳ Phase 4 통합: 모든 기능을 실제 DB와 연동
- ⏳ 배포: Vercel 프로덕션 배포

---

## 📝 노트

- 더 이상 `lib/dummy-data.ts` 사용 안 함
- 모든 쿼리는 Supabase 클라이언트 사용
- Server Actions는 `[feature]/actions.ts` 패턴 준수
- TypeScript 타입은 `types/database.ts`에서 자동 생성
