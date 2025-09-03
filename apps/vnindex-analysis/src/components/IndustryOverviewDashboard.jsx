import React, { useState, useMemo } from 'react';
import { useDataLoader } from '../utils/dataLoader';
import { AlertTriangle } from 'lucide-react';
import IndustryStrengthHeatmap from './IndustryStrengthHeatmap';
import MarketOverview from './MarketOverview';
import UnifiedRankingByScore from './UnifiedRankingByScore';
import UnifiedRankingBySpeed from './UnifiedRankingBySpeed';
import DetailedAnalysis from './DetailedAnalysis';
import IndustryRSAnalysis from './IndustryRSAnalysis';
import RRGChart from './rrg/RRGChart';

import TabNav from './detailed-analysis/layout/TabNav';

const TABS = [
  { key: 'overview', label: 'Thị trường chung' },
  { key: 'ranking', label: '📊 Xếp hạng & Phân tích' },
  { key: 'rrg', label: 'RRG Ngành' },
  { key: 'heatmap', label: 'Heatmap' },
  { key: 'rrg-groups', label: 'RRG Nhóm Vốn Hóa' },
];

const IndustryOverviewDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('1D');
  
  // Use centralized data loader
  const { data: analyticsData, loading, error } = useDataLoader('RRG_ANALYSIS', timeframe);
  
  const { industries: allIndustries } = analyticsData || {};
  
  // Get insights data
  const insights = analyticsData?.insights || {};
  const marketOverview = insights?.market_overview || {};
  const industryAnalysis = insights?.insights?.industries || {};
  const detailedAnalysis = insights?.detailed_analysis || {};
  const investmentStrategies = insights?.investment_strategies || {};

  const { industries } = useMemo(() => {
    if (!allIndustries) return { industries: [] };
    
    const industriesWithRS = allIndustries.map(ind => {
      const latest = Array.isArray(ind.tail) && ind.tail.length > 0 ? ind.tail[ind.tail.length - 1] : {};
      return {
        ...ind,
        industry: ind.name,
        rs_close: ind.metrics?.current_rs ?? null,  // Current RS from metrics
        rs_ratio: latest.x ?? null,        // RRG RS-Ratio (x-axis)
        rs_momentum: latest.y ?? null,     // RRG RS-Momentum (y-axis)
        crs: ind.metrics?.current_crs ?? null,      // Current CRS from metrics
      };
    });
    return {
      industries: industriesWithRS,
    };
  }, [allIndustries]);

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
          <span className="ml-3 text-gray-600">Đang tải dữ liệu phân tích ngành...</span>
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
            industries={allIndustries}
            analyticsData={analyticsData}
          />          

          {/* Unified Ranking by Score */}
          {(() => {
            return (
              <UnifiedRankingByScore
                analysisData={analyticsData?.insights?.insights?.industries || {}}
                type="industry"
                getQuadrantColor={getQuadrantColor}
                analyzeData={analyticsData}
              />
            );
          })()}

          {/* Unified Ranking by Speed */}
          <UnifiedRankingBySpeed
            analysisData={analyticsData?.insights?.insights?.industries || {}}
            type="industry"
            renderInsightItems={renderInsightItems}
            rrgData={analyticsData}
            analyzeData={analyticsData}
          />
          
          {/* Detailed Analysis - Hidden as momentum analysis is disabled */}
          {/* <DetailedAnalysis
            detailedAnalysis={detailedAnalysis}
            getSentimentColor={getSentimentColor}
          /> */}

        
        </div>
      )}
      {activeTab === 'ranking' && (
        <div className="space-y-6">
          <IndustryRSAnalysis 
            key={`industry-rs-analysis-${timeframe}`}
            timeframe={timeframe}
            analyticsData={analyticsData}
          />
        </div>
      )}
      {activeTab === 'rrg' && (
        <div className="space-y-6">
          <div className="mb-4 w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Phân tích RRG ngành nghề
            </h3>
            <p className="text-gray-600">
              Hiển thị sức mạnh tương đối và động lượng của các ngành. Ngành ở góc Dẫn đầu đang vượt trội với động lượng tích cực.
            </p>
          </div>              
          <div className="bg-white rounded-lg shadow-sm border p-6 w-full mb-6">
            <div className="w-full">
              <RRGChart 
                key={`industries-${timeframe}`} 
                type="industries" 
                timeframe={timeframe}
                analyticsData={analyticsData}
              />
            </div>
          </div>
        </div>
      )}
      {activeTab === 'rrg-groups' && (
        <div className="space-y-6">
          <div className="mb-4 w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Phân tích RRG nhóm vốn hóa
            </h3>
            <p className="text-gray-600">
              Hiển thị sức mạnh tương đối và động lượng của các nhóm vốn hóa (VN30, VN100, VNMidCap, VNSmallCap). Nhóm ở góc Dẫn đầu đang vượt trội với động lượng tích cực.
            </p>
          </div>              
          <div className="bg-white rounded-lg shadow-sm border p-6 w-full mb-6">
            <div className="w-full">
              <RRGChart 
                key={`groups-${timeframe}`} 
                type="groups" 
                timeframe={timeframe}
                analyticsData={analyticsData}
              />
            </div>
          </div>
        </div>
      )}
      {activeTab === 'heatmap' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <IndustryStrengthHeatmap industries={industries} timeframe={timeframe} />
        </div>
      )}
    </div>
  );
};

export default IndustryOverviewDashboard;
