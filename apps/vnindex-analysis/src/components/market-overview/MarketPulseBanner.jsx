import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MarketPulseBanner = ({ marketOverview, marketHealthScore }) => {
  // Helper function to get trend icon and color
  const getTrendIcon = (trend) => {
    if (trend?.includes('Up') || trend?.includes('Tăng')) return { icon: TrendingUp, color: 'text-green-600' };
    if (trend?.includes('Down') || trend?.includes('Giảm')) return { icon: TrendingDown, color: 'text-red-600' };
    return { icon: Minus, color: 'text-gray-600' };
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-900">{marketHealthScore}%</div>
            <div className="text-xs text-blue-700">Sức khỏe thị trường</div>
          </div>
          <div className="h-10 w-1 bg-blue-200"></div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {marketOverview.market_regime?.regime || 'Trạng thái thị trường'}
            </div>
            <div className="text-xs text-gray-600">
              {marketOverview.market_regime?.description || 'Mô tả trạng thái hiện tại'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-600">Xu hướng tổng thể</div>
          <div className="flex items-center space-x-1">
            {(() => {
              const { icon: TrendIcon, color } = getTrendIcon(marketOverview.market_regime?.regime);
              return <TrendIcon className={`w-4 h-4 ${color}`} />;
            })()}
            <span className="text-sm font-semibold text-gray-900">
              {marketOverview.market_regime?.regime?.includes('Bull') ? 'Tăng' : 
               marketOverview.market_regime?.regime?.includes('Bear') ? 'Giảm' : 'Đi ngang'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulseBanner; 