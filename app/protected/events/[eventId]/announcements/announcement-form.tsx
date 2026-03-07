"use client"

import { useState } from "react"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { createAnnouncement } from "./actions"

interface AnnouncementFormProps {
  eventId: string
}

export function AnnouncementForm({ eventId }: AnnouncementFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPinned, setIsPinned] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const result = await createAnnouncement(eventId, title, content, isPinned)

      if (result.success) {
        setTitle("")
        setContent("")
        setIsPinned(false)
      } else {
        alert(result.message)
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border-dashed border rounded-lg"
    >
      <h3 className="font-semibold">새 공지 작성</h3>
      <Input
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isPending}
      />
      <Textarea
        placeholder="내용"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
      />
      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            disabled={isPending}
          />
          상단에 고정
        </label>
        <Button disabled={isPending}>
          {isPending ? "게시 중..." : "게시"}
        </Button>
      </div>
    </form>
  )
}
