# 프로젝트 메모리 - Next.js + Supabase

## 핵심 설정

- Next.js 16+ App Router, Supabase SSR (@supabase/ssr)
- 환경변수: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (anon key 아님)
- DB: profiles 테이블 존재 (id, user_id 기반)

## 인증 패턴

- 이메일 로그인: Client Component에서 `createClient()` 브라우저 클라이언트로 `signInWithPassword` 직접 호출
- 이메일 회원가입: 동일 패턴, `/auth/sign-up-success`로 리다이렉트
- OTP 확인: `app/auth/confirm/route.ts` - `verifyOtp` 사용
- **Google OAuth**: `app/auth/actions.ts` Server Action → `signInWithOAuth` → `app/auth/callback/route.ts`에서 `exchangeCodeForSession`

## OAuth 콜백 URL 패턴

- 콜백 라우트: `app/auth/callback/route.ts`
- 로컬 환경: `x-forwarded-host` 없으면 `origin` 사용
- 배포 환경: `x-forwarded-host` 헤더로 올바른 도메인 감지
- Supabase 콘솔 설정 필수: Redirect URLs에 `{origin}/auth/callback` 등록

## 로컬 Google OAuth ERR_SSL_PROTOCOL_ERROR 해결

- 원인: `actions.ts`에서 `x-forwarded-host` 존재 시 `https://` 강제 적용 → localhost에서 HTTPS 콜백 URL 생성
- 해결 코드: `isLocalEnv = process.env.NODE_ENV === "development"` 로 분기, 로컬에서는 `origin` 헤더만 사용
- Google Cloud Console: Authorized redirect URIs에 `http://localhost:3000/auth/callback` 추가 필수
- Supabase 콘솔: Redirect URLs에 `http://localhost:3000/**` 추가 필수

## 파일 구조 (인증 관련)

- `app/auth/actions.ts` - Google OAuth Server Action
- `app/auth/callback/route.ts` - OAuth 코드→세션 교환
- `app/auth/confirm/route.ts` - 이메일 OTP 확인
- `components/login-form.tsx` - 이메일 + Google 로그인
- `components/sign-up-form.tsx` - 이메일 + Google 회원가입

## 주의사항

- Server Client는 전역 변수에 저장 금지 (Fluid compute 호환)
- `getClaims()`: 빠른 JWT 검증 (DB 조회 없음), `getUser()`: 느리지만 안전한 서버 검증
- Google OAuth 사용 시 Supabase 콘솔 > Authentication > Providers > Google 활성화 필수
