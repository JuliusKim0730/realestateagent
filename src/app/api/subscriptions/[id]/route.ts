import { NextRequest, NextResponse } from 'next/server';

// 2025년 6월 청약 상세 데이터
const mockSubscriptionDetails: { [key: string]: any } = {
  'apt-001': {
    id: 'apt-001',
    house_name: '두산힐링 부동산허브',
    location: '서울 강서구',
    address: '서울시 강서구 화곡동 1086',
    latitude: 37.5416,
    longitude: 126.8378,
    subscription_start_date: '2025-06-05',
    subscription_end_date: '2025-06-12',
    winner_announcement_date: '2025-06-20',
    total_supply_count: 672,
    constructor: '두산건설',
    agency: '두산힐링',
    min_price: 450000000,
    max_price: 850000000,
    types: [
      {
        area_type: '59A',
        supply_area: 59.9,
        exclusive_area: 44.2,
        supply_count: 250,
        price: 450000000
      },
      {
        area_type: '74B',
        supply_area: 74.8,
        exclusive_area: 58.3,
        supply_count: 300,
        price: 650000000
      },
      {
        area_type: '84C',
        supply_area: 84.5,
        exclusive_area: 65.1,
        supply_count: 122,
        price: 850000000
      }
    ]
  },
  'apt-002': {
    id: 'apt-002',
    house_name: '오산 세교2지구 A12블록',
    location: '경기 오산시',
    address: '경기도 오산시 세교동 세교신도시 A12블록',
    latitude: 37.1347,
    longitude: 127.0773,
    subscription_start_date: '2025-06-06',
    subscription_end_date: '2025-06-13',
    winner_announcement_date: '2025-06-21',
    total_supply_count: 1245,
    constructor: 'LH한국토지주택공사',
    agency: '세교신도시',
    min_price: 380000000,
    max_price: 620000000,
    types: [
      {
        area_type: '51A',
        supply_area: 51.2,
        exclusive_area: 39.8,
        supply_count: 450,
        price: 380000000
      },
      {
        area_type: '59B',
        supply_area: 59.6,
        exclusive_area: 46.3,
        supply_count: 500,
        price: 480000000
      },
      {
        area_type: '74C',
        supply_area: 74.1,
        exclusive_area: 58.2,
        supply_count: 295,
        price: 620000000
      }
    ]
  },
  'apt-003': {
    id: 'apt-003',
    house_name: '파크 교육공급시설',
    location: '인천 계양구',
    address: '인천시 계양구 박촌동 1234-5',
    latitude: 37.5537,
    longitude: 126.7353,
    subscription_start_date: '2025-06-04',
    subscription_end_date: '2025-06-11',
    winner_announcement_date: '2025-06-19',
    total_supply_count: 389,
    constructor: '대우건설',
    agency: '파크시티',
    min_price: 520000000,
    max_price: 780000000,
    types: [
      {
        area_type: '69A',
        supply_area: 69.4,
        exclusive_area: 52.8,
        supply_count: 189,
        price: 520000000
      },
      {
        area_type: '84B',
        supply_area: 84.2,
        exclusive_area: 64.5,
        supply_count: 200,
        price: 780000000
      }
    ]
  },
  'apt-004': {
    id: 'apt-004',
    house_name: '복수원 이룸 시티프라자',
    location: '경기 시흥시',
    address: '경기도 시흥시 정왕동 복수원 신도시',
    latitude: 37.3735,
    longitude: 126.7314,
    subscription_start_date: '2025-06-07',
    subscription_end_date: '2025-06-14',
    winner_announcement_date: '2025-06-22',
    total_supply_count: 578,
    constructor: 'GS건설',
    agency: '이룸건설',
    min_price: 410000000,
    max_price: 690000000,
    types: [
      {
        area_type: '59A',
        supply_area: 59.8,
        exclusive_area: 45.2,
        supply_count: 278,
        price: 410000000
      },
      {
        area_type: '74B',
        supply_area: 74.9,
        exclusive_area: 56.8,
        supply_count: 300,
        price: 690000000
      }
    ]
  },
  'apt-005': {
    id: 'apt-005',
    house_name: '타실업 더로렉스 하우징',
    location: '경기 화성시',
    address: '경기도 화성시 동탄2신도시 영천동',
    latitude: 37.2009,
    longitude: 127.0745,
    subscription_start_date: '2025-06-04',
    subscription_end_date: '2025-06-11',
    winner_announcement_date: '2025-06-19',
    total_supply_count: 892,
    constructor: '포스코건설',
    agency: '더로렉스',
    min_price: 650000000,
    max_price: 1200000000,
    types: [
      {
        area_type: '74A',
        supply_area: 74.3,
        exclusive_area: 56.9,
        supply_count: 350,
        price: 650000000
      },
      {
        area_type: '84B',
        supply_area: 84.6,
        exclusive_area: 64.8,
        supply_count: 400,
        price: 950000000
      },
      {
        area_type: '104C',
        supply_area: 104.1,
        exclusive_area: 79.2,
        supply_count: 142,
        price: 1200000000
      }
    ]
  },
  // 업데이트로 추가된 새로운 청약 상세 정보
  'apt-010': {
    id: 'apt-010',
    house_name: '센트럴 아이파크',
    location: '서울 강남구',
    address: '서울시 강남구 신사동 519-23',
    latitude: 37.5231,
    longitude: 127.0201,
    subscription_start_date: '2025-06-04',
    subscription_end_date: '2025-06-11',
    winner_announcement_date: '2025-06-19',
    total_supply_count: 298,
    constructor: '현대건설',
    agency: '현대산업개발',
    min_price: 1250000000,
    max_price: 1820000000,
    types: [
      {
        area_type: '59A',
        supply_area: 59.88,
        exclusive_area: 45.2,
        supply_count: 78,
        price: 1250000000
      },
      {
        area_type: '74A',
        supply_area: 74.32,
        exclusive_area: 56.8,
        supply_count: 112,
        price: 1450000000
      },
      {
        area_type: '84A',
        supply_area: 84.91,
        exclusive_area: 64.5,
        supply_count: 108,
        price: 1650000000
      }
    ]
  },
  'apt-011': {
    id: 'apt-011',
    house_name: '더샵 센텀파크',
    location: '부산 해운대구',
    address: '부산시 해운대구 우동 더샵 센텀파크',
    latitude: 35.1695,
    longitude: 129.1306,
    subscription_start_date: '2025-06-05',
    subscription_end_date: '2025-06-12',
    winner_announcement_date: '2025-06-20',
    total_supply_count: 886,
    constructor: '포스코건설',
    agency: '포스코이앤씨',
    min_price: 780000000,
    max_price: 1230000000,
    types: [
      {
        area_type: '74A',
        supply_area: 74.66,
        exclusive_area: 56.2,
        supply_count: 234,
        price: 780000000
      },
      {
        area_type: '84A',
        supply_area: 84.91,
        exclusive_area: 64.8,
        supply_count: 356,
        price: 920000000
      },
      {
        area_type: '104A',
        supply_area: 104.55,
        exclusive_area: 79.5,
        supply_count: 296,
        price: 1120000000
      }
    ]
  },
  'apt-012': {
    id: 'apt-012',
    house_name: '송도 더샵 퍼스트타워',
    location: '인천 연수구',
    address: '인천시 연수구 송도동 24-1',
    latitude: 37.3946,
    longitude: 126.6563,
    subscription_start_date: '2025-06-06',
    subscription_end_date: '2025-06-13',
    winner_announcement_date: '2025-06-21',
    total_supply_count: 1204,
    constructor: '포스코건설',
    agency: '송도랜드마크시티',
    min_price: 590000000,
    max_price: 840000000,
    types: [
      {
        area_type: '59A',
        supply_area: 59.98,
        exclusive_area: 45.8,
        supply_count: 356,
        price: 590000000
      },
      {
        area_type: '74A',
        supply_area: 74.56,
        exclusive_area: 56.9,
        supply_count: 445,
        price: 680000000
      },
      {
        area_type: '84A',
        supply_area: 84.87,
        exclusive_area: 64.2,
        supply_count: 403,
        price: 780000000
      }
    ]
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const subscription = mockSubscriptionDetails[id];
    
    if (!subscription) {
      return NextResponse.json(
        { error: '청약 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(subscription);
  } catch (error) {
    return NextResponse.json(
      { error: '청약 상세 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 