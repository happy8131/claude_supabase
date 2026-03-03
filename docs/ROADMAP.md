# 모임 이벤트 관리 MVP 개발 로드맵

모임 주최자가 공지, 참여자 관리, 카풀, 정산을 하나의 웹에서 처리할 수 있는 소규모 모임 전용 플랫폼

---

## 개요

모임 이벤트 관리 MVP는 수영/헬스/친구 모임을 정기적으로 주관하는 소규모 그룹 주최자와 참여자를 위한 통합 모임 관리 서비스로 다음 기능을 제공합니다:

- **이벤트 생성/관리 (F001)**: 모임 이벤트를 생성하고 공유 링크를 통해 참여자를 모집
- **참여자 관리 (F002)**: 공개 참여 신청 수락, 승인/거절, 정원 관리
- **공지 관리 (F003)**: 주최자가 참여자에게 공지를 전달하는 게시판 기능
- **카풀 매칭 (F004)**: 출발 지역 기반으로 운전자와 탑승자를 자동 매칭
- **1/N 정산 (F005)**: 비용 항목 입력 후 참여자 수 기준 자동 균등 분배

---

## 개발 철학: UI/UX 우선 설계

**순서**: UI/UX 완성 → 디자인 검증 및 개선 → 데이터베이스 연동 → 기능 구현

이 접근법으로 사용자 경험을 빠르게 검증하고 필요한 변경 사항을 반영할 수 있습니다.

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 체크박스로 표시

---

## 개발 단계

### Phase 1: 기본 구조 & 네비게이션

애플리케이션의 기본 구조를 먼저 구축하고 비로그인 사용자도 접근할 수 있는 공개 경로를 설정합니다.

- **Task 001: proxy.ts 공개 경로 설정** - 우선순위
  - `proxy.ts`의 matcher에 공개 경로 예외 처리 추가
    - `/events/share/*` 경로는 비인증 사용자도 접근 가능하도록 설정
    - 기존 정적 파일 제외 패턴 유지
  - `lib/supabase/proxy.ts`에서 공개 경로 목록 관리
    - 인증 없이 접근 가능한 경로 화이트리스트 정의
    - 비인증 접근 시 세션 갱신 시도 없이 통과 처리

- **Task 002: 랜딩 페이지 재작성 (app/page.tsx)**
  - 서비스 소개 섹션 구현
    - 서비스명 및 한 줄 소개 헤더
    - 핵심 기능 5가지 소개 카드 (이벤트, 참여자 관리, 공지, 카풀, 정산)
  - 로그인/회원가입 CTA 버튼 배치
    - 로그인 버튼 → `/auth/login`
    - 회원가입 버튼 → `/auth/sign-up`
  - 로그인 상태 감지: 이미 로그인한 경우 대시보드(`/protected`)로 리다이렉트
  - 반응형 레이아웃 적용 (모바일/데스크톱)

- **Task 003: 대시보드 구현 (app/protected/page.tsx)** - 우선순위
  - 더미 데이터 기반 UI 먼저 구현
    - \"내가 만든 이벤트\" 섹션: 이벤트 카드 목록 (날짜, 제목, 참여 인원, 상태 배지)
    - \"내가 참여한 이벤트\" 섹션: 참여한 이벤트 카드 목록
    - 이벤트 상태 배지: 예정(scheduled) / 완료(completed) / 취소(cancelled)
  - \"새 모임 만들기\" 버튼 → `/protected/events/new`
  - 이벤트 카드 클릭 → `/protected/events/[eventId]`
  - 이벤트 없을 때 빈 상태(empty state) UI 표시
  - `EventCard` 컴포넌트 구현

- **Task 004: 네비게이션 업데이트 (app/protected/layout.tsx)** - 우선순위
  - 서비스명을 \"모임 이벤트 관리\"로 변경
  - 상단 네비게이션 구성
    - 홈(대시보드) 링크 → `/protected`
    - 프로필 메뉴 → `/protected/profile`
    - 로그아웃 버튼
  - DeployButton 및 Next.js 스타터 관련 요소 제거
  - 모바일 반응형 네비게이션 적용 (햄버거 메뉴 또는 하단 탭바 고려)

