"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"

import { markAsPaid } from "./actions"

interface PaymentMarkPaidProps {
  paymentId: string
}

export function PaymentMarkPaid({ paymentId }: PaymentMarkPaidProps) {
  const [isPending, startTransition] = useTransition()

  const handleMarkPaid = () => {
    startTransition(async () => {
      const result = await markAsPaid(paymentId)

      if (!result.success) {
        alert(result.message)
      }
    })
  }

  return (
    <Button size="sm" onClick={handleMarkPaid} disabled={isPending}>
      {isPending ? "처리 중..." : "납부"}
    </Button>
  )
}
