import React from 'react';

const IndustryAnalysis = ({ industryAnalysis, marketOverview, getQuadrantColor, renderInsightItems }) => {
  if (!industryAnalysis) return null;
  
  const hasAnyData = [
    industryAnalysis.money_flow_analysis?.quadrant_distribution,
    industryAnalysis.sector_momentum?.momentum_leaders?.industries,
    industryAnalysis.sector_momentum?.accumulation_candidates?.industries,
    industryAnalysis.sector_momentum?.stealth_accumulation?.industries,
    industryAnalysis.sector_momentum?.breakout_candidates?.industries,
    industryAnalysis.sector_risk?.momentum_exhaustion?.industries,
    industryAnalysis.sector_risk?.falling_knife?.industries,
    industryAnalysis.sector_risk?.dead_cat_bounce?.industries,
    industryAnalysis.sector_risk?.distribution_signals?.industries,
    industryAnalysis.sector_performers?.top_industries,
    industryAnalysis.sector_performers?.bottom_industries
  ].some(data => data && (Array.isArray(data) ? data.length > 0 : Object.values(data || {}).some(v => v > 0)));
  
  if (!hasAnyData) return null;
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-green-900 mb-3">{industryAnalysis.title || 'Phân tích ngành (Sector Level)'}</h3>
      
      {/* Market Sentiment Summary */}
      <div className="bg-white p-4 rounded border mb-6">
        <h4 className="font-medium text-green-800 mb-2">Tóm tắt tình hình thị trường</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Tổng quan:</div>
            <div className="text-gray-900">{marketOverview?.market_phase?.current_phase || 'N/A'}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Sức mạnh xu hướng:</div>
            <div className="text-gray-900">{marketOverview?.market_phase?.trend_strength || 'N/A'}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Mức độ biến động:</div>
            <div className="text-gray-900">{marketOverview?.market_phase?.volatility_level || 'N/A'}</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-600">
          <strong>Lưu ý:</strong> Các phần "Động lượng ngành" và "Rủi ro ngành" có thể trống khi thị trường không có tín hiệu rõ ràng hoặc đang trong giai đoạn ổn định.
        </div>
      </div>
      
      {/* Money Flow Analysis */}
      {industryAnalysis.money_flow_analysis && (
        <div className="mb-6">
          <h4 className="font-medium text-green-800 mb-3">{industryAnalysis.money_flow_analysis.title}</h4>
          <p className="text-green-700 mb-3">{industryAnalysis.money_flow_analysis.summary}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(industryAnalysis.money_flow_analysis.quadrant_distribution || {}).map(([quadrant, count]) => (
              <div key={quadrant} className="bg-white p-3 rounded border text-center">
                <div className={`text-lg font-bold ${getQuadrantColor(quadrant)}`}>{count}</div>
                <div className="text-xs text-gray-600 mt-1">{quadrant}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sector Momentum */}
      {(() => {
        const hasMomentumData = [
          industryAnalysis.sector_momentum?.momentum_leaders?.industries,
          industryAnalysis.sector_momentum?.accumulation_candidates?.industries,
          industryAnalysis.sector_momentum?.stealth_accumulation?.industries,
          industryAnalysis.sector_momentum?.breakout_candidates?.industries
        ].some(data => data && data.length > 0);
        
        if (!hasMomentumData) return null;
        
        return (
          <div className="mb-6">
            <h4 className="font-medium text-green-800 mb-3">{industryAnalysis.sector_momentum.title}</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Momentum Leaders */}
              {industryAnalysis.sector_momentum.momentum_leaders?.industries?.length > 0 && (
                <div>
                  <h5 className="font-medium text-green-700 mb-2">{industryAnalysis.sector_momentum.momentum_leaders.title}</h5>
                  {renderInsightItems(industryAnalysis.sector_momentum.momentum_leaders.industries, 'ngành có động lượng mạnh')}
                </div>
              )}

              {/* Accumulation Candidates */}
              {industryAnalysis.sector_momentum.accumulation_candidates?.industries?.length > 0 && (
                <div>
                  <h5 className="font-medium text-green-700 mb-2">Ngành tích lũy tiềm năng</h5>
                  {renderInsightItems(industryAnalysis.sector_momentum.accumulation_candidates.industries, 'ngành tích lũy tiềm năng')}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Stealth Accumulation */}
              {industryAnalysis.sector_momentum.stealth_accumulation?.industries?.length > 0 && (
                <div>
                  <h5 className="font-medium text-green-700 mb-2">Tích lũy âm thầm (tổ chức)</h5>
                  {renderInsightItems(industryAnalysis.sector_momentum.stealth_accumulation.industries, 'tích lũy âm thầm')}
                </div>
              )}

              {/* Breakout Candidates */}
              {industryAnalysis.sector_momentum.breakout_candidates?.industries?.length > 0 && (
                <div>
                  <h5 className="font-medium text-green-700 mb-2">Ngành có thể bứt phá</h5>
                  {renderInsightItems(industryAnalysis.sector_momentum.breakout_candidates.industries, 'ngành có thể bứt phá')}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Sector Risk */}
      {(() => {
        const hasRiskData = [
          industryAnalysis.sector_risk?.momentum_exhaustion?.industries,
          industryAnalysis.sector_risk?.falling_knife?.industries,
          industryAnalysis.sector_risk?.dead_cat_bounce?.industries,
          industryAnalysis.sector_risk?.distribution_signals?.industries
        ].some(data => data && data.length > 0);
        
        if (!hasRiskData) return null;
        
        return (
          <div className="mb-6">
            <h4 className="font-medium text-red-800 mb-3">{industryAnalysis.sector_risk.title}</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Momentum Exhaustion */}
              {industryAnalysis.sector_risk.momentum_exhaustion?.industries?.length > 0 && (
                <div>
                  <h5 className="font-medium text-red-700 mb-2">Cảnh báo kiệt sức động lượng</h5>
                  {renderInsightItems(industryAnalysis.sector_risk.momentum_exhaustion.industries, 'cảnh báo kiệt sức động lượng')}
                </div>
              )}

              {/* Falling Knife */}
              {industryAnalysis.sector_risk.falling_knife?.industries?.length > 0 && (
                <div>
                  <h5 className="font-medium text-red-700 mb-2">Cảnh báo dao rơi</h5>
                  {renderInsightItems(industryAnalysis.sector_risk.falling_knife.industries, 'cảnh báo dao rơi')}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Dead Cat Bounce */}
              {industryAnalysis.sector_risk.dead_cat_bounce?.industries?.length > 0 && (
                <div>
                  <h5 className="font-medium text-red-700 mb-2">Bật nảy tạm thời (không bền vững)</h5>
                  {renderInsightItems(industryAnalysis.sector_risk.dead_cat_bounce.industries, 'bật nảy tạm thời')}
                </div>
              )}

              {/* Distribution Signals */}
              {industryAnalysis.sector_risk.distribution_signals?.industries?.length > 0 && (
                <div>
                  <h5 className="font-medium text-red-700 mb-2">Tín hiệu phân phối (bán ra)</h5>
                  {renderInsightItems(industryAnalysis.sector_risk.distribution_signals.industries, 'tín hiệu phân phối')}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Sector Performers */}
      {industryAnalysis.sector_performers && (
        <div>
          <h4 className="font-medium text-green-800 mb-3">{industryAnalysis.sector_performers.title}</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Industries */}
            {industryAnalysis.sector_performers.top_industries?.length > 0 && (
              <div>
                <h5 className="font-medium text-green-700 mb-2">Top ngành mạnh nhất</h5>
                <div className="space-y-2">
                  {industryAnalysis.sector_performers.top_industries.slice(0, 5).map((industry, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{industry?.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-600 mt-1">{industry?.description || 'N/A'}</div>
                          <div className={`text-xs mt-1 ${getQuadrantColor(industry?.rrg_position)}`}>
                            {industry?.rrg_position || 'N/A'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">{(industry?.strength_score || 0).toFixed(2)}</div>
                          <div className="text-xs text-gray-500 mt-1">{industry?.money_flow || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Industries */}
            {industryAnalysis.sector_performers.bottom_industries?.length > 0 && (
              <div>
                <h5 className="font-medium text-red-700 mb-2">Top ngành yếu nhất</h5>
                <div className="space-y-2">
                  {industryAnalysis.sector_performers.bottom_industries.slice(0, 5).map((industry, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{industry?.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-600 mt-1">{industry?.description || 'N/A'}</div>
                          <div className={`text-xs mt-1 ${getQuadrantColor(industry?.rrg_position)}`}>
                            {industry?.rrg_position || 'N/A'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-600">{(industry?.strength_score || 0).toFixed(2)}</div>
                          <div className="text-xs text-gray-500 mt-1">{industry?.money_flow || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryAnalysis; 