import React from 'react';

export default function GroupRankingByScore({ groupAnalysis, getQuadrantColor }) {
  if (!groupAnalysis || !groupAnalysis.group_performers) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xếp hạng nhóm vốn hóa theo điểm số</h3>
        <div className="text-gray-500 text-center py-8">
          Không có dữ liệu phân tích nhóm vốn hóa
        </div>
      </div>
    );
  }

  const { top_groups, bottom_groups } = groupAnalysis.group_performers;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Xếp hạng nhóm vốn hóa theo điểm số</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Groups */}
        <div>
          <h4 className="font-medium text-green-600 mb-3">Top nhóm vốn hóa mạnh nhất</h4>
          <div className="space-y-2">
            {top_groups && top_groups.length > 0 ? (
              top_groups.slice(0, 5).map((group, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded border">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {group?.name || 'Unknown'}
                        {group?.custom_id && ` (${group.custom_id})`}
                      </div>
                      <div className={`text-sm ${getQuadrantColor(group?.quadrant)}`}>
                        {group?.quadrant || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      {(group?.strength_score || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      RS: {(group?.current_rs || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">Không có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Bottom Groups */}
        <div>
          <h4 className="font-medium text-red-600 mb-3">Top nhóm vốn hóa yếu nhất</h4>
          <div className="space-y-2">
            {bottom_groups && bottom_groups.length > 0 ? (
              bottom_groups.slice(0, 5).map((group, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded border">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {group?.name || 'Unknown'}
                        {group?.custom_id && ` (${group.custom_id})`}
                      </div>
                      <div className={`text-sm ${getQuadrantColor(group?.quadrant)}`}>
                        {group?.quadrant || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-600">
                      {(group?.strength_score || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      RS: {(group?.current_rs || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 