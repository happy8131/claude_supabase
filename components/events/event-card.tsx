"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Users } from "lucide-react"

interface EventCardProps {
  id: string
  title: string
  date: string
  location: string
  participantCount: number
  maxMembers?: number
  status: "published" | "completed" | "cancelled"
  coverImageUrl?: string
}

export function EventCard({
  id,
  title,
  date,
  location,
  participantCount,
  maxMembers,
  status,
  coverImageUrl,
}: EventCardProps) {
  // 상태별 배지 색상
  const statusConfig = {
    published: { label: "진행중", variant: "default" as const },
    completed: { label: "완료", variant: "secondary" as const },
    cancelled: { label: "취소", variant: "destructive" as const },
  }

  const config = statusConfig[status] || { label: "알 수 없음", variant: "outline" as const }

  // 날짜 포맷 (ISO → 한국어)
  const formattedDate = new Date(date).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Link href={`/protected/events/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* 커버 이미지 또는 회색 배경 */}
        <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <div className="p-4 space-y-3">
          {/* 제목 및 상태 배지 */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1">
              {title}
            </h3>
            <Badge variant={config.variant} className="shrink-0">
              {config.label}
            </Badge>
          </div>

          {/* 날짜 및 장소 */}
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>

          {/* 참여자 수 */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t">
            <Users className="w-3.5 h-3.5" />
            <span>
              {participantCount}
              {maxMembers ? `/${maxMembers}명` : "명"}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
