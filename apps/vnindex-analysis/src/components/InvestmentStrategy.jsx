import React from 'react';

const InvestmentStrategy = ({ investmentStrategies }) => {
  if (!investmentStrategies || !investmentStrategies.title) return null;
  
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-orange-900 mb-3">{investmentStrategies.title || 'Chiến lược đầu tư đề xuất'}</h3>
      
      <div className="space-y-4">
        {/* Macro Strategy */}
        {investmentStrategies.macro_strategy && (
          <div>
            <h4 className="font-medium text-orange-800 mb-2">{investmentStrategies.macro_strategy.title || 'Chiến lược tổng thể thị trường (Macro)'}</h4>
            <div className="bg-white p-3 rounded border">
              <div className="space-y-2">
                {investmentStrategies.macro_strategy.market_phase_analysis?.map((point, index) => (
                  <div key={index} className="text-sm text-gray-700">• {point}</div>
                ))}
                {investmentStrategies.macro_strategy.overall_positioning?.map((point, index) => (
                  <div key={index} className="text-sm text-gray-700">• {point}</div>
                ))}
                {investmentStrategies.macro_strategy.risk_management?.map((point, index) => (
                  <div key={index} className="text-sm text-gray-700">• {point}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sector Strategy */}
        {investmentStrategies.sector_strategy && (
          <div>
            <h4 className="font-medium text-orange-800 mb-2">{investmentStrategies.sector_strategy.title || 'Chiến lược ngành (Sector)'}</h4>
            <div className="bg-white p-3 rounded border">
              <div className="space-y-2">
                {investmentStrategies.sector_strategy.sector_rotation_signals?.map((point, index) => (
                  <div key={index} className="text-sm text-gray-700">• {point}</div>
                ))}
                {investmentStrategies.sector_strategy.sector_allocation?.map((point, index) => (
                  <div key={index} className="text-sm text-gray-700">• {point}</div>
                ))}
                {investmentStrategies.sector_strategy.sector_risk_warnings?.map((point, index) => (
                  <div key={index} className="text-sm text-gray-700">• {point}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stock Strategy */}
        {investmentStrategies.stock_strategy && (
          <div>
            <h4 className="font-medium text-orange-800 mb-2">{investmentStrategies.stock_strategy.title || 'Chiến lược cổ phiếu cá nhân (Stock)'}</h4>
            <div className="bg-white p-3 rounded border">
              <div className="space-y-2">
                {investmentStrategies.stock_strategy.momentum_strategy?.map((point, index) => (
                  <div key={index} className="text-sm text-gray-700">• {point}</div>
                ))}
                {investmentStrategies.stock_strategy.accumulation_strategy?.map((point, index) => (
                  <div key={index} className="text-sm text-gray-700">• {point}</div>
                ))}
                {investmentStrategies.stock_strategy.risk_avoidance?.map((point, index) => (
                  <div key={index} className="text-sm text-gray-700">• {point}</div>
                ))}
                {investmentStrategies.stock_strategy.position_sizing?.map((point, index) => (
                  <div key={index} className="text-sm text-gray-700">• {point}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentStrategy; 