"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { EventFormData, eventFormSchema } from "@/lib/schemas/events"
import type { Event } from "@/lib/dummy-data"

type ActionResult = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

interface EventFormProps {
  action: "create" | "edit"
  eventId?: string
  initialData?: Event
  formAction: (formData: FormData) => Promise<ActionResult>
}

export function EventForm({
  action,
  eventId,
  initialData,
  formAction,
}: EventFormProps) {
  const router = useRouter()
  const isEdit = action === "edit"
  const [isPending, startTransition] = useTransition()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || null,
      eventDate: initialData
        ? new Date(initialData.date).toISOString().slice(0, 16)
        : "",
      location: initialData?.location || "",
      maxMembers: initialData?.maxMembers || null,
      autoApprove: initialData?.autoApprove ?? false,
    },
  })

  // 폼 제출 처리
  const onSubmit = (data: EventFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("description", data.description || "")
        formData.append("eventDate", data.eventDate)
        formData.append("location", data.location)
        if (data.maxMembers) {
          formData.append("maxMembers", String(data.maxMembers))
        }
        formData.append("autoApprove", data.autoApprove ? "on" : "off")

        // fileInputRef를 사용하여 파일 직접 가져오기
        const fileInput = fileInputRef.current
        if (fileInput?.files?.[0]) {
          formData.append("coverImageFile", fileInput.files[0])
        } else if (selectedFile) {
          formData.append("coverImageFile", selectedFile)
        }

        const result = await formAction(formData)

        if (!result.success) {
          // 검증 실패로 인한 필드별 에러
          if (result.errors) {
            Object.entries(result.errors).forEach(([field, messages]) => {
              const key = field as keyof EventFormData
              setError(key, {
                type: "server",
                message: Array.isArray(messages) ? messages[0] : messages,
              })
            })
          }
        } else {
          // 성공: 대시보드로 이동
          router.push("/protected")
        }
      } catch (error) {
        // 에러 처리 (redirect 제외)
        if ((error as Error).message?.includes("NEXT_REDIRECT")) {
          return
        }
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 제목 */}
      <div className="space-y-2">
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          placeholder="예: 주말 수영 모임"
          maxLength={100}
          {...register("title")}
          aria-invalid={!!errors.title}
        />
        {errors.title?.message && (
          <p className="text-xs text-red-500">{String(errors.title.message)}</p>
        )}
        <p className="text-xs text-muted-foreground">최대 100자</p>
      </div>

      {/* 커버 이미지 */}
      <div className="space-y-2">
        <Label htmlFor="coverImage">커버 이미지</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            ref={fileInputRef}
            id="coverImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setSelectedFile(file)
              }
            }}
          />
          <label htmlFor="coverImage" className="cursor-pointer block">
            {selectedFile ? (
              <div className="text-sm text-green-600">
                <p className="font-medium">✓ {selectedFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  이미지를 드래그하거나 클릭하여 업로드하세요
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPEG, PNG, WebP (최대 5MB)
                </p>
              </>
            )}
          </label>
        </div>
        {errors.coverImageFile?.message && (
          <p className="text-xs text-red-500">
            {String(errors.coverImageFile.message)}
          </p>
        )}
      </div>

      {/* 설명 */}
      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          placeholder="모임에 대해 설명해주세요"
          rows={4}
          {...register("description")}
          aria-invalid={!!errors.description}
        />
        {errors.description?.message && (
          <p className="text-xs text-red-500">{String(errors.description.message)}</p>
        )}
      </div>

      {/* 날짜/시간 */}
      <div className="space-y-2">
        <Label htmlFor="eventDate">날짜 및 시간 *</Label>
        <Input
          id="eventDate"
          type="datetime-local"
          {...register("eventDate")}
          aria-invalid={!!errors.eventDate}
        />
        {errors.eventDate?.message && (
          <p className="text-xs text-red-500">{String(errors.eventDate.message)}</p>
        )}
      </div>

      {/* 장소 */}
      <div className="space-y-2">
        <Label htmlFor="location">장소 *</Label>
        <Input
          id="location"
          placeholder="예: 서울 강남 수영장"
          {...register("location")}
          aria-invalid={!!errors.location}
        />
        {errors.location?.message && (
          <p className="text-xs text-red-500">{String(errors.location.message)}</p>
        )}
      </div>

      {/* 최대 인원 */}
      <div className="space-y-2">
        <Label htmlFor="maxMembers">최대 인원 (선택)</Label>
        <Input
          id="maxMembers"
          type="number"
          placeholder="입력하지 않으면 무제한"
          min={1}
          {...register("maxMembers", { valueAsNumber: true })}
          aria-invalid={!!errors.maxMembers}
        />
        {errors.maxMembers?.message && (
          <p className="text-xs text-red-500">{String(errors.maxMembers.message)}</p>
        )}
      </div>

      {/* 승인 방식 */}
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <Label htmlFor="autoApprove" className="cursor-pointer">
          자동 승인 (참여 신청 즉시 승인)
        </Label>
        <Switch id="autoApprove" {...register("autoApprove")} />
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
          disabled={isPending}
        >
          취소
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "처리 중..." : isEdit ? "수정" : "만들기"}
        </Button>
      </div>
    </form>
  )
}
