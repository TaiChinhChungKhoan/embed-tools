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

            {/* Market Regime and Strategic Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {marketOverview.market_regime && (
          <div className="bg-white p-3 rounded border">
            <h3 className="font-medium text-gray-700 mb-2">Trạng thái thị trường</h3>
            <div className="text-lg font-semibold text-blue-600">{marketOverview.market_regime.regime || 'N/A'}</div>
            <div className="text-sm text-gray-600 mb-2">
              {marketOverview.market_regime.description || 'N/A'}
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm mb-2">
              <div>
                <span className="font-medium">Độ tin cậy:</span> {marketOverview.market_regime.confidence || 'N/A'}%
              </div>
              <div>
                <span className="font-medium">Điểm rộng:</span> {marketOverview.market_regime.breadth_score ? 
                  `${(marketOverview.market_regime.breadth_score * 100).toFixed(1)}%` : 'N/A'}
              </div>
              <div>
                <span className="font-medium">Điểm động lượng:</span> {marketOverview.market_regime.momentum_score ? 
                  `${(marketOverview.market_regime.momentum_score * 100).toFixed(1)}%` : 'N/A'}
              </div>
            </div>
            {marketOverview.market_regime.supporting_evidence && marketOverview.market_regime.supporting_evidence.length > 0 && (
              <div className="text-xs text-gray-500">
                <span className="font-medium">Bằng chứng hỗ trợ:</span>
                <ul className="list-disc list-inside mt-1">
                  {marketOverview.market_regime.supporting_evidence.map((evidence, index) => (
                    <li key={index}>{evidence}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {marketOverview.strategic_recommendation && (
          <div className="bg-white p-3 rounded border">
            <h3 className="font-medium text-gray-700 mb-2">Khuyến nghị chiến lược</h3>
            <div className="text-lg font-semibold text-purple-600">{marketOverview.strategic_recommendation.stance || 'N/A'}</div>
            <div className="text-sm text-gray-600">{marketOverview.market_health.market_character.strategy || 'N/A'}</div>
            <div className="text-sm text-gray-600">
              Độ tin cậy: {marketOverview.strategic_recommendation.confidence || 'N/A'}%
            </div>
            <div className="text-sm text-gray-700 mt-1">
              {marketOverview.strategic_recommendation.rationale || 'N/A'}
            </div>
          </div>
        )}
      </div>

      {/* Market Health */}
      {marketOverview.market_health && (
        <div className="bg-white p-3 rounded border mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Sức khỏe thị trường</h3>
          <div className="text-sm text-gray-600 mb-3">
            {marketOverview.market_health.summary || 'N/A'}
          </div>
          
          {/* Key Metrics */}
          {marketOverview.market_health.key_metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              {/* Market Breadth */}
              {marketOverview.market_health.key_metrics.market_breadth && (
                <div className="p-2 bg-blue-50 rounded">
                  <div className="font-medium text-sm text-blue-700 mb-1">Độ rộng thị trường</div>
                  <div className="text-sm font-semibold text-blue-600">
                    {marketOverview.market_health.key_metrics.market_breadth.score ? 
                      `${(marketOverview.market_health.key_metrics.market_breadth.score * 100).toFixed(1)}%` : 'N/A'}
                  </div>
                  <div className="text-xs text-blue-600">{marketOverview.market_health.key_metrics.market_breadth.interpretation || 'N/A'}</div>
                  <div className="text-xs text-gray-500 mt-1">{marketOverview.market_health.key_metrics.market_breadth.description || 'N/A'}</div>
                </div>
              )}

              {/* Momentum Distribution */}
              {marketOverview.market_health.key_metrics.momentum_distribution && (
                <div className="p-2 bg-green-50 rounded">
                  <div className="font-medium text-sm text-green-700 mb-1">Phân bổ động lượng</div>
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Rất mạnh:</span> {marketOverview.market_health.key_metrics.momentum_distribution.momentum_categories?.very_strong || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Mạnh:</span> {marketOverview.market_health.key_metrics.momentum_distribution.momentum_categories?.strong || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Trung bình:</span> {marketOverview.market_health.key_metrics.momentum_distribution.momentum_categories?.moderate || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Yếu:</span> {marketOverview.market_health.key_metrics.momentum_distribution.momentum_categories?.weak || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Giảm:</span> {marketOverview.market_health.key_metrics.momentum_distribution.momentum_categories?.declining || 'N/A'}
                  </div>
                  <div className="text-xs text-green-600 font-medium mt-1">
                    {marketOverview.market_health.key_metrics.momentum_distribution.momentum_summary || 'N/A'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Risk and Speed Distribution */}
          {marketOverview.market_health.key_metrics?.momentum_distribution && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              {/* Risk Distribution */}
              {marketOverview.market_health.key_metrics.momentum_distribution.risk_distribution && (
                <div className="p-2 bg-red-50 rounded">
                  <div className="font-medium text-sm text-red-700 mb-1">Phân bổ rủi ro</div>
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Cao:</span> {marketOverview.market_health.key_metrics.momentum_distribution.risk_distribution.High || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Trung bình:</span> {marketOverview.market_health.key_metrics.momentum_distribution.risk_distribution.Medium || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Thấp:</span> {marketOverview.market_health.key_metrics.momentum_distribution.risk_distribution.Low || 'N/A'}
                  </div>
                </div>
              )}

              {/* Speed Distribution */}
              {marketOverview.market_health.key_metrics.momentum_distribution.speed_distribution && (
                <div className="p-2 bg-yellow-50 rounded">
                  <div className="font-medium text-sm text-yellow-700 mb-1">Phân bổ tốc độ</div>
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Nhanh:</span> {marketOverview.market_health.key_metrics.momentum_distribution.speed_distribution.fast || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Trung bình:</span> {marketOverview.market_health.key_metrics.momentum_distribution.speed_distribution.moderate || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Chậm:</span> {marketOverview.market_health.key_metrics.momentum_distribution.speed_distribution.slow || 'N/A'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}



      {/* Market Cap Rotation */}
      {marketOverview.market_health?.market_cap_rotation && (
        <div className="bg-white p-3 rounded border mt-4">
          <div className="font-medium text-gray-700 mb-2">Luân chuyển vốn hóa thị trường</div>
          <div className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Chủ đề:</span> {marketOverview.market_health.market_cap_rotation.rotation_theme || 'N/A'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {marketOverview.market_health.market_cap_rotation.large_cap && (
              <div className="border-l-4 border-blue-500 pl-3">
                <div className="font-medium text-sm">{marketOverview.market_health.market_cap_rotation.large_cap.name}</div>
                <div className={`text-sm ${marketOverview.market_health.market_cap_rotation.large_cap.performance === 'Vượt trội' ? 'text-green-600' : 'text-red-600'}`}>
                  {marketOverview.market_health.market_cap_rotation.large_cap.performance}
                </div>
                <div className="text-xs text-gray-500">
                  {marketOverview.market_health.market_cap_rotation.large_cap.interpretation}
                </div>
              </div>
            )}
            {marketOverview.market_health.market_cap_rotation.mid_cap && (
              <div className="border-l-4 border-yellow-500 pl-3">
                <div className="font-medium text-sm">{marketOverview.market_health.market_cap_rotation.mid_cap.name}</div>
                <div className={`text-sm ${marketOverview.market_health.market_cap_rotation.mid_cap.performance === 'Vượt trội' ? 'text-green-600' : 'text-red-600'}`}>
                  {marketOverview.market_health.market_cap_rotation.mid_cap.performance}
                </div>
                <div className="text-xs text-gray-500">
                  {marketOverview.market_health.market_cap_rotation.mid_cap.interpretation}
                </div>
              </div>
            )}
            {marketOverview.market_health.market_cap_rotation.small_cap && (
              <div className="border-l-4 border-red-500 pl-3">
                <div className="font-medium text-sm">{marketOverview.market_health.market_cap_rotation.small_cap.name}</div>
                <div className={`text-sm ${marketOverview.market_health.market_cap_rotation.small_cap.performance === 'Vượt trội' ? 'text-green-600' : 'text-red-600'}`}>
                  {marketOverview.market_health.market_cap_rotation.small_cap.performance}
                </div>
                <div className="text-xs text-gray-500">
                  {marketOverview.market_health.market_cap_rotation.small_cap.interpretation}
                </div>
              </div>
            )}
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