import axios from 'axios';

// 청약홈 API 클라이언트
const cheongyakHomeApi = axios.create({
  baseURL: process.env.CHEONGYAKHOME_API_URL,
  timeout: 10000,
});

// LH API 클라이언트
const lhApi = axios.create({
  baseURL: process.env.LH_API_URL,
  timeout: 10000,
});

export const externalApi = {
  // 청약홈 API 관련 함수들
  cheongyakHome: {
    // 분양정보 조회
    async getAPTLttotPblancDetail(params: {
      serviceKey: string;
      numOfRows?: number;
      pageNo?: number;
      region?: string;
    }) {
      try {
        const response = await cheongyakHomeApi.get('/getAPTLttotPblancDetail', {
          params: {
            serviceKey: params.serviceKey || process.env.CHEONGYAKHOME_API_KEY,
            numOfRows: params.numOfRows || 100,
            pageNo: params.pageNo || 1,
            region: params.region || '11', // 기본값: 서울시
          },
        });
        return response.data;
      } catch (error) {
        console.error('청약홈 분양정보 조회 실패:', error);
        throw error;
      }
    },
  },

  // LH API 관련 함수들
  lh: {
    // LH 청약센터 분양/임대정보
    async getSubscriptHouseInfo(params: {
      serviceKey: string;
      numOfRows?: number;
      pageNo?: number;
    }) {
      try {
        const response = await lhApi.get('/LH_SubscriptHouseInfo/getSubscriptHouseInfo', {
          params: {
            serviceKey: params.serviceKey || process.env.LH_API_KEY,
            numOfRows: params.numOfRows || 100,
            pageNo: params.pageNo || 1,
          },
        });
        return response.data;
      } catch (error) {
        console.error('LH 청약정보 조회 실패:', error);
        throw error;
      }
    },
  },
}; 