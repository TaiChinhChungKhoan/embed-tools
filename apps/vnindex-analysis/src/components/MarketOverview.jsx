import React from 'react';

const MarketOverview = ({ marketOverview, getSentimentColor }) => {
  if (!marketOverview || !marketOverview.title) return null;
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">{marketOverview.title || 'Tổng quan thị trường (Macro)'}</h3>
      
      {/* Analysis date and timeframe */}
      <div className="text-sm text-blue-700 mb-4">
        {marketOverview.analysis_date && (
          <span>Ngày phân tích: {new Date(marketOverview.analysis_date).toLocaleDateString()} | </span>
        )}
        {marketOverview.timeframe && (
          <span>Khung thời gian: {marketOverview.timeframe} | </span>
        )}
        {marketOverview.benchmark && (
          <span>Chuẩn so sánh: {marketOverview.benchmark}</span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-3 rounded border">
          <div className="font-medium text-gray-700 mb-2">Ngành vượt trội</div>
          <div className="text-lg font-semibold text-green-600">{marketOverview.key_metrics?.outperforming_industries || 'N/A'}</div>
          <div className={`text-sm ${getSentimentColor(marketOverview.key_metrics?.industry_sentiment)}`}>
            {marketOverview.key_metrics?.industry_sentiment || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {marketOverview.key_metrics?.outperforming_industries_pct || 'N/A'}
          </div>
        </div>
        <div className="bg-white p-3 rounded border">
          <div className="font-medium text-gray-700 mb-2">Cổ phiếu vượt trội</div>
          <div className="text-lg font-semibold text-green-600">{marketOverview.key_metrics?.outperforming_symbols || 'N/A'}</div>
          <div className={`text-sm ${getSentimentColor(marketOverview.key_metrics?.symbol_sentiment)}`}>
            {marketOverview.key_metrics?.symbol_sentiment || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {marketOverview.key_metrics?.outperforming_symbols_pct || 'N/A'}
          </div>
        </div>
        <div className="bg-white p-3 rounded border">
          <div className="font-medium text-gray-700 mb-2">Nhóm vốn hóa vượt trội</div>
          <div className="text-lg font-semibold text-green-600">{marketOverview.key_metrics?.outperforming_groups || 'N/A'}</div>
          <div className={`text-sm ${getSentimentColor(marketOverview.key_metrics?.group_sentiment)}`}>
            {marketOverview.key_metrics?.group_sentiment || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {marketOverview.key_metrics?.outperforming_groups_pct || 'N/A'}
          </div>
        </div>
      </div>

      {/* Market Regime and Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {marketOverview.market_regime && (
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700 mb-2">Chế độ thị trường</div>
            <div className="text-lg font-semibold text-blue-600">{marketOverview.market_regime.regime || 'N/A'}</div>
            <div className="text-sm text-gray-600">
              Độ tin cậy: {marketOverview.market_regime.confidence || 'N/A'}%
            </div>
            {marketOverview.market_regime.characteristics && (
              <div className="text-xs text-gray-500 mt-1">
                {marketOverview.market_regime.characteristics.join(', ')}
              </div>
            )}
          </div>
        )}
        
        {marketOverview.market_health && (
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700 mb-2">Sức khỏe thị trường</div>
            <div className="text-lg font-semibold text-green-600">{marketOverview.market_health.overall_health || 'N/A'}</div>
            <div className="text-sm text-gray-600">
              Điểm rộng: {(marketOverview.market_health.breadth_score * 100).toFixed(1)}% | 
              Điểm động lượng: {(marketOverview.market_health.momentum_score * 100).toFixed(1)}% | 
              Điểm biến động: {(marketOverview.market_health.volatility_score * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Strategic Recommendation */}
      {marketOverview.strategic_recommendation && (
        <div className="bg-white p-3 rounded border">
          <div className="font-medium text-gray-700 mb-2">Khuyến nghị chiến lược</div>
          <div className="text-lg font-semibold text-purple-600">{marketOverview.strategic_recommendation.stance || 'N/A'}</div>
          <div className="text-sm text-gray-600">
            Độ tin cậy: {marketOverview.strategic_recommendation.confidence || 'N/A'}%
          </div>
          <div className="text-sm text-gray-700 mt-1">
            {marketOverview.strategic_recommendation.rationale || 'N/A'}
          </div>
        </div>
      )}

      {/* Market Indices */}
      {marketOverview.market_indices && (
        <div className="bg-white p-3 rounded border mt-4">
          <div className="font-medium text-gray-700 mb-2">Chỉ số thị trường</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Tổng thể:</span> {marketOverview.market_indices.general_market}
            </div>
            <div>
              <span className="text-gray-600">Vốn hóa lớn:</span> {marketOverview.market_indices.large_cap}
            </div>
            <div>
              <span className="text-gray-600">Vốn hóa vừa:</span> {marketOverview.market_indices.mid_cap}
            </div>
            <div>
              <span className="text-gray-600">Vốn hóa nhỏ:</span> {marketOverview.market_indices.small_cap}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketOverview; 