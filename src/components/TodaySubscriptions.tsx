'use client';

import { Subscription } from '@/types/subscription';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';

interface TodaySubscriptionsProps {
  subscriptions: Subscription[];
}

export default function TodaySubscriptions({ subscriptions }: TodaySubscriptionsProps) {
  const router = useRouter();

  const handleSubscriptionClick = (id: string) => {
    router.push(`/subscription/${id}`);
  };

  const formatPrice = (price: number) => {
    return (price / 100000000).toFixed(1) + '억원';
  };

  if (subscriptions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m0 0H5m2 0v-9"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          오늘 진행 중인 청약은 없습니다
        </h3>
        <p className="text-gray-500">
          월별 청약 탭에서 예정된 청약 정보를 확인해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid gap-4">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.id}
            onClick={() => handleSubscriptionClick(subscription.id)}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {subscription.house_name}
                </h3>
                <p className="text-gray-600 mb-1">
                  📍 {subscription.location}
                </p>
                <p className="text-sm text-gray-500">
                  {subscription.address}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">
                  청약 마감일
                </div>
                <div className="text-lg font-semibold text-red-600">
                  {format(new Date(subscription.subscription_end_date), 'MM월 dd일 (E)', { locale: ko })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">총 공급세대</div>
                <div className="font-semibold text-gray-800">
                  {subscription.total_supply_count.toLocaleString()}세대
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">분양가</div>
                <div className="font-semibold text-gray-800">
                  {subscription.min_price && subscription.max_price ? (
                    `${formatPrice(subscription.min_price)} ~ ${formatPrice(subscription.max_price)}`
                  ) : (
                    '분양가 미정'
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {(() => {
                  // 2025-06-10 기준으로 D-day 계산
                  const today = new Date('2025-06-10');
                  const endDate = new Date(subscription.subscription_end_date);
                  const diffTime = endDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  if (diffDays === 0) return '오늘 마감';
                  if (diffDays < 0) return `마감됨 (${Math.abs(diffDays)}일 전)`;
                  return `D-${diffDays}`;
                })()}
              </div>
              <div className="text-blue-600 font-medium">
                상세보기 →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 