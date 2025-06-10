'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/main');
    }
  }, [status, router]);

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/main' });
  };

  if (!isClient || status === 'loading') {
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
            <p className="text-sm mt-2">main_banner.png를 public/images/에 추가해주세요</p>
          </div>
        </div>

        {/* 구글 로그인 버튼 */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-300 rounded-lg px-6 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm mb-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-gray-700 font-medium">구글로 로그인</span>
        </button>

        {/* 테스트용 메인 화면 바로가기 버튼 */}
        <button
          onClick={() => router.push('/main')}
          className="w-full bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors shadow-sm mb-4"
        >
          <span className="font-medium">🏠 테스트용 메인 화면 바로가기</span>
        </button>

        <p className="text-center text-sm text-gray-500">
          로그인하여 맞춤형 청약 정보를 확인하세요
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          ※ 테스트용 버튼으로 서비스 기능을 미리 체험해보세요
        </p>
      </div>
    </div>
  );
} 