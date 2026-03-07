"use client"

import { Trash2 } from "lucide-react"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"

import { deleteSettlementItem } from "./actions"

interface SettlementItemDeleteProps {
  itemId: string
}

export function SettlementItemDelete({ itemId }: SettlementItemDeleteProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSettlementItem(itemId)

      if (!result.success) {
        alert(result.message)
      }
    })
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
