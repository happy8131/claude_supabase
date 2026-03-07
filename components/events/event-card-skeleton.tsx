import { Card } from "@/components/ui/card"

export function EventCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* 이미지 placeholder */}
        <div className="w-full h-[200px] bg-gray-200 rounded-lg animate-pulse" />

        {/* 제목 및 배지 영역 */}
        <div className="flex items-start justify-between gap-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse flex-1" />
          <div className="h-5 w-12 bg-gray-200 rounded animate-pulse shrink-0" />
        </div>

        {/* 날짜, 장소 영역 */}
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>

        {/* 참여자 수 영역 */}
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 pt-1 border-t border-gray-200" />
      </div>
    </Card>
  )
}
