"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { updatePassword } from "./actions"

export function PasswordChangeForm() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // 클라이언트 검증
    if (!newPassword || !confirmPassword) {
      setError("모든 필드를 입력해주세요")
      return
    }

    if (newPassword.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다")
      return
    }

    startTransition(async () => {
      try {
        await updatePassword(newPassword)
        alert("비밀번호가 변경되었습니다")
        setNewPassword("")
        setConfirmPassword("")
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "비밀번호 변경에 실패했습니다",
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 새 비밀번호 */}
      <div className="space-y-2">
        <label htmlFor="newPassword" className="block text-sm font-medium">
          새 비밀번호
        </label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="최소 6자"
          disabled={isPending}
          aria-label="새 비밀번호"
        />
      </div>

      {/* 비밀번호 확인 */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          비밀번호 확인
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호를 다시 입력하세요"
          disabled={isPending}
          aria-label="비밀번호 확인"
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div
          role="alert"
          className="p-3 bg-red-50 text-red-700 rounded text-sm"
        >
          {error}
        </div>
      )}

      {/* 버튼 */}
      <Button type="submit" disabled={isPending} aria-busy={isPending}>
        {isPending ? "변경 중..." : "비밀번호 변경"}
      </Button>
    </form>
  )
}
