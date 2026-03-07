"use client"

import { Check, Trash2, X } from "lucide-react"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"

import { approveMember, rejectMember, removeMember } from "./actions"

interface MemberActionsProps {
  eventId: string
  memberId: string
  status: "pending" | "joined" | "waitlisted"
}

export function MemberActions({
  eventId,
  memberId,
  status,
}: MemberActionsProps) {
  const [isPending, startTransition] = useTransition()

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveMember(eventId, memberId)
      if (!result.success) {
        alert(result.message)
      }
    })
  }

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectMember(eventId, memberId)
      if (!result.success) {
        alert(result.message)
      }
    })
  }

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeMember(eventId, memberId)
      if (!result.success) {
        alert(result.message)
      }
    })
  }

  if (status === "pending") {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="default"
          onClick={handleApprove}
          disabled={isPending}
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleReject}
          disabled={isPending}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  if (status === "joined") {
    return (
      <Button
        size="sm"
        variant="destructive"
        onClick={handleRemove}
        disabled={isPending}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    )
  }

  return null
}
