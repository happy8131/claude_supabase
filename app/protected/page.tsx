import { InfoIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { ProfileCard } from "@/components/profile-card"
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps"
import { createClient } from "@/lib/supabase/server"

async function UserDetails() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect("/auth/login")
  }

  return JSON.stringify(data.claims, null, 2)
}

async function UserProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    return null
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    return null
  }

  return <ProfileCard profile={profile} />
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          <Suspense>
            <UserDetails />
          </Suspense>
        </pre>
      </div>
      <div className="max-w-md">
        <Suspense fallback={<div>프로필 로딩 중...</div>}>
          <UserProfile />
        </Suspense>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  )
}
