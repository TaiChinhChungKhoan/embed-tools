import React, { useState } from 'react';
import RRGChart from './RRGChart';
import MarketOverview from './MarketOverview';
import StockRankingByScore from './StockRankingByScore';
import StockRankingBySpeed from './StockRankingBySpeed';
import IndustryRankingByScore from './IndustryRankingByScore';
import IndustryRankingBySpeed from './IndustryRankingBySpeed';
import GroupRankingByScore from './GroupRankingByScore';
import GroupRankingBySpeed from './GroupRankingBySpeed';
import InvestmentStrategy from './InvestmentStrategy';
import { loadRRGData } from '../utils/rrgDataLoader';
import analyzeRsData from '../data/analyze_rs.json';


// Main RRGAnalysis Component
export default function RRGAnalysis() {
  const [activeTab, setActiveTab] = useState('overview');
  const rrgData = loadRRGData();
  
  // Safely access insights data with fallbacks for new structure
  const insights = analyzeRsData?.insights || {};
  const marketOverview = insights?.market_overview || {};
  const industryAnalysis = insights?.industry_analysis || {};
  const groupAnalysis = insights?.group_analysis || {};
  const individualStockAnalysis = insights?.individual_stock_analysis || {};
  const investmentStrategies = insights?.investment_strategies || {};

  const getQuadrantColor = (quadrant) => {
    if (quadrant?.includes('Leading') || quadrant?.includes('Dẫn dắt')) return 'text-green-600';
    if (quadrant?.includes('Improving') || quadrant?.includes('Cải thiện')) return 'text-blue-600';
    if (quadrant?.includes('Weakening') || quadrant?.includes('Suy yếu')) return 'text-yellow-600';
    if (quadrant?.includes('Lagging') || quadrant?.includes('Tụt hậu')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment?.includes('tích cực')) return 'text-green-600';
    if (sentiment?.includes('tiêu cực')) return 'text-red-600';
    if (sentiment?.includes('trung tính')) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getDirectionColor = (direction) => {
    if (direction?.includes('Strongly Improving') || direction?.includes('Improving')) return 'text-green-600';
    if (direction?.includes('Strongly Degrading') || direction?.includes('Degrading')) return 'text-red-600';
    if (direction?.includes('Sideways')) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel === 'High') return 'text-red-600';
    if (riskLevel === 'Medium') return 'text-yellow-600';
    if (riskLevel === 'Low') return 'text-green-600';
    return 'text-gray-600';
  };

  const getTrendStrengthColor = (strength) => {
    if (strength?.includes('Very Strong') || strength?.includes('Strong')) return 'text-green-600';
    if (strength?.includes('Moderate')) return 'text-yellow-600';
    if (strength?.includes('Weak')) return 'text-red-600';
    return 'text-gray-600';
  };



  // Update active tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Helper function to safely render insight items
  const renderInsightItems = (items, type) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return null;
    }

    return (
      <div className="space-y-2">
        {items.slice(0, 5).map((item, index) => (
          <div key={index} className="bg-white p-3 rounded border">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-900">
                  {item?.name || 'Unknown'}
                  {item?.symbol && ` (${item.symbol})`}
                </div>
                {item?.primary_industry && (
                  <div className="text-xs text-gray-500">{item.primary_industry}</div>
                )}
                <div className="text-sm text-gray-600 mt-1">{item?.speed_category || 'N/A'}</div>
                <div className={`text-xs mt-1 ${getDirectionColor(item?.direction)}`}>
                  {item?.direction || 'N/A'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-purple-600">
                  {(item?.weighted_speed || 0).toFixed(3)}
                </div>
                <div className={`text-xs mt-1 ${getRiskColor(item?.risk_level)}`}>
                  {item?.risk_level || 'Unknown'} Risk
                </div>
                <div className="text-xs text-gray-500 mt-1">{item?.position_size || 'N/A'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const [overviewType, setOverviewType] = useState('industry');
  const OverviewToggle = () => (
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

  // Add state for trail length and filter for industries and tickers
  const [industryTrailLength, setIndustryTrailLength] = useState(10);
  const [industryFilter, setIndustryFilter] = useState('');
  const [tickerTrailLength, setTickerTrailLength] = useState(10);
  const [tickerFilter, setTickerFilter] = useState('');

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
        
        {/* Data Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium text-gray-700">Ngày phân tích</div>
            <div className="text-gray-900">{new Date(rrgData.rrgDate).toLocaleDateString()}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium text-gray-700">Độ dài vệt</div>
            <div className="text-gray-900">{rrgData.tailLength} days</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium text-gray-700">Tổng số chuỗi</div>
            <div className="text-gray-900">{rrgData.industries.length + rrgData.groups.length + rrgData.tickers.length}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-medium text-gray-700">Chi tiết</div>
            <div className="text-gray-900">
              {rrgData.industries.length} ngành, {rrgData.groups.length} nhóm, {rrgData.tickers.length} cổ phiếu
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
            <button
              onClick={() => handleTabChange('industries')}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === 'industries'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ngành nghề ({rrgData.industries.length})
            </button>
            <button
              onClick={() => handleTabChange('groups')}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === 'groups'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Nhóm vốn hóa ({rrgData.groups.length})
            </button>
            <button
              onClick={() => handleTabChange('tickers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === 'tickers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cổ phiếu ({rrgData.tickers.length})
            </button>
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
                  <MarketOverview marketOverview={marketOverview} getSentimentColor={getSentimentColor} />
                  <IndustryRankingByScore 
                    industryAnalysis={industryAnalysis} 
                    getQuadrantColor={getQuadrantColor} 
                  />
                  <IndustryRankingBySpeed 
                    industryAnalysis={industryAnalysis} 
                    renderInsightItems={renderInsightItems} 
                    rrgData={rrgData}
                  />
                </>
              ) : overviewType === 'group' ? (
                <>
                  <MarketOverview marketOverview={marketOverview} getSentimentColor={getSentimentColor} />
                  <GroupRankingByScore 
                    groupAnalysis={groupAnalysis} 
                    getQuadrantColor={getQuadrantColor} 
                  />
                  <GroupRankingBySpeed 
                    groupAnalysis={groupAnalysis} 
                    renderInsightItems={renderInsightItems} 
                    rrgData={rrgData}
                    investmentStrategies={investmentStrategies}
                  />
                </>
              ) : (
                <>
                  <MarketOverview marketOverview={marketOverview} getSentimentColor={getSentimentColor} />
                  <StockRankingByScore 
                    individualStockAnalysis={individualStockAnalysis} 
                    getQuadrantColor={getQuadrantColor} 
                  />
                  <StockRankingBySpeed 
                    individualStockAnalysis={individualStockAnalysis} 
                    renderInsightItems={renderInsightItems} 
                    rrgData={rrgData}
                  />
                </>
              )}

              {/* Investment Strategy */}
              <InvestmentStrategy investmentStrategies={investmentStrategies} />
            </div>
          )}

          {activeTab === 'industries' && (
            <div className="space-y-6">
              <div className="mb-4 w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phân tích RRG ngành nghề</h3>
                <p className="text-gray-600">
                  Hiển thị sức mạnh tương đối và động lượng của các ngành. Ngành ở góc Dẫn đầu đang vượt trội với động lượng tích cực.
                </p>
              </div>              
              <div className="bg-white rounded-lg shadow-sm border p-6 w-full mb-6">
                <div className="w-full">
                  <RRGChart type="industries" />
                </div>
              </div>
              <div className="w-full mb-6">
                {/* Interpretation Guide */}
                <div className="bg-white rounded-lg shadow-sm border p-6 w-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn đọc RRG</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Các góc phần tư</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li><span className="font-medium text-green-600">Dẫn đầu:</span> Vượt trội với động lượng tích cực</li>
                        <li><span className="font-medium text-yellow-600">Suy yếu:</span> Vượt trội nhưng động lượng giảm</li>
                        <li><span className="font-medium text-red-600">Tụt hậu:</span> Kém hiệu quả với động lượng tiêu cực</li>
                        <li><span className="font-medium text-blue-600">Cải thiện:</span> Kém hiệu quả nhưng động lượng tăng</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Chỉ số</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li><span className="font-medium">Tỷ số RS:</span> Sức mạnh tương đối hiện tại so với VN-Index</li>
                        <li><span className="font-medium">CRS:</span> Sức mạnh tương đối tích lũy (chuẩn hóa về 100)</li>
                        <li><span className="font-medium">Vệt:</span> Đường đi lịch sử thể hiện sự xoay chuyển theo thời gian</li>
                        <li><span className="font-medium">Màu sắc:</span> Dựa trên thời lượng dữ liệu (xanh = ngắn, đỏ = dài)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="space-y-6">
              <div className="mb-4 w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phân tích RRG nhóm vốn hóa</h3>
                <p className="text-gray-600">
                  Hiển thị sức mạnh tương đối và động lượng của các nhóm vốn hóa (VN30, VN100, VNMidCap, VNSmallCap). Nhóm ở góc Dẫn đầu đang vượt trội với động lượng tích cực.
                </p>
              </div>              
              <div className="bg-white rounded-lg shadow-sm border p-6 w-full mb-6">
                <div className="w-full">
                  <RRGChart type="groups" />
                </div>
              </div>
              <div className="w-full mb-6">
                {/* Interpretation Guide */}
                <div className="bg-white rounded-lg shadow-sm border p-6 w-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn đọc RRG</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Các góc phần tư</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li><span className="font-medium text-green-600">Dẫn đầu:</span> Vượt trội với động lượng tích cực</li>
                        <li><span className="font-medium text-yellow-600">Suy yếu:</span> Vượt trội nhưng động lượng giảm</li>
                        <li><span className="font-medium text-red-600">Tụt hậu:</span> Kém hiệu quả với động lượng tiêu cực</li>
                        <li><span className="font-medium text-blue-600">Cải thiện:</span> Kém hiệu quả nhưng động lượng tăng</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Chỉ số</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li><span className="font-medium">Tỷ số RS:</span> Sức mạnh tương đối hiện tại so với VN-Index</li>
                        <li><span className="font-medium">CRS:</span> Sức mạnh tương đối tích lũy (chuẩn hóa về 100)</li>
                        <li><span className="font-medium">Vệt:</span> Đường đi lịch sử thể hiện sự xoay chuyển theo thời gian</li>
                        <li><span className="font-medium">Màu sắc:</span> Dựa trên thời lượng dữ liệu (xanh = ngắn, đỏ = dài)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tickers' && (
            <div className="space-y-6">
              <div className="mb-4 w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phân tích RRG cổ phiếu</h3>
                <p className="text-gray-600">
                  Hiển thị sức mạnh tương đối và động lượng của các cổ phiếu. Sử dụng bộ lọc ngành để tập trung vào các nhóm cụ thể và giảm nhiễu.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6 w-full mb-6">
                <div className="w-full">
                  <RRGChart type="tickers" />
                </div>
              </div>
              <div className="w-full mb-6">
                {/* Interpretation Guide */}
                <div className="bg-white rounded-lg shadow-sm border p-6 w-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn đọc RRG</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Các góc phần tư</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li><span className="font-medium text-green-600">Dẫn đầu:</span> Vượt trội với động lượng tích cực</li>
                        <li><span className="font-medium text-yellow-600">Suy yếu:</span> Vượt trội nhưng động lượng giảm</li>
                        <li><span className="font-medium text-red-600">Tụt hậu:</span> Kém hiệu quả với động lượng tiêu cực</li>
                        <li><span className="font-medium text-blue-600">Cải thiện:</span> Kém hiệu quả nhưng động lượng tăng</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Chỉ số</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li><span className="font-medium">Tỷ số RS:</span> Sức mạnh tương đối hiện tại so với VN-Index</li>
                        <li><span className="font-medium">CRS:</span> Sức mạnh tương đối tích lũy (chuẩn hóa về 100)</li>
                        <li><span className="font-medium">Vệt:</span> Đường đi lịch sử thể hiện sự xoay chuyển theo thời gian</li>
                        <li><span className="font-medium">Màu sắc:</span> Dựa trên thời lượng dữ liệu (xanh = ngắn, đỏ = dài)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 