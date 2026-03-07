"use client"

import { Edit2, Save, Trash2, X } from "lucide-react"
import { useState } from "react"
import { useTransition } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { deleteAnnouncement, togglePin, updateAnnouncement } from "./actions"

interface AnnouncementItemProps {
  id: string
  title: string
  content: string
  authorName: string
  createdAt: string | null
  isPinned: boolean | null
  isHost: boolean
}

export function AnnouncementItem({
  id,
  title,
  content,
  authorName,
  createdAt,
  isPinned,
  isHost,
}: AnnouncementItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editContent, setEditContent] = useState(content)
  const [editIsPinned, setEditIsPinned] = useState(isPinned ?? false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAnnouncement(id)

      if (!result.success) {
        alert(result.message)
      }
    })
  }

  const handleTogglePin = () => {
    startTransition(async () => {
      const result = await togglePin(id)

      if (!result.success) {
        alert(result.message)
      }
    })
  }

  const handleSaveEdit = () => {
    startTransition(async () => {
      const result = await updateAnnouncement(
        id,
        editTitle,
        editContent,
        editIsPinned,
      )

      if (result.success) {
        setIsEditing(false)
      } else {
        alert(result.message)
      }
    })
  }

  const handleCancel = () => {
    setEditTitle(title)
    setEditContent(content)
    setEditIsPinned(isPinned ?? false)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Card className="p-4 space-y-3">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          disabled={isPending}
        />
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={3}
          disabled={isPending}
        />
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={editIsPinned}
              onChange={(e) => setEditIsPinned(e.target.checked)}
              disabled={isPending}
            />
            상단에 고정
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={handleSaveEdit} disabled={isPending}>
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          {isPinned && <Badge variant="outline">고정</Badge>}
        </div>
        {isHost && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              disabled={isPending}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleTogglePin}
              disabled={isPending}
            >
              {isPinned ? "📌" : "📍"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{content}</p>
      <div className="text-xs text-muted-foreground">
        {authorName} ·{" "}
        {createdAt
          ? new Date(createdAt).toLocaleDateString("ko-KR")
          : "날짜 미정"}
      </div>
    </Card>
  )
}
