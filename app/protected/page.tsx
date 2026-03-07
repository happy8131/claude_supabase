import Link from "next/link"

import { EventCard } from "@/components/events/event-card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export default async function ProtectedPage() {
  const supabase = await createClient()

  // 현재 사용자 조회
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    return <div>로그인이 필요합니다.</div>
  }

  // 내가 만든 이벤트 조회 (host_id = current user)
  const { data: hostedEvents = [], error: hostedError } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      event_date,
      location,
      max_members,
      status,
      cover_image_url,
      event_members(count)
    `,
    )
    .eq("host_id", user.id)
    .order("event_date", { ascending: true })

  // 내가 참여한 이벤트 조회 (status = approved)
  const { data: participatedMembers = [] } = await supabase
    .from("event_members")
    .select(
      `
      event_id,
      events(
        id,
        title,
        event_date,
        location,
        max_members,
        status,
        cover_image_url,
        event_members(count)
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("status", "approved")
    .order("events.event_date", { ascending: true })

  // 데이터 변환
  const hostedEventsList = (hostedEvents || []).map((event: any) => ({
    id: event.id,
    title: event.title,
    date: event.event_date,
    location: event.location,
    participantCount: event.event_members?.[0]?.count || 0,
    maxMembers: event.max_members,
    status: event.status,
    coverImageUrl: event.cover_image_url,
  }))

  const participatedEventsList = (participatedMembers || [])
    .map((member: any) => member.events)
    .filter(Boolean)
    .map((event: any) => ({
      id: event.id,
      title: event.title,
      date: event.event_date,
      location: event.location,
      participantCount: event.event_members?.[0]?.count || 0,
      maxMembers: event.max_members,
      status: event.status,
      coverImageUrl: event.cover_image_url,
    }))

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
        {hostedEventsList.length === 0 ? (
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
            {hostedEventsList.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                participantCount={event.participantCount}
                maxMembers={event.maxMembers}
                status={event.status}
                coverImageUrl={event.coverImageUrl}
              />
            ))}
          </div>
        )}
      </section>

      {/* 내가 참여한 이벤트 섹션 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">내가 참여한 이벤트</h2>
        {participatedEventsList.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>아직 참여한 이벤트가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participatedEventsList.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                participantCount={event.participantCount}
                maxMembers={event.maxMembers}
                status={event.status}
                coverImageUrl={event.coverImageUrl}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
