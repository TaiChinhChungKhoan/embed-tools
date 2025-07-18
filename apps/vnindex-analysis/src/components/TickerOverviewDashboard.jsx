import React, { useState, useMemo } from 'react';
import { useDataLoader } from '../utils/dataLoader';
import { AlertTriangle } from 'lucide-react';
import MarketOverview from './MarketOverview';
import UnifiedRankingByScore from './UnifiedRankingByScore';
import UnifiedRankingBySpeed from './UnifiedRankingBySpeed';
import DetailedAnalysis from './DetailedAnalysis';
import TickerRSTable from './TickerRSTable';
import RRGChart from './rrg/RRGChart';
import TickerHeatmap from './TickerHeatmap';

import TabNav from './detailed-analysis/layout/TabNav';

const TABS = [
  { key: 'overview', label: 'Thị trường chung' },
  { key: 'ranking', label: '📊 Xếp hạng & Phân tích' },
  { key: 'rrg', label: 'RRG Cổ phiếu' },
  { key: 'heatmap', label: 'Heatmap' },
];

const TickerOverviewDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('1D');
  
  // Use centralized data loader
  const { data: analyticsData, loading, error } = useDataLoader('RRG_ANALYSIS', timeframe);
  
  const { symbols: allTickers } = analyticsData || {};
  
  // Get insights data
  const insights = analyticsData?.insights || {};
  const marketOverview = insights?.market_overview || {};
  const tickerAnalysis = insights?.insights?.tickers || {};
  const detailedAnalysis = insights?.detailed_analysis || {};
  const investmentStrategies = insights?.investment_strategies || {};

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

  // Helper functions for the components
  const getQuadrantColor = (quadrant) => {
    if (quadrant?.includes('Leading') || quadrant?.includes('Dẫn dắt')) return 'text-green-600';
    if (quadrant?.includes('Improving') || quadrant?.includes('Cải thiện')) return 'text-blue-600';
    if (quadrant?.includes('Weakening') || quadrant?.includes('Suy yếu')) return 'text-yellow-600';
    if (quadrant?.includes('Lagging') || quadrant?.includes('Tụt hậu')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'bullish':
        return 'text-green-600';
      case 'bearish':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderInsightItems = (items, type) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="bg-white p-3 rounded border">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-900">
                  {item?.name || item?.custom_id || item?.symbol || 'Unknown'}
                </div>
                <div className="text-sm text-gray-600 mt-1">{item?.description || 'N/A'}</div>
                <div className={`text-xs mt-1 ${getQuadrantColor(item?.rrg_position)}`}>
                  {item?.rrg_position || 'N/A'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600">{(item?.speed_score || 0).toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">{item?.speed_category || 'N/A'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Full Market Overview Panel (RRG/insights-driven) */}
          <MarketOverview
            marketOverview={marketOverview}
            getSentimentColor={getSentimentColor}
            breadth_detail={detailedAnalysis.breadth_detail}
            tickers={allTickers}
            analyticsData={analyticsData}
          />          

          {/* Unified Ranking by Score */}
          {(() => {
            return (
              <UnifiedRankingByScore
                analysisData={analyticsData?.insights?.insights?.tickers || {}}
                type="ticker"
                getQuadrantColor={getQuadrantColor}
                analyzeData={analyticsData}
              />
            );
          })()}

          {/* Unified Ranking by Speed */}
          <UnifiedRankingBySpeed
            analysisData={analyticsData?.insights?.insights?.tickers || {}}
            type="ticker"
            renderInsightItems={renderInsightItems}
            rrgData={analyticsData}
            analyzeData={analyticsData}
          />

          {/* Detailed Analysis */}
          <DetailedAnalysis
            detailedAnalysis={detailedAnalysis}
            getSentimentColor={getSentimentColor}
          />

        
        </div>
      )}
      {activeTab === 'ranking' && (
        <div className="space-y-6">
          <TickerRSTable />
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