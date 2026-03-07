import { EventForm } from "@/components/events/event-form"
import { createEvent } from "./actions"

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">새 모임 만들기</h1>
        <p className="text-muted-foreground mt-2">
          새로운 모임 이벤트를 만들고 참여자를 모집하세요.
        </p>
      </div>

      {/* 폼 컨테이너 */}
      <div className="max-w-2xl mx-auto border rounded-lg p-6">
        <EventForm action="create" formAction={createEvent} />
      </div>
    </div>
  )
}
