import {
  Calendar,
  Calendar as CalendarIcon,
  Edit2,
  LogOut,
  Mail,
  MapPin,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { dummyProfile } from "@/lib/dummy-data"

export default function ProfilePage() {
  // TODO(Phase 4): Supabase 인증 정보로 실제 프로필 데이터 조회
  const profile = dummyProfile

  const joinDate = new Date(profile.joinedDate).toLocaleDateString("ko-KR", {
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
              <h1 className="text-3xl font-bold">{profile.displayName}</h1>
              <p className="text-muted-foreground mt-1">{profile.bio}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">수정</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </Button>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 이메일 */}
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">이메일</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>

            {/* 지역 */}
            {profile.region && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">지역</p>
                  <p className="font-medium">{profile.region}</p>
                </div>
              </div>
            )}

            {/* 생년월일 */}
            {profile.birthDate && (
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">생년월일</p>
                  <p className="font-medium">
                    {new Date(profile.birthDate).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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
                    <p className="text-2xl font-bold">
                      {profile.hostedEventCount}
                    </p>
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
                    <p className="text-2xl font-bold">
                      {profile.participatedEventCount}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* 상태 배지 */}
          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-4">상태</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">활동적인 주최자</Badge>
              <Badge variant="outline">신뢰할 수 있는 회원</Badge>
              <Badge>모임 애호가</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
