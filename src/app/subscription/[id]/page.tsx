'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Subscription } from '@/types/subscription';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import NaverMap from '@/components/NaverMap';
import LoanCalculator from '@/components/LoanCalculator';

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'map' | 'calculator'>('info');

  useEffect(() => {
    if (params.id) {
      loadSubscriptionDetail(params.id as string);
    }
  }, [params.id]);

  const loadSubscriptionDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/subscriptions/${id}`);
      if (!response.ok) {
        throw new Error('API 호출 실패');
      }
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error('청약 상세 정보 로드 실패:', error);
      // 개발 중에는 더미 데이터 사용
      setSubscription({
        id: id,
        house_name: '래미안 강남 (샘플)',
        location: '서울 강남구',
        address: '서울시 강남구 대치동 123-45',
        latitude: 37.4979,
        longitude: 127.0276,
        subscription_start_date: '2024-12-10',
        subscription_end_date: '2024-12-15',
        winner_announcement_date: '2024-12-20',
        total_supply_count: 300,
        constructor: '삼성물산',
        agency: '래미안',
        min_price: 800000000,
        max_price: 1500000000,
        types: [
          {
            area_type: '84A',
            supply_area: 84.5,
            exclusive_area: 59.8,
            supply_count: 100,
            price: 800000000
          },
          {
            area_type: '104A',
            supply_area: 104.2,
            exclusive_area: 74.1,
            supply_count: 150,
            price: 1200000000
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return (price / 100000000).toFixed(1) + '억원';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">청약 정보를 찾을 수 없습니다</h2>
          <button
            onClick={() => router.push('/main')}
            className="text-blue-600 hover:text-blue-800"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            돌아가기
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {subscription.house_name}
          </h1>
          <p className="text-gray-600">
            📍 {subscription.location} • {subscription.address}
          </p>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'info'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            기본 정보
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'map'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            위치 확인
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'calculator'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            대출 계산기
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'info' && (
            <div className="p-6">
              {/* 청약 일정 */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">청약 일정</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-green-600 font-medium mb-1">청약 시작</div>
                    <div className="text-lg font-semibold">
                      {subscription.subscription_start_date 
                        ? format(new Date(subscription.subscription_start_date), 'MM월 dd일 (E)', { locale: ko })
                        : '미정'
                      }
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-red-600 font-medium mb-1">청약 마감</div>
                    <div className="text-lg font-semibold">
                      {format(new Date(subscription.subscription_end_date), 'MM월 dd일 (E)', { locale: ko })}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-medium mb-1">당첨 발표</div>
                    <div className="text-lg font-semibold">
                      {subscription.winner_announcement_date 
                        ? format(new Date(subscription.winner_announcement_date), 'MM월 dd일 (E)', { locale: ko })
                        : '미정'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">시공사</div>
                        <div className="font-semibold">{subscription.constructor || '미정'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">분양업체</div>
                        <div className="font-semibold">{subscription.agency || '미정'}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">총 공급세대</div>
                        <div className="font-semibold">{subscription.total_supply_count.toLocaleString()}세대</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">분양가 범위</div>
                        <div className="font-semibold">
                          {subscription.min_price && subscription.max_price
                            ? `${formatPrice(subscription.min_price)} ~ ${formatPrice(subscription.max_price)}`
                            : '미정'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 평형별 정보 */}
              {subscription.types && subscription.types.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">평형별 정보</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">타입</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">공급면적</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">전용면적</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">공급세대</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">분양가</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscription.types.map((type, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2 font-medium">{type.area_type}</td>
                            <td className="border border-gray-300 px-4 py-2">{type.supply_area}㎡</td>
                            <td className="border border-gray-300 px-4 py-2">{type.exclusive_area}㎡</td>
                            <td className="border border-gray-300 px-4 py-2">{type.supply_count}세대</td>
                            <td className="border border-gray-300 px-4 py-2 font-semibold">
                              {formatPrice(type.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'map' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">위치 정보</h2>
              <NaverMap
                latitude={subscription.latitude || 37.4979}
                longitude={subscription.longitude || 127.0276}
                address={subscription.address}
                houseName={subscription.house_name}
              />
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">대출 계산기</h2>
              <LoanCalculator subscription={subscription} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 