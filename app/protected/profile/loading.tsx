import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      {/* 프로필 헤더 스켈레톤 */}
      <Skeleton className="rounded-lg h-32" />

      {/* 프로필 정보 카드 스켈레톤 */}
      <Card className="p-6 -mt-16 relative z-10">
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>

          {/* 통계 섹션 */}
          <div className="pt-6 border-t space-y-4">
            <Skeleton className="h-6 w-20" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>

          {/* 상태 배지 */}
          <div className="pt-6 border-t space-y-4">
            <Skeleton className="h-6 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
