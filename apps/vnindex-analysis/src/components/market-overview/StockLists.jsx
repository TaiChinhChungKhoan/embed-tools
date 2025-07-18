import React, { useState } from 'react';
import { List, ChevronDown, ChevronRight } from 'lucide-react';

const StockLists = ({ topSectors, bottomSectors, industries }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <button
        onClick={toggleExpanded}
        className="w-full p-2 text-left flex items-center justify-between hover:bg-gray-50"
      >
        <div className="flex items-center">
          <List className="w-3 h-3 mr-1 text-gray-600" />
          <span className="font-medium text-gray-900 text-xs">Danh sách cổ phiếu</span>
        </div>
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      
      {expanded && (
        <div className="px-2 pb-2 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            <div className="bg-green-50 p-2 rounded">
              <div className="font-medium text-xs text-green-700 mb-1">Top Gainers</div>
              <div className="text-xs text-gray-600">
                {topSectors.slice(0, 5).map((sector, index) => (
                  <div key={sector.custom_id || sector.id} className="flex justify-between py-1">
                    <span>{sector.name}</span>
                    <span className="font-medium text-green-600">
                      {sector.metrics?.current_rs ? `${(sector.metrics.current_rs * 100).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-red-50 p-2 rounded">
              <div className="font-medium text-xs text-red-700 mb-1">Top Losers</div>
              <div className="text-xs text-gray-600">
                {bottomSectors.slice(0, 5).map((sector, index) => (
                  <div key={sector.custom_id || sector.id} className="flex justify-between py-1">
                    <span>{sector.name}</span>
                    <span className="font-medium text-red-600">
                      {sector.metrics?.current_rs ? `${(sector.metrics.current_rs * 100).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-medium text-xs text-blue-700 mb-1">High Momentum</div>
              <div className="text-xs text-gray-600">
                {industries?.filter(sector => sector.metrics?.current_rs > 0.1).slice(0, 5).map((sector, index) => (
                  <div key={sector.custom_id || sector.id} className="flex justify-between py-1">
                    <span>{sector.name}</span>
                    <span className="font-medium text-blue-600">
                      {sector.metrics?.current_rs ? `${(sector.metrics.current_rs * 100).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockLists; 