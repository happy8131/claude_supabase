# AI Development Guidelines - Next.js + Supabase App

This document provides AI agents with project-specific rules, standards, and decision-making criteria for development tasks.

## Project Overview

**Purpose**: Next.js 15+ full-stack web application with Supabase backend and authentication

**Technology Stack**:

- Frontend: React 19, Next.js 15+ (App Router)
- Backend: Supabase (PostgreSQL, Auth)
- Styling: Tailwind CSS, shadcn/ui, next-themes
- Development Tools: TypeScript, ESLint, Prettier, Husky, lint-staged

**Core Functionality**:

- User authentication (Email + Google OAuth)
- Protected routes and user sessions
- Email verification flow
- Role-based access control (via Supabase)

## Code Quality Standards

### Formatting & Linting

**Automatic Pre-commit Checks**:

- ESLint auto-fix for `*.ts,*.tsx,*.js,*.jsx,*.mjs,*.cjs`
- Prettier format for `*.ts,*.tsx,*.js,*.jsx,*.mjs,*.cjs,*.json,*.css,*.md`

**Pre-push Checks**:

- Full TypeScript type checking (`npm run type-check`)

**Manual Commands**:

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint errors
npm run format        # Run Prettier
npm run format:check  # Check formatting
npm run type-check    # TypeScript validation
```

### Style Configuration

| Setting        | Value        | Notes                            |
| -------------- | ------------ | -------------------------------- |
| Indentation    | 2 spaces     | Never use tabs                   |
| Quotes         | Double (`"`) | Single quotes auto-converted     |
| Semicolons     | None         | Automatically removed            |
| Trailing Comma | Enabled      | Multiline elements require comma |
| Line Ending    | LF (`\n`)    | Windows CRLF auto-converted      |
| Encoding       | UTF-8        | Always use UTF-8                 |
| Import Sort    | Automatic    | Via simple-import-sort plugin    |

### Language & Comments

- **Code**: English (variables, functions, types)
- **Comments**: Korean (한국어)
- **Commit Messages**: Korean with emoji prefix
- **Documentation**: Korean (한글)

---

## Architecture & Project Structure

### Directory Structure

```
app/
├── auth/              # Authentication routes (login, signup, password-reset, confirm)
├── api/              # Route handlers (endpoints)
├── protected/        # Protected routes (requires authentication)
│   ├── layout.tsx    # Auth UI wrapper, session checks
│   ├── page.tsx      # Protected dashboard
│   └── ...other pages
└── page.tsx          # Public home page

lib/supabase/
├── client.ts         # Browser client (use in client components)
├── server.ts         # Server client (use in server components/actions)
└── proxy.ts          # Session refresh middleware

components/
├── ui/              # shadcn/ui components (auto-generated)
├── auth-button.tsx  # Auth/logout button
├── login-form.tsx   # Login form component
├── sign-up-form.tsx # Sign-up form component
└── ...other components

types/
└── database.ts      # Auto-generated Supabase types (Database.json schema)

styles/
└── globals.css      # Global Tailwind styles

.env.example         # Environment variables template
.env.local          # Local env vars (DO NOT COMMIT)
next.config.ts      # Next.js configuration
tsconfig.json       # TypeScript configuration
components.json     # shadcn/ui configuration
```

---

## Architecture Patterns

### 1. Supabase Client Usage (CRITICAL)

**Rule**: Always use the correct Supabase client for the execution context.

**Server Components / Server Actions**:

```typescript
import { createClient } from "@/lib/supabase/server"

export default async function MyComponent() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  // Server-side logic here
}
```

**Client Components**:

```typescript
"use client"
import { createClient } from "@/lib/supabase/client"

export default function MyComponent() {
  const supabase = createClient()
  // Client-side logic here
}
```

**⚠️ CRITICAL**:

- **NEVER** use `lib/supabase/server.ts` in client components
- **NEVER** store server client in global variables
- Always create a new instance per function call
- Server client reads cookies from incoming request context

