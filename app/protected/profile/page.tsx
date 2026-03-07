import { Calendar, Mail, Users } from "lucide-react"
import { redirect } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

import { ProfileEditSection } from "./profile-edit-section"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    redirect("/auth/login")
  }

  // 프로필 조회
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // 주최한 이벤트 수
  const { count: hostedCount } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("host_id", user.id)

  // 참여한 이벤트 수 (status = 'joined')
  const { count: joinedCount } = await supabase
    .from("event_members")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "joined")

  const joinDate = new Date(
    profile?.created_at || new Date(),
  ).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      {/* 프로필 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg h-32"></div>

      {/* 프로필 정보 카드 */}
      <Card className="p-6 -mt-16 relative z-10">
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {profile?.full_name || "미설정"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {profile?.bio || "자기소개가 없습니다"}
              </p>
            </div>
            <ProfileEditSection profile={profile} />
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 이메일 */}
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">이메일</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            {/* 웹사이트 */}
            {profile?.website && (
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">웹사이트</p>
                  <p className="font-medium text-blue-600 hover:underline cursor-pointer">
                    {profile.website}
                  </p>
                </div>
              </div>
            )}

            {/* 가입일 */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">가입일</p>
                <p className="font-medium">{joinDate}</p>
              </div>
            </div>
          </div>

          {/* 통계 섹션 */}
          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-4">활동 통계</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* 주최한 이벤트 */}
              <Card className="p-4 bg-muted">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      주최한 이벤트
                    </p>
                    <p className="text-2xl font-bold">{hostedCount || 0}</p>
                  </div>
                </div>
              </Card>

              {/* 참여한 이벤트 */}
              <Card className="p-4 bg-muted">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-3">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      참여한 이벤트
                    </p>
                    <p className="text-2xl font-bold">{joinedCount || 0}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* 상태 배지 */}
          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-4">상태</h3>
            <div className="flex flex-wrap gap-2">
              {hostedCount && hostedCount > 0 && (
                <Badge variant="secondary">활동적인 주최자</Badge>
              )}
              {joinedCount && joinedCount > 0 && (
                <Badge variant="outline">신뢰할 수 있는 회원</Badge>
              )}
              {(hostedCount || 0) + (joinedCount || 0) > 0 && (
                <Badge>모임 애호가</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
