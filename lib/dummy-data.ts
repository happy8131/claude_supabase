// 더미 데이터 (Task 017에서 실제 DB 데이터로 교체)

export interface Event {
  id: string
  title: string
  description?: string
  date: string
  location: string
  participantCount: number
  maxMembers?: number
  autoApprove: boolean
  status: "scheduled" | "completed" | "cancelled"
}

export const dummyEvents = {
  // 사용자가 만든 이벤트
  hostedEvents: [
    {
      id: "event-1",
      title: "주말 수영 모임 - 3월",
      description:
        "매주 토요일 아침 수영을 함께 하는 모임입니다. 초급자도 환영합니다!",
      date: "2026-03-09T10:00:00Z",
      location: "서울 강남 수영장",
      participantCount: 8,
      maxMembers: 15,
      autoApprove: true,
      status: "scheduled" as const,
    },
    {
      id: "event-2",
      title: "헬스 모임 - 3월 정기",
      description: "함께 운동하고 건강한 생활을 추구하는 모임",
      date: "2026-03-15T07:00:00Z",
      location: "강남역 피트니스 센터",
      participantCount: 12,
      maxMembers: 20,
      autoApprove: false,
      status: "scheduled" as const,
    },
    {
      id: "event-3",
      title: "2월 친구 모임 회식",
      description: "따뜻한 봄날 한강에서의 즐거운 회식",
      date: "2026-02-28T18:00:00Z",
      location: "한강공원 여의도",
      participantCount: 15,
      maxMembers: 15,
      autoApprove: false,
      status: "completed" as const,
    },
    {
      id: "event-4",
      title: "1월 야구 시청 모임",
      description: "함께 야구 경기를 관람하며 응원하는 모임",
      date: "2026-01-25T18:00:00Z",
      location: "서울 잠실 야구장",
      participantCount: 0,
      maxMembers: 8,
      autoApprove: true,
      status: "cancelled" as const,
    },
  ] as Event[],

  // 사용자가 참여한 이벤트
  participatedEvents: [
    {
      id: "event-5",
      title: "서초 테니스 클럽 - 3월",
      description: "테니스를 즐기는 사람들의 커뮤니티",
      date: "2026-03-16T15:00:00Z",
      location: "서초동 테니스 코트",
      participantCount: 10,
      maxMembers: 12,
      autoApprove: false,
      status: "scheduled" as const,
    },
    {
      id: "event-6",
      title: "드래곤 플라이 독 카페 모임",
      description: "반려견 친구들과 함께하는 카페 모임",
      date: "2026-03-08T14:00:00Z",
      location: "성수동 카페",
      participantCount: 6,
      maxMembers: 10,
      autoApprove: true,
      status: "scheduled" as const,
    },
    {
      id: "event-7",
      title: "2월 보드게임 나이트",
      description: "다양한 보드게임을 즐기는 저녁 모임",
      date: "2026-02-22T19:00:00Z",
      location: "강남 보드게임 카페",
      participantCount: 8,
      autoApprove: true,
      status: "completed" as const,
    },
  ] as Event[],
}

// 사용자 프로필 타입
export interface UserProfile {
  id: string
  email: string
  displayName: string
  bio?: string
  region?: string
  birthDate?: string
  joinedDate: string
  hostedEventCount: number
  participatedEventCount: number
}

// 더미 사용자 프로필
export const dummyProfile: UserProfile = {
  id: "user-1",
  email: "park.minjun@example.com",
  displayName: "박민준",
  bio: "모임을 통해 새로운 사람들을 만나고 다양한 경험을 공유하는 것을 좋아합니다. 수영과 헬스에 관심이 많아요!",
  region: "서울 강남구",
  birthDate: "1995-07-15",
  joinedDate: "2025-06-01",
  hostedEventCount: 4,
  participatedEventCount: 3,
}