---

### Phase 2: UI/UX 완성 (더미 데이터)

모든 페이지와 탭의 UI를 더미 데이터로 완성하여 전체 사용자 플로우를 검증합니다. **이 단계에서 Server Action 없이 순수 UI만 구현합니다.**

- **Task 005: 이벤트 생성 페이지 (app/protected/events/new/)** - 우선순위
  - 파일 구성
    - `app/protected/events/new/page.tsx` - 이벤트 생성 폼 페이지
    - `components/events/event-form.tsx` - 재사용 가능한 이벤트 폼 컴포넌트
  - 폼 필드 구현 (UI만)
    - 제목 입력 (필수, 최대 100자, 글자 수 카운터)
    - 설명 입력 (선택, textarea)
    - 날짜/시간 선택 (필수, datetime-local input)
    - 장소 입력 (필수)
    - 최대 인원 입력 (선택, 숫자, 미입력 시 무제한)
    - 승인 방식 토글 (자동 승인 / 주최자 승인 필요)
  - 취소 버튼 → 대시보드로 이동
  - 만들기 버튼은 클릭 해도 동작 없음 (Task 016에서 연결)

- **Task 006: 이벤트 수정 페이지 (app/protected/events/[eventId]/edit/)**
  - 파일 구성
    - `app/protected/events/[eventId]/edit/page.tsx` - 이벤트 수정 폼 페이지
  - `EventForm` 컴포넌트 재사용
  - 더미 이벤트 데이터로 폼 사전 로드
  - 수정/삭제 버튼 UI (클릭 해도 동작 없음)

- **Task 007: 공개 이벤트 상세 페이지 (app/events/share/[token]/)** - 우선순위
  - 파일 구성
    - `app/events/share/[token]/page.tsx` - 공개 이벤트 상세 페이지
  - 더미 이벤트 데이터로 페이지 표시
  - 표시 정보
    - 이벤트 제목, 날짜, 장소, 설명
    - 현재 참여 인원 / 최대 인원
  - 참여 상태별 버튼 분기 (UI만)
    - 비로그인: \"로그인 후 참여 신청\" 버튼
    - 신청 가능: \"참여 신청\" 버튼
    - 승인 대기 중: \"승인 대기 중\" 비활성 버튼
    - 이미 참여 중: \"이벤트 허브 바로가기\" 버튼
    - 정원 마감: \"정원이 마감되었습니다\" 비활성 버튼
  - 모든 버튼은 클릭 해도 동작 없음 (Task 016에서 연결)

- **Task 008: 이벤트 허브 셸 (app/protected/events/[eventId]/)**
  - 파일 구성
    - `app/protected/events/[eventId]/page.tsx` - 이벤트 허브 메인 (탭 컨테이너)
    - `app/protected/events/[eventId]/layout.tsx` - 이벤트 헤더 레이아웃
    - `components/events/event-header.tsx` - 이벤트 헤더 컴포넌트
  - 이벤트 헤더 구현
    - 이벤트 제목, 날짜, 장소, 상태 배지
    - 공유 링크 복사 버튼 (클립보드 API)
  - 탭 네비게이션 구현 (shadcn Tabs 컴포넌트)
    - 공지 탭
    - 참여자 탭 (주최자만 표시)
    - 카풀 탭
    - 정산 탭
    - 설정 탭 (주최자만 표시)
  - 각 탭 내용은 Task 009-012에서 구현

- **Task 009: 공지 탭 UI (app/protected/events/[eventId]/announcements/)**
  - 파일 구성
    - `app/protected/events/[eventId]/announcements/page.tsx` - 공지 탭
    - `components/announcement-card.tsx` - 공지 카드 컴포넌트
    - `components/announcement-form.tsx` - 공지 작성 폼 컴포넌트
  - 공지 목록 UI
    - 고정 공지 상단 표시 (더미 데이터)
    - 공지 카드: 제목, 내용 요약, 작성일
    - 주최자에게만 수정/삭제/고정 버튼 표시 (더미 상태)
  - 공지 작성 폼 (주최자만)
    - 제목 입력
    - 내용 입력
    - 고정 여부 토글
  - 모든 버튼은 동작 없음 (Task 017에서 연결)

