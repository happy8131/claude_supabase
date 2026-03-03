import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, MapPin, Clock } from "lucide-react"

const dummyCarpools = [
  {
    id: "1",
    area: "강남역",
    driver: "박민준",
    time: "10:00",
    passengers: 2,
    seats: 3,
  },
  {
    id: "2",
    area: "서초동",
    driver: "정수진",
    time: "10:15",
    passengers: 1,
    seats: 2,
  },
]

export default function CarpoolPage() {
  return (
    <div className="space-y-6">
      {/* 카풀 그룹 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">매칭된 카풀</h3>
        <div className="space-y-3">
          {dummyCarpools.map((carpool) => (
            <Card key={carpool.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="font-semibold">{carpool.area} 출발</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{carpool.time} 출발</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        운전자: {carpool.driver} (
                        {carpool.seats - carpool.passengers} 자리 남음)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 운전자/탑승 등록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 운전자 등록 */}
        <Card className="p-4 space-y-3 border-dashed">
          <h4 className="font-semibold">운전자 등록</h4>
          <Input placeholder="출발 지역" />
          <Input type="time" />
          <Input type="number" placeholder="가능한 좌석 수" min={1} />
          <Button className="w-full">등록</Button>
        </Card>

        {/* 탑승 희망 */}
        <Card className="p-4 space-y-3 border-dashed">
          <h4 className="font-semibold">탑승 희망</h4>
          <Input placeholder="희망 출발 지역" />
          <Button className="w-full">신청</Button>
        </Card>
      </div>

      {/* 매칭 버튼 (주최자만) */}
      <Button variant="outline" className="w-full">
        카풀 매칭 처리
      </Button>
    </div>
  )
}
