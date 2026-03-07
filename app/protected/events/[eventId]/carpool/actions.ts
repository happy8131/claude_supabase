"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import {
  registerDriverSchema,
  registerPassengerSchema,
} from "@/lib/schemas/carpool"

export type ActionResult<T = unknown> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

// 운전자 등록
export async function registerDriver(
  eventId: string,
  departureArea: string,
  departureTime: string,
  availableSeats: number,
): Promise<ActionResult<{ driverId: string }>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // Zod 검증
    const validated = registerDriverSchema.safeParse({
      departureArea,
      departureTime,
      availableSeats,
    })

    if (!validated.success) {
      return {
        success: false,
        message: "입력 값 검증 실패",
        errors: validated.error.flatten().fieldErrors,
      }
    }

    // 이미 운전자로 등록되었는지 확인
    const { data: existingDriver } = await supabase
      .from("carpool_drivers")
      .select("id")
      .eq("event_id", eventId)
      .eq("driver_id", user.id)
      .single()

    if (existingDriver) {
      return {
        success: false,
        message: "이미 운전자로 등록되었습니다",
      }
    }

    // 운전자 등록
    const { data, error } = await supabase
      .from("carpool_drivers")
      .insert([
        {
          event_id: eventId,
          driver_id: user.id,
          departure_area: validated.data.departureArea,
          departure_time: validated.data.departureTime,
          available_seats: validated.data.availableSeats,
        },
      ])
      .select()

    if (error || !data?.[0]) {
      return {
        success: false,
        message: `운전자 등록 실패: ${error?.message || "알 수 없는 오류"}`,
      }
    }

    revalidatePath(`/protected/events/${eventId}/carpool`)

    return {
      success: true,
      message: "운전자로 등록되었습니다",
      data: { driverId: data[0].id },
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}

// 탑승자 등록
export async function registerPassenger(
  eventId: string,
  departureArea: string,
): Promise<ActionResult<{ passengerId: string }>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // Zod 검증
    const validated = registerPassengerSchema.safeParse({
      departureArea,
    })

    if (!validated.success) {
      return {
        success: false,
        message: "입력 값 검증 실패",
        errors: validated.error.flatten().fieldErrors,
      }
    }

    // 이미 탑승자로 등록되었는지 확인
    const { data: existingPassenger } = await supabase
      .from("carpool_passengers")
      .select("id")
      .eq("event_id", eventId)
      .eq("passenger_id", user.id)
      .single()

    if (existingPassenger) {
      return {
        success: false,
        message: "이미 탑승자로 등록되었습니다",
      }
    }

    // 탑승자 등록
    const { data, error } = await supabase
      .from("carpool_passengers")
      .insert([
        {
          event_id: eventId,
          passenger_id: user.id,
          departure_area: validated.data.departureArea,
        },
      ])
      .select()

    if (error || !data?.[0]) {
      return {
        success: false,
        message: `탑승자 등록 실패: ${error?.message || "알 수 없는 오류"}`,
      }
    }

    revalidatePath(`/protected/events/${eventId}/carpool`)

    return {
      success: true,
      message: "탑승자로 등록되었습니다",
      data: { passengerId: data[0].id },
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}

// 카풀 매칭 (주최자만)
export async function matchCarpool(eventId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // 이벤트 주최자 확인
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("host_id")
      .eq("id", eventId)
      .single()

    if (eventError || !event || event.host_id !== user.id) {
      return { success: false, message: "권한이 없습니다" }
    }

    // 모든 운전자와 탑승자 조회
    const { data: drivers } = await supabase
      .from("carpool_drivers")
      .select("*")
      .eq("event_id", eventId)

    const { data: passengers } = await supabase
      .from("carpool_passengers")
      .select("*")
      .eq("event_id", eventId)

    if (!drivers || !passengers) {
      return {
        success: true,
        message: "매칭할 운전자 또는 탑승자가 없습니다",
      }
    }

    // 지역별 매칭 로직
    const matches: Array<{
      driver_id: string
      passenger_id: string
    }> = []

    const driversWithSeats = drivers.map((d) => ({
      ...d,
      remaining_seats: d.available_seats,
    }))

    for (const passenger of passengers) {
      for (const driver of driversWithSeats) {
        if (
          driver.departure_area === passenger.departure_area &&
          driver.remaining_seats > 0
        ) {
          matches.push({
            driver_id: driver.id,
            passenger_id: passenger.id,
          })
          driver.remaining_seats -= 1
          break
        }
      }
    }

    revalidatePath(`/protected/events/${eventId}/carpool`)

    return {
      success: true,
      message: `${matches.length}개의 매칭이 완료되었습니다`,
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}

// 카풀 등록 취소
export async function cancelCarpool(
  carpoolId: string,
  carpoolType: "driver" | "passenger",
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    const table =
      carpoolType === "driver" ? "carpool_drivers" : "carpool_passengers"
    const userIdColumn = carpoolType === "driver" ? "driver_id" : "passenger_id"

    // 카풀 등록 정보 조회
    const { data: carpool, error: carpoolError } = await supabase
      .from(table)
      .select("event_id")
      .eq("id", carpoolId)
      .eq(userIdColumn, user.id)
      .single()

    if (carpoolError || !carpool) {
      return { success: false, message: "권한이 없습니다" }
    }

    // 카풀 등록 취소
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", carpoolId)

    if (error) {
      return {
        success: false,
        message: `카풀 등록 취소 실패: ${error.message}`,
      }
    }

    revalidatePath(`/protected/events/${carpool.event_id}/carpool`)

    return {
      success: true,
      message: "카풀 등록이 취소되었습니다",
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}
