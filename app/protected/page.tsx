import { Plus } from "lucide-react"
import Link from "next/link"

import { EventCard } from "@/components/events/event-card"
import { Button } from "@/components/ui/button"
import { dummyEvents } from "@/lib/dummy-data"

export default function ProtectedPage() {
  const hostedEvents = dummyEvents.hostedEvents
  const participatedEvents = dummyEvents.participatedEvents

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">내 모임</h1>
          <p className="text-muted-foreground mt-1">
            주최하고 참여하는 모임을 관리하세요.
          </p>
        </div>
        <Link href="/protected/events/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />새 모임 만들기
          </Button>
        </Link>
      </div>

      {/* 주최한 이벤트 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">주최한 모임</h2>
        {hostedEvents.length > 0 ? (
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
                status={
                  event.status === "scheduled" ? "published" : event.status
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            주최한 모임이 없습니다.
          </p>
        )}
      </section>

      {/* 참여한 이벤트 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">참여한 모임</h2>
        {participatedEvents.length > 0 ? (
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
                status={
                  event.status === "scheduled" ? "published" : event.status
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            참여한 모임이 없습니다.
          </p>
        )}
      </section>
    </div>
  )
}
