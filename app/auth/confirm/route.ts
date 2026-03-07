import { type EmailOtpType } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { type NextRequest } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/protected"

  const supabase = await createClient()

  // 새 버전: token_hash + type 파라미터
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      redirect(next)
    } else {
      redirect(
        `/auth/error?error=${encodeURIComponent(error?.message || "Verification failed")}`,
      )
    }
  }

  // 구 버전 또는 대체: code 파라미터
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      redirect(next)
    } else {
      redirect(
        `/auth/error?error=${encodeURIComponent(error?.message || "Verification failed")}`,
      )
    }
  }

  // 둘 다 없으면 오류
  redirect(
    `/auth/error?error=${encodeURIComponent(
      "No verification token or code provided",
    )}`,
  )
}