- **Task 010: 참여자 관리 탭 UI (app/protected/events/[eventId]/members/)**
  - 파일 구성
    - `app/protected/events/[eventId]/members/page.tsx` - 참여자 탭
    - `components/member-list.tsx` - 참여자 목록 컴포넌트
  - 탭 내 섹션 구성 (더미 데이터)
    - 승인 대기(pending) 목록: 이름, 신청일, 승인/거절 버튼
    - 승인된 참여자(approved) 목록: 이름, 승인일, 강퇴 버튼
    - 대기자(waitlisted) 목록
  - 주최자 외 접근 시 권한 오류 메시지 표시
  - 모든 버튼은 동작 없음

- **Task 011: 카풀 탭 UI (app/protected/events/[eventId]/carpool/)**
  - 파일 구성
    - `app/protected/events/[eventId]/carpool/page.tsx` - 카풀 탭
    - `components/carpool-group.tsx` - 카풀 그룹 카드 컴포넌트
    - `components/carpool-driver-form.tsx` - 운전자 등록 폼
    - `components/carpool-passenger-form.tsx` - 탑승 희망 폼
  - 카풀 현황 표시 (더미 데이터)
    - 지역별 카풀 그룹 카드: 운전자 정보, 탑승 인원, 잔여 좌석
    - 매칭 완료된 탑승자 목록
  - 운전자 등록 폼 UI
    - 출발 지역명 입력
    - 출발 시간 입력
    - 가능 좌석 수 입력
  - 탑승 희망 등록 폼 UI
    - 희망 출발 지역 입력
  - 매칭 처리 버튼 (주최자만, 더미 상태)
  - 모든 버튼은 동작 없음

- **Task 012: 정산 탭 UI (app/protected/events/[eventId]/settlement/)**
  - 파일 구성
    - `app/protected/events/[eventId]/settlement/page.tsx` - 정산 탭
    - `components/settlement-item-form.tsx` - 비용 항목 추가 폼
    - `components/settlement-summary.tsx` - 1인당 금액 요약 카드
    - `components/payment-status-table.tsx` - 납부 현황 테이블
  - 비용 항목 목록 UI (더미 데이터)
    - 항목명, 금액, 선불 담당자 표시
  - 항목 추가 폼 (주최자만)
    - 항목명, 금액, 선불 담당자 선택
  - 1/N 계산 버튼 (주최자만, 클릭 해도 동작 없음)
  - 1인당 금액 요약 카드 (계산 후 표시할 더미 데이터)
  - 납부 현황 테이블 (더미 데이터)
    - 이름, 납부해야 할 금액, 납부 상태
    - \"납부 완료\" 버튼 (본인 항목만, 동작 없음)

---

### Phase 3: 데이터베이스 스키마 & RLS 설정

UI/UX 검증을 마친 후 데이터베이스 기반을 구축합니다.

- **Task 013: Supabase 테이블 마이그레이션** - 우선순위
  - Supabase SQL Editor에서 다음 8개 테이블 생성
    - `events` (이벤트): id, host_id, title, description, event_date, location, max_members, require_approval, share_token, status, created_at
    - `event_members` (참여자): id, event_id, user_id, status, joined_at
    - `announcements` (공지): id, event_id, author_id, title, content, is_pinned, created_at, updated_at
    - `carpool_drivers` (카풀 운전자): id, event_id, driver_id, departure_area, departure_time, available_seats, current_seats, created_at
    - `carpool_passengers` (카풀 탑승자): id, event_id, passenger_id, driver_id, departure_area, status, created_at
    - `settlements` (정산): id, event_id, total_amount, created_at, updated_at
    - `settlement_items` (정산 항목): id, settlement_id, name, amount, paid_by, created_at
    - `settlement_payments` (개인별 납부 현황): id, settlement_id, user_id, amount_owed, status, created_at, updated_at
  - 외래 키 제약 조건 및 인덱스 설정
    - CASCADE DELETE 설정 확인
    - UNIQUE 제약: `share_token`, `event_id + user_id` (event_members), `event_id + driver_id` (carpool_drivers), `event_id + passenger_id` (carpool_passengers), `settlement_id + user_id` (settlement_payments)
  - ENUM 타입 정의
    - event_status: 'published' | 'cancelled' | 'completed'
    - member_status: 'pending' | 'approved' | 'rejected' | 'waitlisted'
    - carpool_passenger_status: 'pending' | 'matched' | 'cancelled'
    - payment_status: 'unpaid' | 'paid'

