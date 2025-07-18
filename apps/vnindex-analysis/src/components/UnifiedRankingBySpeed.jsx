import React from 'react';
import IndustryInfoPanelMinified from './rrg/IndustryInfoPanelMinified';
import GroupInfoPanelMinified from './rrg/GroupInfoPanelMinified';
import SymbolInfoPanelMinified from './rrg/SymbolInfoPanelMinified';

const UnifiedRankingBySpeed = ({ analysisData, type, renderInsightItems, rrgData, investmentStrategies, analyzeData }) => {
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

  // Helper function to render the appropriate minified panel
  const renderMinifiedPanel = (item) => {
    switch (type) {
      case 'industry':
        // For industries, we need to look up the full data from analyzeData using custom_id
        const fullIndustryData = analyzeData?.industries?.find(industry => 
          industry.custom_id === item.custom_id || industry.id === item.custom_id
        );
        return <IndustryInfoPanelMinified industry={fullIndustryData || item} />;
      case 'group':
        return <GroupInfoPanelMinified group={item} analyzeData={analyzeData} />;
      case 'ticker':
        return <SymbolInfoPanelMinified symbol={item} analyzeData={analyzeData} />;
      default:
        return null;
    }
  };

  // Renders RRG quadrant performer items with only relevant fields
  const renderRRGInsightItems = (items, quadrantKey) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return null;
    }
    return (
      <div className="space-y-2">
        {items.slice(0, 5).map((item, index) => (
          <div key={index}>
            {renderMinifiedPanel(item)}
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
              <div className="space-y-2">
                {analysisData.top_performers.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(analysisData.improving_momentum) && analysisData.improving_momentum.some(Boolean) && (
            <div>
              <h4 className="font-medium text-green-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} có động lượng cải thiện</h4>
              <div className="space-y-2">
                {analysisData.improving_momentum.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(analysisData.accumulation_candidates) && analysisData.accumulation_candidates.some(Boolean) && (
            <div>
              <h4 className="font-medium text-purple-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} tích lũy tiềm năng</h4>
              <div className="space-y-2">
                {analysisData.accumulation_candidates.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(analysisData.breakout_candidates) && analysisData.breakout_candidates.some(Boolean) && (
            <div>
              <h4 className="font-medium text-blue-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} có thể bứt phá</h4>
              <div className="space-y-2">
                {analysisData.breakout_candidates.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(analysisData.stealth_accumulation) && analysisData.stealth_accumulation.some(Boolean) && (
            <div>
              <h4 className="font-medium text-indigo-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} tích lũy âm thầm</h4>
              <div className="space-y-2">
                {analysisData.stealth_accumulation.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(analysisData.institutional_activity) && analysisData.institutional_activity.some(Boolean) && (
            <div>
              <h4 className="font-medium text-cyan-700 mb-2">Hoạt động tổ chức</h4>
              <div className="space-y-2">
                {analysisData.institutional_activity.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {Array.isArray(analysisData.bottom_performers) && analysisData.bottom_performers.some(Boolean) && (
            <div>
              <h4 className="font-medium text-red-800 mb-2">{type === 'ticker' ? 'Cổ phiếu yếu nhất' : type === 'group' ? 'Nhóm yếu nhất' : 'Ngành yếu nhất'}</h4>
              <div className="space-y-2">
                {analysisData.bottom_performers.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(analysisData.degrading_momentum) && analysisData.degrading_momentum.some(Boolean) && (
            <div>
              <h4 className="font-medium text-red-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} có động lượng suy giảm</h4>
              <div className="space-y-2">
                {analysisData.degrading_momentum.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(analysisData.distribution_candidates) && analysisData.distribution_candidates.some(Boolean) && (
            <div>
              <h4 className="font-medium text-orange-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} có thể phân phối</h4>
              <div className="space-y-2">
                {analysisData.distribution_candidates.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(analysisData.consolidation_candidates) && analysisData.consolidation_candidates.some(Boolean) && (
            <div>
              <h4 className="font-medium text-yellow-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} củng cố</h4>
              <div className="space-y-2">
                {analysisData.consolidation_candidates.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(analysisData.stealth_distribution) && analysisData.stealth_distribution.some(Boolean) && (
            <div>
              <h4 className="font-medium text-pink-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} phân phối âm thầm</h4>
              <div className="space-y-2">
                {analysisData.stealth_distribution.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(analysisData.falling_knife) && analysisData.falling_knife.some(Boolean) && (
            <div>
              <h4 className="font-medium text-red-800 mb-2">Dao rơi (tránh hoàn toàn)</h4>
              <div className="space-y-2">
                {analysisData.falling_knife.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(analysisData.high_volatility) && analysisData.high_volatility.some(Boolean) && (
            <div>
              <h4 className="font-medium text-orange-800 mb-2">Biến động cao</h4>
              <div className="space-y-2">
                {analysisData.high_volatility.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(analysisData.deteriorating_fundamentals) && analysisData.deteriorating_fundamentals.some(Boolean) && (
            <div>
              <h4 className="font-medium text-red-800 mb-2">Cơ bản suy giảm</h4>
              <div className="space-y-2">
                {analysisData.deteriorating_fundamentals.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    {renderMinifiedPanel(item)}
                  </div>
                ))}
              </div>
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