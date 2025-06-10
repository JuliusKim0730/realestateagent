'use client';

import { useState, useEffect } from 'react';
import { Subscription } from '@/types/subscription';

interface LoanCalculatorProps {
  subscription: Subscription;
}

interface CalculationResult {
  selectedPrice: number;
  loanAmount: number;
  requiredCash: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export default function LoanCalculator({ subscription }: LoanCalculatorProps) {
  const [selectedType, setSelectedType] = useState<number>(0);
  const [loanRatio, setLoanRatio] = useState<number>(80);
  const [interestRate, setInterestRate] = useState<number>(3.5);
  const [loanPeriod, setLoanPeriod] = useState<number>(30);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateLoan = () => {
    if (!subscription.types || subscription.types.length === 0) return;

    const selectedPrice = subscription.types[selectedType]?.price || 0;
    const loanAmount = Math.floor(selectedPrice * (loanRatio / 100));
    const requiredCash = selectedPrice - loanAmount;

    // 월 이자율
    const monthlyRate = interestRate / 100 / 12;
    // 총 개월 수
    const totalMonths = loanPeriod * 12;

    // 월 상환액 계산 (원리금균등상환방식)
    const monthlyPayment = loanAmount > 0 
      ? Math.floor(loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1))
      : 0;

    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - loanAmount;

    setResult({
      selectedPrice,
      loanAmount,
      requiredCash,
      monthlyPayment,
      totalInterest,
      totalPayment
    });
  };

  useEffect(() => {
    calculateLoan();
  }, [selectedType, loanRatio, interestRate, loanPeriod, subscription]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatPrice = (price: number) => {
    if (price >= 100000000) {
      return `${(price / 100000000).toFixed(1)}억`;
    } else if (price >= 10000) {
      return `${Math.floor(price / 10000).toLocaleString()}만`;
    }
    return formatNumber(price);
  };

  if (!subscription.types || subscription.types.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>평형별 정보가 없어 대출 계산기를 사용할 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 계산 조건 입력 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">계산 조건</h3>
          
          {/* 평형 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              평형 선택
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {subscription.types.map((type, index) => (
                <option key={index} value={index}>
                  {type.area_type} - {type.exclusive_area}㎡ ({formatPrice(type.price)}원)
                </option>
              ))}
            </select>
          </div>

          {/* 대출비율 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              대출비율: {loanRatio}%
            </label>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={loanRatio}
              onChange={(e) => setLoanRatio(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>90%</span>
            </div>
          </div>

          {/* 금리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연 금리 (%)
            </label>
            <input
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 대출기간 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              대출기간 (년)
            </label>
            <select
              value={loanPeriod}
              onChange={(e) => setLoanPeriod(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10년</option>
              <option value={15}>15년</option>
              <option value={20}>20년</option>
              <option value={25}>25년</option>
              <option value={30}>30년</option>
              <option value={35}>35년</option>
            </select>
          </div>
        </div>

        {/* 계산 결과 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">계산 결과</h3>
          
          {result && (
            <div className="space-y-4">
              {/* 주요 결과 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">분양가</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {formatPrice(result.selectedPrice)}원
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">대출금액</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {formatPrice(result.loanAmount)}원
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">필요 현금</div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatPrice(result.requiredCash)}원
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ({formatNumber(result.requiredCash)}원)
                  </div>
                </div>
              </div>

              {/* 상세 결과 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">월 상환액</span>
                  <span className="font-semibold">
                    {formatNumber(result.monthlyPayment)}원
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">총 이자</span>
                  <span className="font-semibold text-orange-600">
                    {formatPrice(result.totalInterest)}원
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">총 상환액</span>
                  <span className="font-semibold">
                    {formatPrice(result.totalPayment)}원
                  </span>
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                <h4 className="font-semibold mb-2">💡 참고사항</h4>
                <ul className="space-y-1 text-xs">
                  <li>• 위 계산은 원리금균등상환방식 기준입니다.</li>
                  <li>• 실제 대출조건은 은행별로 다를 수 있습니다.</li>
                  <li>• 취득세, 등록세 등 부대비용은 별도입니다.</li>
                  <li>• 중도상환수수료나 보증료는 포함되지 않았습니다.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 평형별 비교 */}
      {subscription.types.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">평형별 비교</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">타입</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">분양가</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">대출금액</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">필요현금</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">월상환액</th>
                </tr>
              </thead>
              <tbody>
                {subscription.types.map((type, index) => {
                  const typePrice = type.price;
                  const typeLoanAmount = Math.floor(typePrice * (loanRatio / 100));
                  const typeRequiredCash = typePrice - typeLoanAmount;
                  const monthlyRate = interestRate / 100 / 12;
                  const totalMonths = loanPeriod * 12;
                  const typeMonthlyPayment = typeLoanAmount > 0 
                    ? Math.floor(typeLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1))
                    : 0;

                  return (
                    <tr key={index} className={index === selectedType ? 'bg-blue-50' : ''}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {type.area_type}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatPrice(typePrice)}원
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatPrice(typeLoanAmount)}원
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-semibold text-red-600">
                        {formatPrice(typeRequiredCash)}원
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatNumber(typeMonthlyPayment)}원
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 