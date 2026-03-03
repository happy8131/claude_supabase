import Link from "next/link"

import { EventForm } from "@/components/events/event-form"
import { Button } from "@/components/ui/button"
import { dummyEvents } from "@/lib/dummy-data"

interface EditEventPageProps {
  params: {
    eventId: string
  }
}

export default function EditEventPage({ params }: EditEventPageProps) {
  // 더미 데이터에서 첫 번째 호스트 이벤트 사용 (실제는 DB에서 조회)
  const event = dummyEvents.hostedEvents[0]

  if (!event) {
    return <div>이벤트를 찾을 수 없습니다.</div>
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
        <EventForm initialData={event} />
      </div>

      {/* 삭제 버튼 */}
      <div className="max-w-2xl mx-auto">
        <Button variant="destructive" className="w-full">
          모임 삭제
        </Button>
      </div>
    </div>
  )
}
