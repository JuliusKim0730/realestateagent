# 네이버 지도 API v3 설정 가이드

네이버 클라우드 플랫폼의 Maps API를 사용하여 지도 기능을 구현합니다.

## 1. 네이버 클라우드 플랫폼 계정 생성

1. [네이버 클라우드 플랫폼](https://www.ncloud.com) 접속
2. 회원가입 또는 로그인
3. 콘솔 접속

## 2. Maps API 서비스 신청

1. 콘솔에서 **AI Services** > **Maps** 선택
2. **이용 신청** 클릭
3. 약관 동의 후 신청 완료
4. **Application 등록** 진행

## 3. Application 등록

1. Maps 서비스 페이지에서 **Application** 메뉴 선택
2. **Application 등록** 클릭
3. 다음 정보 입력:
   - **Application 이름**: `realestate_solution`
   - **Service URL**: `http://localhost:3000` (개발용)
   - **Bundle ID**: (선택사항)

## 4. 인증 정보 확인

Application 등록 완료 후:
- **Client ID (X-NCP-APIGW-API-KEY-ID)**: 환경변수에 사용할 키
- **Client Secret (X-NCP-APIGW-API-KEY)**: 서버사이드에서 필요시 사용

## 5. 환경변수 설정

`.env.local` 파일에 다음과 같이 설정:

```bash
# 네이버 지도 API v3 설정
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your-client-id-here
```

## 6. API 사용량 및 요금

### 무료 사용량 (월간)
- **Dynamic Map**: 6,000,000건
- **Static Map**: 3,000,000건  
- **Geocoding**: 3,000,000건
- **Reverse Geocoding**: 3,000,000건
- **Directions 5**: 60,000건
- **Directions 15**: 3,000건

### 참고사항
- 무료 사용량 초과시 과금 발생
- 대표 계정 1개에 한해 무료 사용량 제공
- VAT 별도

## 7. API 변경사항

### 기존 API (사용 중단 예정)
```javascript
// 기존 URL
https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=CLIENT_ID
```

### 새로운 API (현재 사용)
```javascript
// 새로운 URL
https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=CLIENT_ID
```

## 8. 인증 실패 처리

```javascript
// 전역 인증 실패 처리 함수
window.navermap_authFailure = function() {
    console.error('네이버 지도 API 인증 실패');
    // 에러 처리 로직
};
```

## 9. 문제 해결

### 지도가 로드되지 않는 경우
1. **Client ID 확인**: 올바른 Client ID 입력 여부
2. **도메인 확인**: 등록된 Service URL과 현재 도메인 일치 여부
3. **API 사용량**: 무료 사용량 초과 여부
4. **브라우저 콘솔**: JavaScript 에러 메시지 확인

### 자주 발생하는 에러
- `Authentication Failed`: 잘못된 Client ID 또는 도메인 불일치
- `Quota Exceeded`: API 사용량 초과
- `Invalid URL`: 잘못된 API URL 사용

## 10. 참고 링크

- [네이버 지도 API v3 공식 문서](https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html)
- [네이버 클라우드 플랫폼 Maps 서비스](https://www.ncloud.com/product/applicationService/maps)
- [API 사용 가이드](https://navermaps.github.io/maps.js.ncp/docs/)
- [예제 모음](https://navermaps.github.io/maps.js.ncp/docs/tutorial-digest.html) 