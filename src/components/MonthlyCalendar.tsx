'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { CalendarData } from '@/types/subscription';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';

interface MonthlyCalendarProps {
  calendarData: CalendarData;
}

export default function MonthlyCalendar({ calendarData }: MonthlyCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const router = useRouter();

  const handleDateChange = (value: any) => {
    setSelectedDate(value);
  };

  const handleSubscriptionClick = (id: string) => {
    router.push(`/subscription/${id}`);
  };

  const getTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const dateString = format(date, 'yyyy-MM-dd');
    const events = calendarData[dateString];

    if (!events || events.length === 0) return null;

    return (
      <div className="calendar-events">
        {events.map((event, index) => (
          <div
            key={`${event.id}-${index}`}
            className="text-xs bg-blue-500 text-white rounded px-1 mt-1 truncate"
            title={event.house_name}
          >
            {event.house_name}
          </div>
        ))}
      </div>
    );
  };

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const selectedEvents = calendarData[selectedDateString] || [];

  return (
    <div className="p-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 캘린더 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">청약 캘린더</h3>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="w-full"
            tileContent={getTileContent}
            locale="ko-KR"
            formatDay={(locale, date) => format(date, 'd')}
            formatMonthYear={(locale, date) => format(date, 'yyyy년 MM월', { locale: ko })}
            showNeighboringMonth={false}
          />
          
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>청약 일정</span>
            </div>
            <p>날짜를 클릭하면 해당 일의 청약 정보를 확인할 수 있습니다.</p>
          </div>
        </div>

        {/* 선택된 날짜의 청약 정보 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {format(selectedDate, 'MM월 dd일 (E)', { locale: ko })} 청약 정보
          </h3>
          
          {selectedEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p>선택한 날짜에 청약 일정이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((event, index) => (
                <div
                  key={`${event.id}-${index}`}
                  onClick={() => handleSubscriptionClick(event.id)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {event.house_name}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        event.event_type === 'start'
                          ? 'bg-green-100 text-green-700'
                          : event.event_type === 'end'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {event.event_type === 'start'
                        ? '청약 시작'
                        : event.event_type === 'end'
                        ? '청약 마감'
                        : '당첨 발표'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    마감일: {format(new Date(event.subscription_end_date), 'MM월 dd일', { locale: ko })}
                  </div>
                  
                  <div className="text-blue-600 text-sm font-medium">
                    상세보기 →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 