// 더미 데이터 (Task 017에서 실제 DB 데이터로 교체)

export interface Event {
  id: string
  title: string
  date: string
  location: string
  participantCount: number
  maxMembers?: number
  status: "scheduled" | "completed" | "cancelled"
}

export const dummyEvents = {
  // 사용자가 만든 이벤트
  hostedEvents: [
    {
      id: "event-1",
      title: "주말 수영 모임 - 3월",
      date: "2026-03-09T10:00:00Z",
      location: "서울 강남 수영장",
      participantCount: 8,
      maxMembers: 15,
      status: "scheduled" as const,
    },
    {
      id: "event-2",
      title: "헬스 모임 - 3월 정기",
      date: "2026-03-15T07:00:00Z",
      location: "강남역 피트니스 센터",
      participantCount: 12,
      maxMembers: 20,
      status: "scheduled" as const,
    },
    {
      id: "event-3",
      title: "2월 친구 모임 회식",
      date: "2026-02-28T18:00:00Z",
      location: "한강공원 여의도",
      participantCount: 15,
      maxMembers: 15,
      status: "completed" as const,
    },
    {
      id: "event-4",
      title: "1월 야구 시청 모임",
      date: "2026-01-25T18:00:00Z",
      location: "서울 잠실 야구장",
      participantCount: 0,
      maxMembers: 8,
      status: "cancelled" as const,
    },
  ] as Event[],

  // 사용자가 참여한 이벤트
  participatedEvents: [
    {
      id: "event-5",
      title: "서초 테니스 클럽 - 3월",
      date: "2026-03-16T15:00:00Z",
      location: "서초동 테니스 코트",
      participantCount: 10,
      maxMembers: 12,
      status: "scheduled" as const,
    },
    {
      id: "event-6",
      title: "드래곤 플라이 독 카페 모임",
      date: "2026-03-08T14:00:00Z",
      location: "성수동 카페",
      participantCount: 6,
      maxMembers: 10,
      status: "scheduled" as const,
    },
    {
      id: "event-7",
      title: "2월 보드게임 나이트",
      date: "2026-02-22T19:00:00Z",
      location: "강남 보드게임 카페",
      participantCount: 8,
      status: "completed" as const,
    },
  ] as Event[],
}
