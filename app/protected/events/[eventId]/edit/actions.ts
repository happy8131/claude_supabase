"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { eventFormSchema } from "@/lib/schemas/events"

export type ActionResult<T = unknown> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

export async function updateEvent(
  eventId: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // 이벤트 소유권 확인
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("host_id, cover_image_url")
      .eq("id", eventId)
      .single()

    if (eventError || !event) {
      return { success: false, message: "이벤트를 찾을 수 없습니다" }
    }

    if (event.host_id !== user.id) {
      return { success: false, message: "이 이벤트를 수정할 권한이 없습니다" }
    }

    // FormData를 객체로 변환
    const coverImageFileEntry = formData.get("coverImageFile")
    const coverImageFile =
      coverImageFileEntry instanceof File && coverImageFileEntry.size > 0
        ? coverImageFileEntry
        : null

    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      eventDate: formData.get("eventDate"),
      location: formData.get("location"),
      maxMembers: formData.get("maxMembers")
        ? Number(formData.get("maxMembers"))
        : undefined,
      autoApprove: formData.get("autoApprove") === "on",
      coverImageFile,
    }

    // Zod 검증
    const validated = eventFormSchema.safeParse(rawData)
    if (!validated.success) {
      console.error("Zod 검증 실패:", validated.error.flatten())
      return {
        success: false,
        message: "입력 값 검증 실패",
        errors: validated.error.flatten().fieldErrors,
      }
    }

    // 파일 검증 (Server Action에서 수행)
    if (
      validated.data.coverImageFile &&
      validated.data.coverImageFile instanceof File
    ) {
      const file = validated.data.coverImageFile

      // 파일 크기 검증
      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          message: "이미지는 5MB 이하여야 합니다",
          errors: { coverImageFile: ["이미지는 5MB 이하여야 합니다"] },
        }
      }

      // 파일 타입 검증
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        return {
          success: false,
          message: "JPEG, PNG, WebP 형식만 지원합니다",
          errors: { coverImageFile: ["JPEG, PNG, WebP 형식만 지원합니다"] },
        }
      }
    }

    let coverImageUrl = event.cover_image_url

    // 새로운 이미지 업로드 처리
    if (
      validated.data.coverImageFile &&
      validated.data.coverImageFile instanceof File
    ) {
      try {
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("event-covers")
          .upload(fileName, validated.data.coverImageFile, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          console.error("이미지 업로드 오류:", uploadError)
        } else {
          const {
            data: { publicUrl },
          } = supabase.storage.from("event-covers").getPublicUrl(fileName)
          coverImageUrl = publicUrl
        }
      } catch (imgError) {
        console.error("이미지 처리 오류:", imgError)
      }
    }

    // DB update
    const { error: updateError } = await supabase
      .from("events")
      .update({
        title: validated.data.title,
        description: validated.data.description,
        event_date: validated.data.eventDate,
        location: validated.data.location,
        max_members: validated.data.maxMembers,
        require_approval: !validated.data.autoApprove,
        cover_image_url: coverImageUrl,
      })
      .eq("id", eventId)

    if (updateError) {
      return {
        success: false,
        message: `이벤트 수정 실패: ${updateError.message}`,
      }
    }

    revalidatePath("/protected")

    return {
      success: true,
      message: "이벤트가 수정되었습니다",
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}

export async function deleteEvent(eventId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
    }

    // 이벤트 소유권 확인
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("host_id")
      .eq("id", eventId)
      .single()

    if (eventError || !event) {
      return { success: false, message: "이벤트를 찾을 수 없습니다" }
    }

    if (event.host_id !== user.id) {
      return { success: false, message: "이 이벤트를 삭제할 권한이 없습니다" }
    }

    // DB delete (CASCADE 적용됨)
    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId)

    if (deleteError) {
      return {
        success: false,
        message: `이벤트 삭제 실패: ${deleteError.message}`,
      }
    }

    revalidatePath("/protected")

    return {
      success: true,
      message: "이벤트가 삭제되었습니다",
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}
