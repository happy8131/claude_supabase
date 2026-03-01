import { redirect } from "next/navigation"

import { ProfileForm } from "@/components/profile-form"
import { createClient } from "@/lib/supabase/server"

async function GetUserProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/protected")
  }

  return profile
}

export default async function ProfilePage() {
  const profile = await GetUserProfile()

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full max-w-md mx-auto">
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}