### 2. Authentication State Management

**Pattern**: Use Server Components for auth checks, Server Actions for state changes.

**Protected Route Pattern** (`app/protected/layout.tsx`):

```typescript
export default async function ProtectedLayout() {
  const supabase = await createClient()
  const { data: user, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }
  // Render protected content
}
```

**Auth State Changes** (Sign-up, Login, Logout):

- Always use Server Actions
- Server client automatically updates HTTP-only cookies
- No manual cookie management needed

**Session Verification**:

- Use `supabase.auth.getUser()` for server-side checks
- Use `supabase.auth.getSession()` to verify session validity
- Session is cookie-based, available across entire app

### 3. Component Composition

**Server Components (Default)**:

- Use for data fetching and auth checks
- Use for database queries
- Cannot use hooks or event handlers
- File: no "use client" directive

**Client Components** (When needed):

- Use for interactivity (forms, buttons, state)
- Use for event handlers and hooks
- Use for client-side data manipulation
- File: Must have `"use client"` directive at top

**Decision Tree**:

1. Does component fetch data or check auth? → **Server Component**
2. Does component need interactivity or state? → **Client Component**
3. Default to Server Components; convert only if needed

### 4. Email Verification Flow

**Current Flow**:

1. User signs up with email
2. Supabase sends confirmation email with OTP token
3. User clicks link: `/app/auth/confirm?token=xxx&next=/protected`
4. Route handler verifies token and confirms email
5. Redirect to `?next` parameter (user-specified page)

**Do not change** this pattern without explicit requirements.

---

## File Interaction Standards

### Multi-File Modification Rules

**When modifying these files, ALWAYS check dependent files**:

| File Modified                           | Check/Update These Files                             | Reason                                           |
| --------------------------------------- | ---------------------------------------------------- | ------------------------------------------------ |
| `app/auth/*`                            | `lib/supabase/server.ts`, `app/protected/layout.tsx` | Auth routes may affect session flow              |
| `lib/supabase/server.ts` or `client.ts` | All components using Supabase                        | Client initialization changes affect all queries |
| `types/database.ts`                     | All files using types from database                  | Type changes affect multiple components          |
| `.env.example`                          | Update any docs mentioning env vars                  | Keep docs and example in sync                    |
| `next.config.ts`                        | `tsconfig.json`, `components.json`                   | Config interdependencies                         |
| `app/protected/layout.tsx`              | Check all `app/protected/*` routes                   | Layout changes affect all protected pages        |

### Dependencies Map

```
lib/supabase/server.ts
  ├── app/auth/* (auth routes)
  ├── app/protected/layout.tsx (session checks)
  └── All Server Components using auth

lib/supabase/client.ts
  ├── All Client Components
  └── Forms and interactive components

types/database.ts
  ├── All components with database types
  ├── Server actions
  └── API routes

app/protected/layout.tsx
  ├── AuthButton component
  ├── All app/protected/* routes
  └── Protected route UI
```

---

## Implementation Standards

### 1. Import Aliases

**RULE**: Use `@/` alias prefix for all imports. NEVER use relative paths.

**Correct**:

```typescript
import { createClient } from "@/lib/supabase/server"
import { AuthButton } from "@/components/auth-button"
import type { Database } from "@/types/database"
```

**Incorrect** (Do NOT do this):

```typescript
import { createClient } from "../../lib/supabase/server"
import { AuthButton } from "../auth-button"
```

**Configured Aliases**:

- `@/app` → `app/`
- `@/components` → `components/`
- `@/lib` → `lib/`
- `@/types` → `types/`
- `@/styles` → `styles/`

### 2. TypeScript Rules

**RULE**: Never disable TypeScript strict mode. All types must be explicitly defined.

**Required**:

- `strict: true` in `tsconfig.json`
- Explicit return types for functions
- Complete type definitions for objects and APIs
- No `any` type usage without justification

