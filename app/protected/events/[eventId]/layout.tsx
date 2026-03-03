import { EventHeader } from "@/components/events/event-header"
import { dummyEvents } from "@/lib/dummy-data"

interface EventLayoutProps {
  children: React.ReactNode
  params: Promise<{
    eventId: string
  }>
}

export default async function EventLayout({
  children,
  params,
}: EventLayoutProps) {
  const { eventId } = await params
  // 더미: 첫 번째 호스트 이벤트 사용
  const event = dummyEvents.hostedEvents[0]

  if (!event) {
    return <div>이벤트를 찾을 수 없습니다.</div>
  }

  return (
    <div className="space-y-6">
      <EventHeader event={event} />
      {children}
    </div>
  )
}
