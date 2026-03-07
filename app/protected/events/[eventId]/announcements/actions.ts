"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { announcementSchema } from "@/lib/schemas/announcements"

export type ActionResult<T = unknown> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

// 공지사항 생성
export async function createAnnouncement(
  eventId: string,
  title: string,
  content: string,
  isPinned: boolean,
): Promise<ActionResult<{ announcementId: string }>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // Zod 검증
    const validated = announcementSchema.safeParse({
      title,
      content,
      isPinned,
    })

    if (!validated.success) {
      return {
        success: false,
        message: "입력 값 검증 실패",
        errors: validated.error.flatten().fieldErrors,
      }
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

    // 공지사항 삽입
    const { data, error } = await supabase
      .from("announcements")
      .insert([
        {
          event_id: eventId,
          author_id: user.id,
          title: validated.data.title,
          content: validated.data.content,
          is_pinned: validated.data.isPinned,
        },
      ])
      .select()

    if (error || !data?.[0]) {
      return {
        success: false,
        message: `공지사항 생성 실패: ${error?.message || "알 수 없는 오류"}`,
      }
    }

    revalidatePath(`/protected/events/${eventId}/announcements`)

    return {
      success: true,
      message: "공지사항이 생성되었습니다",
      data: { announcementId: data[0].id },
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}

// 공지사항 수정
export async function updateAnnouncement(
  announcementId: string,
  title: string,
  content: string,
  isPinned: boolean,
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // Zod 검증
    const validated = announcementSchema.safeParse({
      title,
      content,
      isPinned,
    })

    if (!validated.success) {
      return {
        success: false,
        message: "입력 값 검증 실패",
        errors: validated.error.flatten().fieldErrors,
      }
    }

    // 공지사항 작성자 확인
    const { data: announcement, error: announcementError } = await supabase
      .from("announcements")
      .select("event_id, author_id")
      .eq("id", announcementId)
      .single()

    if (
      announcementError ||
      !announcement ||
      announcement.author_id !== user.id
    ) {
      return { success: false, message: "권한이 없습니다" }
    }

    // 공지사항 수정
    const { error } = await supabase
      .from("announcements")
      .update({
        title: validated.data.title,
        content: validated.data.content,
        is_pinned: validated.data.isPinned,
      })
      .eq("id", announcementId)

    if (error) {
      return {
        success: false,
        message: `공지사항 수정 실패: ${error.message}`,
      }
    }

    revalidatePath(
      `/protected/events/${announcement.event_id}/announcements`,
    )

    return {
      success: true,
      message: "공지사항이 수정되었습니다",
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}

// 공지사항 삭제
export async function deleteAnnouncement(
  announcementId: string,
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // 공지사항 작성자 확인
    const { data: announcement, error: announcementError } = await supabase
      .from("announcements")
      .select("event_id, author_id")
      .eq("id", announcementId)
      .single()

    if (
      announcementError ||
      !announcement ||
      announcement.author_id !== user.id
    ) {
      return { success: false, message: "권한이 없습니다" }
    }

    // 공지사항 삭제
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", announcementId)

    if (error) {
      return {
        success: false,
        message: `공지사항 삭제 실패: ${error.message}`,
      }
    }

    revalidatePath(
      `/protected/events/${announcement.event_id}/announcements`,
    )

    return {
      success: true,
      message: "공지사항이 삭제되었습니다",
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}

// 공지사항 고정 토글
export async function togglePin(announcementId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // 공지사항 작성자 확인 및 현재 상태 조회
    const { data: announcement, error: announcementError } = await supabase
      .from("announcements")
      .select("event_id, author_id, is_pinned")
      .eq("id", announcementId)
      .single()

    if (
      announcementError ||
      !announcement ||
      announcement.author_id !== user.id
    ) {
      return { success: false, message: "권한이 없습니다" }
    }

    // 고정 상태 토글
    const { error } = await supabase
      .from("announcements")
      .update({ is_pinned: !announcement.is_pinned })
      .eq("id", announcementId)

    if (error) {
      return {
        success: false,
        message: `공지사항 고정 변경 실패: ${error.message}`,
      }
    }

    revalidatePath(
      `/protected/events/${announcement.event_id}/announcements`,
    )

    return {
      success: true,
      message: announcement.is_pinned ? "고정을 해제했습니다" : "고정했습니다",
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}
