"use client"

import { Bell, Cog, DollarSign, Users, Wind } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface EventTabNavigationProps {
  eventId: string
  isHost: boolean
}

export function EventTabNavigation({
  eventId,
  isHost,
}: EventTabNavigationProps) {
  const pathname = usePathname()

  // 현재 탭 식별
  const currentTab = pathname.split("/").pop() || "announcements"

  // 탭 목록 정의
  const tabs = [
    {
      id: "announcements",
      label: "공지",
      icon: Bell,
      href: `/protected/events/${eventId}/announcements`,
      hostOnly: false,
    },
    {
      id: "members",
      label: "참여자",
      icon: Users,
      href: `/protected/events/${eventId}/members`,
      hostOnly: true,
    },
    {
      id: "carpool",
      label: "카풀",
      icon: Wind,
      href: `/protected/events/${eventId}/carpool`,
      hostOnly: false,
    },
    {
      id: "settlement",
      label: "정산",
      icon: DollarSign,
      href: `/protected/events/${eventId}/settlement`,
      hostOnly: false,
    },
    {
      id: "settings",
      label: "설정",
      icon: Cog,
      href: `/protected/events/${eventId}/settings`,
      hostOnly: true,
    },
  ]

  // 표시할 탭 필터링 (주최자 전용 탭 제외)
  const visibleTabs = tabs.filter((tab) => !tab.hostOnly || isHost)

  return (
    <div className="flex flex-wrap gap-2 border-b pb-4 mb-6">
      {visibleTabs.map((tab) => {
        const Icon = tab.icon
        const isActive = currentTab === tab.id

        return (
          <Link key={tab.id} href={tab.href}>
            <button
              className={`
                flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors
                ${
                  isActive
                    ? "bg-blue-50 border-b-2 border-blue-600 text-blue-600"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          </Link>
        )
      })}
    </div>
  )
}
