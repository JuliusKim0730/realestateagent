import { NextRequest, NextResponse } from 'next/server';

// 2025년 6월 캘린더 데이터
const mockCalendarData = {
  '2025-06-11': [
    {
      id: 'apt-003',
      house_name: '파크 교육공급시설',
      event_type: 'end',
      subscription_end_date: '2025-06-11'
    },
    {
      id: 'apt-005',
      house_name: '타실업 더로렉스 하우징',
      event_type: 'end',
      subscription_end_date: '2025-06-11'
    },
    {
      id: 'apt-010',
      house_name: '센트럴 아이파크',
      event_type: 'end',
      subscription_end_date: '2025-06-11'
    }
  ],
  '2025-06-12': [
    {
      id: 'apt-001',
      house_name: '두산힐링 부동산허브',
      event_type: 'end',
      subscription_end_date: '2025-06-12'
    },
    {
      id: 'apt-008',
      house_name: '고촌텍 등업 양반',
      event_type: 'end',
      subscription_end_date: '2025-06-12'
    },
    {
      id: 'apt-011',
      house_name: '더샵 센텀파크',
      event_type: 'end',
      subscription_end_date: '2025-06-12'
    }
  ],
  '2025-06-13': [
    {
      id: 'apt-002',
      house_name: '오산 세교2지구 A12블록',
      event_type: 'end',
      subscription_end_date: '2025-06-13'
    },
    {
      id: 'apt-007',
      house_name: '에스마이플렉스 오피스테르',
      event_type: 'end',
      subscription_end_date: '2025-06-13'
    },
    {
      id: 'apt-012',
      house_name: '송도 더샵 퍼스트타워',
      event_type: 'end',
      subscription_end_date: '2025-06-13'
    }
  ],
  '2025-06-14': [
    {
      id: 'apt-004',
      house_name: '복수원 이룸 시티프라자',
      event_type: 'end',
      subscription_end_date: '2025-06-14'
    }
  ],
  '2025-06-15': [
    {
      id: 'apt-006',
      house_name: '그린즈 리버마크 아파트',
      event_type: 'end',
      subscription_end_date: '2025-06-15'
    }
  ],
  '2025-06-16': [
    {
      id: 'apt-009',
      house_name: '담구텍 등업 멀띔',
      event_type: 'end',
      subscription_end_date: '2025-06-16'
    }
  ],
  '2025-06-18': [
    {
      id: 'apt-010',
      house_name: '신도시 더플래티넘',
      event_type: 'start',
      subscription_end_date: '2025-06-25'
    }
  ],
  '2025-06-20': [
    {
      id: 'apt-001',
      house_name: '두산힐링 부동산허브',
      event_type: 'announcement',
      subscription_end_date: '2025-06-12'
    }
  ],
  '2025-06-22': [
    {
      id: 'apt-013',
      house_name: '의정부 민락2지구 롯데캐슬',
      event_type: 'start',
      subscription_end_date: '2025-06-28'
    }
  ],
  '2025-06-24': [
    {
      id: 'apt-014',
      house_name: '하남 감일지구 위례신도시',
      event_type: 'start',
      subscription_end_date: '2025-06-30'
    }
  ],
  '2025-06-25': [
    {
      id: 'apt-010',
      house_name: '신도시 더플래티넘',
      event_type: 'end',
      subscription_end_date: '2025-06-25'
    }
  ],
  '2025-06-26': [
    {
      id: 'apt-015',
      house_name: '수원 영통지구 광교신도시',
      event_type: 'start',
      subscription_end_date: '2025-07-02'
    }
  ],
  '2025-06-28': [
    {
      id: 'apt-013',
      house_name: '의정부 민락2지구 롯데캐슬',
      event_type: 'end',
      subscription_end_date: '2025-06-28'
    }
  ],
  '2025-06-30': [
    {
      id: 'apt-014',
      house_name: '하남 감일지구 위례신도시',
      event_type: 'end',
      subscription_end_date: '2025-06-30'
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    
    // 실제 구현시에는 year, month 파라미터를 사용하여 
    // 해당 월의 데이터만 필터링
    
    return NextResponse.json(mockCalendarData);
  } catch (error) {
    return NextResponse.json(
      { error: '캘린더 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 