import { NextRequest, NextResponse } from 'next/server';
import { externalApi } from '@/lib/external-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || '11'; // 기본값: 서울시
    const numOfRows = parseInt(searchParams.get('numOfRows') || '100');
    const pageNo = parseInt(searchParams.get('pageNo') || '1');

    // 실제 청약홈 API 호출
    const data = await externalApi.cheongyakHome.getAPTLttotPblancDetail({
      serviceKey: process.env.CHEONGYAKHOME_API_KEY || '',
      numOfRows,
      pageNo,
      region,
    });

    // API 응답 데이터를 내부 형식으로 변환
    const transformedData = data.response?.body?.items?.item || [];
    
    // 내부 포맷으로 변환
    const subscriptions = transformedData.map((item: any) => ({
      id: item.pblancNo || '',
      house_name: item.houseNm || '',
      location: `${item.sido || ''} ${item.gugun || ''}`.trim(),
      address: item.houseDetailAddr || '',
      subscription_start_date: item.rcritPblancBeginDe || '',
      subscription_end_date: item.rcritPblancEndDe || '',
      winner_announcement_date: item.przwnerPresnatnDe || '',
      total_supply_count: parseInt(item.totSuplyHouseHoldCo || '0'),
      constructor: item.cnstrctCmpnyNm || '',
      agency: item.mdhs || '',
      min_price: null, // 청약홈 API에서는 별도 계산 필요
      max_price: null,
    }));

    return NextResponse.json({
      success: true,
      data: subscriptions,
      totalCount: data.response?.body?.totalCount || 0,
    });

  } catch (error) {
    console.error('청약홈 API 호출 실패:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '청약홈 데이터를 가져오는데 실패했습니다.',
        message: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 