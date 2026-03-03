"use client"

import { Eye } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Event } from "@/lib/dummy-data"

interface EventManagementTableProps {
  events: Event[]
}

export function EventManagementTable({ events }: EventManagementTableProps) {
  const statusConfig = {
    scheduled: { label: "진행 중", variant: "default" as const },
    completed: { label: "완료", variant: "secondary" as const },
    cancelled: { label: "취소", variant: "destructive" as const },
  }

  if (events.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">주최한 이벤트가 없습니다.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table - hidden on mobile */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">
                이벤트명
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">날짜</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                참여자
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">상태</th>
              <th className="px-6 py-3 text-right text-sm font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t hover:bg-muted/30">
                <td className="px-6 py-4">
                  <p className="font-medium">{event.title}</p>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(event.date).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 text-sm">
                  {event.members?.length || 1}명
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusConfig[event.status].variant}>
                    {statusConfig[event.status].label}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/protected/events/${event.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      보기
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - shown on mobile only */}
      <div className="md:hidden space-y-3">
        {events.map((event) => (
          <Card key={event.id} className="p-4">
            <Link href={`/protected/events/${event.id}`}>
              <div className="space-y-3 cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant={statusConfig[event.status].variant}>
                    {statusConfig[event.status].label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {event.members?.length || 1}명 참여
                  </span>
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
