import React, { useState } from 'react';
import RRGChart from './RRGChart';
import { loadRRGData } from '../utils/rrgDataLoader';
import analyzeRsData from '../data/analyze_rs.json';

export default function RRGAnalysis() {
  const [activeTab, setActiveTab] = useState('overview');
  const [overviewMode, setOverviewMode] = useState('industries'); // New state for overview mode
  const rrgData = loadRRGData();
  const insights = analyzeRsData.insights;

  const getQuadrantColor = (quadrant) => {
    if (quadrant.includes('Leading') || quadrant.includes('Dẫn dắt')) return 'text-green-600';
    if (quadrant.includes('Improving') || quadrant.includes('Cải thiện')) return 'text-blue-600';
    if (quadrant.includes('Weakening') || quadrant.includes('Suy yếu')) return 'text-yellow-600';
    if (quadrant.includes('Lagging') || quadrant.includes('Tụt hậu')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment.includes('tích cực')) return 'text-green-600';
    if (sentiment.includes('tiêu cực')) return 'text-red-600';
    if (sentiment.includes('trung tính')) return 'text-yellow-600';
    return 'text-gray-600';
  };

  // Update overview mode when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'industries') {
      setOverviewMode('industries');
    } else if (tab === 'tickers') {
      setOverviewMode('tickers');
    }
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
        
        {/* Data Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
            <div className="text-gray-900">{rrgData.industries.length + rrgData.tickers.length}</div>
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
              {/* Overview Mode Selector */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Hiển thị tổng quan cho:</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOverviewMode('industries')}
                      className={`cursor-pointer px-3 py-1 rounded text-sm font-medium ${
                        overviewMode === 'industries'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Ngành nghề
                    </button>
                    <button
                      onClick={() => setOverviewMode('tickers')}
                      className={`cursor-pointer px-3 py-1 rounded text-sm font-medium ${
                        overviewMode === 'tickers'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Cổ phiếu
                    </button>
                  </div>
                </div>
              </div>

              {/* Market Overview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">{insights.market_overview.title}</h3>
                <p className="text-blue-800 mb-4">{insights.market_overview.summary}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-700 mb-2">Ngành vượt trội</div>
                    <div className="text-lg font-semibold text-green-600">{insights.market_overview.key_metrics.outperforming_industries}</div>
                    <div className={`text-sm ${getSentimentColor(insights.market_overview.key_metrics.industry_sentiment)}`}>
                      {insights.market_overview.key_metrics.industry_sentiment}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-700 mb-2">Cổ phiếu vượt trội</div>
                    <div className="text-lg font-semibold text-green-600">{insights.market_overview.key_metrics.outperforming_symbols}</div>
                    <div className={`text-sm ${getSentimentColor(insights.market_overview.key_metrics.symbol_sentiment)}`}>
                      {insights.market_overview.key_metrics.symbol_sentiment}
                    </div>
                  </div>
                </div>
              </div>

              {/* Money Flow Analysis */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-3">{insights.money_flow_analysis.title}</h3>
                <p className="text-green-800 mb-4">{insights.money_flow_analysis.summary}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(insights.money_flow_analysis.quadrant_distribution).map(([quadrant, count]) => (
                    <div key={quadrant} className="bg-white p-3 rounded border text-center">
                      <div className={`text-lg font-bold ${getQuadrantColor(quadrant)}`}>{count}</div>
                      <div className="text-xs text-gray-600 mt-1">{quadrant}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top and Bottom Performers - Side by side comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performers */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">
                    {overviewMode === 'industries' ? 'Top các ngành mạnh nhất' : 'Top các cổ phiếu mạnh nhất'}
                  </h3>
                  
                  {overviewMode === 'industries' ? (
                    <div className="space-y-2">
                      {insights.top_performers.industries.slice(0, 8).map((industry, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-900">{industry.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{industry.description}</div>
                              <div className={`text-xs mt-1 ${getQuadrantColor(industry.rrg_position)}`}>
                                {industry.rrg_position}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-600">{industry.strength_score.toFixed(2)}</div>
                              <div className="text-xs text-gray-500 mt-1">{industry.money_flow}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {insights.top_performers.symbols.slice(0, 8).map((symbol, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-900">{symbol.name} ({symbol.symbol})</div>
                              <div className="text-xs text-gray-500">{symbol.primary_industry}</div>
                              <div className="text-sm text-gray-600 mt-1">{symbol.description}</div>
                              <div className={`text-xs mt-1 ${getQuadrantColor(symbol.rrg_position)}`}>
                                {symbol.rrg_position}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-600">{symbol.strength_score.toFixed(2)}</div>
                              <div className="text-xs text-gray-500 mt-1">{symbol.money_flow}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Performers */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">
                    {overviewMode === 'industries' ? 'Top các ngành yếu nhất' : 'Top các cổ phiếu yếu nhất'}
                  </h3>
                  
                  {overviewMode === 'industries' ? (
                    <div className="space-y-2">
                      {insights.bottom_performers.industries.slice(0, 8).map((industry, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-900">{industry.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{industry.description}</div>
                              <div className={`text-xs mt-1 ${getQuadrantColor(industry.rrg_position)}`}>
                                {industry.rrg_position}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-red-600">{industry.strength_score.toFixed(2)}</div>
                              <div className="text-xs text-gray-500 mt-1">{industry.money_flow}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {insights.bottom_performers.symbols.slice(0, 8).map((symbol, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-900">{symbol.name} ({symbol.symbol})</div>
                              <div className="text-xs text-gray-500">{symbol.primary_industry}</div>
                              <div className="text-sm text-gray-600 mt-1">{symbol.description}</div>
                              <div className={`text-xs mt-1 ${getQuadrantColor(symbol.rrg_position)}`}>
                                {symbol.rrg_position}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-red-600">{symbol.strength_score.toFixed(2)}</div>
                              <div className="text-xs text-gray-500 mt-1">{symbol.money_flow}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Investment Strategy - Dynamic based on overview mode */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  {overviewMode === 'industries' ? 'Chiến lược đầu tư theo ngành' : 'Chiến lược đầu tư theo cổ phiếu'}
                </h3>
                
                {insights.investment_strategy.market_phase_analysis.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-purple-800 mb-2">Phân tích giai đoạn thị trường</h4>
                    <ul className="list-disc list-inside space-y-1 text-purple-800">
                      {insights.investment_strategy.market_phase_analysis.map((point, index) => (
                        <li key={index} className="text-sm">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="font-medium text-purple-800 mb-2">
                    {overviewMode === 'industries' ? 'Tín hiệu luân chuyển ngành' : 'Tín hiệu luân chuyển cổ phiếu'}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-purple-800">
                    {insights.investment_strategy.sector_rotation_signals.map((signal, index) => (
                      <li key={index} className="text-sm">{signal}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-800 mb-2">Cảnh báo rủi ro</h4>
                  <ul className="list-disc list-inside space-y-1 text-red-700">
                    {insights.investment_strategy.risk_warnings.map((warning, index) => (
                      <li key={index} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'industries' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phân tích RRG ngành nghề</h3>
                <p className="text-gray-600">
                  Hiển thị sức mạnh tương đối và động lượng của các ngành. Ngành ở góc Dẫn đầu đang vượt trội với động lượng tích cực.
                </p>
              </div>
              <RRGChart type="industries" />
            </div>
          )}

          {activeTab === 'tickers' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phân tích RRG cổ phiếu</h3>
                <p className="text-gray-600">
                  Hiển thị sức mạnh tương đối và động lượng của các cổ phiếu. Sử dụng bộ lọc ngành để tập trung vào các nhóm cụ thể và giảm nhiễu.
                </p>
              </div>
              <RRGChart type="tickers" />
            </div>
          )}
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
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
  );
} 