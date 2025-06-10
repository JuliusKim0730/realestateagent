# 당신을 위한 부동산 알리미

맞춤형 청약 정보를 제공하는 웹 서비스입니다.

## 🚀 주요 기능

### 1. 사용자 인증
- 구글 SSO 로그인
- 로그인 상태 유지

### 2. 청약 정보 조회
- 오늘의 청약 정보 조회
- 월별 청약 캘린더
- 청약 상세 정보 확인

### 3. 청약 상세 분석
- 기본 정보 (일정, 공급세대, 시공사 등)
- 네이버 지도를 통한 위치 확인
- 대출 계산기로 필요 현금 계산
- 평형별 비교 분석

## 🛠 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **인증**: NextAuth.js (Google OAuth)
- **지도**: 네이버 지도 API
- **캘린더**: react-calendar
- **HTTP 클라이언트**: Axios
- **날짜 처리**: date-fns

## 📋 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`env.example` 파일을 참고하여 `.env.local` 파일을 생성하고 필요한 환경변수를 설정하세요.

```bash
cp env.example .env.local
```

#### 필수 환경변수:

1. **NextAuth 설정**
   - `NEXTAUTH_URL`: 애플리케이션 URL (개발환경: http://localhost:3000)
   - `NEXTAUTH_SECRET`: JWT 서명용 시크릿 키

2. **Google OAuth 설정**
   - `GOOGLE_CLIENT_ID`: Google OAuth 클라이언트 ID
   - `GOOGLE_CLIENT_SECRET`: Google OAuth 클라이언트 시크릿

3. **네이버 지도 API 설정**
   - `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`: 네이버 지도 클라이언트 ID

### 3. 메인 배너 이미지 추가

`public/images/` 폴더에 `main_banner.png` 파일을 추가하세요. (선택사항)

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🔑 API 키 발급 방법

### Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "APIs & Services" > "Credentials" 메뉴 이동
4. "Create Credentials" > "OAuth client ID" 선택
5. Application type을 "Web application"으로 설정
6. Authorized redirect URIs에 `http://localhost:3000/api/auth/callback/google` 추가
7. 생성된 Client ID와 Client Secret을 환경변수에 설정

### 네이버 지도 API v3 설정

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/)에 접속
2. 콘솔 로그인 후 "AI Services" > "Maps" 선택
3. "이용 신청" 클릭하여 서비스 활성화
4. "Application 등록" 버튼 클릭
5. 다음 정보 입력:
   - **Application 이름**: `realestate_solution`
   - **Service URL**: `http://localhost:3000` (개발용)
6. 생성된 **Client ID (ncpKeyId)**를 환경변수에 설정

**⚠️ 중요**: 최신 API는 `ncpKeyId` 파라미터를 사용합니다.

#### 📚 상세 설정 가이드
**[📖 네이버 지도 API 설정 가이드](docs/NAVER_MAP_API_SETUP.md)**

#### API 변경사항
- **기존**: `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=...`
- **최신**: `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=...`

#### 네이버 지도 API 종류
- **Static Map API**: 정적 지도 이미지
- **Dynamic Map API**: 동적 웹 지도 (현재 프로젝트에서 사용)
- **Geocoding API**: 주소 → 좌표 변환
- **Reverse Geocoding API**: 좌표 → 주소 변환

### 청약홈 공공데이터 API 설정

#### 1단계: API 신청
1. [공공데이터포털](https://data.go.kr) 접속
2. 회원가입 및 로그인
3. "청약홈 분양정보" 검색
4. 다음 API 서비스들 신청:
   - **한국부동산원_청약Home 분양정보**
   - **한국부동산원_청약Home 무순위/잔여세대 분양정보**
5. 승인 완료 후 API 키 발급받기 (보통 1-2일 소요)

#### 2단계: 주요 엔드포인트
- **분양정보 조회**: `/getRemndrLttotPblancDetail`
- **무순위 분양정보**: `/getLttotAnnceDetail`  
- **지역별 분양정보**: `/getAPTLttotPblancDetail`

### LH 한국토지주택공사 API 설정

#### 1단계: API 신청
1. [공공데이터포털](https://data.go.kr)에서 "LH" 또는 "한국토지주택공사" 검색
2. 다음 API들 신청:
   - **LH 청약센터 분양/임대정보**
   - **LH 토지임대부 분양정보**
   - **LH 행복주택 정보**
3. API 키 발급 (1-2일 소요)

#### 2단계: API 연동 준비
- 발급받은 API 키를 환경변수에 설정
- 각 API별 요청 파라미터 확인
- 응답 데이터 구조 파악 및 타입 정의

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── main/              # 메인 페이지
│   ├── subscription/      # 청약 상세 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 랜딩 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── TodaySubscriptions.tsx
│   ├── MonthlyCalendar.tsx
│   ├── NaverMap.tsx
│   └── LoanCalculator.tsx
├── lib/                   # 유틸리티 함수
│   └── api.ts             # API 클라이언트
└── types/                 # TypeScript 타입 정의
    └── subscription.ts
```

## 🔄 API 연동

현재 프로젝트는 더미 데이터로 동작하며, 실제 API 연동을 위해서는 다음 엔드포인트들을 구현해야 합니다:

- `GET /api/subscriptions/today` - 오늘의 청약 정보
- `GET /api/subscriptions/calendar` - 월별 청약 캘린더
- `GET /api/subscriptions/:id` - 청약 상세 정보
- `GET /api/subscriptions/search` - 청약 검색

### 📋 상세 API 연동 가이드

실제 공공데이터 API 연동을 위한 자세한 가이드는 다음 문서를 참고하세요:

**[📖 API 연동 가이드](docs/API_INTEGRATION_GUIDE.md)**

이 가이드에서 다루는 내용:
- 청약홈 공공데이터 API 신청 및 연동
- LH 한국토지주택공사 API 연동  
- 네이버 지도 API 활용
- 실제 구현 예시 코드
- 에러 처리 및 Best Practices

## 📱 주요 페이지

### 1. 랜딩 페이지 (`/`)
- 서비스 소개
- 구글 로그인 버튼
- 메인 배너 이미지

### 2. 메인 페이지 (`/main`)
- 오늘의 청약 탭
- 월별 청약 캘린더 탭
- 탭 전환 기능

### 3. 청약 상세 페이지 (`/subscription/[id]`)
- 기본 정보 탭
- 위치 확인 탭 (네이버 지도)
- 대출 계산기 탭

## 🎯 향후 개발 계획

1. **백엔드 API 구현**
   - 청약홈 공공데이터 API 연동
   - LH 공공데이터 API 연동
   - 데이터베이스 구축

2. **기능 확장**
   - 청약 알림 기능
   - 관심 청약 저장
   - 청약 검색 및 필터링
   - 모바일 앱 개발

3. **UI/UX 개선**
   - 반응형 디자인 최적화
   - 다크 모드 지원
   - 접근성 개선

## 📞 문의

프로젝트 관련 문의사항은 GitHub Issues를 통해 남겨주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 