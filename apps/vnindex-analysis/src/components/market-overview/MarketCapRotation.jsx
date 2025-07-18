import React from 'react';
import { Users } from 'lucide-react';

const MarketCapRotation = ({ marketOverview }) => {
  if (!marketOverview.market_health?.market_cap_rotation) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2">
      <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
        <Users className="w-3 h-3 mr-1 text-purple-600" />
        Luân chuyển vốn hóa thị trường
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {marketOverview.market_health.market_cap_rotation.large_cap && (
          <div className="border-l-4 border-blue-500 pl-2">
            <div className="font-medium text-xs">{marketOverview.market_health.market_cap_rotation.large_cap.name}</div>
            <div className={`text-xs ${marketOverview.market_health.market_cap_rotation.large_cap.performance === 'Vượt trội' ? 'text-green-600' : 'text-red-600'}`}>
              {marketOverview.market_health.market_cap_rotation.large_cap.performance}
            </div>
            <div className="text-xs text-gray-500">
              {marketOverview.market_health.market_cap_rotation.large_cap.interpretation}
            </div>
          </div>
        )}
        {marketOverview.market_health.market_cap_rotation.mid_cap && (
          <div className="border-l-4 border-yellow-500 pl-2">
            <div className="font-medium text-xs">{marketOverview.market_health.market_cap_rotation.mid_cap.name}</div>
            <div className={`text-xs ${marketOverview.market_health.market_cap_rotation.mid_cap.performance === 'Vượt trội' ? 'text-green-600' : 'text-red-600'}`}>
              {marketOverview.market_health.market_cap_rotation.mid_cap.performance}
            </div>
            <div className="text-xs text-gray-500">
              {marketOverview.market_health.market_cap_rotation.mid_cap.interpretation}
            </div>
          </div>
        )}
        {marketOverview.market_health.market_cap_rotation.small_cap && (
          <div className="border-l-4 border-red-500 pl-2">
            <div className="font-medium text-xs">{marketOverview.market_health.market_cap_rotation.small_cap.name}</div>
            <div className={`text-xs ${marketOverview.market_health.market_cap_rotation.small_cap.performance === 'Vượt trội' ? 'text-green-600' : 'text-red-600'}`}>
              {marketOverview.market_health.market_cap_rotation.small_cap.performance}
            </div>
            <div className="text-xs text-gray-500">
              {marketOverview.market_health.market_cap_rotation.small_cap.interpretation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketCapRotation; 