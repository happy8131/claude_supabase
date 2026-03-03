import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { dummyEvents } from "@/lib/dummy-data"
import { Calendar, MapPin, Users } from "lucide-react"

interface ShareEventPageProps {
  params: {
    token: string
  }
}

export default function ShareEventPage({ params }: ShareEventPageProps) {
  // 더미 데이터에서 첫 번째 호스트 이벤트 사용
  const event = dummyEvents.hostedEvents[0]

  if (!event) {
    return <div className="text-center py-12">이벤트를 찾을 수 없습니다.</div>
  }

  // 상태별 버튼 렌더링 (더미: 참여 가능 상태)
  const renderButton = () => {
    return (
      <Button size="lg" className="w-full">
        참여 신청
      </Button>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-background">
      {/* 헤더 */}
      <div className="w-full flex justify-center border-b">
        <div className="w-full max-w-5xl px-5 h-16 flex items-center">
          <Link href="/" className="font-semibold text-base">
            모임 이벤트 관리
          </Link>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 flex justify-center w-full">
        <div className="w-full max-w-2xl px-5 py-12">
          <Card className="p-8 space-y-6">
            {/* 제목 */}
            <h1 className="text-4xl font-bold">{event.title}</h1>

            {/* 정보 */}
            <div className="space-y-3 text-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>
                  {new Date(event.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-green-500" />
                <span>
                  {event.participantCount}
                  {event.maxMembers ? `/${event.maxMembers}` : ""}명 참여 중
                </span>
              </div>
            </div>

            {/* 설명 */}
            <div className="pt-4 border-t">
              <p className="text-muted-foreground leading-relaxed">
                이 모임은 주기적으로 열리는 즐거운 시간입니다. 함께 참여하고
                싶으신 분들은 언제든지 신청해주세요!
              </p>
            </div>

            {/* CTA 버튼 */}
            <div className="pt-6 space-y-3">{renderButton()}</div>
          </Card>
        </div>
      </div>
    </main>
  )
}
