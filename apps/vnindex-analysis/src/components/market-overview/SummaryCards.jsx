import React from 'react';
import { Activity, BarChart3, Zap, DollarSign, Target } from 'lucide-react';

const SummaryCards = ({ marketOverview }) => {
  // Helper functions to extract and format data
  const getMomentumData = () => {
    const positiveSlopes = marketOverview.market_regime?.positive_slopes_pct;
    if (typeof positiveSlopes === 'number') {
      return {
        value: `${(positiveSlopes * 100).toFixed(0)}%`,
        color: positiveSlopes > 0.5 ? 'text-green-600' : positiveSlopes > 0.3 ? 'text-yellow-600' : 'text-red-600',
        status: positiveSlopes > 0.5 ? 'Bullish ↑' : positiveSlopes > 0.3 ? 'Mixed ↔' : 'Bearish ↓'
      };
    }
    return { value: 'Chuyển tiếp', color: 'text-gray-600', status: 'Transitional' };
  };

  const getBreadthData = () => {
    const breadth = marketOverview.market_health?.key_metrics?.market_breadth;
    if (breadth?.score) {
      const score = breadth.score;
      return {
        value: `${(score * 100).toFixed(0)}%`,
        color: score > 0.6 ? 'text-green-600' : score > 0.4 ? 'text-yellow-600' : 'text-red-600',
        status: breadth.interpretation || 'Advance/Decline'
      };
    }
    return { value: 'Yếu', color: 'text-red-600', status: 'Narrow market' };
  };

  const getVolatilityData = () => {
    const veryStrong = marketOverview.market_health?.key_metrics?.momentum_distribution?.momentum_categories?.very_strong;
    if (veryStrong) {
      const percentage = parseFloat(veryStrong.match(/(\d+\.?\d*)%/)?.[1] || '0');
      return {
        value: veryStrong,
        color: percentage > 20 ? 'text-red-600' : percentage > 10 ? 'text-yellow-600' : 'text-green-600',
        status: percentage > 20 ? 'Cao' : percentage > 10 ? 'Trung bình' : 'Thấp'
      };
    }
    return { value: '10.8%', color: 'text-green-600', status: 'Ổn định' };
  };


  const getFlowData = () => {
    const outperforming = marketOverview.market_health?.key_metrics?.outperforming_symbols;
    if (outperforming) {
      const percentage = parseFloat(outperforming.match(/\((\d+\.?\d*)%\)/)?.[1] || '0');
      return {
        value: percentage > 40 ? 'Tích cực' : percentage > 25 ? 'Trung tính' : 'Tiêu cực',
        color: percentage > 40 ? 'text-green-600' : percentage > 25 ? 'text-yellow-600' : 'text-red-600',
        status: `${percentage.toFixed(0)}% outperform`
      };
    }
    return { value: 'Tiêu cực', color: 'text-red-600', status: 'Defensive' };
  };

  const getConfidenceData = () => {
    const confidence = marketOverview.market_regime?.confidence;
    if (typeof confidence === 'number') {
      return {
        value: `${confidence}%`,
        color: confidence > 80 ? 'text-green-600' : confidence > 60 ? 'text-yellow-600' : 'text-red-600',
        status: confidence > 80 ? 'Cao' : confidence > 60 ? 'Trung bình' : 'Thấp'
      };
    }
    return { value: '90%', color: 'text-green-600', status: 'Ổn định' };
  };

  const momentum = getMomentumData();
  const breadth = getBreadthData();
  const volatility = getVolatilityData();
  const flow = getFlowData();
  const confidence = getConfidenceData();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      {/* Trend Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
        <div className="flex justify-center mb-1">
          <Activity className="w-3 h-3 text-blue-600" />
        </div>
        <div className="text-xs font-medium text-gray-700 mb-1">Động lượng</div>
        <div className={`text-sm font-bold ${momentum.color}`}>
          {momentum.value}
        </div>
        <div className="text-xs text-gray-500">{momentum.status}</div>
      </div>

      {/* Breadth Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
        <div className="flex justify-center mb-1">
          <BarChart3 className="w-3 h-3 text-green-600" />
        </div>
        <div className="text-xs font-medium text-gray-700 mb-1">Độ rộng</div>
        <div className={`text-sm font-bold ${breadth.color}`}>
          {breadth.value}
        </div>
        <div className="text-xs text-gray-500">{breadth.status}</div>
      </div>

      {/* Volatility Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
        <div className="flex justify-center mb-1">
          <Zap className="w-3 h-3 text-yellow-600" />
        </div>
        <div className="text-xs font-medium text-gray-700 mb-1">Biến động</div>
        <div className={`text-sm font-bold ${volatility.color}`}>
          {volatility.value}
        </div>
        <div className="text-xs text-gray-500">IV: {volatility.status}</div>
      </div>


      {/* Volume Flow Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
        <div className="flex justify-center mb-1">
          <DollarSign className="w-3 h-3 text-purple-600" />
        </div>
        <div className="text-xs font-medium text-gray-700 mb-1">Dòng tiền</div>
        <div className={`text-sm font-bold ${flow.color}`}>
          {flow.value}
        </div>
        <div className="text-xs text-gray-500">{flow.status}</div>
      </div>

      {/* Confidence Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
        <div className="flex justify-center mb-1">
          <Target className="w-3 h-3 text-indigo-600" />
        </div>
        <div className="text-xs font-medium text-gray-700 mb-1">Độ tin cậy</div>
        <div className={`text-sm font-bold ${confidence.color}`}>
          {confidence.value}
        </div>
        <div className="text-xs text-gray-500">Conf: {confidence.status}</div>
      </div>
    </div>
  );
};

export default SummaryCards; 