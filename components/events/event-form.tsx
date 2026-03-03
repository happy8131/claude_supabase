"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Event } from "@/lib/dummy-data"

interface EventFormProps {
  initialData?: Event
  onSubmit?: (data: any) => void
}

export function EventForm({ initialData, onSubmit }: EventFormProps) {
  const isEdit = !!initialData

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.({})
      }}
      className="space-y-6"
    >
      {/* 제목 */}
      <div className="space-y-2">
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          placeholder="예: 주말 수영 모임"
          maxLength={100}
          defaultValue={initialData?.title}
          required
        />
        <p className="text-xs text-muted-foreground">최대 100자</p>
      </div>

      {/* 설명 */}
      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          placeholder="모임에 대해 설명해주세요"
          rows={4}
        />
      </div>

      {/* 날짜/시간 */}
      <div className="space-y-2">
        <Label htmlFor="date">날짜 및 시간 *</Label>
        <Input
          id="date"
          type="datetime-local"
          defaultValue={
            initialData
              ? new Date(initialData.date).toISOString().slice(0, 16)
              : ""
          }
          required
        />
      </div>

      {/* 장소 */}
      <div className="space-y-2">
        <Label htmlFor="location">장소 *</Label>
        <Input
          id="location"
          placeholder="예: 서울 강남 수영장"
          defaultValue={initialData?.location}
          required
        />
      </div>

      {/* 최대 인원 */}
      <div className="space-y-2">
        <Label htmlFor="maxMembers">최대 인원 (선택)</Label>
        <Input
          id="maxMembers"
          type="number"
          placeholder="입력하지 않으면 무제한"
          min={1}
          defaultValue={initialData?.maxMembers || ""}
        />
      </div>

      {/* 승인 방식 */}
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <Label htmlFor="autoApprove" className="cursor-pointer">
          자동 승인 (참여 신청 즉시 승인)
        </Label>
        <Switch id="autoApprove" defaultChecked={false} />
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1">
          취소
        </Button>
        <Button type="submit" className="flex-1">
          {isEdit ? "수정" : "만들기"}
        </Button>
      </div>
    </form>
  )
}
