import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { dummyEvents } from "@/lib/dummy-data"

interface EventSettingsPageProps {
  params: Promise<{
    eventId: string
  }>
}

export default async function EventSettingsPage({
  params,
}: EventSettingsPageProps) {
  const { eventId } = await params

  // eventId에 해당하는 이벤트 찾기 (호스트 이벤트만)
  const event = dummyEvents.hostedEvents.find((e) => e.id === eventId)

  // 비주최자 접근 시 접근 불가 메시지
  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">접근 권한이 없습니다</h2>
        <p className="text-muted-foreground">
          주최자만 설정에 접근할 수 있습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">이벤트 설정</h2>
        <p className="text-muted-foreground mt-1">
          이벤트의 기본 설정을 관리하세요.
        </p>
      </div>

      {/* 기본 설정 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">이벤트명</p>
            <p className="font-medium">{event.title}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">설명</p>
            <p className="font-medium">{event.description || "없음"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">날짜 및 시간</p>
            <p className="font-medium">
              {new Date(event.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">장소</p>
            <p className="font-medium">{event.location}</p>
          </div>
        </div>
      </Card>

      {/* 참여자 설정 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">참여자 설정</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">최대 인원</p>
            <p className="font-medium">{event.maxMembers || "무제한"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">승인 방식</p>
            <p className="font-medium">
              {event.autoApprove ? "자동 승인" : "주최자 승인 필요"}
            </p>
          </div>
        </div>
      </Card>

      {/* 위험 영역 */}
      <Card className="p-6 border-red-200 bg-red-50">
        <h3 className="text-lg font-semibold mb-4 text-red-900">위험 영역</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-red-700 mb-3">
              이벤트를 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
            </p>
            <Button variant="destructive" className="w-full sm:w-auto">
              이벤트 삭제
            </Button>
          </div>
        </div>
      </Card>

      {/* TODO 주석 */}
      <div className="text-sm text-muted-foreground">
        <p>💡 Phase 4에서 설정 수정 및 이벤트 삭제 기능이 추가될 예정입니다.</p>
      </div>
    </div>
  )
}
