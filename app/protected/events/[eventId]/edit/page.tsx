"use client"

import { useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { EventForm } from "@/components/events/event-form"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { deleteEvent, updateEvent } from "./actions"
import type { Database } from "@/types/database"

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // 이벤트 데이터 로드
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single()

        if (fetchError) {
          setError("이벤트를 찾을 수 없습니다.")
          return
        }

        // UI용으로 데이터 변환
        setEvent({
          id: data.id,
          title: data.title,
          description: data.description,
          date: data.event_date,
          location: data.location,
          maxMembers: data.max_members,
          autoApprove: !data.require_approval,
          participantCount: 0,
          status: data.status,
        })
      } catch (err) {
        setError("이벤트 로드 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [eventId])

  const handleDelete = async () => {
    if (
      confirm("정말 이 모임을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      startTransition(async () => {
        try {
          console.log("삭제 시작:", eventId)
          const result = await deleteEvent(eventId)
          console.log("삭제 결과:", result)
          if (result.success) {
            console.log("삭제 성공, 리다이렉트 중...")
            router.push("/protected")
          } else {
            console.log("삭제 실패:", result.message)
            setDeleteError(result.message)
          }
        } catch (err) {
          console.error("삭제 에러:", err)
          setDeleteError("삭제 중 오류가 발생했습니다.")
        }
      })
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">로드 중...</div>
  }

  if (error || !event) {
    return <div className="text-center py-12 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">모임 수정</h1>
        <p className="text-muted-foreground mt-2">{event.title}</p>
      </div>

      {/* 폼 컨테이너 */}
      <div className="max-w-2xl mx-auto border rounded-lg p-6">
        <EventForm
          action="edit"
          eventId={eventId}
          initialData={event}
          formAction={(fd) => updateEvent(eventId, fd)}
        />
      </div>

      {/* 삭제 버튼 */}
      <div className="max-w-2xl mx-auto">
        {deleteError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-3">
            {deleteError}
          </div>
        )}
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? "삭제 중..." : "모임 삭제"}
        </Button>
      </div>
    </div>
  )
}
