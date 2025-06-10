'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { subscriptionApi } from '@/lib/api';
import { Subscription, CalendarData } from '@/types/subscription';
import TodaySubscriptions from '@/components/TodaySubscriptions';
import MonthlyCalendar from '@/components/MonthlyCalendar';

export default function MainPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'today' | 'monthly'>('today');
  const [todaySubscriptions, setTodaySubscriptions] = useState<Subscription[]>([]);
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{
    type: 'info' | 'success' | 'error';
    message: string;
    details?: string[];
  } | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // 테스트용: 인증 체크 비활성화 (개발 중)
    // if (status === 'unauthenticated') {
    //   router.push('/');
    //   return;
    // }

    // 데이터는 항상 로드
    loadData();
  }, [isClient, status, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 오늘의 청약 정보 로드
      const today = await subscriptionApi.getTodaySubscriptions();
      setTodaySubscriptions(today);

      // 현재 월의 캘린더 데이터 로드
      const now = new Date();
      const calendar = await subscriptionApi.getCalendarData(
        now.getFullYear(),
        now.getMonth() + 1
      );
      setCalendarData(calendar);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      // 개발 중에는 더미 데이터 사용
      setTodaySubscriptions([]);
      setCalendarData({});
    } finally {
      setLoading(false);
    }
  };

  // 전체 데이터 업데이트 함수
  const handleUpdateData = async () => {
    setUpdating(true);
    setUpdateStatus({
      type: 'info',
      message: '모든 API를 확인하고 데이터를 업데이트하는 중...',
      details: ['청약홈 API 연결 확인', 'LH API 연결 확인', '네이버 지도 API 확인', '내부 데이터 동기화']
    });

    try {
      const response = await fetch('/api/update/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setUpdateStatus({
          type: 'success',
          message: `${result.summary} - ${result.duration} 소요`,
          details: result.updateResults
        });

        // 5초 후 데이터 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 3000);

      } else {
        setUpdateStatus({
          type: 'error',
          message: result.error || '업데이트 중 오류가 발생했습니다.',
          details: result.details ? [result.details] : undefined
        });
      }
    } catch (error) {
      setUpdateStatus({
        type: 'error',
        message: '서버와 연결할 수 없습니다.',
        details: ['네트워크 연결을 확인해주세요.']
      });
    } finally {
      setUpdating(false);
      
      // 성공/실패 메시지를 10초 후에 자동으로 숨김
      setTimeout(() => {
        setUpdateStatus(null);
      }, 10000);
    }
  };

  const handleTabChange = (tab: 'today' | 'monthly') => {
    setActiveTab(tab);
  };

  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                오늘의 청약 정보
              </h1>
              <p className="text-gray-600">
                안녕하세요, {session?.user?.name || '테스트 사용자'}님! 오늘의 청약 정보를 확인하세요.
              </p>
            </div>
            <button
              onClick={handleUpdateData}
              disabled={updating}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                updating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              {updating ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  업데이트 중...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  전체 데이터 업데이트
                </>
              )}
            </button>
          </div>
          
          {/* 업데이트 상태 표시 */}
          {updateStatus && (
            <div className={`px-4 py-3 rounded-lg mb-4 ${
              updateStatus.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : updateStatus.type === 'error'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              <div className="flex items-center gap-2">
                {updateStatus.type === 'success' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : updateStatus.type === 'error' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
                <span className="font-medium">{updateStatus.message}</span>
              </div>
              {updateStatus.details && (
                <div className="mt-2 text-sm">
                  {updateStatus.details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-current rounded-full opacity-60"></span>
                      {detail}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 탭 버튼 */}
        <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => handleTabChange('today')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'today'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            오늘의 청약
          </button>
          <button
            onClick={() => handleTabChange('monthly')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'monthly'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            월별 청약
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'today' ? (
            <TodaySubscriptions subscriptions={todaySubscriptions} />
          ) : (
            <MonthlyCalendar calendarData={calendarData} />
          )}
        </div>
      </div>
    </div>
  );
} 