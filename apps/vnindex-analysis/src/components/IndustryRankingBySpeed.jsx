import React from 'react';

const IndustryRankingBySpeed = ({ industryAnalysis, renderInsightItems, rrgData }) => {
  if (!industryAnalysis) return null;
  
  // Get industries with risk signals from the main data
  const industriesWithRiskSignals = rrgData.industries?.filter(industry => 
    industry.risk_assessment?.risk_signals?.falling_knife ||
    industry.risk_assessment?.risk_signals?.momentum_exhaustion ||
    industry.risk_assessment?.risk_signals?.distribution_signals
  ) || [];
  
  const hasAnyData = [
    industryAnalysis.sector_momentum?.momentum_leaders?.industries,
    industryAnalysis.sector_momentum?.breakout_candidates?.industries,
    industryAnalysis.sector_momentum?.accumulation_candidates?.industries,
    industryAnalysis.sector_performers?.bottom_industries,
    industriesWithRiskSignals.length > 0
  ].some(data => data && (Array.isArray(data) ? data.length > 0 : data));
  
  if (!hasAnyData) return null;
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-green-900 mb-3">Xếp hạng ngành theo tốc độ/hướng</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Positive Momentum */}
        <div className="space-y-4">
          {/* Strongest Momentum */}
          {industryAnalysis.sector_momentum?.momentum_leaders?.industries?.length > 0 && (
            <div>
              <h4 className="font-medium text-green-700 mb-2">Các ngành có động lượng mạnh nhất</h4>
              {renderInsightItems(industryAnalysis.sector_momentum.momentum_leaders.industries, 'ngành có động lượng mạnh')}
            </div>
          )}

          {/* Breakout Candidates */}
          {industryAnalysis.sector_momentum?.breakout_candidates?.industries?.length > 0 && (
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Ngành có thể bứt phá</h4>
              {renderInsightItems(industryAnalysis.sector_momentum.breakout_candidates.industries, 'ngành có thể bứt phá')}
            </div>
          )}

          {/* Accumulation Candidates */}
          {industryAnalysis.sector_momentum?.accumulation_candidates?.industries?.length > 0 && (
            <div>
              <h4 className="font-medium text-purple-700 mb-2">Ngành tích lũy tiềm năng</h4>
              {renderInsightItems(industryAnalysis.sector_momentum.accumulation_candidates.industries, 'ngành tích lũy tiềm năng')}
            </div>
          )}
        </div>

        {/* Right Column - Negative Momentum */}
        <div className="space-y-4">
          {/* Weakest Momentum */}
          {industryAnalysis.sector_performers?.bottom_industries?.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-2">Các ngành có động lượng yếu nhất</h4>
              <div className="space-y-2">
                {industryAnalysis.sector_performers.bottom_industries.slice(0, 5).map((industry, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{industry?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-600 mt-1">{industry?.description || 'N/A'}</div>
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

          {/* Industries Likely to Decline */}
          {(() => {
            const fallingKnifeIndustries = rrgData.industries?.filter(industry => 
              industry.risk_assessment?.risk_signals?.falling_knife
            ) || [];
            
            const momentumExhaustionIndustries = rrgData.industries?.filter(industry => 
              industry.risk_assessment?.risk_signals?.momentum_exhaustion
            ) || [];
            
            if (fallingKnifeIndustries.length > 0 || momentumExhaustionIndustries.length > 0) {
              return (
                <div>
                  <h4 className="font-medium text-orange-700 mb-2">Ngành có thể giảm</h4>
                  {fallingKnifeIndustries.length > 0 && (
                    <div className="mb-2">
                      <div className="font-medium text-orange-600 mb-1">Dao rơi (tránh hoàn toàn)</div>
                      <div className="space-y-2">
                        {fallingKnifeIndustries.slice(0, 5).map((industry, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-gray-900">{industry.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-600 mt-1">{industry.speed_analysis?.speed_category || 'N/A'}</div>
                                <div className={`text-xs mt-1 ${industry.direction_analysis?.direction?.includes('Degrading') ? 'text-red-600' : 'text-gray-600'}`}>
                                  {industry.direction_analysis?.direction || 'N/A'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-red-600">
                                  {(industry.speed_analysis?.weighted_speed || 0).toFixed(3)}
                                </div>
                                <div className={`text-xs mt-1 ${industry.risk_assessment?.risk_level === 'High' ? 'text-red-600' : industry.risk_assessment?.risk_level === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {industry.risk_assessment?.risk_level || 'Unknown'} Risk
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{industry.risk_assessment?.suggested_position_size || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {momentumExhaustionIndustries.length > 0 && (
                    <div>
                      <div className="font-medium text-orange-600 mb-1">Động lượng kiệt quệ (cần thận trọng)</div>
                      <div className="space-y-2">
                        {momentumExhaustionIndustries.slice(0, 5).map((industry, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-gray-900">{industry.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-600 mt-1">{industry.speed_analysis?.speed_category || 'N/A'}</div>
                                <div className={`text-xs mt-1 ${industry.direction_analysis?.direction?.includes('Degrading') ? 'text-red-600' : 'text-gray-600'}`}>
                                  {industry.direction_analysis?.direction || 'N/A'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-red-600">
                                  {(industry.speed_analysis?.weighted_speed || 0).toFixed(3)}
                                </div>
                                <div className={`text-xs mt-1 ${industry.risk_assessment?.risk_level === 'High' ? 'text-red-600' : industry.risk_assessment?.risk_level === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {industry.risk_assessment?.risk_level || 'Unknown'} Risk
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{industry.risk_assessment?.suggested_position_size || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })()}

          {/* Distribution Candidates */}
          {(() => {
            const distributionIndustries = rrgData.industries?.filter(industry => 
              industry.risk_assessment?.risk_signals?.distribution_signals
            ) || [];
            
            if (distributionIndustries.length > 0) {
              return (
                <div>
                  <h4 className="font-medium text-yellow-700 mb-2">Ngành phân phối tiềm năng</h4>
                  <div className="space-y-2">
                    {distributionIndustries.slice(0, 5).map((industry, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">{industry.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-600 mt-1">{industry.speed_analysis?.speed_category || 'N/A'}</div>
                            <div className={`text-xs mt-1 ${industry.direction_analysis?.direction?.includes('Degrading') ? 'text-red-600' : 'text-gray-600'}`}>
                              {industry.direction_analysis?.direction || 'N/A'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-yellow-600">
                              {(industry.speed_analysis?.weighted_speed || 0).toFixed(3)}
                            </div>
                            <div className={`text-xs mt-1 ${industry.risk_assessment?.risk_level === 'High' ? 'text-red-600' : industry.risk_assessment?.risk_level === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                              {industry.risk_assessment?.risk_level || 'Unknown'} Risk
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{industry.risk_assessment?.suggested_position_size || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* Fallback: Show bottom performers as potential decline candidates when risk data is empty */}
          {(industriesWithRiskSignals.length === 0 &&
            industryAnalysis.sector_performers?.bottom_industries?.length > 0) && (
            <div>
              <h4 className="font-medium text-orange-700 mb-2">Ngành có thể giảm (dựa trên điểm số thấp)</h4>
              <div className="text-xs text-gray-500 mb-2">* Dữ liệu rủi ro chưa có, hiển thị dựa trên điểm số thấp nhất</div>
              <div className="space-y-2">
                {industryAnalysis.sector_performers.bottom_industries.slice(0, 5).map((industry, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{industry?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-600 mt-1">{industry?.description || 'N/A'}</div>
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
    </div>
  );
};

export default IndustryRankingBySpeed; 