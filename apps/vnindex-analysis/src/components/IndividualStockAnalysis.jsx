import React from 'react';

const IndividualStockAnalysis = ({ individualStockAnalysis, getQuadrantColor, renderInsightItems }) => {
  if (!individualStockAnalysis) return null;
  
  const hasAnyData = [
    individualStockAnalysis.stock_momentum?.momentum_leaders?.symbols,
    individualStockAnalysis.stock_momentum?.accumulation_candidates?.symbols,
    individualStockAnalysis.stock_momentum?.stealth_accumulation?.symbols,
    individualStockAnalysis.stock_momentum?.breakout_candidates?.symbols,
    individualStockAnalysis.stock_risk?.momentum_exhaustion?.symbols,
    individualStockAnalysis.stock_risk?.falling_knife?.symbols,
    individualStockAnalysis.stock_risk?.dead_cat_bounce?.symbols,
    individualStockAnalysis.stock_risk?.distribution_signals?.symbols,
    individualStockAnalysis.stock_performers?.top_symbols,
    individualStockAnalysis.stock_performers?.bottom_symbols
  ].some(data => data && (Array.isArray(data) ? data.length > 0 : Object.values(data || {}).some(v => v > 0)));
  
  if (!hasAnyData) return null;
  
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-purple-900 mb-3">{individualStockAnalysis.title || 'Phân tích cổ phiếu cá nhân (Stock Level)'}</h3>
      
      {/* Stock Momentum */}
      {(() => {
        const hasMomentumData = [
          individualStockAnalysis.stock_momentum?.momentum_leaders?.symbols,
          individualStockAnalysis.stock_momentum?.accumulation_candidates?.symbols,
          individualStockAnalysis.stock_momentum?.stealth_accumulation?.symbols,
          individualStockAnalysis.stock_momentum?.breakout_candidates?.symbols
        ].some(data => data && data.length > 0);
        
        if (!hasMomentumData) return null;
        
        return (
          <div className="mb-6">
            <h4 className="font-medium text-purple-800 mb-3">{individualStockAnalysis.stock_momentum.title}</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Momentum Leaders */}
              {individualStockAnalysis.stock_momentum.momentum_leaders?.symbols?.length > 0 && (
                <div>
                  <h5 className="font-medium text-purple-700 mb-2">{individualStockAnalysis.stock_momentum.momentum_leaders.title}</h5>
                  {renderInsightItems(individualStockAnalysis.stock_momentum.momentum_leaders.symbols, 'cổ phiếu có động lượng mạnh')}
                </div>
              )}

              {/* Accumulation Candidates */}
              {individualStockAnalysis.stock_momentum.accumulation_candidates?.symbols?.length > 0 && (
                <div>
                  <h5 className="font-medium text-purple-700 mb-2">Cổ phiếu tích lũy tiềm năng</h5>
                  {renderInsightItems(individualStockAnalysis.stock_momentum.accumulation_candidates.symbols, 'cổ phiếu tích lũy tiềm năng')}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Stealth Accumulation */}
              {individualStockAnalysis.stock_momentum.stealth_accumulation?.symbols?.length > 0 && (
                <div>
                  <h5 className="font-medium text-purple-700 mb-2">Tích lũy âm thầm (tổ chức)</h5>
                  {renderInsightItems(individualStockAnalysis.stock_momentum.stealth_accumulation.symbols, 'tích lũy âm thầm')}
                </div>
              )}

              {/* Breakout Candidates */}
              {individualStockAnalysis.stock_momentum.breakout_candidates?.symbols?.length > 0 && (
                <div>
                  <h5 className="font-medium text-purple-700 mb-2">Cổ phiếu có thể bứt phá</h5>
                  {renderInsightItems(individualStockAnalysis.stock_momentum.breakout_candidates.symbols, 'cổ phiếu có thể bứt phá')}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Stock Risk */}
      {(() => {
        const hasRiskData = [
          individualStockAnalysis.stock_risk?.momentum_exhaustion?.symbols,
          individualStockAnalysis.stock_risk?.falling_knife?.symbols,
          individualStockAnalysis.stock_risk?.dead_cat_bounce?.symbols,
          individualStockAnalysis.stock_risk?.distribution_signals?.symbols
        ].some(data => data && data.length > 0);
        
        if (!hasRiskData) return null;
        
        return (
          <div className="mb-6">
            <h4 className="font-medium text-red-800 mb-3">{individualStockAnalysis.stock_risk.title}</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Momentum Exhaustion */}
              {individualStockAnalysis.stock_risk.momentum_exhaustion?.symbols?.length > 0 && (
                <div>
                  <h5 className="font-medium text-red-700 mb-2">Cảnh báo kiệt sức động lượng</h5>
                  {renderInsightItems(individualStockAnalysis.stock_risk.momentum_exhaustion.symbols, 'cảnh báo kiệt sức động lượng')}
                </div>
              )}

              {/* Falling Knife */}
              {individualStockAnalysis.stock_risk.falling_knife?.symbols?.length > 0 && (
                <div>
                  <h5 className="font-medium text-red-700 mb-2">Cảnh báo dao rơi</h5>
                  {renderInsightItems(individualStockAnalysis.stock_risk.falling_knife.symbols, 'cảnh báo dao rơi')}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Dead Cat Bounce */}
              {individualStockAnalysis.stock_risk.dead_cat_bounce?.symbols?.length > 0 && (
                <div>
                  <h5 className="font-medium text-red-700 mb-2">Bật nảy tạm thời (không bền vững)</h5>
                  {renderInsightItems(individualStockAnalysis.stock_risk.dead_cat_bounce.symbols, 'bật nảy tạm thời')}
                </div>
              )}

              {/* Distribution Signals */}
              {individualStockAnalysis.stock_risk.distribution_signals?.symbols?.length > 0 && (
                <div>
                  <h5 className="font-medium text-red-700 mb-2">Tín hiệu phân phối (bán ra)</h5>
                  {renderInsightItems(individualStockAnalysis.stock_risk.distribution_signals.symbols, 'tín hiệu phân phối')}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Stock Performers */}
      {individualStockAnalysis.stock_performers && (
        <div>
          <h4 className="font-medium text-purple-800 mb-3">{individualStockAnalysis.stock_performers.title}</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Symbols */}
            {individualStockAnalysis.stock_performers.top_symbols?.length > 0 && (
              <div>
                <h5 className="font-medium text-purple-700 mb-2">Cổ phiếu mạnh nhất</h5>
                <div className="space-y-2">
                  {individualStockAnalysis.stock_performers.top_symbols.slice(0, 5).map((symbol, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{symbol?.name || 'Unknown'} ({symbol?.symbol || 'N/A'})</div>
                          <div className="text-xs text-gray-500">{symbol?.primary_industry || 'N/A'}</div>
                          <div className="text-sm text-gray-600 mt-1">{symbol?.description || 'N/A'}</div>
                          <div className={`text-xs mt-1 ${getQuadrantColor(symbol?.rrg_position)}`}>
                            {symbol?.rrg_position || 'N/A'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">{(symbol?.strength_score || 0).toFixed(2)}</div>
                          <div className="text-xs text-gray-500 mt-1">{symbol?.money_flow || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Symbols */}
            {individualStockAnalysis.stock_performers.bottom_symbols?.length > 0 && (
              <div>
                <h5 className="font-medium text-red-700 mb-2">Cổ phiếu yếu nhất</h5>
                <div className="space-y-2">
                  {individualStockAnalysis.stock_performers.bottom_symbols.slice(0, 5).map((symbol, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{symbol?.name || 'Unknown'} ({symbol?.symbol || 'N/A'})</div>
                          <div className="text-xs text-gray-500">{symbol?.primary_industry || 'N/A'}</div>
                          <div className="text-sm text-gray-600 mt-1">{symbol?.description || 'N/A'}</div>
                          <div className={`text-xs mt-1 ${getQuadrantColor(symbol?.rrg_position)}`}>
                            {symbol?.rrg_position || 'N/A'}
                          </div>
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
      )}

      {/* Weakest Momentum Stocks */}
      {individualStockAnalysis.stock_performers?.bottom_symbols?.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-red-800 mb-2">Các cổ phiếu có động lượng yếu nhất</h4>
          <div className="space-y-2">
            {individualStockAnalysis.stock_performers.bottom_symbols.slice(0, 8).map((symbol, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{symbol?.name || 'Unknown'} ({symbol?.symbol || 'N/A'})</div>
                    <div className="text-xs text-gray-500">{symbol?.primary_industry || 'N/A'}</div>
                    <div className="text-sm text-gray-600 mt-1">{symbol?.description || 'N/A'}</div>
                    <div className={`text-xs mt-1 ${getQuadrantColor(symbol?.rrg_position)}`}>{symbol?.rrg_position || 'N/A'}</div>
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

      {/* Distribution Candidates */}
      {individualStockAnalysis.stock_risk?.distribution_signals?.symbols?.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-yellow-800 mb-2">Cổ phiếu phân phối tiềm năng</h4>
          {renderInsightItems(individualStockAnalysis.stock_risk.distribution_signals.symbols, 'cổ phiếu phân phối tiềm năng')}
        </div>
      )}

      {/* Stocks Likely to Decline */}
      {(individualStockAnalysis.stock_risk?.falling_knife?.symbols?.length > 0 || individualStockAnalysis.stock_risk?.momentum_exhaustion?.symbols?.length > 0) && (
        <div className="mb-6">
          <h4 className="font-medium text-orange-800 mb-2">Cổ phiếu có thể giảm</h4>
          {individualStockAnalysis.stock_risk.falling_knife.symbols?.length > 0 && (
            <div>
              <div className="font-medium text-orange-700 mb-1">Dao rơi (tránh hoàn toàn)</div>
              {renderInsightItems(individualStockAnalysis.stock_risk.falling_knife.symbols, 'dao rơi')}
            </div>
          )}
          {individualStockAnalysis.stock_risk.momentum_exhaustion.symbols?.length > 0 && (
            <div className="mt-2">
              <div className="font-medium text-orange-700 mb-1">Động lượng kiệt quệ (cần thận trọng)</div>
              {renderInsightItems(individualStockAnalysis.stock_risk.momentum_exhaustion.symbols, 'kiệt quệ động lượng')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IndividualStockAnalysis; 