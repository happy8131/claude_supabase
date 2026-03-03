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

  // eventId에 해당하는 이벤트 찾기 (호스트 이벤트 우선, 없으면 참여 이벤트)
  const event =
    dummyEvents.hostedEvents.find((e) => e.id === eventId) ||
    dummyEvents.participatedEvents.find((e) => e.id === eventId)

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

  return (
    <div className="space-y-6">
      <EventHeader event={event} />
      {children}
    </div>
  )
}
