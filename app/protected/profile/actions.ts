"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import type { ProfileUpdate } from "@/types/database"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    throw new Error("인증되지 않았습니다")
  }

  const fullName = formData.get("fullName") as string
  const bio = formData.get("bio") as string
  const website = formData.get("website") as string
  const username = formData.get("username") as string

  const updates: ProfileUpdate = {
    username: username || null,
    full_name: fullName || null,
    bio: bio || null,
    website: website || null,
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)

  if (error) {
    throw new Error(`프로필 업데이트 실패: ${error.message}`)
  }

  revalidatePath("/protected/profile")
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    throw new Error("인증되지 않았습니다")
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw new Error(`비밀번호 변경 실패: ${error.message}`)
  }
}
