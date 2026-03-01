"use client"

import { useFormStatus } from "react-dom"

import { updateProfile } from "@/app/protected/profile/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Profile } from "@/types/database"

interface ProfileFormProps {
  profile: Profile
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "저장 중..." : "저장"}
    </Button>
  )
}

export function ProfileForm({ profile }: ProfileFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 수정</CardTitle>
        <CardDescription>회원 정보를 수정하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">이름</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={profile.full_name || ""}
              placeholder="이름을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">사용자명</Label>
            <Input
              id="username"
              name="username"
              defaultValue={profile.username || ""}
              placeholder="사용자명을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">소개</Label>
            <Input
              id="bio"
              name="bio"
              defaultValue={profile.bio || ""}
              placeholder="간단한 소개를 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">웹사이트</Label>
            <Input
              id="website"
              name="website"
              type="url"
              defaultValue={profile.website || ""}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">프로필 이미지 URL</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              defaultValue={profile.avatar_url || ""}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
