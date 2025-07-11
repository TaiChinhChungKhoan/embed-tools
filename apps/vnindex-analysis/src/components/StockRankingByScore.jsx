import React from 'react';

const StockRankingByScore = ({ individualStockAnalysis, getQuadrantColor }) => {
  if (!individualStockAnalysis?.stock_performers) return null;
  
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-purple-900 mb-3">Xếp hạng cổ phiếu theo điểm số</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Symbols */}
        {individualStockAnalysis.stock_performers.top_symbols?.length > 0 && (
          <div>
            <h4 className="font-medium text-purple-700 mb-2">Top 10 cổ phiếu mạnh nhất</h4>
            <div className="space-y-2">
              {individualStockAnalysis.stock_performers.top_symbols.slice(0, 10).map((symbol, index) => (
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
            <h4 className="font-medium text-red-700 mb-2">Top 10 cổ phiếu yếu nhất</h4>
            <div className="space-y-2">
              {individualStockAnalysis.stock_performers.bottom_symbols.slice(0, 10).map((symbol, index) => (
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
  );
};

export default StockRankingByScore; 