"use client"

import { CheckCircle, FileText, Play, Users } from "lucide-react"

import { Card } from "@/components/ui/card"

interface DashboardStatsProps {
  hostedEventsCount: number
  participantsCount: number
  ongoingCount: number
  completedCount: number
}

export function DashboardStats({
  hostedEventsCount,
  participantsCount,
  ongoingCount,
  completedCount,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "주최한 이벤트",
      value: hostedEventsCount,
      icon: FileText,
      bgGradient: "from-blue-500 to-blue-600",
      iconColor: "text-blue-600",
    },
    {
      label: "총 참여자",
      value: participantsCount,
      icon: Users,
      bgGradient: "from-green-500 to-green-600",
      iconColor: "text-green-600",
    },
    {
      label: "진행 중",
      value: ongoingCount,
      icon: Play,
      bgGradient: "from-orange-500 to-orange-600",
      iconColor: "text-orange-600",
    },
    {
      label: "완료됨",
      value: completedCount,
      icon: CheckCircle,
      bgGradient: "from-purple-500 to-purple-600",
      iconColor: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.label}
            className={`p-6 bg-gradient-to-br ${stat.bgGradient} text-white`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <Icon className="w-8 h-8 opacity-80" />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