- **Task 014: Row Level Security(RLS) 정책 설정** - 우선순위
  - 모든 신규 테이블에 RLS 활성화
  - `events` 테이블 RLS
    - SELECT: 인증 사용자만 / published 상태 이벤트는 비인증도 허용
    - INSERT: 인증 사용자 (host_id = auth.uid())
    - UPDATE/DELETE: 주최자만
  - `event_members` 테이블 RLS
    - SELECT: 해당 이벤트 주최자 또는 본인 레코드
    - INSERT: 인증 사용자 (본인 user_id로만 신청)
    - UPDATE: 주최자 (status 변경)
    - DELETE: 주최자 또는 본인
  - `announcements` 테이블 RLS
    - SELECT: 해당 이벤트 승인된 참여자 + 주최자
    - INSERT/UPDATE/DELETE: 주최자만
  - `carpool_drivers`, `carpool_passengers` 테이블 RLS
    - SELECT: 해당 이벤트 승인된 참여자 + 주최자
    - INSERT: 승인된 참여자 (본인 id로만)
    - UPDATE/DELETE: 본인 또는 주최자
  - `settlements`, `settlement_items`, `settlement_payments` 테이블 RLS
    - SELECT: 해당 이벤트 승인된 참여자 + 주최자
    - INSERT/UPDATE/DELETE: 주최자만 (settlement_payments는 UPDATE에서 본인도 가능)

- **Task 015: TypeScript 타입 업데이트** - 우선순위
  - `types/database.ts` 파일에 신규 테이블 타입 추가
    - 각 테이블의 Row/Insert/Update 타입
    - ENUM 타입 정의 (Enums 섹션)
  - 편의 타입 alias 추가
    - `Event`, `EventInsert`, `EventUpdate`
    - `EventMember`, `EventMemberInsert`, `EventMemberUpdate`
    - `Announcement`, `AnnouncementInsert`, `AnnouncementUpdate`
    - `CarpoolDriver`, `CarpoolDriverInsert`, `CarpoolDriverUpdate`
    - `CarpoolPassenger`, `CarpoolPassengerInsert`, `CarpoolPassengerUpdate`
    - `Settlement`, `SettlementInsert`, `SettlementUpdate`
    - `SettlementItem`, `SettlementItemInsert`, `SettlementItemUpdate`
    - `SettlementPayment`, `SettlementPaymentInsert`, `SettlementPaymentUpdate`

---

### Phase 4: 기능 구현 & 데이터 연동

이제 UI에 실제 데이터베이스를 연결하고 비즈니스 로직을 구현합니다.

- **Task 016: 이벤트 생성/수정/참여 Server Actions 구현**
  - 파일 구성
    - `app/protected/events/new/actions.ts`
    - `app/protected/events/[eventId]/edit/actions.ts`
    - `app/events/share/[token]/actions.ts`
  - Server Action 구현
    - `createEvent`: 유효성 검사, share_token 생성, INSERT
    - `updateEvent`: 주최자만 UPDATE
    - `deleteEvent`: 주최자만 DELETE
    - `applyToEvent`: 참여 신청, require_approval에 따라 status 결정, 정원 초과 시 waitlisted
  - Task 005-007의 UI를 실제 기능으로 연결

  **테스트 체크리스트**
  - [ ] Playwright: 이벤트 생성 완료 후 이벤트 허브 리다이렉트
  - [ ] Playwright: 필수 필드 미입력 시 유효성 검사 에러
  - [ ] Playwright: 비로그인 상태에서 공개 이벤트 페이지 접근 후 참여 신청 → 로그인 페이지
  - [ ] Playwright: 자동 승인 이벤트 vs 승인 필요 이벤트 동작 확인
  - [ ] Playwright: 정원 초과 시 waitlisted 처리

