import { NextResponse } from 'next/server';

// 2025년 6월 10일 기준 청약 정보 - 실제 구현시에는 데이터베이스나 외부 API에서 가져옴
const mockSubscriptions = [
  {
    id: 'apt-001',
    house_name: '두산힐링 부동산허브',
    location: '서울 강서구',
    address: '서울시 강서구 화곡동 1086',
    subscription_end_date: '2025-06-12',
    total_supply_count: 672,
    min_price: 450000000,
    max_price: 850000000
  },
  {
    id: 'apt-002',
    house_name: '오산 세교2지구 A12블록',
    location: '경기 오산시',
    address: '경기도 오산시 세교동 세교신도시 A12블록',
    subscription_end_date: '2025-06-13',
    total_supply_count: 1245,
    min_price: 380000000,
    max_price: 620000000
  },
  {
    id: 'apt-003',
    house_name: '파크 교육공급시설',
    location: '인천 계양구',
    address: '인천시 계양구 박촌동 1234-5',
    subscription_end_date: '2025-06-11',
    total_supply_count: 389,
    min_price: 520000000,
    max_price: 780000000
  },
  {
    id: 'apt-004',
    house_name: '복수원 이룸 시티프라자',
    location: '경기 시흥시',
    address: '경기도 시흥시 정왕동 복수원 신도시',
    subscription_end_date: '2025-06-14',
    total_supply_count: 578,
    min_price: 410000000,
    max_price: 690000000
  },
  {
    id: 'apt-005',
    house_name: '타실업 더로렉스 하우징',
    location: '경기 화성시',
    address: '경기도 화성시 동탄2신도시 영천동',
    subscription_end_date: '2025-06-11',
    total_supply_count: 892,
    min_price: 650000000,
    max_price: 1200000000
  },
  {
    id: 'apt-006',
    house_name: '그린즈 리버마크 아파트',
    location: '서울 구로구',
    address: '서울시 구로구 신도림동 168-9',
    subscription_end_date: '2025-06-15',
    total_supply_count: 234,
    min_price: 720000000,
    max_price: 1350000000
  },
  {
    id: 'apt-007',
    house_name: '에스마이플렉스 오피스테르',
    location: '경기 성남시',
    address: '경기도 성남시 분당구 야탑동 345',
    subscription_end_date: '2025-06-13',
    total_supply_count: 156,
    min_price: 890000000,
    max_price: 1680000000
  },
  {
    id: 'apt-008',
    house_name: '고촌텍 등업 양반',
    location: '인천 서구',
    address: '인천시 서구 검암동 루원시티 고촌지구',
    subscription_end_date: '2025-06-12',
    total_supply_count: 445,
    min_price: 480000000,
    max_price: 750000000
  },
  {
    id: 'apt-009',
    house_name: '담구텍 등업 멀띔',
    location: '경기 파주시',
    address: '경기도 파주시 운정신도시 교하동',
    subscription_end_date: '2025-06-16',
    total_supply_count: 678,
    min_price: 550000000,
    max_price: 920000000
  },
  // 업데이트로 추가된 새로운 청약 정보들
  {
    id: 'apt-010',
    house_name: '센트럴 아이파크',
    location: '서울 강남구',
    address: '서울시 강남구 신사동 519-23',
    subscription_end_date: '2025-06-11',
    total_supply_count: 298,
    min_price: 1250000000,
    max_price: 1820000000
  },
  {
    id: 'apt-011',
    house_name: '더샵 센텀파크',
    location: '부산 해운대구',
    address: '부산시 해운대구 우동 더샵 센텀파크',
    subscription_end_date: '2025-06-12',
    total_supply_count: 886,
    min_price: 780000000,
    max_price: 1230000000
  },
  {
    id: 'apt-012',
    house_name: '송도 더샵 퍼스트타워',
    location: '인천 연수구',
    address: '인천시 연수구 송도동 24-1',
    subscription_end_date: '2025-06-13',
    total_supply_count: 1204,
    min_price: 590000000,
    max_price: 840000000
  }
];

export async function GET() {
  try {
    // 실제 구현시에는 JWT 토큰 검증 로직 추가
    // const token = request.headers.get('authorization');
    
    return NextResponse.json(mockSubscriptions);
  } catch (error) {
    return NextResponse.json(
      { error: '청약 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 