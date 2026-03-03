import Link from "next/link"
import { Suspense } from "react"

import { AuthButton } from "@/components/auth-button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { hasEnvVars } from "@/lib/utils"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* 네비게이션 헤더 */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center px-5 text-sm">
            {/* 좌측: 서비스명 */}
            <Link
              href="/protected"
              className="font-semibold hover:underline text-base"
            >
              모임 이벤트 관리
            </Link>

            {/* 우측: 인증 버튼 */}
            {!hasEnvVars ? null : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 w-full flex justify-center">
          <div className="w-full max-w-5xl px-5 py-8">{children}</div>
        </div>

        {/* 푸터 */}
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
          <p className="text-muted-foreground">
            Powered by{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              className="font-semibold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  )
}
