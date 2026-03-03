import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Trash2 } from "lucide-react"

const dummyMembers = {
  pending: [
    { id: "1", name: "김철수", appliedDate: "2026-03-02" },
    { id: "2", name: "이영희", appliedDate: "2026-03-01" },
  ],
  approved: [
    { id: "3", name: "박민준", approvedDate: "2026-02-28" },
    { id: "4", name: "정수진", approvedDate: "2026-02-27" },
    { id: "5", name: "이주호", approvedDate: "2026-02-26" },
  ],
  waitlisted: [{ id: "6", name: "최지은", joinedDate: "2026-02-25" }],
}

export default function MembersPage() {
  const isHost = true

  if (!isHost) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          주최자만 참여자를 관리할 수 있습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 승인 대기 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          승인 대기 ({dummyMembers.pending.length})
        </h3>
        <div className="space-y-2">
          {dummyMembers.pending.map((member) => (
            <Card
              key={member.id}
              className="p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">
                  {member.appliedDate}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="default">
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 승인됨 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          승인됨 ({dummyMembers.approved.length})
        </h3>
        <div className="space-y-2">
          {dummyMembers.approved.map((member) => (
            <Card
              key={member.id}
              className="p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">
                  {member.approvedDate}
                </p>
              </div>
              <Button size="sm" variant="destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* 대기자 */}
      {dummyMembers.waitlisted.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            대기자 ({dummyMembers.waitlisted.length})
          </h3>
          <div className="space-y-2">
            {dummyMembers.waitlisted.map((member) => (
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
