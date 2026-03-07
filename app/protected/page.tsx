import { Plus } from "lucide-react"
import Link from "next/link"

import { EventCard } from "@/components/events/event-card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

interface EventWithParticipants {
  id: string
  title: string
  event_date: string
  location: string
  max_members: number | null
  status: string
  cover_image_url: string | null
  _participantCount?: number
}

export default async function ProtectedPage() {
  const supabase = await createClient()

  // 현재 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">로그인이 필요합니다</h2>
      </div>
    )
  }

  // 주최한 이벤트 조회
  const { data: hostedEventsData } = await supabase
    .from("events")
    .select(
      "id, title, event_date, location, max_members, status, cover_image_url",
    )
    .eq("host_id", user.id)
    .order("event_date", { ascending: true })

  // 참여한 이벤트 조회 (event_members에서 user_id 조회 후 events 조회)
  const { data: participatedEventsData } = await supabase
    .from("event_members")
    .select("event_id")
    .eq("user_id", user.id)
    .eq("status", "joined")

  let participatedEvents: EventWithParticipants[] = []
  if (participatedEventsData && participatedEventsData.length > 0) {
    const eventIds = participatedEventsData.map((em) => em.event_id)
    const { data: events } = await supabase
      .from("events")
      .select(
        "id, title, event_date, location, max_members, status, cover_image_url",
      )
      .in("id", eventIds)
      .order("event_date", { ascending: true })
    participatedEvents = events || []
  }

  // 각 이벤트별 참여자 수 조회 함수
  const getParticipantCount = async (eventId: string) => {
    const { count } = await supabase
      .from("event_members")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "joined")

    return count || 0
  }

  // 주최한 이벤트에 참여자 수 추가
  const hostedEventsWithCount = await Promise.all(
    (hostedEventsData || []).map(async (event) => ({
      ...event,
      _participantCount: await getParticipantCount(event.id),
    })),
  )

  // 참여한 이벤트에 참여자 수 추가
  const participatedEventsWithCount = await Promise.all(
    participatedEvents.map(async (event) => ({
      ...event,
      _participantCount: await getParticipantCount(event.id),
    })),
  )

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
        {hostedEventsWithCount.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hostedEventsWithCount.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.event_date}
                location={event.location}
                participantCount={event._participantCount || 0}
                maxMembers={event.max_members || 0}
                status={event.status as "published" | "completed" | "cancelled"}
                coverImageUrl={event.cover_image_url || undefined}
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
        {participatedEventsWithCount.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participatedEventsWithCount.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.event_date}
                location={event.location}
                participantCount={event._participantCount || 0}
                maxMembers={event.max_members || 0}
                status={event.status as "published" | "completed" | "cancelled"}
                coverImageUrl={event.cover_image_url || undefined}
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