- **Task 017: 대시보드 & 모든 탭 데이터 연동**
  - `app/protected/page.tsx` 업데이트
    - Supabase 쿼리로 실제 이벤트 목록 로드
    - 더미 데이터 제거
  - 각 탭 Server Actions 구현
    - `app/protected/events/[eventId]/members/actions.ts`: approveMember, rejectMember, removeMember
    - `app/protected/events/[eventId]/announcements/actions.ts`: createAnnouncement, updateAnnouncement, deleteAnnouncement, togglePin
    - `app/protected/events/[eventId]/carpool/actions.ts`: registerDriver, registerPassenger, matchCarpool, cancelCarpool
    - `app/protected/events/[eventId]/settlement/actions.ts`: addSettlementItem, deleteSettlementItem, calculateSettlement, markAsPaid
  - Task 009-012의 UI를 실제 기능으로 연결

  **테스트 체크리스트**
  - [ ] Playwright: 대시보드에서 생성한 이벤트 목록 표시
  - [ ] Playwright: 참여자 승인/거절/강퇴 처리
  - [ ] Playwright: 공지 작성/수정/삭제/고정 처리
  - [ ] Playwright: 카풀 운전자/탑승자 등록 및 매칭 처리
  - [ ] Playwright: 정산 항목 추가, 1/N 계산, 납부 처리
  - [ ] Playwright: 권한 검증 (주최자만 가능한 기능 확인)

- **Task 018: 프로필 업데이트 & 전반적인 UX 개선**
  - `app/protected/profile/page.tsx` 업데이트
    - full_name, username 필수로 강조
    - Server Action: updateProfile
  - UI/UX 개선
    - 로딩 상태 처리 (useFormStatus, useTransition)
    - 에러 바운더리 설정
    - 성공/실패 Toast 알림
    - 빈 상태(Empty State) UI 통일
    - 모바일 반응형 최종 점검
    - 접근성 개선 (aria-label, 키보드 네비게이션)

  **테스트 체크리스트**
  - [ ] Playwright: 전체 주최자 플로우 E2E (로그인 → 이벤트 생성 → 공유 → 참여자 승인 → 공지 → 카풀 → 정산)
  - [ ] Playwright: 전체 참여자 플로우 E2E (공유 링크 → 로그인 → 참여 신청 → 이벤트 허브 접근)
  - [ ] Playwright: 모바일 뷰포트(390px)에서 주요 플로우
  - [ ] Playwright: 에러 시나리오 (네트워크 오류, 권한 오류)
  - [ ] Playwright: 로딩 상태 및 성공 알림

---

## 기술 스택 요약

| 구분          | 기술                               |
| ------------- | ---------------------------------- |
| 프레임워크    | Next.js 15 (App Router)            |
| 언어          | TypeScript 5.6+                    |
| UI 라이브러리 | React 19                           |
| 스타일링      | Tailwind CSS v3                    |
| 컴포넌트      | shadcn/ui (new-york style)         |
| 아이콘        | Lucide React                       |
| 다크모드      | next-themes                        |
| 백엔드        | Supabase (PostgreSQL + Auth + RLS) |
| SSR 인증      | @supabase/ssr                      |
| 배포          | Vercel                             |

---

## 페이지/파일 구조 계획

