"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Profile } from "@/types/database"

import { updateProfile } from "./actions"

interface ProfileFormProps {
  profile: Profile | null
  onSuccess?: () => void
}

export function ProfileForm({ profile, onSuccess }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateProfile(formData)
        alert("프로필이 업데이트되었습니다")
        onSuccess?.()
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "프로필 업데이트에 실패했습니다",
        )
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* 사용자명 */}
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium">
          사용자명
        </label>
        <Input
          id="username"
          name="username"
          defaultValue={profile?.username || ""}
          placeholder="사용자명을 입력하세요"
          disabled={isPending}
          aria-label="사용자명"
        />
      </div>

      {/* 이름 */}
      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-medium">
          이름
        </label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={profile?.full_name || ""}
          placeholder="이름을 입력하세요"
          disabled={isPending}
          aria-label="이름"
        />
      </div>

      {/* 자기소개 */}
      <div className="space-y-2">
        <label htmlFor="bio" className="block text-sm font-medium">
          자기소개
        </label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile?.bio || ""}
          placeholder="자기소개를 입력하세요"
          disabled={isPending}
          aria-label="자기소개"
          rows={4}
        />
      </div>

      {/* 웹사이트 */}
      <div className="space-y-2">
        <label htmlFor="website" className="block text-sm font-medium">
          웹사이트
        </label>
        <Input
          id="website"
          name="website"
          type="url"
          defaultValue={profile?.website || ""}
          placeholder="https://example.com"
          disabled={isPending}
          aria-label="웹사이트"
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  )
}
