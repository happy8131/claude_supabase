import { Clock, Users } from "lucide-react"

import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

import { CarpoolDriverForm } from "./carpool-driver-form"
import { CarpoolMatchButton } from "./carpool-match-button"
import { CarpoolPassengerForm } from "./carpool-passenger-form"

interface CarpoolPageProps {
  params: Promise<{
    eventId: string
  }>
}

export default async function CarpoolPage({ params }: CarpoolPageProps) {
  const { eventId } = await params

  const supabase = await createClient()

  // 현재 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 이벤트의 주최자 확인
  const { data: event } = await supabase
    .from("events")
    .select("host_id")
    .eq("id", eventId)
    .single()

  const isHost = Boolean(event && event.host_id === user?.id)

  // 카풀 드라이버 조회
  const { data: drivers } = await supabase
    .from("carpool_drivers")
    .select(
      "id, driver_id, departure_area, departure_time, available_seats, current_seats",
    )
    .eq("event_id", eventId)

  // 각 드라이버의 프로필 정보 조회
  const driversWithProfile = await Promise.all(
    (drivers || []).map(async (driver) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", driver.driver_id)
        .single()

      // 승객 수 조회
      const { count: passengerCount } = await supabase
        .from("carpool_passengers")
        .select("*", { count: "exact", head: true })
        .eq("driver_id", driver.id)
        .eq("status", "matched")

      return {
        ...driver,
        driverName: profile?.full_name || "알 수 없음",
        passengerCount: passengerCount || 0,
      }
    }),
  )

  return (
    <div className="space-y-6">
      {/* 카풀 그룹 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">매칭된 카풀</h3>
        {driversWithProfile.length > 0 ? (
          <div className="space-y-3">
            {driversWithProfile.map((driver) => (
              <Card key={driver.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="font-semibold">
                      {driver.departure_area} 출발
                    </p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {driver.departure_time
                            ? new Date(
                                driver.departure_time,
                              ).toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "시간 미정"}{" "}
                          출발
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                          운전자: {driver.driverName} (
                          {driver.available_seats - driver.passengerCount} 자리
                          남음)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            등록된 카풀이 없습니다.
          </p>
        )}
      </div>

      {/* 운전자/탑승 등록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CarpoolDriverForm eventId={eventId} />
        <CarpoolPassengerForm eventId={eventId} />
      </div>

      {/* 매칭 버튼 (주최자만) */}
      {isHost && <CarpoolMatchButton eventId={eventId} />}
    </div>
  )
}
