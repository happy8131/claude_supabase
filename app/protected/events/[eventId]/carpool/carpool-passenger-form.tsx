"use client"

import { useState } from "react"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { registerPassenger } from "./actions"

interface CarpoolPassengerFormProps {
  eventId: string
}

export function CarpoolPassengerForm({ eventId }: CarpoolPassengerFormProps) {
  const [departureArea, setDepartureArea] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!departureArea) {
      alert("출발 지역을 입력하세요")
      return
    }

    startTransition(async () => {
      const result = await registerPassenger(eventId, departureArea)

      if (result.success) {
        setDepartureArea("")
      } else {
        alert(result.message)
      }
    })
  }

  return (
    <Card className="p-4 space-y-3 border-dashed">
      <h4 className="font-semibold">탑승 희망</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="희망 출발 지역"
          value={departureArea}
          onChange={(e) => setDepartureArea(e.target.value)}
          disabled={isPending}
        />
        <Button className="w-full" disabled={isPending}>
          {isPending ? "신청 중..." : "신청"}
        </Button>
      </form>
    </Card>
  )
}
