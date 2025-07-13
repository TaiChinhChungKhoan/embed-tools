import React from 'react';

const UnifiedRankingBySpeed = ({ analysisData, type, renderInsightItems, rrgData, investmentStrategies }) => {
  if (!analysisData) return null;
  
  // The analysisData is already at the insights.industries level, so access directly
  // Check if we have any data to show with standardized structure
  // Only include momentum-related fields for hasAnyData
  const dataArrays = {
    improving_momentum: analysisData.improving_momentum,
    degrading_momentum: analysisData.degrading_momentum,
    breakout_candidates: analysisData.breakout_candidates,
    accumulation_candidates: analysisData.accumulation_candidates,
    distribution_candidates: analysisData.distribution_candidates,
    consolidation_candidates: analysisData.consolidation_candidates,
    stealth_accumulation: analysisData.stealth_accumulation,
    stealth_distribution: analysisData.stealth_distribution,
    institutional_activity: analysisData.institutional_activity,
    high_volatility: analysisData.high_volatility,
    deteriorating_fundamentals: analysisData.deteriorating_fundamentals,
    falling_knife: analysisData.falling_knife
    // top_performers and bottom_performers are excluded
  };

  const hasAnyData = Object.values(dataArrays).some(arr => Array.isArray(arr) && arr.some(Boolean));

  // Check if we have group strategy data (only for groups)
  const hasGroupStrategy = type === 'group' && (
    investmentStrategies?.group_strategy?.group_rotation_signals?.length > 0 ||
    investmentStrategies?.group_strategy?.group_allocation?.length > 0 ||
    investmentStrategies?.group_strategy?.group_risk_warnings?.length > 0
  );

  if (!hasAnyData && !hasGroupStrategy) {
    return null;
  }

  const typeLabels = {
    industry: {
      title: 'Xếp hạng ngành theo tốc độ/hướng',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900'
    },
    group: {
      title: 'Xếp hạng nhóm vốn hóa theo tốc độ',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900'
    },
    ticker: {
      title: 'Xếp hạng cổ phiếu theo tốc độ/hướng',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-900'
    }
  };

  const labels = typeLabels[type] || typeLabels.industry;
  const typeName = type === 'industry' ? 'ngành' : type === 'group' ? 'nhóm' : 'cổ phiếu';
  
  const hasPositiveData = [
    analysisData.improving_momentum,
    analysisData.breakout_candidates,
    analysisData.accumulation_candidates,
    analysisData.stealth_accumulation,
    analysisData.institutional_activity,
    analysisData.top_performers
  ].some(arr => Array.isArray(arr) && arr.length > 0);

  const hasNegativeData = [
    analysisData.degrading_momentum,
    analysisData.distribution_candidates,
    analysisData.consolidation_candidates,
    analysisData.stealth_distribution,
    analysisData.falling_knife,
    analysisData.high_volatility,
    analysisData.deteriorating_fundamentals,
    analysisData.bottom_performers
  ].some(arr => Array.isArray(arr) && arr.length > 0);

  // Renders RRG quadrant performer items with only relevant fields
  const renderRRGInsightItems = (items, quadrantKey) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return null;
    }
    return (
      <div className="space-y-2">
        {items.slice(0, 5).map((item, index) => (
          <div key={index} className="bg-white p-3 rounded border">
            <div className="flex justify-between items-start gap-2">
              {/* Left: Main info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {item?.name || item?.symbol || 'Unknown'}
                </div>
                {item?.speed_category && (
                  <div className="text-sm text-gray-600 truncate">{item.speed_category}</div>
                )}
                {item?.direction && (
                  <div className="text-xs text-gray-700 truncate">{item.direction}</div>
                )}
              </div>
              {/* Right: Key metrics */}
              <div className="flex flex-col items-end min-w-[80px]">
                {typeof item.velocity === 'number' && (
                  <div className="text-base font-semibold text-purple-700 leading-tight">{item.velocity.toFixed(2)}</div>
                )}
                {item?.trajectory_strength && (
                  <div className="text-xs text-blue-700 mt-1 whitespace-nowrap">{item.trajectory_strength}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render sections for all types
  return (
    <div className={`${labels.bgColor} border ${labels.borderColor} rounded-lg p-4`}>
      <h3 className={`text-lg font-semibold ${labels.textColor} mb-3`}>{labels.title}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {Array.isArray(analysisData.top_performers) && analysisData.top_performers.some(Boolean) && (
            <div>
              <h4 className="font-medium text-green-800 mb-2">{type === 'ticker' ? 'Top cổ phiếu mạnh nhất' : type === 'group' ? 'Top nhóm mạnh nhất' : 'Top ngành mạnh nhất'}</h4>
              {renderInsightItems(analysisData.top_performers, 'Top performers')}
            </div>
          )}
          {Array.isArray(analysisData.improving_momentum) && analysisData.improving_momentum.some(Boolean) && (
            <div>
              <h4 className="font-medium text-green-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} có động lượng cải thiện</h4>
              {renderInsightItems(analysisData.improving_momentum, `${typeName} có động lượng cải thiện`)}
            </div>
          )}
          {Array.isArray(analysisData.accumulation_candidates) && analysisData.accumulation_candidates.some(Boolean) && (
            <div>
              <h4 className="font-medium text-purple-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} tích lũy tiềm năng</h4>
              {renderInsightItems(analysisData.accumulation_candidates, `${typeName} tích lũy tiềm năng`)}
            </div>
          )}
          {Array.isArray(analysisData.breakout_candidates) && analysisData.breakout_candidates.some(Boolean) && (
            <div>
              <h4 className="font-medium text-blue-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} có thể bứt phá</h4>
              {renderInsightItems(analysisData.breakout_candidates, `${typeName} có thể bứt phá`)}
            </div>
          )}
          {Array.isArray(analysisData.stealth_accumulation) && analysisData.stealth_accumulation.some(Boolean) && (
            <div>
              <h4 className="font-medium text-indigo-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} tích lũy âm thầm</h4>
              {renderInsightItems(analysisData.stealth_accumulation, `${typeName} tích lũy âm thầm`)}
            </div>
          )}
          {Array.isArray(analysisData.institutional_activity) && analysisData.institutional_activity.some(Boolean) && (
            <div>
              <h4 className="font-medium text-cyan-700 mb-2">Hoạt động tổ chức</h4>
              {renderInsightItems(analysisData.institutional_activity, 'Hoạt động tổ chức')}
            </div>
          )}
        </div>
        <div className="space-y-4">
          {Array.isArray(analysisData.bottom_performers) && analysisData.bottom_performers.some(Boolean) && (
            <div>
              <h4 className="font-medium text-red-800 mb-2">{type === 'ticker' ? 'Cổ phiếu yếu nhất' : type === 'group' ? 'Nhóm yếu nhất' : 'Ngành yếu nhất'}</h4>
              {renderInsightItems(analysisData.bottom_performers, 'Bottom performers')}
            </div>
          )}
          {Array.isArray(analysisData.degrading_momentum) && analysisData.degrading_momentum.some(Boolean) && (
            <div>
              <h4 className="font-medium text-red-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} có động lượng suy giảm</h4>
              {renderInsightItems(analysisData.degrading_momentum, `${typeName} có động lượng suy giảm`)}
            </div>
          )}
          {Array.isArray(analysisData.distribution_candidates) && analysisData.distribution_candidates.some(Boolean) && (
            <div>
              <h4 className="font-medium text-orange-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} có thể phân phối</h4>
              {renderInsightItems(analysisData.distribution_candidates, `${typeName} có thể phân phối`)}
            </div>
          )}
          {Array.isArray(analysisData.consolidation_candidates) && analysisData.consolidation_candidates.some(Boolean) && (
            <div>
              <h4 className="font-medium text-yellow-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} củng cố</h4>
              {renderInsightItems(analysisData.consolidation_candidates, `${typeName} củng cố`)}
            </div>
          )}
          {Array.isArray(analysisData.stealth_distribution) && analysisData.stealth_distribution.some(Boolean) && (
            <div>
              <h4 className="font-medium text-pink-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} phân phối âm thầm</h4>
              {renderInsightItems(analysisData.stealth_distribution, `${typeName} phân phối âm thầm`)}
            </div>
          )}
          {Array.isArray(analysisData.falling_knife) && analysisData.falling_knife.some(Boolean) && (
            <div>
              <h4 className="font-medium text-red-800 mb-2">Dao rơi (tránh hoàn toàn)</h4>
              {renderInsightItems(analysisData.falling_knife, 'Dao rơi')}
            </div>
          )}
          {Array.isArray(analysisData.high_volatility) && analysisData.high_volatility.some(Boolean) && (
            <div>
              <h4 className="font-medium text-orange-800 mb-2">Biến động cao</h4>
              {renderInsightItems(analysisData.high_volatility, 'Biến động cao')}
            </div>
          )}
          {Array.isArray(analysisData.deteriorating_fundamentals) && analysisData.deteriorating_fundamentals.some(Boolean) && (
            <div>
              <h4 className="font-medium text-red-800 mb-2">Cơ bản suy giảm</h4>
              {renderInsightItems(analysisData.deteriorating_fundamentals, 'Cơ bản suy giảm')}
            </div>
          )}
        </div>
      </div>
      {/* RRG Performers Quadrants */}
      {analysisData.rrg_performers && (
        <div className="mt-6">
          <h4 className="font-medium text-blue-700 mb-3">RRG Quadrants</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: 'leading_quadrant', label: 'Leading (Dẫn dắt)' },
              { key: 'lagging_quadrant', label: 'Lagging (Tụt hậu)' },
              { key: 'improving_quadrant', label: 'Improving (Cải thiện)' },
              { key: 'weakening_quadrant', label: 'Weakening (Suy yếu)' }
            ].map(({ key, label }) =>
              Array.isArray(analysisData.rrg_performers[key]) && analysisData.rrg_performers[key].some(Boolean) && (
                <div key={key}>
                  <h5 className="font-semibold mb-2">{label}</h5>
                  {renderRRGInsightItems(analysisData.rrg_performers[key], key)}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedRankingBySpeed; 