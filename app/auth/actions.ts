"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

/**
 * Google OAuth 로그인 Server Action
 * 브라우저를 Google 인증 페이지로 리다이렉트하는 URL을 생성하고 이동
 */
export async function signInWithGoogle() {
  const supabase = await createClient()
  const headersList = await headers()

  // 현재 요청의 origin을 동적으로 감지 (로컬/배포 환경 모두 대응)
  // 로컬 개발 환경은 HTTP를 사용하므로 NODE_ENV로 분기하여 https:// 강제 적용 방지
  const isLocalEnv = process.env.NODE_ENV === "development"
  const forwardedHost = headersList.get("x-forwarded-host")
  const origin = isLocalEnv
    ? (headersList.get("origin") ?? "http://localhost:3000")
    : forwardedHost
      ? `https://${forwardedHost}`
      : (headersList.get("origin") ?? "http://localhost:3000")

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // OAuth 인증 완료 후 콜백 URL
      redirectTo: `${origin}/auth/callback`,
      // Google 계정 선택 화면을 항상 표시 (계정 전환 용이성)
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  })

  if (error) {
    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    // Google 인증 페이지로 리다이렉트
    redirect(data.url)
  }
}
