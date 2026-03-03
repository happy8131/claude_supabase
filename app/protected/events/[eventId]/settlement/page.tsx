import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

const dummyItems = [
  { id: "1", name: "수영장 입장료", amount: 150000, paidBy: "박민준" },
  { id: "2", name: "음료 구매", amount: 30000, paidBy: "정수진" },
  { id: "3", name: "간식비", amount: 50000, paidBy: "박민준" },
]

const dummySettlement = {
  totalAmount: 230000,
  participants: 5,
  perPerson: 46000,
}

const dummyPayments = [
  { id: "1", name: "김철수", owed: 46000, status: "unpaid" },
  { id: "2", name: "이영희", owed: 46000, status: "unpaid" },
  { id: "3", name: "박민준", owed: 0, status: "paid" },
  { id: "4", name: "정수진", owed: 0, status: "paid" },
  { id: "5", name: "이주호", owed: 46000, status: "unpaid" },
]

export default function SettlementPage() {
  const isHost = true

  return (
    <div className="space-y-6">
      {/* 비용 항목 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">비용 항목</h3>
        <div className="space-y-2">
          {dummyItems.map((item) => (
            <Card
              key={item.id}
              className="p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.paidBy}가 {item.amount.toLocaleString()}원 지불
                </p>
              </div>
              {isHost && (
                <Button size="sm" variant="ghost">
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* 항목 추가 (주최자만) */}
      {isHost && (
        <Card className="p-4 space-y-3 border-dashed">
          <h4 className="font-semibold">비용 항목 추가</h4>
          <Input placeholder="항목명" />
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" placeholder="금액" />
            <Input placeholder="누가 지불했나요?" />
          </div>
          <Button className="w-full">추가</Button>
        </Card>
      )}

      {/* 1/N 계산 버튼 (주최자만) */}
      {isHost && (
        <Button variant="outline" className="w-full">
          1/N 계산
        </Button>
      )}

      {/* 정산 요약 */}
      <Card className="p-4 bg-muted space-y-2">
        <p className="text-sm text-muted-foreground">총 비용</p>
        <p className="text-3xl font-bold">
          {dummySettlement.totalAmount.toLocaleString()}원
        </p>
        <p className="text-sm text-muted-foreground">
          {dummySettlement.participants}명 ÷{" "}
          {dummySettlement.perPerson.toLocaleString()}원
        </p>
      </Card>

      {/* 납부 현황 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">납부 현황</h3>
        <div className="space-y-2">
          {dummyPayments.map((payment) => (
            <Card
              key={payment.id}
              className="p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{payment.name}</p>
                <p className="text-sm">
                  {payment.owed === 0
                    ? "완납"
                    : `${payment.owed.toLocaleString()}원 납부 필요`}
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
                {payment.owed > 0 && <Button size="sm">납부</Button>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
