"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

export type ActionResult<T = unknown> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

export async function applyToEvent(token: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 비인증 상태면 로그인 페이지로 리다이렉트
    if (!user?.id) {
      redirect(`/auth/login?next=/events/share/${token}`)
    }

    // token으로 이벤트 조회
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, max_members, require_approval, status")
      .eq("share_token", token)
      .single()

    if (eventError || !event) {
      return { success: false, message: "이벤트를 찾을 수 없습니다" }
    }

    // 이미 참여했는지 확인
    const { data: existingMember } = await supabase
      .from("event_members")
      .select("id")
      .eq("event_id", event.id)
      .eq("user_id", user.id)
      .single()

    if (existingMember) {
      return {
        success: false,
        message: "이미 참여했거나 신청 중인 이벤트입니다",
      }
    }

    // 참가자 수 조회
    const { count: memberCount, error: countError } = await supabase
      .from("event_members")
      .select("*", { count: "exact" })
      .eq("event_id", event.id)
      .eq("status", "approved")

    if (countError) {
      return { success: false, message: "참가자 수 조회 실패" }
    }

    // 상태 결정
    let status = "pending"

    // 자동 승인인 경우
    if (!event.require_approval) {
      status = "approved"
    }

    // 정원이 있고 초과한 경우
    if (event.max_members && (memberCount || 0) >= event.max_members) {
      status = "waitlisted"
    }

    // event_members 테이블에 INSERT
    const { data: member, error: insertError } = await supabase
      .from("event_members")
      .insert([
        {
          event_id: event.id,
          user_id: user.id,
          status,
        },
      ])
      .select()

    if (insertError || !member?.[0]) {
      return {
        success: false,
        message: `참여 신청 실패: ${insertError?.message || "알 수 없는 오류"}`,
      }
    }

    revalidatePath(`/protected/events/${event.id}`)
    redirect(`/protected/events/${event.id}`)
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}
