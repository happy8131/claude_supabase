import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Cog, DollarSign, Users, Wind } from "lucide-react"

interface EventHubPageProps {
  params: Promise<{
    eventId: string
  }>
}

export default async function EventHubPage({ params }: EventHubPageProps) {
  const { eventId } = await params

  // 더미: 주최자 상태 (실제는 DB에서 확인)
  const isHost = true

  return (
    <Tabs defaultValue="announcements" className="w-full">
      {/* 탭 목록 */}
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-6">
        <TabsTrigger value="announcements" className="gap-2">
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">공지</span>
        </TabsTrigger>

        {isHost && (
          <TabsTrigger value="members" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">참여자</span>
          </TabsTrigger>
        )}

        <TabsTrigger value="carpool" className="gap-2">
          <Wind className="w-4 h-4" />
          <span className="hidden sm:inline">카풀</span>
        </TabsTrigger>

        <TabsTrigger value="settlement" className="gap-2">
          <DollarSign className="w-4 h-4" />
          <span className="hidden sm:inline">정산</span>
        </TabsTrigger>

        {isHost && (
          <TabsTrigger value="settings" className="gap-2">
            <Cog className="w-4 h-4" />
            <span className="hidden sm:inline">설정</span>
          </TabsTrigger>
        )}
      </TabsList>

      {/* 공지 탭 */}
      <TabsContent value="announcements">
        <div className="text-muted-foreground text-center py-12">
          공지 탭이 곧 준비됩니다.
        </div>
      </TabsContent>

      {/* 참여자 탭 */}
      {isHost && (
        <TabsContent value="members">
          <div className="text-muted-foreground text-center py-12">
            참여자 관리 탭이 곧 준비됩니다.
          </div>
        </TabsContent>
      )}

      {/* 카풀 탭 */}
      <TabsContent value="carpool">
        <div className="text-muted-foreground text-center py-12">
          카풀 탭이 곧 준비됩니다.
        </div>
      </TabsContent>

      {/* 정산 탭 */}
      <TabsContent value="settlement">
        <div className="text-muted-foreground text-center py-12">
          정산 탭이 곧 준비됩니다.
        </div>
      </TabsContent>

      {/* 설정 탭 */}
      {isHost && (
        <TabsContent value="settings">
          <div className="text-muted-foreground text-center py-12">
            설정 탭이 곧 준비됩니다.
          </div>
        </TabsContent>
      )}
    </Tabs>
  )
}