```
app/
├── page.tsx                                    # 랜딩 페이지 (Task 002)
├── events/
│   └── share/
│       └── [token]/
│           ├── page.tsx                        # 공개 이벤트 상세 (Task 007)
│           └── actions.ts                      # 참여 신청 Server Action (Task 016)
└── protected/
    ├── layout.tsx                              # 네비게이션 (Task 004)
    ├── page.tsx                                # 대시보드 (Task 003, 017)
    ├── profile/
    │   ├── page.tsx                            # 프로필 페이지 (Task 018)
    │   └── actions.ts
    └── events/
        ├── new/
        │   ├── page.tsx                        # 이벤트 생성 (Task 005)
        │   └── actions.ts                      # 이벤트 생성 Server Action (Task 016)
        └── [eventId]/
            ├── layout.tsx                      # 이벤트 헤더 (Task 008)
            ├── page.tsx                        # 이벤트 허브 탭 셸 (Task 008)
            ├── edit/
            │   ├── page.tsx                    # 이벤트 수정 (Task 006)
            │   └── actions.ts                  # 이벤트 수정 Server Action (Task 016)
            ├── members/
            │   ├── page.tsx                    # 참여자 탭 (Task 010)
            │   └── actions.ts                  # 참여자 관리 Server Actions (Task 017)
            ├── announcements/
            │   ├── page.tsx                    # 공지 탭 (Task 009)
            │   └── actions.ts                  # 공지 Server Actions (Task 017)
            ├── carpool/
            │   ├── page.tsx                    # 카풀 탭 (Task 011)
            │   └── actions.ts                  # 카풀 Server Actions (Task 017)
            └── settlement/
                ├── page.tsx                    # 정산 탭 (Task 012)
                └── actions.ts                  # 정산 Server Actions (Task 017)

types/
└── database.ts                                 # DB 타입 (Task 015)

components/
├── events/
│   ├── event-card.tsx                         # 이벤트 카드 (Task 003)
│   ├── event-form.tsx                         # 이벤트 폼 (Task 005, 006)
│   ├── event-header.tsx                       # 이벤트 헤더 (Task 008)
│   ├── announcement-card.tsx                  # 공지 카드 (Task 009)
│   ├── announcement-form.tsx                  # 공지 폼 (Task 009)
│   ├── member-list.tsx                        # 참여자 목록 (Task 010)
│   ├── carpool-group.tsx                      # 카풀 그룹 (Task 011)
│   ├── carpool-driver-form.tsx                # 운전자 폼 (Task 011)
│   ├── carpool-passenger-form.tsx             # 탑승 폼 (Task 011)
│   ├── settlement-item-form.tsx               # 항목 폼 (Task 012)
│   ├── settlement-summary.tsx                 # 정산 요약 (Task 012)
│   └── payment-status-table.tsx               # 납부 현황 (Task 012)

proxy.ts                                        # 공개 경로 설정 (Task 001)
```

---

## 작업 현황 요약

| Phase   | Task     | 제목                                 | 상태   |
| ------- | -------- | ------------------------------------ | ------ |
| Phase 1 | Task 001 | proxy.ts 공개 경로 설정              | 미완료 |
| Phase 1 | Task 002 | 랜딩 페이지 재작성                   | 미완료 |
| Phase 1 | Task 003 | 대시보드 구현 (더미 데이터)          | 미완료 |
| Phase 1 | Task 004 | 네비게이션 업데이트                  | 미완료 |
| Phase 2 | Task 005 | 이벤트 생성 페이지 UI                | 미완료 |
| Phase 2 | Task 006 | 이벤트 수정 페이지 UI                | 미완료 |
| Phase 2 | Task 007 | 공개 이벤트 상세 페이지 UI           | 미완료 |
| Phase 2 | Task 008 | 이벤트 허브 셸                       | 미완료 |
| Phase 2 | Task 009 | 공지 탭 UI                           | 미완료 |
| Phase 2 | Task 010 | 참여자 관리 탭 UI                    | 미완료 |
| Phase 2 | Task 011 | 카풀 탭 UI                           | 미완료 |
| Phase 2 | Task 012 | 정산 탭 UI                           | 미완료 |
| Phase 3 | Task 013 | Supabase 테이블 마이그레이션         | 미완료 |
| Phase 3 | Task 014 | RLS 정책 설정                        | 미완료 |
| Phase 3 | Task 015 | TypeScript 타입 업데이트             | 미완료 |
| Phase 4 | Task 016 | 이벤트 생성/수정/참여 Server Actions | 미완료 |
| Phase 4 | Task 017 | 모든 탭 데이터 연동                  | 미완료 |
| Phase 4 | Task 018 | 프로필 & UX 개선                     | 미완료 |

---

## 개발 완료 기준

모든 18개 Task가 완료되고 다음을 만족할 때:

- ✅ 모든 페이지가 반응형 디자인 적용
- ✅ 모든 기능이 Server Actions으로 구현
- ✅ RLS 정책으로 권한 관리 완료
- ✅ Playwright E2E 테스트 모두 통과
- ✅ 사용자 플로우(주최자/참여자) 검증 완료
