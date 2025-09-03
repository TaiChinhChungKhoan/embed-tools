import React, { useState } from 'react';
import { useDataLoader } from '../utils/dataLoader';
import MomentumInsightsDashboard from './MomentumInsightsDashboard';

const MomentumInsightsWrapper = () => {
  const [timeframe, setTimeframe] = useState('1D');
  const { data: rsData, loading, error } = useDataLoader('rs_analysis', timeframe);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        {/* Timeframe Selector - Show even when loading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Tổng quan Động lượng Thị trường</h2>
          <div className="flex gap-2">
            <button
              className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1D' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
              onClick={() => setTimeframe('1D')}
            >
              Hàng ngày (1D)
            </button>
            <button
              className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1W' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
              onClick={() => setTimeframe('1W')}
            >
              Hàng tuần (1W)
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Đang tải thông tin động lượng ({timeframe})...</div>
        </div>
      </div>
    );
  }

  if (error || !rsData?.momentum_insights) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Tổng quan Động lượng Thị trường</h2>
          <div className="flex gap-2">
            <button
              className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1D' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
              onClick={() => setTimeframe('1D')}
            >
              Hàng ngày (1D)
            </button>
            <button
              className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1W' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
              onClick={() => setTimeframe('1W')}
            >
              Hàng tuần (1W)
            </button>
          </div>
        </div>
        <div className="text-center text-gray-500 space-y-2">
          {error ? (
            <div>
              <div className="text-red-600 font-medium">Lỗi tải dữ liệu:</div>
              <div className="text-sm">{error}</div>
            </div>
          ) : (
            <div>
              <div className="font-medium">Trạng thái dữ liệu:</div>
              <div className="text-sm space-y-1">
                <div>• Có dữ liệu RS: {rsData ? '✅' : '❌'}</div>
                <div>• Có momentum_insights: {rsData?.momentum_insights ? '✅' : '❌'}</div>
                {rsData && <div>• Khóa dữ liệu: {Object.keys(rsData).join(', ')}</div>}
                {rsData?.momentum_insights && (
                  <div>• Insights có: {Object.keys(rsData.momentum_insights).join(', ')}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <MomentumInsightsDashboard 
      momentumInsights={rsData.momentum_insights} 
      timeframe={timeframe}
      onTimeframeChange={setTimeframe}
    />
  );
};

export default MomentumInsightsWrapper;