"use client"

import { Calendar, Copy, Edit2, MapPin, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { deleteEvent } from "@/app/protected/events/[eventId]/edit/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface EventHeaderProps {
  event: {
    id: string
    title: string
    date: string
    location: string
    status: "published" | "completed" | "cancelled"
  }
  isHost?: boolean
}

export function EventHeader({ event, isHost = false }: EventHeaderProps) {
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleCopyLink = () => {
    // 더미: 단순히 복사됨 표시
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = () => {
    // 확인 대화상자
    const confirmed = window.confirm(
      "정말 이 모임을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.",
    )

    if (!confirmed) return

    startTransition(async () => {
      const result = await deleteEvent(event.id)

      if (result.success) {
        router.push("/protected")
      } else {
        alert(`삭제 실패: ${result.message}`)
      }
    })
  }

  const statusConfig = {
    published: { label: "진행중", variant: "default" as const },
    completed: { label: "완료", variant: "secondary" as const },
    cancelled: { label: "취소", variant: "destructive" as const },
  }

  const config = statusConfig[event.status] || {
    label: "알 수 없음",
    variant: "outline" as const,
  }

  return (
    <div className="border-b pb-6 space-y-4">
      {/* 제목과 배지 */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>

      {/* 정보 */}
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
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
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          <Copy className="w-4 h-4" />
          {copied ? "복사됨!" : "공유 링크 복사"}
        </Button>

        {/* 주최자 전용 버튼 */}
        {isHost && (
          <>
            <Link href={`/protected/events/${event.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit2 className="w-4 h-4" />
                수정
              </Button>
            </Link>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {isPending ? "삭제 중..." : "삭제"}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
