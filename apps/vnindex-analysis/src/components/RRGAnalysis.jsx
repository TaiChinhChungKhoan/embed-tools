import React, { useState } from 'react';
import RRGChart from './rrg/RRGChart';

import MarketOverview from './MarketOverview';
import UnifiedRankingByScore from './UnifiedRankingByScore';
import UnifiedRankingBySpeed from './UnifiedRankingBySpeed';
import DetailedAnalysis from './DetailedAnalysis';
import { useRRGAnalysis } from '../utils/dataLoader';
import { getSentimentColor, getRiskColor, getDirectionColor, getQuadrantColor } from './detailed-analysis/utils/colorUtils';

// Main RRGAnalysis Component
export default function RRGAnalysis({ type = 'industries' }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('1D');
  
  const { data: analyzeRsData, loading, error } = useRRGAnalysis(timeframe);
  
  // Safely access insights data with fallbacks for new standardized structure
  const insights = analyzeRsData?.insights || {};
  const marketOverview = insights?.market_overview || {};
  const industryAnalysis = insights?.insights?.industries || {};
  const groupAnalysis = insights?.insights?.groups || {};
  const tickerAnalysis = insights?.insights?.tickers || {};
  const advancedAnalysis = insights?.advanced_analysis || {};
  // investment_strategies is under insights
  const investmentStrategies = insights?.investment_strategies || {};
  const detailedAnalysis = insights?.detailed_analysis || {};
  
  // Access the main data arrays
  const industries = analyzeRsData?.industries || [];
  const groups = analyzeRsData?.groups || [];
  const symbols = analyzeRsData?.symbols || [];

  // Update active tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Helper function to safely render insight items with standardized structure
  const renderInsightItems = (items, type) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return null;
    }

    return (
      <div className="space-y-2">
        {items.slice(0, 5).map((item, index) => (
          <div key={index} className="bg-white p-3 rounded border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {item?.name || item?.custom_id || item?.symbol || 'Unknown'}
                  {item?.symbol && ` (${item.symbol})`}
                </div>
                {/* Use primary_industry if available, otherwise fall back to industries array */}
                <div className="text-xs text-gray-500">
                  {item?.primary_industry || (item?.industries && item.industries.length > 0 ? (() => {
                    const primaryIndustry = item.industries.find(ind => ind.is_primary);
                    const firstIndustry = item.industries[0];
                    const industryName = primaryIndustry?.name || firstIndustry?.name;
                    return typeof industryName === 'string' ? industryName : 'Unknown Industry';
                  })() : 'N/A')}
                </div>
                {/* Use new direct fields if available */}
                <div className="text-sm text-gray-600 mt-1">
                  {item?.speed_category || item?.speed_analysis?.speed_category || 'N/A'}
                </div>
                <div className={`text-xs mt-1 ${getDirectionColor(item?.direction || item?.direction_analysis?.direction)}`}>
                  {item?.direction || item?.direction_analysis?.direction || 'N/A'}
                </div>
                {/* Add description if available */}
                {item?.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {item.description}
                  </div>
                )}
                {/* Add money flow if available */}
                {item?.money_flow && (
                  <div className="text-xs text-blue-600 mt-1">
                    {item.money_flow}
                  </div>
                )}
                {/* Add performance summary if available */}
                {item?.performance_summary && (
                  <div className="text-xs text-gray-500 mt-1">
                    RS Trend: {item.performance_summary.rs_trend || 'N/A'}
                  </div>
                )}
              </div>
              <div className="text-right ml-4">
                <div className="text-sm font-medium text-purple-600">
                  {(item?.weighted_speed || item?.speed_analysis?.weighted_speed || 0).toFixed(3)}
                </div>
                <div className={`text-xs mt-1 ${getRiskColor(item?.risk_level || item?.risk_assessment?.risk_level)}`}>
                  {item?.risk_level || item?.risk_assessment?.risk_level || 'Unknown'} Risk
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item?.position_size || item?.risk_assessment?.suggested_position_size || 'N/A'}
                </div>
                {/* Add strength score if available */}
                {item?.strength_score && (
                  <div className="text-xs text-green-600 mt-1">
                    Score: {item.strength_score.toFixed(2)}
                  </div>
                )}
                {/* Add acceleration if available */}
                {item?.acceleration && (
                  <div className="text-xs text-green-600 mt-1">
                    Acc: {item.acceleration.toFixed(2)}
                  </div>
                )}
                {/* Add RRG position if available */}
                {item?.rrg_position && (
                  <div className="text-xs text-blue-600 mt-1">
                    {item.rrg_position}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const [overviewType, setOverviewType] = useState(type === 'tickers' ? 'ticker' : 'industry');
  const OverviewToggle = () => {
    if (type === 'tickers') {
      return (
        <div className="bg-gray-50 rounded-lg border p-4 flex items-center space-x-4 mb-4">
          <span className="text-sm font-medium text-gray-700">Phân tích cổ phiếu:</span>
          <div className="text-sm text-gray-600">
            Hiển thị xếp hạng và phân tích chi tiết cho các mã chứng khoán
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-gray-50 rounded-lg border p-4 flex items-center space-x-4 mb-4">
        <span className="text-sm font-medium text-gray-700">Hiển thị tổng quan cho:</span>
        <button
          className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${overviewType === 'industry' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
          onClick={() => setOverviewType('industry')}
        >
          Ngành nghề
        </button>
        <button
          className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${overviewType === 'group' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
          onClick={() => setOverviewType('group')}
        >
          Nhóm vốn hóa
        </button>
        <button
          className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${overviewType === 'ticker' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
          onClick={() => setOverviewType('ticker')}
        >
          Cổ phiếu
        </button>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Đồ thị Xoay Tương đối (RRG)
        </h2>
        <p className="text-gray-600 mb-4">
          Phân tích sức mạnh tương đối và động lượng của các ngành và cổ phiếu so với VN-Index.
        </p>
        
        {/* Timeframe Selector */}
        <div className="bg-gray-50 rounded-lg border p-4 flex items-center space-x-4 mb-4">
          <span className="text-sm font-medium text-gray-700">Khung thời gian:</span>
          <button
            className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1D' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
            onClick={() => {
              setTimeframe('1D');
            }}
          >
            Hàng ngày (1D)
          </button>
          <button
            className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1W' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
            onClick={() => {
              setTimeframe('1W');
            }}
          >
            Hàng tuần (1W)
          </button>
        </div>
        
        {/* Data Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium text-gray-700">Ngày phân tích</div>
            <div className="text-gray-900">
              {analyzeRsData?.analysis_date ? new Date(analyzeRsData.analysis_date).toLocaleDateString() : new Date(analyzeRsData.rrgDate).toLocaleDateString()}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium text-gray-700">Khung thời gian</div>
            <div className="text-gray-900">{analyzeRsData?.timeframe || timeframe}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium text-gray-700">Tổng số chuỗi</div>
            <div className="text-gray-900">{industries.length + groups.length + symbols.length}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium text-gray-700">Chi tiết</div>
            <div className="text-gray-900">
              {industries.length} ngành, {groups.length} nhóm, {symbols.length} cổ phiếu
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => handleTabChange('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tổng quan
            </button>
            {type === 'industries' ? (
              <>
                <button
                  onClick={() => handleTabChange('chart-industries')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                    activeTab === 'chart-industries'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Biểu đồ RRG Ngành
                </button>
                <button
                  onClick={() => handleTabChange('chart-groups')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                    activeTab === 'chart-groups'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Biểu đồ RRG Vốn Hóa
                </button>
              </>
            ) : (
              <button
                onClick={() => handleTabChange('chart')}
                className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === 'chart'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Biểu đồ RRG
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Overview Toggle */}
              <OverviewToggle />

              {/* Overview Panels */}
              {overviewType === 'industry' ? (
                <>
                  <UnifiedRankingByScore 
                    key={`industry-score-${timeframe}`}
                    analysisData={industryAnalysis} 
                    type="industry"
                    getQuadrantColor={getQuadrantColor}
                    analyzeData={analyzeRsData}
                  />
                  <UnifiedRankingBySpeed 
                    key={`industry-speed-${timeframe}`}
                    analysisData={industryAnalysis} 
                    type="industry"
                    renderInsightItems={renderInsightItems} 
                    rrgData={analyzeRsData}
                    analyzeData={analyzeRsData}
                  />
                  <MarketOverview key={`market-overview-industry-${timeframe}`} marketOverview={marketOverview} getSentimentColor={getSentimentColor} breadth_detail={detailedAnalysis.breadth_detail} />
                </>
              ) : overviewType === 'group' ? (
                <>
                  <UnifiedRankingByScore 
                    key={`group-score-${timeframe}`}
                    analysisData={groupAnalysis} 
                    type="group"
                    getQuadrantColor={getQuadrantColor}
                    analyzeData={analyzeRsData}
                  />
                  <UnifiedRankingBySpeed 
                    key={`group-speed-${timeframe}`}
                    analysisData={groupAnalysis} 
                    type="group"
                    renderInsightItems={renderInsightItems} 
                    rrgData={analyzeRsData}
                    investmentStrategies={investmentStrategies}
                    analyzeData={analyzeRsData}
                  />
                  <MarketOverview key={`market-overview-group-${timeframe}`} marketOverview={marketOverview} getSentimentColor={getSentimentColor} breadth_detail={detailedAnalysis.breadth_detail} />                  
                </>
              ) : (
                <>
                  <UnifiedRankingByScore 
                    key={`ticker-score-${timeframe}`}
                    analysisData={tickerAnalysis} 
                    type="ticker"
                    getQuadrantColor={getQuadrantColor}
                    analyzeData={analyzeRsData}
                  />
                  <UnifiedRankingBySpeed 
                    key={`ticker-speed-${timeframe}`}
                    analysisData={tickerAnalysis} 
                    type="ticker"
                    renderInsightItems={renderInsightItems} 
                    rrgData={analyzeRsData}
                    analyzeData={analyzeRsData}
                  />
                  <MarketOverview key={`market-overview-ticker-${timeframe}`} marketOverview={marketOverview} getSentimentColor={getSentimentColor} breadth_detail={detailedAnalysis.breadth_detail} />                  
                </>
              )}
              
              {/* Detailed Analysis */}
              <DetailedAnalysis key={`detailed-analysis-${timeframe}`} detailedAnalysis={detailedAnalysis} />
            </div>
          )}

          {activeTab === 'chart-industries' && (
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
                  {(() => {
                    if (loading) {
                      return (
                        <div className="w-full p-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                          <div className="text-gray-600 mt-2">Đang tải dữ liệu RRG...</div>
                        </div>
                      );
                    } else if (error) {
                      return (
                        <div className="w-full p-8 text-center">
                          <div className="text-red-600 text-lg font-medium">Lỗi tải dữ liệu RRG</div>
                          <div className="text-gray-600 mt-2">{error.message}</div>
                        </div>
                      );
                    } else {
                      return (
                        <RRGChart 
                          key={`industries-${timeframe}`} 
                          type="industries" 
                          timeframe={timeframe}
                          analyticsData={analyzeRsData}
                        />
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chart-groups' && (
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
                  {loading ? (
                    <div className="w-full p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <div className="text-gray-600 mt-2">Đang tải dữ liệu RRG...</div>
                    </div>
                  ) : error ? (
                    <div className="w-full p-8 text-center">
                      <div className="text-red-600 text-lg font-medium">Lỗi tải dữ liệu RRG</div>
                      <div className="text-gray-600 mt-2">{error.message}</div>
                    </div>
                  ) : (
                    <RRGChart 
                      key={`groups-${timeframe}`} 
                      type="groups" 
                      timeframe={timeframe} 
                      analyticsData={analyzeRsData}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chart' && (
            <div className="space-y-6">
              <div className="mb-4 w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Phân tích RRG {type === 'tickers' ? 'cổ phiếu' : 'nhóm vốn hóa'}
                </h3>
                <p className="text-gray-600">
                  {type === 'tickers'
                    ? 'Hiển thị sức mạnh tương đối và động lượng của các cổ phiếu. Sử dụng bộ lọc ngành để tập trung vào các nhóm cụ thể và giảm nhiễu.'
                    : 'Hiển thị sức mạnh tương đối và động lượng của các nhóm vốn hóa (VN30, VN100, VNMidCap, VNSmallCap). Nhóm ở góc Dẫn đầu đang vượt trội với động lượng tích cực.'
                  }
                </p>
              </div>              
              <div className="bg-white rounded-lg shadow-sm border p-6 w-full mb-6">
                <div className="w-full">
                  {loading ? (
                    <div className="w-full p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <div className="text-gray-600 mt-2">Đang tải dữ liệu RRG...</div>
                    </div>
                  ) : error ? (
                    <div className="w-full p-8 text-center">
                      <div className="text-red-600 text-lg font-medium">Lỗi tải dữ liệu RRG</div>
                      <div className="text-gray-600 mt-2">{error.message}</div>
                    </div>
                  ) : (
                    <RRGChart 
                      key={`${type}-${timeframe}`} 
                      type={type} 
                      timeframe={timeframe} 
                      analyticsData={analyzeRsData}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 