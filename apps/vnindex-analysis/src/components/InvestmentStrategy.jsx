import React from 'react';

const InvestmentStrategy = ({ investmentStrategies }) => {
  if (!investmentStrategies || !investmentStrategies.title) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-orange-900 mb-3">Chiến lược đầu tư đề xuất</h3>
        <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
        <p className="text-xs text-gray-400 mt-2">
          Debug: investmentStrategies keys: {investmentStrategies ? Object.keys(investmentStrategies).join(', ') : 'null'}
        </p>
        <div className="text-xs text-gray-400 mt-2">
          <p>Available data:</p>
          <p>- macro_strategy: {investmentStrategies?.macro_strategy ? 'exists' : 'missing'}</p>
          <p>- group_strategy: {investmentStrategies?.group_strategy ? 'exists' : 'missing'}</p>
          <p>- sector_strategy: {investmentStrategies?.sector_strategy ? 'exists' : 'missing'}</p>
          <p>- stock_strategy: {investmentStrategies?.stock_strategy ? 'exists' : 'missing'}</p>
        </div>
        {investmentStrategies?.macro_strategy && (
          <div className="text-xs text-gray-400 mt-2">
            <p>Macro strategy keys: {Object.keys(investmentStrategies.macro_strategy).join(', ')}</p>
            <p>Overall positioning: {JSON.stringify(investmentStrategies.macro_strategy.overall_positioning)}</p>
          </div>
        )}
        {investmentStrategies?.group_strategy && (
          <div className="text-xs text-gray-400 mt-2">
            <p>Group strategy keys: {Object.keys(investmentStrategies.group_strategy).join(', ')}</p>
            <p>Group rotation signals: {JSON.stringify(investmentStrategies.group_strategy.group_rotation_signals)}</p>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-orange-900 mb-3">{investmentStrategies.title || 'Chiến lược đầu tư đề xuất'}</h3>
      
      <div className="space-y-4">
        {/* Macro Strategy */}
        {investmentStrategies.macro_strategy && (
          <div>
            <h4 className="font-medium text-orange-800 mb-2">Chiến lược tổng thể thị trường (Macro)</h4>
            <div className="bg-white p-3 rounded border">
              <div className="space-y-2">
                {investmentStrategies.macro_strategy.overall_positioning && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Tư thế tổng thể:</div>
                    {investmentStrategies.macro_strategy.overall_positioning.map((position, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {position}</div>
                    ))}
                  </div>
                )}
                {investmentStrategies.macro_strategy.market_phase_analysis && investmentStrategies.macro_strategy.market_phase_analysis.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Phân tích giai đoạn thị trường:</div>
                    {investmentStrategies.macro_strategy.market_phase_analysis.map((analysis, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {analysis}</div>
                    ))}
                  </div>
                )}
                {investmentStrategies.macro_strategy.risk_management && investmentStrategies.macro_strategy.risk_management.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Quản lý rủi ro:</div>
                    {investmentStrategies.macro_strategy.risk_management.map((risk, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {risk}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sector Strategy */}
        {investmentStrategies.sector_strategy && (
          <div>
            <h4 className="font-medium text-orange-800 mb-2">Chiến lược ngành (Sector)</h4>
            <div className="bg-white p-3 rounded border">
              <div className="space-y-2">
                {investmentStrategies.sector_strategy.sector_rotation_signals && investmentStrategies.sector_strategy.sector_rotation_signals.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-blue-700 mb-1">Tín hiệu luân chuyển ngành:</div>
                    {investmentStrategies.sector_strategy.sector_rotation_signals.map((signal, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {signal}</div>
                    ))}
                  </div>
                )}
                {investmentStrategies.sector_strategy.sector_allocation && investmentStrategies.sector_strategy.sector_allocation.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-green-700 mb-1">Phân bổ ngành:</div>
                    {investmentStrategies.sector_strategy.sector_allocation.map((allocation, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {allocation}</div>
                    ))}
                  </div>
                )}
                {investmentStrategies.sector_strategy.sector_risk_warnings && investmentStrategies.sector_strategy.sector_risk_warnings.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-red-700 mb-1">Cảnh báo rủi ro ngành:</div>
                    {investmentStrategies.sector_strategy.sector_risk_warnings.map((warning, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {warning}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Group Strategy */}
        {investmentStrategies.group_strategy && (
          <div>
            <h4 className="font-medium text-orange-800 mb-2">Chiến lược nhóm vốn hóa (Group)</h4>
            <div className="bg-white p-3 rounded border">
              <div className="space-y-2">
                {investmentStrategies.group_strategy.group_rotation_signals && investmentStrategies.group_strategy.group_rotation_signals.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-blue-700 mb-1">Tín hiệu luân chuyển nhóm:</div>
                    {investmentStrategies.group_strategy.group_rotation_signals.map((signal, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {signal}</div>
                    ))}
                  </div>
                )}
                {investmentStrategies.group_strategy.group_allocation && investmentStrategies.group_strategy.group_allocation.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-green-700 mb-1">Phân bổ nhóm:</div>
                    {investmentStrategies.group_strategy.group_allocation.map((allocation, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {allocation}</div>
                    ))}
                  </div>
                )}
                {investmentStrategies.group_strategy.group_risk_warnings && investmentStrategies.group_strategy.group_risk_warnings.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-red-700 mb-1">Cảnh báo rủi ro nhóm:</div>
                    {investmentStrategies.group_strategy.group_risk_warnings.map((warning, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {warning}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stock Strategy */}
        {investmentStrategies.stock_strategy && (
          <div>
            <h4 className="font-medium text-orange-800 mb-2">Chiến lược cổ phiếu cá nhân (Stock)</h4>
            <div className="bg-white p-3 rounded border">
              <div className="space-y-2">
                {investmentStrategies.stock_strategy.momentum_strategy && investmentStrategies.stock_strategy.momentum_strategy.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-green-700 mb-1">Chiến lược momentum:</div>
                    {investmentStrategies.stock_strategy.momentum_strategy.map((strategy, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {strategy}</div>
                    ))}
                  </div>
                )}
                {investmentStrategies.stock_strategy.accumulation_strategy && investmentStrategies.stock_strategy.accumulation_strategy.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-blue-700 mb-1">Chiến lược tích lũy:</div>
                    {investmentStrategies.stock_strategy.accumulation_strategy.map((strategy, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {strategy}</div>
                    ))}
                  </div>
                )}
                {investmentStrategies.stock_strategy.risk_avoidance && investmentStrategies.stock_strategy.risk_avoidance.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-red-700 mb-1">Tránh rủi ro:</div>
                    {investmentStrategies.stock_strategy.risk_avoidance.map((risk, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {risk}</div>
                    ))}
                  </div>
                )}
                {investmentStrategies.stock_strategy.position_sizing && investmentStrategies.stock_strategy.position_sizing.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-purple-700 mb-1">Kích thước vị thế:</div>
                    {investmentStrategies.stock_strategy.position_sizing.map((sizing, index) => (
                      <div key={index} className="text-sm text-gray-700 ml-2">• {sizing}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentStrategy; 