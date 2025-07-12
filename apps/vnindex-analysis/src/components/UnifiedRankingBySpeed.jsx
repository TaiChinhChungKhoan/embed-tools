import React from 'react';

const UnifiedRankingBySpeed = ({ analysisData, type, renderInsightItems, rrgData, investmentStrategies }) => {
  if (!analysisData) return null;
  
  // The analysisData is already at the insights.industries level, so access directly
  // Check if we have any data to show with standardized structure
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
    falling_knife: analysisData.falling_knife,
    top_performers: analysisData.top_performers,
    bottom_performers: analysisData.bottom_performers
  };

  const hasAnyData = Object.values(dataArrays).some(data => data && (Array.isArray(data) ? data.length > 0 : data));

  // Check if we have group strategy data (only for groups)
  const hasGroupStrategy = type === 'group' && (
    investmentStrategies?.group_strategy?.group_rotation_signals?.length > 0 ||
    investmentStrategies?.group_strategy?.group_allocation?.length > 0 ||
    investmentStrategies?.group_strategy?.group_risk_warnings?.length > 0
  );

  if (!hasAnyData && !hasGroupStrategy) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Xếp hạng {type === 'industry' ? 'ngành' : type === 'group' ? 'nhóm' : 'cổ phiếu'} theo tốc độ/hướng
        </h3>
        <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
        <p className="text-xs text-gray-400 mt-2">
          Debug: analysisData keys: {analysisData ? Object.keys(analysisData).join(', ') : 'null'}
        </p>
        <p className="text-xs text-gray-400">
          Debug: hasAnyData: {hasAnyData.toString()}, hasGroupStrategy: {hasGroupStrategy.toString()}
        </p>
        <div className="text-xs text-gray-400 mt-2">
          <p>Array lengths:</p>
          {Object.entries(dataArrays).map(([key, value]) => (
            <p key={key}>- {key}: {Array.isArray(value) ? value.length : typeof value}</p>
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          <p>Sample data (first 2 items):</p>
          {Object.entries(dataArrays).slice(0, 3).map(([key, value]) => (
            <p key={key}>- {key}: {Array.isArray(value) && value.length > 0 ? JSON.stringify(value.slice(0, 2)) : 'empty'}</p>
          ))}
        </div>
      </div>
    );
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
  
  return (
    <div className={`${labels.bgColor} border ${labels.borderColor} rounded-lg p-4`}>
      <h3 className={`text-lg font-semibold ${labels.textColor} mb-3`}>{labels.title}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Positive Momentum */}
        <div className="space-y-4">
          {/* Improving Momentum */}
          {analysisData.improving_momentum?.length > 0 && (
            <div>
              <h4 className="font-medium text-green-700 mb-2">Các {typeName} có động lượng cải thiện</h4>
              {renderInsightItems(analysisData.improving_momentum, `${typeName} có động lượng cải thiện`)}
            </div>
          )}

          {/* Breakout Candidates */}
          {analysisData.breakout_candidates?.length > 0 && (
            <div>
              <h4 className="font-medium text-blue-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} có thể bứt phá</h4>
              {renderInsightItems(analysisData.breakout_candidates, `${typeName} có thể bứt phá`)}
            </div>
          )}

          {/* Accumulation Candidates */}
          {analysisData.accumulation_candidates?.length > 0 && (
            <div>
              <h4 className="font-medium text-purple-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} tích lũy tiềm năng</h4>
              {renderInsightItems(analysisData.accumulation_candidates, `${typeName} tích lũy tiềm năng`)}
            </div>
          )}

          {/* Stealth Accumulation */}
          {analysisData.stealth_accumulation?.length > 0 && (
            <div>
              <h4 className="font-medium text-indigo-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} tích lũy âm thầm</h4>
              {renderInsightItems(analysisData.stealth_accumulation, `${typeName} tích lũy âm thầm`)}
            </div>
          )}

          {/* Institutional Activity */}
          {analysisData.institutional_activity?.length > 0 && (
            <div>
              <h4 className="font-medium text-cyan-700 mb-2">Hoạt động tổ chức</h4>
              {renderInsightItems(analysisData.institutional_activity, 'hoạt động tổ chức')}
            </div>
          )}
        </div>

        {/* Right Column - Negative Momentum */}
        <div className="space-y-4">
          {/* Degrading Momentum */}
          {analysisData.degrading_momentum?.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-2">Các {typeName} có động lượng suy giảm</h4>
              {renderInsightItems(analysisData.degrading_momentum, `${typeName} có động lượng suy giảm`)}
            </div>
          )}

          {/* Distribution Candidates */}
          {analysisData.distribution_candidates?.length > 0 && (
            <div>
              <h4 className="font-medium text-orange-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} có thể phân phối</h4>
              {renderInsightItems(analysisData.distribution_candidates, `${typeName} có thể phân phối`)}
            </div>
          )}

          {/* Consolidation Candidates */}
          {analysisData.consolidation_candidates?.length > 0 && (
            <div>
              <h4 className="font-medium text-yellow-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} củng cố</h4>
              {renderInsightItems(analysisData.consolidation_candidates, `${typeName} củng cố`)}
            </div>
          )}

          {/* Stealth Distribution */}
          {analysisData.stealth_distribution?.length > 0 && (
            <div>
              <h4 className="font-medium text-pink-700 mb-2">{typeName.charAt(0).toUpperCase() + typeName.slice(1)} phân phối âm thầm</h4>
              {renderInsightItems(analysisData.stealth_distribution, `${typeName} phân phối âm thầm`)}
            </div>
          )}

          {/* Risk Categories */}
          {analysisData.falling_knife?.length > 0 && (
            <div>
              <h4 className="font-medium text-red-800 mb-2">Dao rơi (tránh hoàn toàn)</h4>
              {renderInsightItems(analysisData.falling_knife, 'dao rơi')}
            </div>
          )}

          {analysisData.high_volatility?.length > 0 && (
            <div>
              <h4 className="font-medium text-orange-800 mb-2">Biến động cao</h4>
              {renderInsightItems(analysisData.high_volatility, 'biến động cao')}
            </div>
          )}

          {analysisData.deteriorating_fundamentals?.length > 0 && (
            <div>
              <h4 className="font-medium text-red-800 mb-2">Cơ bản suy giảm</h4>
              {renderInsightItems(analysisData.deteriorating_fundamentals, 'cơ bản suy giảm')}
            </div>
          )}
        </div>
      </div>

      {/* Group Strategy Section - Only for groups */}
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
};

export default UnifiedRankingBySpeed; 