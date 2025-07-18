import React, { useState, useEffect } from 'react';
import IndustryInfoPanel from './IndustryInfoPanel';
import SymbolInfoPanel from './SymbolInfoPanel';
import GroupInfoPanel from './GroupInfoPanel';

// Detailed Information Panel Component
export default function DetailedInfoPanel({ 
  selectedItems, 
  hoveredPoint, 
  mousePosition, 
  onClose, 
  getSeriesColor, 
  type, 
  timeframe,
  availableIndustries, 
  availableGroups 
}) {
  // If no items are selected, don't show anything
  if (!selectedItems || selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      {selectedItems.map((item, index) => {
        // Find the actual data for this item
        let itemData = null;
        
        if (item.type === 'industry') {
          // For industries, the item already contains the full analytics data
          itemData = item;
        } else if (item.type === 'group') {
          // For groups, the item already contains the full analytics data
          itemData = item;
        } else if (item.type === 'symbol') {
          // For symbols, the item already contains the full analytics data
          itemData = item;
        }

        if (!itemData) {
          return (
            <div key={`${item.type}-${item.custom_id || item.id}-${index}`} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-center py-4">
                <div className="text-yellow-600 font-medium">Không có dữ liệu</div>
                <div className="text-yellow-500 text-sm mt-1">
                  Không tìm thấy dữ liệu cho {item.type === 'symbol' ? 'cổ phiếu' : item.type === 'group' ? 'nhóm' : 'ngành'}: {item.name || item.custom_id || item.id}
                </div>

              </div>
            </div>
          );
        }

        return (
          <div key={`${item.type}-${item.custom_id || item.id}-${index}`} className="p-4 bg-white border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin chi tiết - {item.type === 'symbol' ? 'Cổ phiếu' : item.type === 'group' ? 'Nhóm vốn hóa' : 'Ngành nghề'}: {item.name || item.custom_id || item.id}
            </h2>
            <div className="space-y-4">
              {item.type === 'symbol' ? (
                <SymbolInfoPanel key={`${item.id}-${timeframe}-${index}`} symbol={itemData} timeframe={timeframe} />
              ) : item.type === 'group' ? (
                <GroupInfoPanel key={`${item.custom_id}-${timeframe}-${index}`} group={itemData} timeframe={timeframe} />
              ) : (
                <IndustryInfoPanel key={`${item.custom_id}-${timeframe}-${index}`} industry={itemData} timeframe={timeframe} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}; 

