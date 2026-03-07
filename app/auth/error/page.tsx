import Link from "next/link"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams
  const error = params?.error || "알 수 없는 오류"

  const isTokenError =
    error.includes("token") ||
    error.includes("hash") ||
    error.includes("code") ||
    error.includes("No verification")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">오류 메시지:</p>
        <p className="font-medium text-destructive">{error}</p>
      </div>

      {isTokenError && (
        <div className="rounded-lg bg-blue-50 p-3 text-sm space-y-2">
          <p className="font-medium text-blue-900">💡 해결 방법:</p>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>이메일의 링크가 만료되었을 수 있습니다</li>
            <li>
              <Link
                href="/auth/sign-up"
                className="underline hover:text-blue-600"
              >
                다시 회원가입
              </Link>
              을 시도해주세요
            </li>
            <li>여전히 문제가 있으면 이메일 주소를 확인해주세요</li>
          </ul>
        </div>
      )}

      <div className="rounded-lg bg-gray-50 p-3 text-xs text-muted-foreground space-y-1">
        <p>🔍 기술 정보:</p>
        <code className="block break-words font-mono bg-white p-2 rounded">
          {error}
        </code>
      </div>
    </div>
  )
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">인증 오류</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Suspense>
                <ErrorContent searchParams={searchParams} />
              </Suspense>

              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/auth/sign-up">회원가입</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/auth/login">로그인</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
