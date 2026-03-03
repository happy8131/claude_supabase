import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { AuthButton } from "@/components/auth-button"
import { FeatureCard } from "@/components/landing/feature-card"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { createClient } from "@/lib/supabase/server"
import { hasEnvVars } from "@/lib/utils"
import {
  Bell,
  Calendar,
  DollarSign,
  Users,
  Wind,
} from "lucide-react"

async function CheckAuth() {
  if (!hasEnvVars) {
    return null
  }

  // 이미 로그인한 사용자는 대시보드로 리다이렉트
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/protected")
  }

  return null
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* 네비게이션 헤더 */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center px-5 text-sm">
            {/* 좌측: 서비스명 */}
            <Link href="/" className="font-semibold text-base hover:underline">
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
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-5xl px-5 py-20 flex flex-col items-center gap-12">
            {/* 영웅 섹션 */}
            <section className="text-center space-y-6">
              <h1 className="text-5xl font-bold tracking-tight">
                모임 이벤트 관리
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                소규모 모임을 쉽게 관리하세요. 이벤트 생성, 참여자 관리, 공지,
                카풀, 정산을 한곳에서 처리합니다.
              </p>
            </section>

            {/* 기능 카드 */}
            <section className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <FeatureCard
                  icon={<Calendar className="w-8 h-8 text-blue-500" />}
                  title="이벤트 관리"
                  description="모임 이벤트를 쉽게 생성하고 공유 링크로 참여자를 모집합니다"
                />
                <FeatureCard
                  icon={<Users className="w-8 h-8 text-green-500" />}
                  title="참여자 관리"
                  description="참여 신청을 승인/거절하고 정원을 효율적으로 관리합니다"
                />
                <FeatureCard
                  icon={<Bell className="w-8 h-8 text-yellow-500" />}
                  title="공지 기능"
                  description="변경사항을 빠르게 공지하고 중요한 정보를 고정합니다"
                />
                <FeatureCard
                  icon={<Wind className="w-8 h-8 text-purple-500" />}
                  title="카풀 매칭"
                  description="출발 지역 기반으로 운전자와 탑승자를 자동으로 매칭합니다"
                />
                <FeatureCard
                  icon={<DollarSign className="w-8 h-8 text-red-500" />}
                  title="1/N 정산"
                  description="비용을 항목별로 입력하면 자동으로 공평하게 분배합니다"
                />
              </div>
            </section>

            {/* CTA 버튼 */}
            <section className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link href="/auth/login">
                <Button size="lg" className="w-full sm:w-auto">
                  로그인
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  회원가입
                </Button>
              </Link>
            </section>
          </div>
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

      <Suspense>
        <CheckAuth />
      </Suspense>
    </main>
  )
}
