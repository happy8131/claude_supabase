import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Profile } from "@/types/database"

interface ProfileCardProps {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필</CardTitle>
        <CardDescription>회원 정보</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.avatar_url && (
          <div className="flex justify-center">
            <img
              src={profile.avatar_url}
              alt={profile.full_name || "프로필"}
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
        )}
        {profile.full_name && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">이름</p>
            <p className="text-lg">{profile.full_name}</p>
          </div>
        )}
        {profile.username && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              사용자명
            </p>
            <p className="text-lg">@{profile.username}</p>
          </div>
        )}
        {profile.bio && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">소개</p>
            <p className="text-sm">{profile.bio}</p>
          </div>
        )}
        {profile.website && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              웹사이트
            </p>
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              {profile.website}
            </a>
          </div>
        )}
        <Link href="/protected/profile">
          <Button className="w-full">프로필 수정</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
