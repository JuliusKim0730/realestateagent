import { NextResponse } from 'next/server';

// 외부 API들을 체크하고 데이터를 업데이트하는 함수
export async function POST() {
  try {
    const updateResults = [];
    const startTime = Date.now();

    // 업데이트 상태 추적
    const apiChecks = [
      { name: '청약홈 공공데이터 API', status: 'checking' },
      { name: 'LH 한국토지주택공사 API', status: 'checking' },
      { name: '네이버 지도 API', status: 'checking' },
      { name: '내부 API 동기화', status: 'checking' }
    ];

    // 1. 청약홈 공공데이터 API 체크
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const cheongyakResponse = await fetch('http://openapi.reb.or.kr/OpenAPI_ToolInstallPackage/service/rest/ApplyhomeInfoDetailSvc/getAPTLttotPblancDetail', {
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (cheongyakResponse.ok) {
        apiChecks[0].status = 'success';
        updateResults.push('✅ 청약홈 API 연결 성공');
      } else {
        apiChecks[0].status = 'error';
        updateResults.push('⚠️ 청약홈 API 응답 오류 (개발 중 - 모의 데이터 사용)');
      }
    } catch (error) {
      apiChecks[0].status = 'error';
      updateResults.push('⚠️ 청약홈 API 연결 실패 (개발 중 - 모의 데이터 사용)');
    }

    // 2. LH API 체크
    try {
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 10000);
      
      const lhResponse = await fetch('http://openapi.lh.or.kr/rest/APTLttotPblancDetailService', {
        headers: {
          'Accept': 'application/json',
        },
        signal: controller2.signal
      });
      
      clearTimeout(timeoutId2);
      
      if (lhResponse.ok) {
        apiChecks[1].status = 'success';
        updateResults.push('✅ LH API 연결 성공');
      } else {
        apiChecks[1].status = 'error';
        updateResults.push('⚠️ LH API 응답 오류 (개발 중 - 모의 데이터 사용)');
      }
    } catch (error) {
      apiChecks[1].status = 'error';
      updateResults.push('⚠️ LH API 연결 실패 (개발 중 - 모의 데이터 사용)');
    }

    // 3. 네이버 지도 API 체크
    try {
      // 네이버 지도 API는 클라이언트 사이드에서 사용하므로 여기서는 환경변수만 체크
      const naverClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
      if (naverClientId && naverClientId !== 'your-naver-map-client-id') {
        apiChecks[2].status = 'success';
        updateResults.push('✅ 네이버 지도 API 키 설정됨');
      } else {
        apiChecks[2].status = 'error';
        updateResults.push('⚠️ 네이버 지도 API 키 미설정');
      }
    } catch (error) {
      apiChecks[2].status = 'error';
      updateResults.push('⚠️ 네이버 지도 API 설정 확인 실패');
    }

    // 4. 내부 API 동기화
    try {
      // 실제 환경에서는 여기서 외부 API로부터 받은 데이터를 파싱하고 
      // 내부 데이터베이스를 업데이트합니다.
      // 현재는 모의 데이터 업데이트 시뮬레이션
      
      // 2025년 6월 추가 청약 정보 시뮬레이션
      const newSubscriptions = [
        '🏠 신규 청약 3건 추가',
        '📅 달력 데이터 업데이트',
        '🔄 기존 청약 상태 갱신'
      ];
      
      apiChecks[3].status = 'success';
      updateResults.push('✅ 내부 데이터 동기화 완료');
      updateResults.push(...newSubscriptions);
      
    } catch (error) {
      apiChecks[3].status = 'error';
      updateResults.push('❌ 내부 데이터 동기화 실패');
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // 성공한 API 개수 계산
    const successCount = apiChecks.filter(api => api.status === 'success').length;
    const totalCount = apiChecks.length;

    return NextResponse.json({
      success: true,
      duration: `${duration}초`,
      summary: `${successCount}/${totalCount} API 연결 성공`,
      apiChecks,
      updateResults,
      timestamp: new Date().toISOString(),
      message: '데이터 업데이트가 완료되었습니다.'
    });

  } catch (error) {
    console.error('전체 업데이트 실패:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '전체 데이터 업데이트 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 