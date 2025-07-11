import React from 'react';

export default function GroupRankingBySpeed({ groupAnalysis, renderInsightItems, rrgData, investmentStrategies }) {
  if (!groupAnalysis) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xếp hạng nhóm vốn hóa theo tốc độ</h3>
        <div className="text-gray-500 text-center py-8">
          Không có dữ liệu phân tích nhóm vốn hóa
        </div>
      </div>
    );
  }

  const { group_momentum, group_performers } = groupAnalysis;
  
  // Check if we have any data to show
  const hasMomentumData = group_momentum?.momentum_leaders?.groups?.length > 0 ||
                         group_momentum?.accumulation_candidates?.groups?.length > 0 ||
                         group_momentum?.stealth_accumulation?.groups?.length > 0 ||
                         group_momentum?.breakout_candidates?.groups?.length > 0;
  
  const hasPerformerData = group_performers?.top_groups?.length > 0 || 
                          group_performers?.bottom_groups?.length > 0;

  // Check if we have group strategy data
  const hasGroupStrategy = investmentStrategies?.group_strategy?.group_rotation_signals?.length > 0 ||
                          investmentStrategies?.group_strategy?.group_allocation?.length > 0 ||
                          investmentStrategies?.group_strategy?.group_risk_warnings?.length > 0;

  // If no data at all, show empty state
  if (!hasMomentumData && !hasPerformerData && !hasGroupStrategy) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xếp hạng nhóm vốn hóa theo tốc độ</h3>
        <div className="text-gray-500 text-center py-8">
          Không có dữ liệu phân tích động lượng nhóm vốn hóa
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Xếp hạng nhóm vốn hóa theo tốc độ</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Momentum Leaders - Only show if has data */}
        {group_momentum?.momentum_leaders?.groups?.length > 0 && (
          <div>
            <h4 className="font-medium text-blue-600 mb-3">Các nhóm có động lượng mạnh nhất</h4>
            {renderInsightItems(group_momentum.momentum_leaders.groups, 'group')}
          </div>
        )}

        {/* Accumulation Candidates - Only show if has data */}
        {group_momentum?.accumulation_candidates?.groups?.length > 0 && (
          <div>
            <h4 className="font-medium text-green-600 mb-3">Ứng viên tích lũy</h4>
            {renderInsightItems(group_momentum.accumulation_candidates.groups, 'group')}
          </div>
        )}

        {/* Stealth Accumulation - Only show if has data */}
        {group_momentum?.stealth_accumulation?.groups?.length > 0 && (
          <div>
            <h4 className="font-medium text-purple-600 mb-3">Tích lũy âm thầm</h4>
            {renderInsightItems(group_momentum.stealth_accumulation.groups, 'group')}
          </div>
        )}

        {/* Breakout Candidates - Only show if has data */}
        {group_momentum?.breakout_candidates?.groups?.length > 0 && (
          <div>
            <h4 className="font-medium text-orange-600 mb-3">Ứng viên đột phá</h4>
            {renderInsightItems(group_momentum.breakout_candidates.groups, 'group')}
          </div>
        )}

        {/* Top Performers - Use available data */}
        {group_performers?.top_groups?.length > 0 && (
          <div>
            <h4 className="font-medium text-green-600 mb-3">Top nhóm vốn hóa mạnh nhất</h4>
            <div className="space-y-2">
              {group_performers.top_groups.slice(0, 5).map((group, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{group.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{group.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{group.rrg_position}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {(group.strength_score || 0).toFixed(3)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Điểm mạnh</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Performers - Use available data */}
        {group_performers?.bottom_groups?.length > 0 && (
          <div>
            <h4 className="font-medium text-red-600 mb-3">Nhóm vốn hóa yếu nhất</h4>
            <div className="space-y-2">
              {group_performers.bottom_groups.slice(0, 5).map((group, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{group.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{group.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{group.rrg_position}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">
                        {(group.strength_score || 0).toFixed(3)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Điểm yếu</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Group Strategy Section */}
      {hasGroupStrategy && (
        <div className="mt-6">
          <h4 className="font-medium text-orange-600 mb-3">Chiến lược nhóm vốn hóa</h4>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="space-y-2">
              {investmentStrategies.group_strategy.group_rotation_signals?.map((point, index) => (
                <div key={index} className="text-sm text-gray-700">• {point}</div>
              ))}
              {investmentStrategies.group_strategy.group_allocation?.map((point, index) => (
                <div key={index} className="text-sm text-gray-700">• {point}</div>
              ))}
              {investmentStrategies.group_strategy.group_risk_warnings?.map((point, index) => (
                <div key={index} className="text-sm text-gray-700">• {point}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 