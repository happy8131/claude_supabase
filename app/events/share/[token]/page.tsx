"use client"

import { useActionState, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Calendar, MapPin, Users } from "lucide-react"
import { applyToEvent } from "./actions"

export default function ShareEventPage() {
  const params = useParams()
  const token = params.token as string
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 이벤트 데이터 로드
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from("events")
          .select(
            `
            id,
            title,
            description,
            event_date,
            location,
            max_members,
            event_members(count)
          `,
          )
          .eq("share_token", token)
          .single()

        if (fetchError) {
          setError("이벤트를 찾을 수 없습니다.")
          return
        }

        setEvent({
          id: data.id,
          title: data.title,
          description: data.description,
          date: data.event_date,
          location: data.location,
          maxMembers: data.max_members,
          participantCount: data.event_members?.[0]?.count || 0,
        })
      } catch (err) {
        setError("이벤트 로드 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [token])

  // 참여 신청 액션 상태 관리
  const [applyState, applyAction, isApplying] = useActionState(
    () => applyToEvent(token),
    { success: false, message: "" },
  )

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center bg-background">
        <div className="w-full flex justify-center border-b">
          <div className="w-full max-w-5xl px-5 h-16 flex items-center">
            <Link href="/" className="font-semibold text-base">
              모임 이벤트 관리
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center w-full">
          <div className="w-full max-w-2xl px-5 py-12 text-center">
            로드 중...
          </div>
        </div>
      </main>
    )
  }

  if (error || !event) {
    return (
      <main className="min-h-screen flex flex-col items-center bg-background">
        <div className="w-full flex justify-center border-b">
          <div className="w-full max-w-5xl px-5 h-16 flex items-center">
            <Link href="/" className="font-semibold text-base">
              모임 이벤트 관리
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center w-full">
          <div className="w-full max-w-2xl px-5 py-12 text-center text-red-500">
            {error}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-background">
      {/* 헤더 */}
      <div className="w-full flex justify-center border-b">
        <div className="w-full max-w-5xl px-5 h-16 flex items-center">
          <Link href="/" className="font-semibold text-base">
            모임 이벤트 관리
          </Link>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 flex justify-center w-full">
        <div className="w-full max-w-2xl px-5 py-12">
          <Card className="p-8 space-y-6">
            {/* 제목 */}
            <h1 className="text-4xl font-bold">{event.title}</h1>

            {/* 정보 */}
            <div className="space-y-3 text-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>
                  {new Date(event.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-green-500" />
                <span>
                  {event.participantCount}
                  {event.maxMembers ? `/${event.maxMembers}` : ""}명 참여 중
                </span>
              </div>
            </div>

            {/* 설명 */}
            <div className="pt-4 border-t">
              <p className="text-muted-foreground leading-relaxed">
                {event.description ||
                  "이 모임은 주기적으로 열리는 즐거운 시간입니다. 함께 참여하고싶으신 분들은 언제든지 신청해주세요!"}
              </p>
            </div>

            {/* 에러 메시지 */}
            {applyState?.message && !applyState.success && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {applyState.message}
              </div>
            )}

            {/* CTA 버튼 */}
            <div className="pt-6 space-y-3">
              <form action={applyAction}>
                <Button size="lg" className="w-full" disabled={isApplying}>
                  {isApplying ? "처리 중..." : "참여 신청"}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
