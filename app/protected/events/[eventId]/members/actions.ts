"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

export type ActionResult<T = unknown> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

// 참여자 승인
export async function approveMember(
  eventId: string,
  memberId: string,
): Promise<ActionResult> {
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

    // 참여자 상태 업데이트
    const { error } = await supabase
      .from("event_members")
      .update({ status: "approved" })
      .eq("event_id", eventId)
      .eq("user_id", memberId)

    if (error) {
      return {
        success: false,
        message: `참여자 승인 실패: ${error.message}`,
      }
    }

    revalidatePath(`/protected/events/${eventId}/members`)

    return {
      success: true,
      message: "참여자를 승인했습니다",
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}

// 참여자 거절
export async function rejectMember(
  eventId: string,
  memberId: string,
): Promise<ActionResult> {
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

    // 참여자 삭제
    const { error } = await supabase
      .from("event_members")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", memberId)

    if (error) {
      return {
        success: false,
        message: `참여자 거절 실패: ${error.message}`,
      }
    }

    revalidatePath(`/protected/events/${eventId}/members`)

    return {
      success: true,
      message: "참여자를 거절했습니다",
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}

// 참여자 제거
export async function removeMember(
  eventId: string,
  memberId: string,
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // 본인이거나 이벤트 주최자 확인
    if (user.id !== memberId) {
      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("host_id")
        .eq("id", eventId)
        .single()

      if (eventError || !event || event.host_id !== user.id) {
        return { success: false, message: "권한이 없습니다" }
      }
    }

    // 참여자 삭제
    const { error } = await supabase
      .from("event_members")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", memberId)

    if (error) {
      return {
        success: false,
        message: `참여자 제거 실패: ${error.message}`,
      }
    }

    revalidatePath(`/protected/events/${eventId}/members`)

    return {
      success: true,
      message: "참여자를 제거했습니다",
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}
