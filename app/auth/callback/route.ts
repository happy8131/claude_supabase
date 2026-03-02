import { NextResponse } from "next/server"
import { type NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/server"

/**
 * Google OAuth 콜백 처리 라우트 핸들러
 * Supabase가 OAuth 인증 후 이 URL로 리다이렉트함
 * code를 세션으로 교환하고 사용자를 최종 목적지로 리다이렉트
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  // Supabase OAuth 콜백에서 전달되는 인증 코드
  const code = searchParams.get("code")
  // 로그인 성공 후 리다이렉트할 경로 (기본값: /protected)
  const next = searchParams.get("next") ?? "/protected"

  if (code) {
    const supabase = await createClient()

    // OAuth 인증 코드를 세션으로 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 외부 URL이 아닌 경우 origin을 붙여서 절대 URL로 변환
      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"

      if (isLocalEnv) {
        // 로컬 환경: origin 사용
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // 프록시/배포 환경: x-forwarded-host 헤더 사용
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // 오류 발생 시 에러 페이지로 리다이렉트
  return NextResponse.redirect(
    `${origin}/auth/error?error=OAuth 인증에 실패했습니다`,
  )
}
