"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Event } from "@/lib/dummy-data"
import { Calendar, Copy, MapPin } from "lucide-react"
import { useState } from "react"

interface EventHeaderProps {
  event: Event
}

export function EventHeader({ event }: EventHeaderProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    // 더미: 단순히 복사됨 표시
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusConfig = {
    scheduled: { label: "예정", variant: "default" as const },
    completed: { label: "완료", variant: "secondary" as const },
    cancelled: { label: "취소", variant: "destructive" as const },
  }

  const config = statusConfig[event.status]

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

      {/* 공유 버튼 */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="gap-2"
      >
        <Copy className="w-4 h-4" />
        {copied ? "복사됨!" : "공유 링크 복사"}
      </Button>
    </div>
  )
}
