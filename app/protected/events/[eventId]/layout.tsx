import { EventHeader } from "@/components/events/event-header"
import { EventTabNavigation } from "@/components/events/event-tab-navigation"
import { createClient } from "@/lib/supabase/server"

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

  const supabase = await createClient()

  // 현재 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 이벤트 조회
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single()

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

  // 주최자 여부 판단
  const isHost = event.host_id === user?.id

  // EventHeader에 전달할 이벤트 형식으로 변환
  const eventData = {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.event_date,
    location: event.location,
    maxMembers: event.max_members,
    status: event.status as "published" | "completed" | "cancelled",
    coverImageUrl: event.cover_image_url,
  }

  return (
    <div className="space-y-6">
      <EventHeader event={eventData} isHost={isHost} />
      <EventTabNavigation eventId={eventId} isHost={isHost} />
      {children}
    </div>
  )
}
