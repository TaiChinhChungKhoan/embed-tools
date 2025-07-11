import React from 'react';

const StockRankingBySpeed = ({ individualStockAnalysis, renderInsightItems, rrgData }) => {
  if (!individualStockAnalysis) return null;
  
  // Get symbols with risk signals from the main data
  const symbolsWithRiskSignals = rrgData.symbols?.filter(symbol => 
    symbol.risk_assessment?.risk_signals?.falling_knife ||
    symbol.risk_assessment?.risk_signals?.momentum_exhaustion ||
    symbol.risk_assessment?.risk_signals?.distribution_signals
  ) || [];
  
  const hasAnyData = [
    individualStockAnalysis.stock_momentum?.momentum_leaders?.symbols,
    individualStockAnalysis.stock_momentum?.breakout_candidates?.symbols,
    individualStockAnalysis.stock_momentum?.accumulation_candidates?.symbols,
    individualStockAnalysis.stock_performers?.bottom_symbols,
    symbolsWithRiskSignals.length > 0
  ].some(data => data && (Array.isArray(data) ? data.length > 0 : data));
  
  if (!hasAnyData) return null;
  
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-purple-900 mb-3">Xếp hạng cổ phiếu theo tốc độ/hướng</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Positive Momentum */}
        <div className="space-y-4">
          {/* Strongest Momentum */}
          {individualStockAnalysis.stock_momentum?.momentum_leaders?.symbols?.length > 0 && (
            <div>
              <h4 className="font-medium text-green-700 mb-2">Các cổ phiếu có động lượng mạnh nhất</h4>
              {renderInsightItems(individualStockAnalysis.stock_momentum.momentum_leaders.symbols, 'cổ phiếu có động lượng mạnh')}
            </div>
          )}

          {/* Breakout Candidates */}
          {individualStockAnalysis.stock_momentum?.breakout_candidates?.symbols?.length > 0 && (
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Cổ phiếu có thể bứt phá</h4>
              {renderInsightItems(individualStockAnalysis.stock_momentum.breakout_candidates.symbols, 'cổ phiếu có thể bứt phá')}
            </div>
          )}

          {/* Accumulation Candidates */}
          {individualStockAnalysis.stock_momentum?.accumulation_candidates?.symbols?.length > 0 && (
            <div>
              <h4 className="font-medium text-purple-700 mb-2">Cổ phiếu tích lũy tiềm năng</h4>
              {renderInsightItems(individualStockAnalysis.stock_momentum.accumulation_candidates.symbols, 'cổ phiếu tích lũy tiềm năng')}
            </div>
          )}
        </div>

        {/* Right Column - Negative Momentum */}
        <div className="space-y-4">
          {/* Weakest Momentum */}
          {individualStockAnalysis.stock_performers?.bottom_symbols?.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-2">Các cổ phiếu có động lượng yếu nhất</h4>
              <div className="space-y-2">
                {individualStockAnalysis.stock_performers.bottom_symbols.slice(0, 5).map((symbol, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{symbol?.name || 'Unknown'} ({symbol?.symbol || 'N/A'})</div>
                        <div className="text-xs text-gray-500">{symbol?.primary_industry || 'N/A'}</div>
                        <div className="text-sm text-gray-600 mt-1">{symbol?.description || 'N/A'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">{(symbol?.strength_score || 0).toFixed(2)}</div>
                        <div className="text-xs text-gray-500 mt-1">{symbol?.money_flow || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stocks Likely to Decline */}
          {(() => {
            const fallingKnifeSymbols = rrgData.symbols?.filter(symbol => 
              symbol.risk_assessment?.risk_signals?.falling_knife
            ) || [];
            
            const momentumExhaustionSymbols = rrgData.symbols?.filter(symbol => 
              symbol.risk_assessment?.risk_signals?.momentum_exhaustion
            ) || [];
            
            if (fallingKnifeSymbols.length > 0 || momentumExhaustionSymbols.length > 0) {
              return (
                <div>
                  <h4 className="font-medium text-orange-700 mb-2">Cổ phiếu có thể giảm</h4>
                  {fallingKnifeSymbols.length > 0 && (
                    <div className="mb-2">
                      <div className="font-medium text-orange-600 mb-1">Dao rơi (tránh hoàn toàn)</div>
                      <div className="space-y-2">
                        {fallingKnifeSymbols.slice(0, 5).map((symbol, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-gray-900">{symbol.name || 'Unknown'} ({symbol.symbol || 'N/A'})</div>
                                <div className="text-xs text-gray-500">{symbol.industries?.[0] || 'N/A'}</div>
                                <div className="text-sm text-gray-600 mt-1">{symbol.speed_analysis?.speed_category || 'N/A'}</div>
                                <div className={`text-xs mt-1 ${symbol.direction_analysis?.direction?.includes('Degrading') ? 'text-red-600' : 'text-gray-600'}`}>
                                  {symbol.direction_analysis?.direction || 'N/A'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-red-600">
                                  {(symbol.speed_analysis?.weighted_speed || 0).toFixed(3)}
                                </div>
                                <div className={`text-xs mt-1 ${symbol.risk_assessment?.risk_level === 'High' ? 'text-red-600' : symbol.risk_assessment?.risk_level === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {symbol.risk_assessment?.risk_level || 'Unknown'} Risk
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{symbol.risk_assessment?.suggested_position_size || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {momentumExhaustionSymbols.length > 0 && (
                    <div>
                      <div className="font-medium text-orange-600 mb-1">Động lượng kiệt quệ (cần thận trọng)</div>
                      <div className="space-y-2">
                        {momentumExhaustionSymbols.slice(0, 5).map((symbol, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-gray-900">{symbol.name || 'Unknown'} ({symbol.symbol || 'N/A'})</div>
                                <div className="text-xs text-gray-500">{symbol.industries?.[0] || 'N/A'}</div>
                                <div className="text-sm text-gray-600 mt-1">{symbol.speed_analysis?.speed_category || 'N/A'}</div>
                                <div className={`text-xs mt-1 ${symbol.direction_analysis?.direction?.includes('Degrading') ? 'text-red-600' : 'text-gray-600'}`}>
                                  {symbol.direction_analysis?.direction || 'N/A'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-red-600">
                                  {(symbol.speed_analysis?.weighted_speed || 0).toFixed(3)}
                                </div>
                                <div className={`text-xs mt-1 ${symbol.risk_assessment?.risk_level === 'High' ? 'text-red-600' : symbol.risk_assessment?.risk_level === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {symbol.risk_assessment?.risk_level || 'Unknown'} Risk
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{symbol.risk_assessment?.suggested_position_size || 'N/A'}</div>
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
            const distributionSymbols = rrgData.symbols?.filter(symbol => 
              symbol.risk_assessment?.risk_signals?.distribution_signals
            ) || [];
            
            if (distributionSymbols.length > 0) {
              return (
                <div>
                  <h4 className="font-medium text-yellow-700 mb-2">Cổ phiếu phân phối tiềm năng</h4>
                  <div className="space-y-2">
                    {distributionSymbols.slice(0, 5).map((symbol, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">{symbol.name || 'Unknown'} ({symbol.symbol || 'N/A'})</div>
                            <div className="text-xs text-gray-500">{symbol.industries?.[0] || 'N/A'}</div>
                            <div className="text-sm text-gray-600 mt-1">{symbol.speed_analysis?.speed_category || 'N/A'}</div>
                            <div className={`text-xs mt-1 ${symbol.direction_analysis?.direction?.includes('Degrading') ? 'text-red-600' : 'text-gray-600'}`}>
                              {symbol.direction_analysis?.direction || 'N/A'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-yellow-600">
                              {(symbol.speed_analysis?.weighted_speed || 0).toFixed(3)}
                            </div>
                            <div className={`text-xs mt-1 ${symbol.risk_assessment?.risk_level === 'High' ? 'text-red-600' : symbol.risk_assessment?.risk_level === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                              {symbol.risk_assessment?.risk_level || 'Unknown'} Risk
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{symbol.risk_assessment?.suggested_position_size || 'N/A'}</div>
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
          {(symbolsWithRiskSignals.length === 0 &&
            individualStockAnalysis.stock_performers?.bottom_symbols?.length > 0) && (
            <div>
              <h4 className="font-medium text-orange-700 mb-2">Cổ phiếu có thể giảm (dựa trên điểm số thấp)</h4>
              <div className="text-xs text-gray-500 mb-2">* Dữ liệu rủi ro chưa có, hiển thị dựa trên điểm số thấp nhất</div>
              <div className="space-y-2">
                {individualStockAnalysis.stock_performers.bottom_symbols.slice(0, 5).map((symbol, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{symbol?.name || 'Unknown'} ({symbol?.symbol || 'N/A'})</div>
                        <div className="text-xs text-gray-500">{symbol?.primary_industry || 'N/A'}</div>
                        <div className="text-sm text-gray-600 mt-1">{symbol?.description || 'N/A'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">{(symbol?.strength_score || 0).toFixed(2)}</div>
                        <div className="text-xs text-gray-500 mt-1">{symbol?.money_flow || 'N/A'}</div>
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

export default StockRankingBySpeed; 