**Correct**:

```typescript
interface User {
  id: string
  email: string
  created_at: string
}

export async function getUser(): Promise<User | null> {
  // ...
}
```

**Incorrect**:

```typescript
export async function getUser(): Promise<any> {
  // ❌
  // ...
}
```

### 3. Tailwind CSS & Styling

**RULE**: Use Tailwind utility classes. Never use raw CSS strings without justification.

**Correct**:

```typescript
<div className="flex items-center justify-between gap-4 p-4">
  <h1 className="text-2xl font-bold">Title</h1>
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
    Click me
  </button>
</div>
```

**Incorrect**:

```typescript
<div style={{display: 'flex', justifyContent: 'space-between'}}>  // ❌
  ...
</div>
```

**Color Theming**:

- Use CSS variables for theme colors (defined in `globals.css`)
- Support dark mode via `next-themes` (class-based)
- Test components in both light and dark modes

### 4. UI Components

**Priority for UI Implementation**:

1. **First**: Check if shadcn/ui has the component
2. **Second**: Use existing project components
3. **Last**: Create new custom component (with strong justification)

**shadcn/ui Usage**:

- Components located in `components/ui/`
- Install via: `npx shadcn-ui@latest add <component-name>`
- Auto-formatted via Prettier post-installation
- Do NOT manually modify generated components

**Custom Component Location**:

```
components/
├── ui/              # shadcn/ui (auto-generated)
├── auth/            # Auth-related components
├── layout/          # Layout components
├── forms/           # Form components
└── shared/          # Shared custom components
```

### 5. Forms & Input Validation

**Pattern**: Use React Hook Form with shadcn/ui form components.

**Structure**:

- Form schema validation (via Zod/Superstruct)
- Server-side validation in Server Actions
- Client-side validation via React Hook Form
- Error messages displayed near inputs

**Never**:

- Trust client-side validation alone
- Submit unvalidated data to server
- Store sensitive data in form state

### 6. API Routes & Route Handlers

**Location**: `app/api/[route]/route.ts`

**Rules**:

- Use Next.js Route Handlers (not Pages API)
- Always validate request method (GET, POST, etc.)
- Validate and sanitize all inputs
- Return proper HTTP status codes
- Handle errors gracefully

**Pattern**:

```typescript
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const data = await request.json()

    // Validate input
    if (!data.email) {
      return Response.json({ error: "Email required" }, { status: 400 })
    }

    // Process...
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}
```

### 7. Environment Variables

**Public Variables** (`NEXT_PUBLIC_*`):

- Exposed to browser
- Used for Supabase URL and publishable key
- Can be committed to repo

**Secret Variables**:

- Never expose to browser
- Store in `.env.local` (DO NOT COMMIT)
- Used for API keys, secrets, service tokens

