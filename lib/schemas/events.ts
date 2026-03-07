import { z } from "zod"

// 이벤트 생성/수정 폼 스키마
export const eventFormSchema = z.object({
  title: z
    .string()
    .min(1, "제목은 필수입니다")
    .max(100, "제목은 100자 이하여야 합니다"),
  description: z
    .string()
    .max(500, "설명은 500자 이하여야 합니다")
    .nullable()
    .optional(),
  eventDate: z.string().refine((date) => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime()) && parsed > new Date()
  }, "이벤트 날짜는 미래 시간이어야 합니다"),
  location: z
    .string()
    .min(1, "장소는 필수입니다")
    .max(200, "장소는 200자 이하여야 합니다"),
  maxMembers: z
    .number()
    .int()
    .positive("최대 인원은 1 이상이어야 합니다")
    .nullable()
    .optional(),
  autoApprove: z.boolean(),
  coverImageFile: z
    .any()
    .optional()
    .nullable(),
})

export type EventFormData = z.infer<typeof eventFormSchema>

// 이벤트 참여 신청 스키마
export const applyToEventSchema = z.object({
  eventId: z.string().uuid("유효한 이벤트 ID가 아닙니다"),
  token: z.string().min(1, "유효한 토큰이 필요합니다"),
})

export type ApplyToEventData = z.infer<typeof applyToEventSchema>
