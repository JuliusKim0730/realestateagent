import axios from 'axios';
import { Subscription, CalendarData, SearchParams } from '@/types/subscription';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT 토큰 인터셉터
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const subscriptionApi = {
  // 오늘의 청약 정보
  getTodaySubscriptions: async (): Promise<Subscription[]> => {
    const response = await apiClient.get('/subscriptions/today');
    return response.data;
  },

  // 월별 청약 캘린더 데이터
  getCalendarData: async (year: number, month: number): Promise<CalendarData> => {
    const response = await apiClient.get(`/subscriptions/calendar?year=${year}&month=${month}`);
    return response.data;
  },

  // 청약 상세 정보
  getSubscriptionDetail: async (id: string): Promise<Subscription> => {
    const response = await apiClient.get(`/subscriptions/${id}`);
    return response.data;
  },

  // 청약 검색
  searchSubscriptions: async (params: SearchParams): Promise<Subscription[]> => {
    const queryParams = new URLSearchParams();
    if (params.region) queryParams.append('region', params.region);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    
    const response = await apiClient.get(`/subscriptions/search?${queryParams.toString()}`);
    return response.data;
  },
};

export default apiClient; 