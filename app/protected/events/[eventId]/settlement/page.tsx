import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

import { PaymentMarkPaid } from "./payment-mark-paid"
import { SettlementItemDelete } from "./settlement-item-delete"
import { SettlementItemForm } from "./settlement-item-form"

interface SettlementPageProps {
  params: Promise<{
    eventId: string
  }>
}

export default async function SettlementPage({ params }: SettlementPageProps) {
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

  // 정산 정보 조회
  const { data: settlement } = await supabase
    .from("settlements")
    .select("id, total_amount")
    .eq("event_id", eventId)
    .single()

  // 정산 항목 조회
  const { data: items } = await supabase
    .from("settlement_items")
    .select("id, name, amount, paid_by")
    .eq("settlement_id", settlement?.id || "")

  // 각 항목의 지불자 정보 조회
  const itemsWithProfile = await Promise.all(
    (items || []).map(async (item) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", item.paid_by || "")
        .single()

      return {
        ...item,
        paidByName: profile?.full_name || "알 수 없음",
      }
    }),
  )

  // 정산 납부 현황 조회
  const { data: payments } = await supabase
    .from("settlement_payments")
    .select("id, user_id, amount_owed, status")
    .eq("settlement_id", settlement?.id || "")

  // 각 납부자의 프로필 정보 조회
  const paymentsWithProfile = await Promise.all(
    (payments || []).map(async (payment) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", payment.user_id)
        .single()

      return {
        ...payment,
        name: profile?.full_name || "알 수 없음",
      }
    }),
  )

  // 참여자 수 계산
  const participantCount = paymentsWithProfile.length
  const perPerson =
    participantCount > 0
      ? Math.round((settlement?.total_amount || 0) / participantCount)
      : 0

  return (
    <div className="space-y-6">
      {/* 비용 항목 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">비용 항목</h3>
        {itemsWithProfile.length > 0 ? (
          <div className="space-y-2">
            {itemsWithProfile.map((item) => (
              <Card
                key={item.id}
                className="p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.paidByName}가 {item.amount.toLocaleString()}원 지불
                  </p>
                </div>
                {isHost && <SettlementItemDelete itemId={item.id} />}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            등록된 비용 항목이 없습니다.
          </p>
        )}
      </div>

      {/* 항목 추가 (주최자만) */}
      {isHost && settlement && (
        <SettlementItemForm settlementId={settlement.id} userId={user?.id} />
      )}

      {/* 1/N 계산 버튼 (주최자만) */}
      {isHost && settlement && (
        <Button variant="outline" className="w-full">
          1/N 계산
        </Button>
      )}

      {/* 정산 요약 */}
      {settlement && (
        <Card className="p-4 bg-muted space-y-2">
          <p className="text-sm text-muted-foreground">총 비용</p>
          <p className="text-3xl font-bold">
            {settlement.total_amount.toLocaleString()}원
          </p>
          <p className="text-sm text-muted-foreground">
            {participantCount}명 ÷ {perPerson.toLocaleString()}원
          </p>
        </Card>
      )}

      {/* 납부 현황 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">납부 현황</h3>
        {paymentsWithProfile.length > 0 ? (
          <div className="space-y-2">
            {paymentsWithProfile.map((payment) => (
              <Card
                key={payment.id}
                className="p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{payment.name}</p>
                  <p className="text-sm">
                    {payment.amount_owed === 0
                      ? "완납"
                      : `${payment.amount_owed.toLocaleString()}원 납부 필요`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      payment.status === "paid" ? "secondary" : "destructive"
                    }
                  >
                    {payment.status === "paid" ? "완납" : "미납"}
                  </Badge>
                  {payment.amount_owed > 0 && (
                    <PaymentMarkPaid paymentId={payment.id} />
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            납부 현황 데이터가 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}
