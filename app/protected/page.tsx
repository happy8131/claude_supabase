import { Cog, DollarSign, FileText, Plus } from "lucide-react"
import Link from "next/link"

import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { EventManagementTable } from "@/components/dashboard/event-management-table"
import { Button } from "@/components/ui/button"
import { dummyEvents } from "@/lib/dummy-data"

export default function ProtectedPage() {
  const hostedEvents = dummyEvents.hostedEvents

  // 통계 계산
  const hostedEventsCount = hostedEvents.length
  const participantsCount = hostedEvents.reduce(
    (sum, event) => sum + (event.participantCount || 1),
    0,
  )
  const ongoingCount = hostedEvents.filter(
    (e) => e.status === "scheduled",
  ).length
  const completedCount = hostedEvents.filter(
    (e) => e.status === "completed",
  ).length

  return (
    <div className="space-y-6">
      {/* 제목 섹션 */}
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground mt-1">
          주최한 이벤트를 한눈에 관리하세요.
        </p>
      </div>

      {/* 통계 섹션 */}
      <DashboardStats
        hostedEventsCount={hostedEventsCount}
        participantsCount={participantsCount}
        ongoingCount={ongoingCount}
        completedCount={completedCount}
      />

      {/* 빠른 작업 섹션 */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">빠른 작업</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/protected/events/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />새 모임 만들기
            </Button>
          </Link>
          <Button variant="outline" disabled className="gap-2">
            <FileText className="w-4 h-4" />
            공지사항 작성
          </Button>
          <Button variant="outline" disabled className="gap-2">
            <DollarSign className="w-4 h-4" />
            정산 관리
          </Button>
          <Button variant="outline" disabled className="gap-2">
            <Cog className="w-4 h-4" />
            설정
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 비활성화된 기능은 Phase 4에서 추가될 예정입니다.
        </p>
      </div>

      {/* 이벤트 관리 섹션 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">이벤트 관리</h2>
        <EventManagementTable events={hostedEvents} />
      </div>
    </div>
  )
}
