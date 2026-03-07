"use server"

import { revalidatePath } from "next/cache"

import { eventFormSchema } from "@/lib/schemas/events"
import { createClient } from "@/lib/supabase/server"

export type ActionResult<T = unknown> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

export async function createEvent(
  formData: FormData,
): Promise<ActionResult<{ eventId: string }>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return { success: false, message: "로그인이 필요합니다" }
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
      console.log("파일 검증 중:", file.name, file.size, file.type)

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

    // share_token 생성
    const shareToken = Math.random().toString(36).substring(2, 14)

    let coverImageUrl: string | null = null

    // 이미지 업로드 처리
    if (
      validated.data.coverImageFile &&
      validated.data.coverImageFile.size > 0
    ) {
      try {
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}`
        console.log(
          "이미지 업로드 시작:",
          fileName,
          validated.data.coverImageFile.type,
        )

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("event-covers")
          .upload(fileName, validated.data.coverImageFile, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          console.error("이미지 업로드 오류:", uploadError)
          // 이미지 업로드 실패는 치명적이지 않으므로 계속 진행
        } else {
          console.log("이미지 업로드 성공:", uploadData)
          const publicUrlResult = supabase.storage
            .from("event-covers")
            .getPublicUrl(fileName)
          console.log("공개 URL 생성:", publicUrlResult)

          if (publicUrlResult.data?.publicUrl) {
            coverImageUrl = publicUrlResult.data.publicUrl
            console.log("최종 이미지 URL:", coverImageUrl)
          }
        }
      } catch (imgError) {
        console.error("이미지 처리 오류:", imgError)
      }
    }

    // DB insert
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          host_id: user.id,
          title: validated.data.title,
          description: validated.data.description,
          event_date: validated.data.eventDate,
          location: validated.data.location,
          max_members: validated.data.maxMembers,
          require_approval: !validated.data.autoApprove,
          share_token: shareToken,
          status: "published",
          cover_image_url: coverImageUrl,
        },
      ])
      .select()

    if (error || !data?.[0]) {
      return {
        success: false,
        message: `이벤트 생성 실패: ${error?.message || "알 수 없는 오류"}`,
      }
    }

    revalidatePath("/protected")

    return {
      success: true,
      message: "이벤트가 생성되었습니다",
      data: { eventId: data[0].id },
    }
  } catch (error) {
    return {
      success: false,
      message: `서버 오류: ${(error as Error).message}`,
    }
  }
}
