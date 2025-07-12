import React from 'react';

const DetailedAnalysis = ({ detailedAnalysis }) => {
  if (!detailedAnalysis || !detailedAnalysis.title) return null;

  const getSentimentColor = (sentiment) => {
    if (sentiment?.includes('tích cực') || sentiment?.includes('positive') || sentiment?.includes('bull')) return 'text-green-600';
    if (sentiment?.includes('tiêu cực') || sentiment?.includes('negative') || sentiment?.includes('bear')) return 'text-red-600';
    if (sentiment?.includes('trung tính') || sentiment?.includes('neutral')) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel === 'High' || riskLevel === 'HIGH' || riskLevel === 'CRITICAL') return 'text-red-600';
    if (riskLevel === 'Medium' || riskLevel === 'MEDIUM') return 'text-yellow-600';
    if (riskLevel === 'Low' || riskLevel === 'LOW') return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">{detailedAnalysis.title}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Sector Rotation */}
          {detailedAnalysis.sector_rotation && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Phân tích xoay vòng ngành</h4>
              <div className="space-y-2">
                {detailedAnalysis.sector_rotation.money_flow_summary && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">Chủ đề dòng tiền:</div>
                    <div className={`text-sm ${getSentimentColor(detailedAnalysis.sector_rotation.money_flow_summary.dominant_theme)}`}>
                      {detailedAnalysis.sector_rotation.money_flow_summary.dominant_theme}
                    </div>
                    <div className="text-xs text-gray-500">
                      Sức mạnh: {detailedAnalysis.sector_rotation.money_flow_summary.rotation_strength} | 
                      Tốc độ: {detailedAnalysis.sector_rotation.money_flow_summary.flow_velocity}
                    </div>
                  </div>
                )}
                {detailedAnalysis.sector_rotation.sector_leadership && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">Leadership ngành:</div>
                    <div className="text-xs text-gray-600">
                      Người dẫn dắt hiện tại: {detailedAnalysis.sector_rotation.sector_leadership.current_leaders?.count || 0} ngành
                    </div>
                    <div className="text-xs text-gray-600">
                      Người dẫn dắt mới: {detailedAnalysis.sector_rotation.sector_leadership.emerging_leaders?.count || 0} ngành
                    </div>
                    <div className="text-xs text-gray-600">
                      Người dẫn dắt suy yếu: {detailedAnalysis.sector_rotation.sector_leadership.declining_leaders?.count || 0} ngành
                    </div>
                  </div>
                )}
                {detailedAnalysis.sector_rotation.rotation_patterns && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">Mô hình xoay vòng:</div>
                    <div className="text-xs text-gray-600">
                      {detailedAnalysis.sector_rotation.rotation_patterns.stability}
                    </div>
                    <div className="text-xs text-gray-600">
                      Tốc độ: {detailedAnalysis.sector_rotation.rotation_patterns.rotation_speed}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Market Cap Flow */}
          {detailedAnalysis.market_cap_flow && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Phân tích dòng tiền vốn hóa thị trường</h4>
              <div className="space-y-2">
                {detailedAnalysis.market_cap_flow.flow_summary && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">Chủ đề dòng tiền:</div>
                    <div className="text-sm text-gray-600">
                      {detailedAnalysis.market_cap_flow.flow_summary.theme}
                    </div>
                    <div className="text-xs text-gray-500">
                      Large/Mid Cap: {detailedAnalysis.market_cap_flow.flow_summary.large_mid_cap_pct} | 
                      Small Cap: {detailedAnalysis.market_cap_flow.flow_summary.small_cap_pct}
                    </div>
                  </div>
                )}
                {detailedAnalysis.market_cap_flow.velocity_analysis && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">Phân tích tốc độ:</div>
                    <div className="text-xs text-gray-600">
                      {detailedAnalysis.market_cap_flow.velocity_analysis.fastest_segment}
                    </div>
                  </div>
                )}
                {detailedAnalysis.market_cap_flow.detailed_analysis && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">Chi tiết theo nhóm:</div>
                    {Object.entries(detailedAnalysis.market_cap_flow.detailed_analysis).map(([key, data]) => (
                      <div key={key} className="text-xs text-gray-600 ml-2">
                        {data.name}: {data.performance} ({data.rrg_quadrant})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Momentum Cycles */}
          {detailedAnalysis.momentum_cycles && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Chu kỳ động lượng</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Chu kỳ hiện tại:</span> {detailedAnalysis.momentum_cycles.current_cycle}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Sức mạnh chu kỳ:</span> {detailedAnalysis.momentum_cycles.cycle_strength}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Thời gian chu kỳ:</span> {detailedAnalysis.momentum_cycles.cycle_duration}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Institutional Flow */}
          {detailedAnalysis.institutional_flow && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Dòng tiền tổ chức</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Hướng dòng tiền:</span> {detailedAnalysis.institutional_flow.flow_direction}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Sức mạnh dòng tiền:</span> {detailedAnalysis.institutional_flow.flow_strength}
                </div>
                {detailedAnalysis.institutional_flow.preferred_segments && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">Phân khúc ưa chuộng:</div>
                    <div className="text-sm text-gray-600">
                      {detailedAnalysis.institutional_flow.preferred_segments.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Risk Distribution */}
          {detailedAnalysis.risk_distribution && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Phân bổ rủi ro</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Rủi ro thấp:</span> {detailedAnalysis.risk_distribution.low_risk}%
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Rủi ro trung bình:</span> {detailedAnalysis.risk_distribution.moderate_risk}%
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Rủi ro cao:</span> {detailedAnalysis.risk_distribution.high_risk}%
                </div>
              </div>
            </div>
          )}

          {/* Systemic Risks */}
          {detailedAnalysis.systemic_risks && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Rủi ro hệ thống</h4>
              <div className="space-y-2">
                <div className={`text-sm font-medium ${getRiskColor(detailedAnalysis.systemic_risks.overall_risk?.level)}`}>
                  <span className="font-medium">Mức độ rủi ro:</span> {detailedAnalysis.systemic_risks.overall_risk?.level}
                </div>
                <div className="text-sm text-gray-700">
                  {detailedAnalysis.systemic_risks.overall_risk?.description}
                </div>
                {detailedAnalysis.systemic_risks.systemic_risks && detailedAnalysis.systemic_risks.systemic_risks.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">Các yếu tố rủi ro:</div>
                    {detailedAnalysis.systemic_risks.systemic_risks.slice(0, 3).map((risk, index) => (
                      <div key={index} className="text-xs text-gray-600 ml-2">
                        • {risk.type}: {risk.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Volatility Regime */}
          {detailedAnalysis.volatility_regime && (
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-blue-800 mb-2">Chế độ biến động</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Chế độ:</span> {detailedAnalysis.volatility_regime.regime}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Mô tả:</span> {detailedAnalysis.volatility_regime.regime_description}
                </div>
                {detailedAnalysis.volatility_regime.statistics && (
                  <div>
                    <div className="text-sm font-medium text-gray-700">Thống kê:</div>
                    <div className="text-xs text-gray-600">
                      Biến động trung bình: {detailedAnalysis.volatility_regime.statistics.average_volatility}
                    </div>
                    <div className="text-xs text-gray-600">
                      Biến động cao: {detailedAnalysis.volatility_regime.statistics.high_volatility_percentage}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysis; 