**Required Variables** (in `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

**When Adding New Variables**:

1. Define in `.env.local` (development)
2. Add template to `.env.example`
3. Update environment setup docs
4. Never hardcode values in code

---

## Decision-Making Standards for AI

### Ambiguity Resolution Priority

When requirements are ambiguous, use this decision tree:

1. **Check Project Precedent**: Is there an existing pattern for this in the codebase?
   - YES → Follow the established pattern
   - NO → Continue to step 2

2. **Check CLAUDE.md Instructions**: Do the CLAUDE.md instructions provide guidance?
   - YES → Follow the instructions
   - NO → Continue to step 3

3. **Default to Architecture Patterns**: Which pattern (Server Component, Client Component, etc.) best fits?
   - Apply the appropriate pattern
   - Document reasoning in comments if non-obvious

### Feature Implementation Checklist

When implementing a new feature, always:

- [ ] Identify where data fetching happens (server or client)
- [ ] Determine if authentication is required
- [ ] Plan which components are server vs client
- [ ] Verify TypeScript types are complete
- [ ] Test in both light and dark modes
- [ ] Run `npm run format` and `npm run lint:fix`
- [ ] Verify no Tailwind class conflicts
- [ ] Check multi-file dependencies
- [ ] Ensure error handling for API calls

### Component Conversion Decision

**Convert to Client Component (`"use client"`) only if**:

- Component uses React hooks (useState, useEffect, etc.)
- Component has event handlers (onClick, onChange, etc.)
- Component needs local state management
- Component reads browser APIs (localStorage, window, etc.)

**Keep as Server Component if**:

- Component only displays static content
- Component fetches data on render
- Component checks authentication
- Component queries database
- Component only receives props

---

## Prohibited Actions & Anti-Patterns

### Strict Prohibitions

**❌ NEVER DO**:

1. **Server Client Misuse**
   - Use `lib/supabase/server.ts` in client components
   - Store server client in global variables
   - Reuse server client instances across requests

2. **TypeScript Violations**
   - Disable strict mode in `tsconfig.json`
   - Use `any` type without explicit justification
   - Skip type definitions for function parameters/returns
   - Use `// @ts-ignore` to suppress errors

3. **Import Violations**
   - Use relative paths (`../../lib/...`)
   - Mix absolute and relative imports
   - Import from `node_modules` without installing dependency

4. **Configuration Tampering**
   - Modify ESLint rules without justification
   - Change Prettier formatting settings
   - Alter Next.js config without documentation
   - Change `cacheComponents` setting in `next.config.ts`

5. **Authentication Violations**
   - Hardcode user IDs or session tokens
   - Store tokens in localStorage (use cookies)
   - Skip email verification steps
   - Modify authentication flow without requirements

6. **State Management Anti-Patterns**
   - Store auth state in client-side context only
   - Use Context API for large data trees (use Server Components)
   - Create Redux/Zustand stores without justification
   - Manage user session state on client alone

7. **Dependency Management**
   - Add new packages without checking existing ecosystem
   - Use deprecated packages or old versions
   - Install multiple packages for same functionality
   - Commit `node_modules/` to git

8. **Data & Security**
   - Hardcode API keys, tokens, or credentials
   - Commit `.env.local` to git
   - Log sensitive user data to console
   - Send unvalidated user input to database

9. **File Structure Violations**
   - Create new root-level directories without justification
   - Scatter components across random folders
   - Mix pages and components in `app/` directory
   - Create conflicting filenames or routes

10. **Styling Violations**
    - Use inline styles with `style={{...}}`
    - Use `className` with hardcoded pixel values
    - Mix Tailwind, CSS Modules, and inline styles
    - Create theme colors outside CSS variables

---

## Workflow Standards

### Development Workflow

1. **Read Existing Code**: Understand how similar features are implemented
2. **Plan Changes**: Identify all affected files and dependencies
3. **Implement**: Make changes with consistent style
4. **Format & Lint**: Run `npm run format` and `npm run lint:fix`
5. **Type Check**: Run `npm run type-check`
6. **Test**: Verify functionality works as expected
7. **Commit**: Use emoji + Korean message format

### Commit Message Format

```
<emoji> <type>(<scope>): <description in Korean>

<optional body in Korean>
```

**Emoji Guide**:

- ✨ `feat`: New feature
- 🐛 `fix`: Bug fix
- 📝 `docs`: Documentation
- 🎨 `style`: Code formatting
- ♻️ `refactor`: Refactoring
- ⚡ `perf`: Performance improvement
- ✅ `test`: Tests
- 🔧 `chore`: Configuration

**Example**:

```
✨ feat(auth): Google OAuth 로그인 추가
```

### Testing Standards

- **Unit Tests**: For utility functions and business logic
- **Integration Tests**: For API routes and database operations
- **Manual Testing**: For UI components and user flows
- **Type Checking**: Always run before committing

---

## Tech Stack & Dependencies

### Core Dependencies

| Package                 | Purpose           | Notes                    |
| ----------------------- | ----------------- | ------------------------ |
| `react 19`              | UI library        | Latest version           |
| `react-dom 19`          | React DOM         | Must match React version |
| `next 15+`              | Framework         | App Router enabled       |
| `@supabase/supabase-js` | Supabase client   | Main DB/Auth client      |
| `@supabase/ssr`         | Cookie-based auth | Required for SSR         |
| `tailwindcss`           | Styling framework | Utility-first CSS        |
| `shadcn/ui`             | UI components     | Pre-built components     |
| `next-themes`           | Dark mode         | Class-based theming      |
| `lucide-react`          | Icons             | Icon library             |
| `typescript`            | Type checker      | Strict mode enabled      |

### Development Dependencies

| Package              | Purpose           |
| -------------------- | ----------------- |
| `eslint`             | Linting           |
| `prettier`           | Formatting        |
| `husky`              | Git hooks         |
| `lint-staged`        | Pre-commit checks |
| `simple-import-sort` | Import sorting    |

**Adding New Dependencies**:

- Prefer built-in solutions (e.g., Next.js features)
- Check if existing packages provide functionality
- Minimize bundle size impact
- Ensure TypeScript support

---

## Special Cases & Notes

### Google OAuth Integration

**Status**: Implemented in recent commits

**Key Files**:

- `app/auth/login` - Login UI with Google option
- `lib/supabase/server.ts` - OAuth provider configuration
- Environment variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (if needed)

**Do Not**:

- Change OAuth provider without requirements
- Modify OAuth configuration without testing
- Hardcode OAuth credentials

### Email Verification Flow

**Status**: Implemented and working

**Flow**:

1. User signs up → confirmation email sent
2. User clicks email link → `/app/auth/confirm?token=xxx&next=/path`
3. Route handler verifies and confirms email
4. Session created, redirect to `?next` page

**Do Not**:

- Skip email verification requirement
- Auto-verify emails without confirmation
- Store OTP tokens insecurely

### Dark Mode Support

**Status**: Enabled via `next-themes`

**Pattern**:

- Use CSS variables for colors (defined in `globals.css`)
- Test all components in light and dark modes
- Use `dark:` Tailwind prefix for dark-mode styles

---

## Escalation & Error Handling

### When Facing Obstacles

1. **Read Related Code**: Check similar implementations
2. **Check Documentation**: Review CLAUDE.md and this document
3. **Research**: Use web search for framework documentation
4. **Test Incrementally**: Make small changes, test each step
5. **Ask for Clarification**: Request user guidance if fundamentally blocked

### Common Error Scenarios

| Error                             | Cause                            | Solution                                      |
| --------------------------------- | -------------------------------- | --------------------------------------------- |
| `createClient is not defined`     | Wrong import path or context     | Verify correct import and execution context   |
| `Supabase client not initialized` | Missing `await` on server client | Add `await` before `createClient()`           |
| `Type error on database types`    | Outdated auto-generated types    | Regenerate types from Supabase schema         |
| `Form not submitting`             | Missing Server Action            | Create proper Server Action with "use server" |
| `Auth state not persisting`       | Cookie not set correctly         | Check Supabase Auth configuration             |

---

## Summary

This document defines AI development standards for this Next.js + Supabase project. Key principles:

- **Architecture**: Server Components default, Client Components for interactivity
- **Authentication**: SSR with cookie-based sessions, proper client isolation
- **Code Quality**: Strict TypeScript, consistent formatting, mandatory pre-commit checks
- **File Management**: Import aliases only, multi-file coordination awareness
- **UI**: Tailwind + shadcn/ui, dark mode support required
- **Security**: No hardcoded secrets, proper validation, server-side checks
- **Workflow**: Read code → Plan → Implement → Format → Type-check → Commit

When in doubt, prefer Server Components, explicit types, and established project patterns.
