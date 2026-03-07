import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

import { MemberActions } from "./member-actions"

interface MembersPageProps {
  params: Promise<{
    eventId: string
  }>
}

export default async function MembersPage({ params }: MembersPageProps) {
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

  const isHost = event && event.host_id === user?.id

  if (!isHost) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          주최자만 참여자를 관리할 수 있습니다.
        </p>
      </div>
    )
  }

  // 참여자 조회
  const { data: members } = await supabase
    .from("event_members")
    .select("id, user_id, status, joined_at")
    .eq("event_id", eventId)
    .order("joined_at", { ascending: false })

  // 각 멤버의 프로필 정보 조회
  const membersWithProfile = await Promise.all(
    (members || []).map(async (member) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", member.user_id)
        .single()

      return {
        ...member,
        name: profile?.full_name || "알 수 없음",
      }
    }),
  )

  // 상태별로 분류
  const pendingMembers = membersWithProfile.filter(
    (m) => m.status === "pending",
  )
  const approvedMembers = membersWithProfile.filter(
    (m) => m.status === "joined",
  )
  const waitlistedMembers = membersWithProfile.filter(
    (m) => m.status === "waitlisted",
  )

  return (
    <div className="space-y-6">
      {/* 승인 대기 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          승인 대기 ({pendingMembers.length})
        </h3>
        {pendingMembers.length > 0 ? (
          <div className="space-y-2">
            {pendingMembers.map((member) => (
              <Card
                key={member.id}
                className="p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.joined_at
                      ? new Date(member.joined_at).toLocaleDateString("ko-KR")
                      : "날짜 미정"}
                  </p>
                </div>
                <MemberActions
                  eventId={eventId}
                  memberId={member.user_id}
                  status="pending"
                />
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            승인 대기 중인 참여자가 없습니다.
          </p>
        )}
      </div>

      {/* 승인됨 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          승인됨 ({approvedMembers.length})
        </h3>
        {approvedMembers.length > 0 ? (
          <div className="space-y-2">
            {approvedMembers.map((member) => (
              <Card
                key={member.id}
                className="p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.joined_at
                      ? new Date(member.joined_at).toLocaleDateString("ko-KR")
                      : "날짜 미정"}
                  </p>
                </div>
                <MemberActions
                  eventId={eventId}
                  memberId={member.user_id}
                  status="joined"
                />
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            승인된 참여자가 없습니다.
          </p>
        )}
      </div>

      {/* 대기자 */}
      {waitlistedMembers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            대기자 ({waitlistedMembers.length})
          </h3>
          <div className="space-y-2">
            {waitlistedMembers.map((member) => (
              <Card
                key={member.id}
                className="p-3 flex items-center justify-between"
              >
                <p className="font-medium">{member.name}</p>
                <Badge variant="outline">대기 중</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
