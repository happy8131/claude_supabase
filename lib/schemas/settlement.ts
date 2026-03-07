import { z } from "zod"

// 정산 항목 생성/수정 스키마
export const settlementItemSchema = z.object({
  name: z
    .string()
    .min(1, "항목명은 필수입니다")
    .max(100, "항목명은 100자 이하여야 합니다"),
  amount: z.number().positive("금액은 0보다 커야 합니다"),
})

export type SettlementItemFormData = z.infer<typeof settlementItemSchema>
