'use client';

import { useEffect, useRef, useState } from 'react';

interface NaverMapProps {
  latitude: number;
  longitude: number;
  address: string;
  houseName: string;
}

declare global {
  interface Window {
    naver: any;
  }
}

export default function NaverMap({ latitude, longitude, address, houseName }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // 네이버 지도 API 인증 실패 처리 함수 등록
    if (typeof window !== 'undefined') {
      (window as any).navermap_authFailure = function() {
        console.error('네이버 지도 API 인증 실패');
        setMapError('네이버 지도 API 인증에 실패했습니다. 클라이언트 키를 확인해주세요.');
      };
      
      // 추가 디버깅 정보
      console.log('네이버 지도 API 초기화 시작');
      console.log('Client ID:', process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || '586jpp38sz');
    }

    // 네이버 클라우드 플랫폼 Maps API 스크립트 로드
    const loadNaverMapScript = () => {
      return new Promise((resolve, reject) => {
        // 이미 로드된 경우
        if (window.naver && window.naver.maps) {
          resolve(window.naver);
          return;
        }

        const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || '586jpp38sz';
        const scriptId = 'naver-maps-api-script';
        
        // 기존 스크립트가 있는지 확인
        let existingScript = document.getElementById(scriptId) as HTMLScriptElement;
        
        if (existingScript) {
          console.log('기존 네이버 지도 스크립트 발견, 재사용');
          // 이미 로드된 스크립트가 있으면 바로 resolve
          if (window.naver && window.naver.maps) {
            resolve(window.naver);
            return;
          }
          // 스크립트는 있지만 API가 로드되지 않은 경우 기다림
          existingScript.onload = () => {
            setTimeout(() => {
              if (window.naver && window.naver.maps) {
                resolve(window.naver);
              } else {
                reject(new Error('네이버 지도 API 로드 실패'));
              }
            }, 100);
          };
          return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
        script.async = true;
        
        console.log('네이버 지도 스크립트 로드 시작:', script.src);
        
        script.onload = () => {
          console.log('네이버 지도 스크립트 로드 완료');
          setTimeout(() => {
            if (window.naver && window.naver.maps) {
              console.log('네이버 지도 API 객체 확인 완료');
              resolve(window.naver);
            } else {
              console.error('네이버 지도 API 객체 없음');
              reject(new Error('네이버 지도 API 로드 실패 - API 객체를 찾을 수 없습니다.'));
            }
          }, 100);
        };
        
        script.onerror = (error) => {
          console.error('네이버 지도 스크립트 로드 에러:', error);
          // 실패한 스크립트 제거
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
          reject(new Error(`네이버 지도 스크립트 로드 실패: ${error}`));
        };
        
        scriptRef.current = script;
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      // 이미 초기화 중이면 중단
      if (isInitializing) {
        console.log('지도 초기화가 이미 진행 중입니다.');
        return;
      }

      try {
        setIsInitializing(true);
        setMapError(null);
        setMapLoaded(false);
        
        console.log('지도 초기화 프로세스 시작');
        await loadNaverMapScript();
        
        if (!mapRef.current) {
          throw new Error('지도 컨테이너를 찾을 수 없습니다.');
        }

        if (!window.naver || !window.naver.maps) {
          throw new Error('네이버 지도 API가 로드되지 않았습니다.');
        }

        // 기존 지도 인스턴스가 있다면 안전하게 제거
        if (mapInstance.current) {
          try {
            if (typeof mapInstance.current.destroy === 'function') {
              mapInstance.current.destroy();
            }
            mapInstance.current = null;
          } catch (error) {
            console.warn('기존 지도 인스턴스 제거 중 오류:', error);
          }
        }

          const mapOptions = {
            center: new window.naver.maps.LatLng(latitude, longitude),
            zoom: 16,
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: window.naver.maps.MapTypeControlStyle.BUTTON,
              position: window.naver.maps.Position.TOP_RIGHT
            },
            zoomControl: true,
            zoomControlOptions: {
              style: window.naver.maps.ZoomControlStyle.SMALL,
              position: window.naver.maps.Position.TOP_LEFT
            },
            scaleControl: false,
            logoControl: false,
            mapDataControl: false
          };

          try {
            console.log('지도 초기화 시작:', mapOptions);
            mapInstance.current = new window.naver.maps.Map(mapRef.current, mapOptions);
            console.log('지도 인스턴스 생성 완료:', mapInstance.current);
            
            // 지도 로드 완료 대기
            window.naver.maps.Event.once(mapInstance.current, 'init', () => {
              console.log('지도 초기화 완료 이벤트 발생');
              // 마커 생성
              const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(latitude, longitude),
                map: mapInstance.current,
                title: houseName,
                icon: {
                  content: `<div style="background: #ff4444; color: white; padding: 8px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${houseName}</div>`,
                  anchor: new window.naver.maps.Point(10, 10)
                }
              });

              // 정보창 생성
              const infoWindow = new window.naver.maps.InfoWindow({
                content: `
                  <div style="padding: 15px; min-width: 250px; font-family: 'Noto Sans KR', sans-serif;">
                    <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #333; font-size: 14px;">${houseName}</h4>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px; line-height: 1.4;">📍 ${address}</p>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px; color: #999;">
                      위도: ${latitude.toFixed(6)} / 경도: ${longitude.toFixed(6)}
                    </div>
                  </div>
                `,
                borderWidth: 0,
                anchorSize: new window.naver.maps.Size(10, 10),
                backgroundColor: 'white'
              });

              // 마커 클릭 시 정보창 표시
              window.naver.maps.Event.addListener(marker, 'click', () => {
                if (infoWindow.getMap()) {
                  infoWindow.close();
                } else {
                  infoWindow.open(mapInstance.current, marker);
                }
              });

              // 기본적으로 정보창 열어놓기
              setTimeout(() => {
                infoWindow.open(mapInstance.current, marker);
              }, 500);

              setMapLoaded(true);
            });

          } catch (mapError) {
            console.error('지도 초기화 실패:', mapError);
            throw mapError;
          }
      } catch (error) {
        console.error('네이버 지도 로드 실패:', error);
        setMapError(error instanceof Error ? error.message : '네이버 지도를 로드할 수 없습니다.');
        setMapLoaded(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeMap();

    return () => {
      console.log('NaverMap 컴포넌트 cleanup 시작');
      
      // 지도 인스턴스 안전하게 제거
      if (mapInstance.current) {
        try {
          if (typeof mapInstance.current.destroy === 'function') {
            mapInstance.current.destroy();
          }
          mapInstance.current = null;
        } catch (error) {
          console.warn('지도 인스턴스 cleanup 중 오류:', error);
        }
      }

      // 상태 초기화
      setMapLoaded(false);
      setMapError(null);
      setIsInitializing(false);
    };
  }, [latitude, longitude, address, houseName]);

  return (
    <div>
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">{houseName}</h3>
        <p className="text-gray-600 text-sm mb-2">📍 {address}</p>
        <div className="text-sm text-gray-500">
          위도: {latitude.toFixed(6)}, 경도: {longitude.toFixed(6)}
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border border-gray-300 relative overflow-hidden"
          style={{ minHeight: '400px' }}
        >
          {/* 로딩 상태 */}
          {(isInitializing || (!mapLoaded && !mapError)) && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">
                  {isInitializing ? '지도를 초기화하는 중...' : '지도를 로딩 중입니다...'}
                </p>
              </div>
            </div>
          )}

          {/* 에러 상태 또는 대체 지도 */}
          {(mapError || !mapLoaded) && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{houseName}</h3>
                <p className="text-sm text-gray-600 mb-4">{address}</p>
                
                {mapError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <h4 className="text-sm font-medium text-red-800">지도 로드 오류</h4>
                    </div>
                    <p className="text-xs text-red-600 mb-2">{mapError}</p>
                    <div className="text-xs text-red-500">
                      <p>• 브라우저 개발자 도구 (F12) 콘솔에서 상세 에러를 확인하세요</p>
                      <p>• 네트워크 연결 상태를 확인하세요</p>
                      <p>• 클라이언트 키가 올바른지 확인하세요</p>
                    </div>
                  </div>
                )}
                
                <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                  <div className="text-xs text-gray-500 mb-2">좌표 정보</div>
                  <div className="text-sm font-mono">
                    위도: {latitude.toFixed(6)}<br />
                    경도: {longitude.toFixed(6)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors mr-2"
                  >
                    네이버지도에서 보기
                  </a>
                  <a
                    href={`https://maps.google.com/maps?q=${latitude},${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    구글지도에서 보기
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 지도 상태 표시 */}
        {mapLoaded && (
          <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-lg px-3 py-1 text-xs text-green-600 font-medium shadow-sm">
            ✅ 네이버 지도 로드 완료
          </div>
        )}
        
        {/* API 키 정보 표시 (개발 모드) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-2 right-2 bg-blue-500 bg-opacity-90 rounded-lg px-3 py-1 text-xs text-white font-mono shadow-sm">
            API: {process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || '586jpp38sz'}
          </div>
        )}
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">교통 정보</h4>
          <p className="text-sm text-blue-700">
            가까운 지하철역과 버스정류장 정보는<br />
            실제 API 연동 후 표시됩니다.
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">주변 시설</h4>
          <p className="text-sm text-green-700">
            학교, 병원, 쇼핑몰 등 주변 시설 정보는<br />
            실제 API 연동 후 표시됩니다.
          </p>
        </div>
      </div>
    </div>
  );
} 