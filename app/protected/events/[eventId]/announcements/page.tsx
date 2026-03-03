import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2, Pin } from "lucide-react"

// 더미 공지 데이터
const dummyAnnouncements = [
  {
    id: "1",
    title: "장소 변경 안내",
    content: "이번 모임 장소가 변경되었습니다. 자세한 사항은 카톡방 참고",
    author: "주최자",
    date: "2026-03-02",
    isPinned: true,
  },
  {
    id: "2",
    title: "참여자 모집 중",
    content: "아직 자리가 남아 있습니다. 많은 참여 부탁드립니다!",
    author: "주최자",
    date: "2026-03-01",
    isPinned: false,
  },
]

export default function AnnouncementsPage() {
  const isHost = true

  return (
    <div className="space-y-6">
      {/* 공지 목록 */}
      <div className="space-y-3">
        {dummyAnnouncements.map((announcement) => (
          <Card
            key={announcement.id}
            className="p-4 space-y-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{announcement.title}</h3>
                {announcement.isPinned && <Badge variant="outline">고정</Badge>}
              </div>
              {isHost && (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {announcement.content}
            </p>
            <div className="text-xs text-muted-foreground">
              {announcement.author} · {announcement.date}
            </div>
          </Card>
        ))}
      </div>

      {/* 공지 작성 폼 (주최자만) */}
      {isHost && (
        <Card className="p-4 space-y-4 border-dashed">
          <h3 className="font-semibold">새 공지 작성</h3>
          <Input placeholder="제목" />
          <Textarea placeholder="내용" rows={3} />
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              상단에 고정
            </label>
            <Button>게시</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
