import Link from "next/link"

import { EventCard } from "@/components/events/event-card"
import { Button } from "@/components/ui/button"
import { dummyEvents } from "@/lib/dummy-data"

export default function ProtectedPage() {
  const { hostedEvents, participatedEvents } = dummyEvents

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* 헤더 - 새 모임 만들기 버튼 */}
      <div className="flex justify-end">
        <Link href="/protected/events/new">
          <Button>새 모임 만들기</Button>
        </Link>
      </div>

      {/* 내가 만든 이벤트 섹션 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">내가 만든 이벤트</h2>
        {hostedEvents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>아직 만든 이벤트가 없습니다.</p>
            <Link href="/protected/events/new">
              <Button variant="outline" className="mt-4">
                첫 모임 만들기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hostedEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                participantCount={event.participantCount}
                maxMembers={event.maxMembers}
                status={event.status}
              />
            ))}
          </div>
        )}
      </section>

      {/* 내가 참여한 이벤트 섹션 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">내가 참여한 이벤트</h2>
        {participatedEvents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>아직 참여한 이벤트가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participatedEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                participantCount={event.participantCount}
                maxMembers={event.maxMembers}
                status={event.status}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
