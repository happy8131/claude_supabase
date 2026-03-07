import { createClient } from "@/lib/supabase/server"

import { AnnouncementForm } from "./announcement-form"
import { AnnouncementItem } from "./announcement-item"

interface AnnouncementsPageProps {
  params: Promise<{
    eventId: string
  }>
}

export default async function AnnouncementsPage({
  params,
}: AnnouncementsPageProps) {
  const { eventId } = await params

  const supabase = await createClient()

  // 현재 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 이벤트의 주최자 확인
  const { data: event } = await supabase
    .from("events")
    .select("host_id")
    .eq("id", eventId)
    .single()

  const isHost = Boolean(event && event.host_id === user?.id)

  // 공지사항 조회
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, content, author_id, created_at, is_pinned")
    .eq("event_id", eventId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  // 각 공지의 작성자 정보 조회
  const announcementsWithAuthor = await Promise.all(
    (announcements || []).map(async (announcement) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", announcement.author_id)
        .single()

      return {
        ...announcement,
        authorName: profile?.full_name || "알 수 없음",
      }
    }),
  )

  return (
    <div className="space-y-6">
      {/* 공지 목록 */}
      <div className="space-y-3">
        {announcementsWithAuthor.length > 0 ? (
          announcementsWithAuthor.map((announcement) => (
            <AnnouncementItem
              key={announcement.id}
              id={announcement.id}
              title={announcement.title}
              content={announcement.content}
              authorName={announcement.authorName}
              createdAt={announcement.created_at}
              isPinned={Boolean(announcement.is_pinned)}
              isHost={isHost}
            />
          ))
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            공지사항이 없습니다.
          </p>
        )}
      </div>

      {/* 공지 작성 폼 (주최자만) */}
      {isHost && <AnnouncementForm eventId={eventId} />}
    </div>
  )
}
