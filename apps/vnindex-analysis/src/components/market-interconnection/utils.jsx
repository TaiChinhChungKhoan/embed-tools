import React from 'react';
import { Brain, AlertTriangle } from 'lucide-react';

// Default data structure with real-time indicators
export const defaultData = {
  inflation_mode: { status: "ANALYZING", indicators: {} },
  risk_mode: { status: "ANALYZING", indicators: {} },
  vix: "Real-time",
  dxy: "Real-time"
};

// Enhanced section headers with explanations
export const SectionHeader = ({ title, intent, howToUse, children }) => (
  <div className="mb-6">
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
      <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center">
        <Brain className="w-5 h-5 mr-2" />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold text-blue-800 mb-1">🎯 Mục đích:</h4>
          <p className="text-blue-700">{intent}</p>
        </div>
        <div>
          <h4 className="font-semibold text-blue-800 mb-1">📖 Cách sử dụng:</h4>
          <p className="text-blue-700">{howToUse}</p>
        </div>
      </div>
    </div>
    {children}
  </div>
);

// Market Mode Indicators with real-time data
export const MarketModeIndicators = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-white rounded-lg border p-4">
      <h4 className="font-semibold text-sm text-slate-700 mb-3">Chế độ Lạm phát (Real-time)</h4>
      <p className="text-xs text-gray-600 mb-2">Theo dõi qua CPI, PPI, và commodities charts bên dưới</p>
      <div className="text-sm text-blue-600">Xem biểu đồ CPI & Commodities</div>
    </div>
    <div className="bg-white rounded-lg border p-4">
      <h4 className="font-semibold text-sm text-slate-700 mb-3">Chế độ Rủi ro (Real-time)</h4>
      <p className="text-xs text-gray-600 mb-2">Theo dõi qua VIX và Bond Yield charts</p>
      <div className="text-sm text-blue-600">Xem biểu đồ VIX & US10Y</div>
    </div>
  </div>
);

// Correlation Matrix Component
export const CorrelationMatrix = ({ correlationData }) => {
  const assets = ['Stocks', 'Bonds', 'Gold', 'USD', 'Crypto'];
  
  return (
    <div className="p-4 bg-white rounded-lg border">
      <h4 className="font-semibold text-sm text-slate-700 mb-3">Ma trận Tương quan (Ước tính)</h4>
      <div className="grid grid-cols-6 gap-1 text-xs">
        <div></div>
        {assets.map(asset => (
          <div key={asset} className="text-center font-medium p-1">{asset}</div>
        ))}
        {assets.map(rowAsset => (
          <React.Fragment key={rowAsset}>
            <div className="font-medium p-1">{rowAsset}</div>
            {assets.map(colAsset => {
              // Sample correlation values for demonstration
              const correlations = {
                'Stocks_Bonds': -0.3,
                'Bonds_Stocks': -0.3,
                'Stocks_Gold': -0.2,
                'Gold_Stocks': -0.2,
                'Stocks_USD': -0.4,
                'USD_Stocks': -0.4,
                'Stocks_Crypto': 0.6,
                'Crypto_Stocks': 0.6,
                'Bonds_Gold': 0.3,
                'Gold_Bonds': 0.3,
                'Bonds_USD': 0.2,
                'USD_Bonds': 0.2,
                'Bonds_Crypto': -0.5,
                'Crypto_Bonds': -0.5,
                'Gold_USD': 0.7,
                'USD_Gold': 0.7,
                'Gold_Crypto': 0.2,
                'Crypto_Gold': 0.2,
                'USD_Crypto': -0.6,
                'Crypto_USD': -0.6,
              };
              
              const key = `${rowAsset}_${colAsset}`;
              const correlation = rowAsset === colAsset ? 1.0 : (correlations[key] || 0);
              
              return (
                <div 
                  key={`${rowAsset}-${colAsset}`}
                  className={`p-1 text-center rounded text-white text-xs font-medium ${
                    correlation > 0.5 ? 'bg-green-500' :
                    correlation > 0 ? 'bg-green-300' :
                    correlation > -0.5 ? 'bg-red-300' : 'bg-red-500'
                  }`}
                >
                  {correlation.toFixed(2)}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Enhanced Market Analysis Summary
export const MarketAnalysisSummary = ({ data }) => {
  return (
    <div className="bg-slate-50 rounded-lg border p-6">
      <h4 className="font-semibold text-lg text-slate-800 mb-4 flex items-center">
        <Brain className="w-5 h-5 mr-2" />
        Phân tích tổng hợp Real-time
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold text-blue-800 mb-2">🔍 Các chỉ số quan trọng</h5>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• VIX: Chỉ số sợ hãi thị trường</div>
              <div>• DXY: Sức mạnh đồng USD</div>
              <div>• US10Y: Lợi suất trái phiếu 10 năm</div>
              <div>• Gold: Tài sản trú ẩn an toàn</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold text-purple-800 mb-2">📋 Theo dõi thường xuyên</h5>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• Fed Meeting và quyết định lãi suất</div>
              <div>• Báo cáo CPI/PPI hàng tháng</div>
              <div>• Biến động commodities</div>
              <div>• Tương quan giữa các tài sản</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};