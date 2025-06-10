# API 연동 가이드

이 문서는 부동산 알리미 서비스에서 외부 API들을 연동하는 방법을 설명합니다.

## 📋 목차

1. [청약홈 공공데이터 API](#청약홈-공공데이터-api)
2. [LH 한국토지주택공사 API](#lh-한국토지주택공사-api)
3. [네이버 지도 API](#네이버-지도-api)
4. [API 연동 구현 예시](#api-연동-구현-예시)

## 🏠 청약홈 공공데이터 API

### 1. API 키 발급

#### 단계별 신청 과정
1. **공공데이터포털 접속**
   - URL: https://data.go.kr
   - 회원가입 및 로그인

2. **API 검색 및 신청**
   ```
   검색어: "청약홈 분양정보"
   ```
   
   **신청할 API 목록:**
   - `한국부동산원_청약Home 분양정보`
   - `한국부동산원_청약Home 무순위/잔여세대 분양정보`

3. **API 활용 신청서 작성**
   - 활용 목적: 부동산 정보 제공 서비스
   - 예상 트래픽: 일 1,000건 이하
   - 승인 기간: 1-2일

### 2. 주요 엔드포인트

#### A. 분양정보 조회 (getAPTLttotPblancDetail)
```http
GET http://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoDetailSvc/getAPTLttotPblancDetail
```

**파라미터:**
- `serviceKey`: 발급받은 API 키
- `numOfRows`: 검색 건수 (기본: 10)
- `pageNo`: 페이지 번호 (기본: 1)
- `region`: 지역코드 (11: 서울, 26: 부산 등)

**응답 예시:**
```json
{
  "response": {
    "header": {
      "resultCode": "00",
      "resultMsg": "NORMAL SERVICE"
    },
    "body": {
      "items": {
        "item": [
          {
            "pblancNo": "2024000001",
            "houseNm": "래미안 강남",
            "sido": "서울특별시",
            "gugun": "강남구",
            "houseDetailAddr": "서울시 강남구 대치동 123-45",
            "rcritPblancBeginDe": "20241210",
            "rcritPblancEndDe": "20241215",
            "przwnerPresnatnDe": "20241220"
          }
        ]
      },
      "totalCount": 1
    }
  }
}
```

#### B. 무순위 분양정보 (getRemndrLttotPblancDetail)
```http
GET http://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoDetailSvc/getRemndrLttotPblancDetail
```

### 3. 구현 예시

#### 환경변수 설정
```bash
# .env.local
CHEONGYAKHOME_API_KEY=your_api_key_here
CHEONGYAKHOME_API_URL=http://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoDetailSvc
```

#### API 호출 함수
```typescript
// src/lib/external-api.ts
import axios from 'axios';

export const cheongyakHomeApi = {
  async getSubscriptions(region: string = '11') {
    const response = await axios.get('/api/external/cheongyakhome', {
      params: { region, numOfRows: 100 }
    });
    return response.data;
  }
};
```

## 🏢 LH 한국토지주택공사 API

### 1. API 키 발급

#### 신청 과정
1. **공공데이터포털에서 LH API 검색**
   ```
   검색어: "LH" 또는 "한국토지주택공사"
   ```

2. **신청할 API 목록:**
   - `LH 청약센터 분양/임대정보`
   - `LH 토지임대부 분양정보`
   - `LH 행복주택 정보`

### 2. 주요 엔드포인트

#### A. 청약센터 분양정보 (getSubscriptHouseInfo)
```http
GET http://openapi.lh.or.kr/rest/LH_SubscriptHouseInfo/getSubscriptHouseInfo
```

**파라미터:**
- `serviceKey`: 발급받은 API 키
- `numOfRows`: 검색 건수
- `pageNo`: 페이지 번호

### 3. 구현 예시

```typescript
// 환경변수
LH_API_KEY=your_lh_api_key
LH_API_URL=http://openapi.lh.or.kr/rest

// API 호출
export const lhApi = {
  async getSubscriptions() {
    const response = await axios.get('/api/external/lh');
    return response.data;
  }
};
```

## 🗺️ 네이버 지도 API

### 1. API 키 발급

#### 네이버 클라우드 플랫폼 설정
1. **가입 및 로그인**
   - URL: https://www.ncloud.com/
   - 회원가입 후 본인인증 완료

2. **Console 접속**
   - Services > AI·Application Service > Maps 선택

3. **Application 등록**
   - 서비스 환경: Web Service URL
   - 서비스 URL: `http://localhost:3000`, `https://yourdomain.com`

4. **인증정보 확인**
   - Client ID 복사
   - Client Secret 복사 (서버사이드 API용)

### 2. API 종류 및 사용법

#### A. Web Dynamic Map (프론트엔드)
```html
<!-- HTML Head에 추가 -->
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID"></script>
```

```typescript
// React 컴포넌트에서 사용
useEffect(() => {
  if (window.naver && window.naver.maps) {
    const map = new window.naver.maps.Map('map', {
      center: new window.naver.maps.LatLng(37.5665, 126.9780),
      zoom: 10
    });
  }
}, []);
```

#### B. Geocoding API (서버사이드)
```typescript
// 주소 → 좌표 변환
const geocodeResponse = await axios.get(
  'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode',
  {
    headers: {
      'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_CLIENT_ID,
      'X-NCP-APIGW-API-KEY': process.env.NAVER_CLIENT_SECRET,
    },
    params: {
      query: '서울시 강남구 테헤란로 152'
    }
  }
);
```

### 3. 환경변수 설정

```bash
# .env.local
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_client_id
NAVER_MAP_CLIENT_SECRET=your_client_secret
```

## 🔧 API 연동 구현 예시

### 1. 통합 데이터 수집 서비스

```typescript
// src/lib/data-collector.ts
import { externalApi } from './external-api';

export class SubscriptionDataCollector {
  async collectAllData() {
    try {
      // 청약홈 데이터 수집
      const cheongyakData = await externalApi.cheongyakHome.getAPTLttotPblancDetail({
        serviceKey: process.env.CHEONGYAKHOME_API_KEY!,
        region: '11' // 서울
      });

      // LH 데이터 수집
      const lhData = await externalApi.lh.getSubscriptHouseInfo({
        serviceKey: process.env.LH_API_KEY!
      });

      // 데이터 정규화 및 병합
      return this.mergeAndNormalizeData(cheongyakData, lhData);
    } catch (error) {
      console.error('데이터 수집 실패:', error);
      throw error;
    }
  }

  private mergeAndNormalizeData(cheongyakData: any, lhData: any) {
    // 데이터 구조 통일 및 병합 로직
    const normalizedData = [];
    
    // 청약홈 데이터 정규화
    if (cheongyakData?.response?.body?.items?.item) {
      const items = Array.isArray(cheongyakData.response.body.items.item) 
        ? cheongyakData.response.body.items.item 
        : [cheongyakData.response.body.items.item];
        
      normalizedData.push(...items.map(this.transformCheongyakData));
    }

    // LH 데이터 정규화
    if (lhData?.response?.body?.items?.item) {
      const items = Array.isArray(lhData.response.body.items.item)
        ? lhData.response.body.items.item
        : [lhData.response.body.items.item];
        
      normalizedData.push(...items.map(this.transformLHData));
    }

    return normalizedData;
  }

  private transformCheongyakData(item: any) {
    return {
      id: item.pblancNo,
      source: 'cheongyakhome',
      house_name: item.houseNm,
      location: `${item.sido} ${item.gugun}`,
      address: item.houseDetailAddr,
      subscription_start_date: item.rcritPblancBeginDe,
      subscription_end_date: item.rcritPblancEndDe,
      winner_announcement_date: item.przwnerPresnatnDe,
      total_supply_count: parseInt(item.totSuplyHouseHoldCo || '0'),
      constructor: item.cnstrctCmpnyNm,
      agency: item.mdhs,
    };
  }

  private transformLHData(item: any) {
    return {
      id: item.pblancNo,
      source: 'lh',
      house_name: item.pblancNm,
      location: `${item.sido} ${item.gugun}`,
      address: item.dtlAddr,
      subscription_start_date: item.rcritBeginDe,
      subscription_end_date: item.rcritEndDe,
      total_supply_count: parseInt(item.supplyHouseHoldCo || '0'),
    };
  }
}
```

### 2. API 라우트에서 활용

```typescript
// src/app/api/subscriptions/today/route.ts
import { SubscriptionDataCollector } from '@/lib/data-collector';

export async function GET() {
  try {
    const collector = new SubscriptionDataCollector();
    const allData = await collector.collectAllData();
    
    // 오늘의 청약만 필터링
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const todaySubscriptions = allData.filter(item => 
      item.subscription_end_date === today
    );

    return NextResponse.json(todaySubscriptions);
  } catch (error) {
    // 외부 API 실패시 캐시된 데이터나 더미 데이터 반환
    return NextResponse.json(mockSubscriptions);
  }
}
```

## 🚨 주의사항 및 Best Practices

### 1. API 호출 제한
- **청약홈 API**: 일 1,000건 제한
- **LH API**: 일 1,000건 제한
- **네이버 API**: 일 25,000건 제한

### 2. 에러 처리
```typescript
// 재시도 로직 구현
async function apiCallWithRetry(apiCall: () => Promise<any>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 3. 캐싱 전략
```typescript
// Redis 또는 메모리 캐시 활용
const CACHE_TTL = 3600; // 1시간

export async function getCachedSubscriptions() {
  const cached = await redis.get('subscriptions:today');
  if (cached) {
    return JSON.parse(cached);
  }

  const fresh = await fetchFromExternalAPIs();
  await redis.setex('subscriptions:today', CACHE_TTL, JSON.stringify(fresh));
  return fresh;
}
```

### 4. 환경별 설정
```typescript
// 개발/운영 환경별 API URL 분리
const API_CONFIG = {
  development: {
    cheongyakHome: 'http://openapi.reb.or.kr/...',
    lh: 'http://openapi.lh.or.kr/...',
  },
  production: {
    cheongyakHome: 'https://openapi.reb.or.kr/...',
    lh: 'https://openapi.lh.or.kr/...',
  }
};
```

## 🔍 문제 해결

### 일반적인 문제들

1. **CORS 에러**
   - 해결: 서버사이드에서 API 호출 (Next.js API Routes 활용)

2. **API 키 인증 실패**
   - 해결: 환경변수 설정 확인, API 키 유효성 검증

3. **응답 데이터 구조 변경**
   - 해결: 데이터 변환 함수에서 안전한 접근 방식 사용

4. **네트워크 타임아웃**
   - 해결: timeout 설정, 재시도 로직 구현

이 가이드를 참고하여 단계적으로 API를 연동하시면 완전한 실시간 청약 정보 서비스를 구축할 수 있습니다. 