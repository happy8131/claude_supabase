"use client"

import { useState } from "react"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { addSettlementItem } from "./actions"

interface SettlementItemFormProps {
  settlementId: string
  userId: string | undefined
}

export function SettlementItemForm({
  settlementId,
  userId,
}: SettlementItemFormProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState<number | string>("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !amount || !userId) {
      alert("모든 필드를 입력하세요")
      return
    }

    startTransition(async () => {
      const result = await addSettlementItem(
        settlementId,
        name,
        Number(amount),
        userId,
      )

      if (result.success) {
        setName("")
        setAmount("")
      } else {
        alert(result.message)
      }
    })
  }

  return (
    <Card className="p-4 space-y-3 border-dashed">
      <h4 className="font-semibold">비용 항목 추가</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="항목명"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
        />
        <Input
          type="number"
          placeholder="금액"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isPending}
        />
        <Button className="w-full" disabled={isPending}>
          {isPending ? "추가 중..." : "추가"}
        </Button>
      </form>
    </Card>
  )
}
