"use client"

import { Edit2, X } from "lucide-react"
import { useState } from "react"

import { LogoutButton } from "@/components/logout-button"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Profile } from "@/types/database"

import { PasswordChangeForm } from "./password-change-form"
import { ProfileForm } from "./profile-form"

interface ProfileEditSectionProps {
  profile: Profile | null
}

export function ProfileEditSection({ profile }: ProfileEditSectionProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile")

  return (
    <>
      {/* 버튼 그룹 */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            setShowEdit(!showEdit)
            setActiveTab("profile")
          }}
          aria-label={showEdit ? "수정 폼 닫기" : "프로필 수정"}
        >
          <Edit2 className="w-4 h-4" />
          <span className="hidden sm:inline">수정</span>
        </Button>
        <LogoutButton />
      </div>

      {/* 수정 폼 - 모달 형태 */}
      {showEdit && (
        <Card className="p-6 mt-6 border-blue-200 bg-blue-50/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("profile")}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === "profile"
                    ? "border-blue-600 text-blue-600 font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                aria-label="프로필 수정 탭"
              >
                프로필 수정
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === "password"
                    ? "border-blue-600 text-blue-600 font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                aria-label="비밀번호 변경 탭"
              >
                비밀번호 변경
              </button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEdit(false)}
              aria-label="폼 닫기"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* 프로필 수정 폼 */}
          {activeTab === "profile" && (
            <ProfileForm
              profile={profile}
              onSuccess={() => setShowEdit(false)}
            />
          )}

          {/* 비밀번호 변경 폼 */}
          {activeTab === "password" && <PasswordChangeForm />}
        </Card>
      )}
    </>
  )
}
