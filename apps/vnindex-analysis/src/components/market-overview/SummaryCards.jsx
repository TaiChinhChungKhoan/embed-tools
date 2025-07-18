import React from 'react';
import { Activity, BarChart3, Zap, Shield, DollarSign, Target } from 'lucide-react';

const SummaryCards = ({ marketOverview }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {/* Trend Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
        <div className="flex justify-center mb-1">
          <Activity className="w-3 h-3 text-blue-600" />
        </div>
        <div className="text-xs font-medium text-gray-700 mb-1">Động lượng</div>
        <div className="text-sm font-bold text-blue-600">
          {marketOverview.market_regime?.momentum_score ? 
            `${(marketOverview.market_regime.momentum_score * 100).toFixed(0)}%` : 'N/A'}
        </div>
        <div className="text-xs text-gray-500">Bullish ↑</div>
      </div>

      {/* Breadth Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
        <div className="flex justify-center mb-1">
          <BarChart3 className="w-3 h-3 text-green-600" />
        </div>
        <div className="text-xs font-medium text-gray-700 mb-1">Độ rộng</div>
        <div className="text-sm font-bold text-green-600">
          {marketOverview.market_health?.key_metrics?.market_breadth?.score ? 
            `${(marketOverview.market_health.key_metrics.market_breadth.score * 100).toFixed(0)}%` : 'N/A'}
        </div>
        <div className="text-xs text-gray-500">Advance/Decline</div>
      </div>

      {/* Volatility Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
        <div className="flex justify-center mb-1">
          <Zap className="w-3 h-3 text-yellow-600" />
        </div>
        <div className="text-xs font-medium text-gray-700 mb-1">Biến động</div>
        <div className="text-sm font-bold text-yellow-600">
          {marketOverview.market_health?.key_metrics?.momentum_distribution?.momentum_categories?.very_strong || 'N/A'}
        </div>
        <div className="text-xs text-gray-500">IV Index: Thấp</div>
      </div>

      {/* Risk Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
        <div className="flex justify-center mb-1">
          <Shield className="w-3 h-3 text-red-600" />
        </div>
        <div className="text-xs font-medium text-gray-700 mb-1">Rủi ro</div>
        <div className="text-sm font-bold text-red-600">
          {marketOverview.market_health?.key_metrics?.momentum_distribution?.risk_distribution?.['Cao'] || 'N/A'}
        </div>
        <div className="text-xs text-gray-500">Risk Gauge: Cảnh báo</div>
      </div>

      {/* Volume Flow Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
        <div className="flex justify-center mb-1">
          <DollarSign className="w-3 h-3 text-purple-600" />
        </div>
        <div className="text-xs font-medium text-gray-700 mb-1">Dòng tiền</div>
        <div className="text-sm font-bold text-purple-600">
          {marketOverview.market_health?.market_cap_rotation?.rotation_theme ? 'Tích cực' : 'N/A'}
        </div>
        <div className="text-xs text-gray-500">Net Buy/Sell</div>
      </div>

      {/* Confidence Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
        <div className="flex justify-center mb-1">
          <Target className="w-3 h-3 text-indigo-600" />
        </div>
        <div className="text-xs font-medium text-gray-700 mb-1">Độ tin cậy</div>
        <div className="text-sm font-bold text-indigo-600">
          {marketOverview.market_regime?.confidence || 'N/A'}%
        </div>
        <div className="text-xs text-gray-500">Confidence</div>
      </div>
    </div>
  );
};

export default SummaryCards; 