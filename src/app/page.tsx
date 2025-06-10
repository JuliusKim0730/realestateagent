'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {/* 타이틀 */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          당신을 위한 부동산 알리미
        </h1>

        {/* 메인 배너 이미지 공간 */}
        <div className="w-full h-96 bg-gray-200 rounded-lg mb-8 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p className="text-lg font-medium">당신을 위한 부동산 알리미</p>
            <p className="text-sm mt-2">맞춤형 청약 정보 서비스</p>
          </div>
        </div>

        {/* 메인 화면 바로가기 버튼 */}
        <button
          onClick={() => router.push('/main')}
          className="w-full bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors shadow-sm mb-4"
        >
          <span className="font-medium">🏠 청약 정보 확인하기</span>
        </button>

        <p className="text-center text-sm text-gray-500">
          실시간 청약 정보와 네이버 지도로 위치를 확인하세요
        </p>
      </div>
    </div>
  );
} 