import { z } from "zod"

// 운전자 등록 스키마
export const registerDriverSchema = z.object({
  departureArea: z
    .string()
    .min(1, "출발 지역은 필수입니다")
    .max(100, "출발 지역은 100자 이하여야 합니다"),
  departureTime: z.string().datetime("유효한 시간이 필요합니다"),
  availableSeats: z
    .number()
    .int()
    .positive("탑승 가능한 좌석은 1개 이상이어야 합니다"),
})

export type RegisterDriverData = z.infer<typeof registerDriverSchema>

// 탑승자 등록 스키마
export const registerPassengerSchema = z.object({
  departureArea: z
    .string()
    .min(1, "출발 지역은 필수입니다")
    .max(100, "출발 지역은 100자 이하여야 합니다"),
})

export type RegisterPassengerData = z.infer<typeof registerPassengerSchema>
