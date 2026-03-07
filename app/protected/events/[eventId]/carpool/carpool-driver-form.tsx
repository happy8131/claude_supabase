"use client"

import { useState } from "react"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { registerDriver } from "./actions"

interface CarpoolDriverFormProps {
  eventId: string
}

export function CarpoolDriverForm({ eventId }: CarpoolDriverFormProps) {
  const [departureArea, setDepartureArea] = useState("")
  const [departureTime, setDepartureTime] = useState("")
  const [availableSeats, setAvailableSeats] = useState<number | string>("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!departureArea || !departureTime || !availableSeats) {
      alert("모든 필드를 입력하세요")
      return
    }

    startTransition(async () => {
      const result = await registerDriver(
        eventId,
        departureArea,
        departureTime,
        Number(availableSeats),
      )

      if (result.success) {
        setDepartureArea("")
        setDepartureTime("")
        setAvailableSeats("")
      } else {
        alert(result.message)
      }
    })
  }

  return (
    <Card className="p-4 space-y-3 border-dashed">
      <h4 className="font-semibold">운전자 등록</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="출발 지역"
          value={departureArea}
          onChange={(e) => setDepartureArea(e.target.value)}
          disabled={isPending}
        />
        <Input
          type="time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          disabled={isPending}
        />
        <Input
          type="number"
          placeholder="가능한 좌석 수"
          min={1}
          value={availableSeats}
          onChange={(e) => setAvailableSeats(e.target.value)}
          disabled={isPending}
        />
        <Button className="w-full" disabled={isPending}>
          {isPending ? "등록 중..." : "등록"}
        </Button>
      </form>
    </Card>
  )
}
