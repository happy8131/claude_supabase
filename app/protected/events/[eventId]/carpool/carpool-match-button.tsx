"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"

import { matchCarpool } from "./actions"

interface CarpoolMatchButtonProps {
  eventId: string
}

export function CarpoolMatchButton({ eventId }: CarpoolMatchButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleMatch = () => {
    startTransition(async () => {
      const result = await matchCarpool(eventId)

      if (!result.success) {
        alert(result.message)
      }
    })
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleMatch}
      disabled={isPending}
    >
      {isPending ? "매칭 중..." : "카풀 매칭 처리"}
    </Button>
  )
}
