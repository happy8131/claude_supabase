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

  // eventId에 해당하는 이벤트 찾기
  const hostedEvent = dummyEvents.hostedEvents.find((e) => e.id === eventId)
  const participatedEvent = dummyEvents.participatedEvents.find(
    (e) => e.id === eventId,
  )
  const event = hostedEvent || participatedEvent

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">이벤트를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mt-2">
          요청하신 이벤트({eventId})가 존재하지 않습니다.
        </p>
      </div>
    )
  }

  // 주최자 여부 판단 (호스트 이벤트 목록에 있으면 주최자)
  const isHost = !!hostedEvent

  return (
    <div className="space-y-6">
      <EventHeader event={event} isHost={isHost} />
      {children}
    </div>
  )
}
