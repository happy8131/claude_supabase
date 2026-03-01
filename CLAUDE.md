# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint (next lint)
npm run lint:fix     # Auto-fix ESLint errors
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting without changes
```

## Code Quality Tools

### 자동화된 코드 품질 검사 (Automated Code Quality)

이 프로젝트는 **Prettier**, **ESLint**, **Husky**, **lint-staged**를 통한 자동화된 코드 품질 검사를 지원합니다:

- **Prettier**: 코드 포맷팅 (일관된 스타일 강제)
- **ESLint**: JavaScript/TypeScript 린팅 (구문 오류 및 코드 품질)
- **simple-import-sort**: Import 문 자동 정렬
- **Husky**: Git 훅 관리 (자동 검사 트리거)
- **lint-staged**: 스테이징된 파일만 검사 (커밋 성능 최적화)

### 코드 스타일 설정 (Code Style Settings)

- **들여쓰기**: 2칸 (스페이스)
- **문자열 따옴표**: 큰따옴표 (`"`)
- **세미콜론**: 없음
- **후행 쉼표**: 활성화 (trailing comma)
- **인코딩**: UTF-8
- **줄 끝**: LF (`\n`)

### 커밋 전 자동 검사 (Pre-commit Hook)

파일을 커밋하면 자동으로:

1. **lint-staged** 실행
2. 스테이징된 파일에 대해:
   - `*.ts,*.tsx`: ESLint 자동 수정 + Prettier 포맷팅
   - `*.js,*.jsx,*.mjs,*.cjs`: ESLint 자동 수정 + Prettier 포맷팅
   - `*.json,*.css,*.md`: Prettier 포맷팅

### Push 전 타입 검사 (Pre-push Hook)

푸시할 때 자동으로:

- `npm run type-check` 실행 (전체 TypeScript 타입 검사)
- 타입 오류가 있으면 푸시 취소

### 수동 코드 품질 검사 (Manual Code Quality Checks)

```bash
# 전체 프로젝트 린팅
npm run lint

# ESLint 자동 수정
npm run lint:fix

# 전체 프로젝트 포맷팅
npm run format

# 포맷팅 검사 (CI/CD용)
npm run format:check

# TypeScript 타입 검사
npm run type-check
```

## Environment Setup

1. Create `.env.local` from `.env.example`
2. Set required variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=[your-project-url]
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[your-publishable-key]
   ```
3. Note: Uses Supabase's new **publishable key format** (not legacy anon key)

## Project Structure

This is a Next.js 15+ app using the App Router with Supabase authentication.

```
app/                    # App Router pages and layouts
├── auth/              # Authentication routes (login, sign-up, password reset, email confirmation)
├── protected/         # Protected routes (requires authentication)
└── page.tsx           # Home page (public)

lib/
├── supabase/
│   ├── client.ts      # Browser client for client-side queries
│   ├── server.ts      # Server client for Server Components/Actions
│   └── proxy.ts       # Session refresh proxy
└── utils.ts           # Utility functions

components/
├── ui/                # shadcn/ui components (Button, Card, Input, etc.)
├── auth-button.tsx    # Auth/logout button component
├── login-form.tsx     # Login form with Supabase Auth
├── sign-up-form.tsx   # Sign-up form with email verification
└── ...other components

types/
└── database.ts        # Auto-generated Supabase database types
```

## Architecture: Supabase Authentication with SSR

This starter uses a **cookie-based authentication pattern** with `@supabase/ssr` for proper Server Component support:

### Key Design Patterns

1. **Dual Supabase Clients**:
   - `lib/supabase/client.ts` - Browser client for client-side operations
   - `lib/supabase/server.ts` - Server client for Server Components and Actions
   - ⚠️ Never put the server client in a global variable; create a new instance per function (especially with Vercel Fluid compute)

2. **Cookie-Based Sessions**:
   - Auth sessions are stored in HTTP-only cookies
   - Makes user sessions available throughout the entire Next.js app (Server Components, Client Components, Route Handlers, Server Actions)
   - The server client automatically reads/writes cookies

3. **Email Verification Flow**:
   - Sign-up sends confirmation email with token
   - `/app/auth/confirm` route handler verifies OTP and confirms email
   - Redirect path specified via `?next=` query parameter

4. **Protected Routes**:
   - `app/protected/layout.tsx` includes auth UI (AuthButton component)
   - Use server-side auth checks to redirect unauthenticated users

## Important Patterns

### Using Supabase Client in Server Components

```typescript
import { createClient } from "@/lib/supabase/server"

export default async function MyComponent() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  // ...
}
```

### Using Supabase Client in Client Components

```typescript
"use client"
import { createClient } from "@/lib/supabase/client"

export default function MyComponent() {
  const supabase = createClient()
  // ...
}
```

### Server Actions for Auth Operations

Auth state changes (sign-up, login, logout) typically use Server Actions with the server client to properly update cookies.

## Styling & UI

- **Framework**: Tailwind CSS with CSS variables for theming
- **Components**: shadcn/ui components (new-york style) in `components/ui/`
- **Dark Mode**: next-themes with class-based dark mode
- **Icon Library**: lucide-react icons

Path aliases for imports: `@/components`, `@/lib`, `@/ui`, etc. (configured in tsconfig.json)

## Key Dependencies

- **next**: Latest version, App Router
- **@supabase/supabase-js**: Supabase client library
- **@supabase/ssr**: Cookie-based auth helpers for Server Components
- **react 19** and **react-dom 19**
- **tailwindcss**: CSS framework
- **next-themes**: Dark mode support
- **lucide-react**: Icon library
- **shadcn/ui**: Pre-built React components

## TypeScript & Configuration

- **tsconfig.json**: Strict mode enabled, path aliases configured (`@/*`)
- **next.config.ts**: Minimal config, `cacheComponents: false` for development
- **components.json**: shadcn/ui configuration (new-york style, RSC enabled)

## Notes on Session Management

- Server client reads cookies from the incoming request
- When modifying auth state (sign-up/logout), the server automatically updates cookies
- The `setAll` method in server client has a try-catch because it may fail in some edge cases (handled by proxy refreshing)
- For production deployment, ensure your Supabase Vercel Integration is connected to automatically set environment variables
