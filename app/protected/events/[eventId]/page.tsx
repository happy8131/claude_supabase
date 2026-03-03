import { redirect } from "next/navigation"

interface EventHubPageProps {
  params: Promise<{
    eventId: string
  }>
}

export default async function EventHubPage({ params }: EventHubPageProps) {
  const { eventId } = await params

  // 기본 페이지: 공지 탭으로 리다이렉트
  redirect(`/protected/events/${eventId}/announcements`)
}
