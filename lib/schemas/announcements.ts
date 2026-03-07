import { z } from "zod"

// 공지사항 생성/수정 스키마
export const announcementSchema = z.object({
  title: z
    .string()
    .min(1, "제목은 필수입니다")
    .max(100, "제목은 100자 이하여야 합니다"),
  content: z
    .string()
    .min(1, "내용은 필수입니다")
    .max(1000, "내용은 1000자 이하여야 합니다"),
  isPinned: z.boolean().default(false),
})

export type AnnouncementFormData = z.infer<typeof announcementSchema>
