import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Target,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const MomentumInsightsDashboard = ({ momentumInsights, timeframe, onTimeframeChange }) => {
  if (!momentumInsights) {
    return null;
  }

  const {
    buy_opportunities = [],
    sell_signals = [],
    sector_themes = [],
    momentum_summary = {}
  } = momentumInsights;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-5 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-500" />
          Tổng quan Động lượng Thị trường
        </h2>
        <div className="flex gap-2">
          <button
            className={`cursor-pointer px-3 py-1 rounded text-sm font-medium border transition-colors ${timeframe === '1D' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600'}`}
            onClick={() => onTimeframeChange('1D')}
          >
            Hàng ngày (1D)
          </button>
          <button
            className={`cursor-pointer px-3 py-1 rounded text-sm font-medium border transition-colors ${timeframe === '1W' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600'}`}
            onClick={() => onTimeframeChange('1W')}
          >
            Hàng tuần (1W)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Market Summary Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Thống kê Tổng quan
            <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
              {timeframe === '1D' ? 'Ngày' : 'Tuần'}
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {momentum_summary.improving_industries || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Ngành cải thiện</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                {momentum_summary.degrading_industries || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Ngành suy yếu</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {momentum_summary.improving_symbols || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Mã cải thiện</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {momentum_summary.degrading_symbols || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Mã suy yếu</div>
            </div>
          </div>
        </div>

        {/* Sector Themes */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Xu hướng Ngành
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
              {timeframe === '1D' ? 'Ngày' : 'Tuần'}
            </span>
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {sector_themes.map((theme, index) => (
              <div 
                key={index} 
                className="text-sm py-1.5 px-2 bg-white dark:bg-gray-600 rounded border border-gray-100 dark:border-gray-500 text-gray-700 dark:text-gray-200"
              >
                {theme}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buy Opportunities */}
      {buy_opportunities.length > 0 && (
        <div className="mt-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2 text-green-500" />
            Cơ hội Mua ({buy_opportunities.length} mã)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {buy_opportunities.map((opportunity, index) => (
              <div 
                key={index}
                className="border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base text-green-800 dark:text-green-300">
                    {opportunity.symbol}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    opportunity.priority === 'high' 
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' 
                      : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                  }`}>
                    {opportunity.priority === 'high' ? 'Cao' : 'TB'}
                  </span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2 space-y-1">
                  <div className="font-medium text-xs leading-relaxed">{opportunity.reason}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{opportunity.context}</div>
                </div>
                <div className="text-xs bg-white dark:bg-gray-700 p-2 rounded border border-gray-100 dark:border-gray-600 space-y-1">
                  <div className="font-mono text-gray-800 dark:text-gray-200">{opportunity.metrics}</div>
                  <div className="text-gray-500 dark:text-gray-400 capitalize">
                    Ngành: {opportunity.industry?.replace(/-/g, ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sell Signals */}
      {sell_signals.length > 0 && (
        <div className="mt-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
            Tín hiệu Bán ({sell_signals.length} mã)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sell_signals.map((signal, index) => (
              <div 
                key={index}
                className="border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg text-red-800">
                    {signal.symbol}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    signal.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {signal.priority === 'high' ? 'Cao' : 'Trung bình'}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  <div className="font-medium">{signal.reason}</div>
                  <div className="text-gray-600 mt-1">{signal.context}</div>
                </div>
                <div className="text-xs bg-white p-2 rounded border">
                  <div className="font-mono">{signal.metrics}</div>
                  <div className="text-gray-500 mt-1 capitalize">
                    Ngành: {signal.industry?.replace(/-/g, ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MomentumInsightsDashboard;