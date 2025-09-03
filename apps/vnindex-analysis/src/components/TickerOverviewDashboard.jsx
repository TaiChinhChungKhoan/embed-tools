import React, { useState, useMemo } from 'react';
import { useDataLoader } from '../utils/dataLoader';
import TickerEnhancedRSAnalysis from './TickerEnhancedRSAnalysis';
import RRGChart from './rrg/RRGChart';
import TickerHeatmap from './TickerHeatmap';

import TabNav from './detailed-analysis/layout/TabNav';

const TABS = [
  { key: 'ranking', label: '📊 Xếp hạng & Phân tích' },
  { key: 'rrg', label: 'RRG Cổ phiếu' },
  { key: 'heatmap', label: 'Heatmap' },
];

const TickerOverviewDashboard = () => {
  const [activeTab, setActiveTab] = useState('ranking');
  const [timeframe, setTimeframe] = useState('1D');
  
  // Use centralized data loader
  const { data: analyticsData, loading, error } = useDataLoader('RRG_ANALYSIS', timeframe);
  
  const { symbols: allTickers } = analyticsData || {};
  
  // Get insights data
  const insights = analyticsData?.insights || {};

  const { tickers } = useMemo(() => {
    if (!allTickers) return { tickers: [] };
    
    const tickersWithRS = allTickers.map(ticker => {
      const latest = Array.isArray(ticker.tail) && ticker.tail.length > 0 ? ticker.tail[ticker.tail.length - 1] : {};
      return {
        ...ticker,
        symbol: ticker.symbol,
        rs_close: ticker.metrics?.current_rs ?? null,  // Current RS from metrics
        rs_ratio: latest.x ?? null,        // RRG RS-Ratio (x-axis)
        rs_momentum: latest.y ?? null,     // RRG RS-Momentum (y-axis)
        crs: ticker.metrics?.current_crs ?? null,      // Current CRS from metrics
      };
    });
    return {
      tickers: tickersWithRS,
    };
  }, [allTickers]);



  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu phân tích cổ phiếu...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 p-4">
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Lỗi tải dữ liệu</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Timeframe Selector (localized, rounded, consistent UI) */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center">
        <span className="text-gray-700 font-medium mr-4">Khung thời gian:</span>
        <div className="flex gap-2">
          <button
            className={`cursor-pointer px-4 py-1 rounded-full font-medium text-sm border transition-colors ${
              timeframe === '1D'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => setTimeframe('1D')}
          >
            Hàng ngày (1D)
          </button>
          <button
            className={`cursor-pointer px-4 py-1 rounded-full font-medium text-sm border transition-colors ${
              timeframe === '1W'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => setTimeframe('1W')}
          >
            Hàng tuần (1W)
          </button>
        </div>
      </div>
      {/* Tab Navigation */}
      <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'ranking' && (
        <div className="space-y-6">
          <TickerEnhancedRSAnalysis 
            key={`ticker-enhanced-rs-${timeframe}`}
            timeframe={timeframe}
            analyticsData={analyticsData}
          />
        </div>
      )}
      {activeTab === 'rrg' && (
        <div className="space-y-6">
          <div className="mb-4 w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Phân tích RRG cổ phiếu
            </h3>
            <p className="text-gray-600">
              Hiển thị sức mạnh tương đối và động lượng của các cổ phiếu. Cổ phiếu ở góc Dẫn đầu đang vượt trội với động lượng tích cực.
            </p>
          </div>              
          <div className="bg-white rounded-lg shadow-sm border p-6 w-full mb-6">
            <div className="w-full">
              <RRGChart 
                key={`tickers-${timeframe}`} 
                type="tickers" 
                timeframe={timeframe}
                analyticsData={analyticsData}
              />
            </div>
          </div>
        </div>
      )}      
      {activeTab === 'heatmap' && (
        <div className="space-y-6">
          <div className="mb-4 w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Heatmap Cổ phiếu
            </h3>
            <p className="text-gray-600">
              Hiển thị sức mạnh tương đối của các cổ phiếu theo các chỉ số khác nhau. Màu xanh lá thể hiện cổ phiếu mạnh, màu đỏ thể hiện cổ phiếu yếu.
            </p>
          </div>              
          <TickerHeatmap 
            key={`ticker-heatmap-${timeframe}`} 
            timeframe={timeframe}
            analyticsData={analyticsData}
          />
        </div>
      )}
    </div>
  );
};

export default TickerOverviewDashboard; 