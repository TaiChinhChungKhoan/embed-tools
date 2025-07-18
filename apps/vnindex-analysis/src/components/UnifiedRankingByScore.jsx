import React from 'react';
import IndustryInfoPanelMinified from './rrg/IndustryInfoPanelMinified';
import GroupInfoPanelMinified from './rrg/GroupInfoPanelMinified';
import SymbolInfoPanelMinified from './rrg/SymbolInfoPanelMinified';

const UnifiedRankingByScore = ({ analysisData, type, getQuadrantColor, analyzeData }) => {
  // The analysisData is already at the insights.industries level, so access directly
  if (!analysisData?.top_performers?.length && !analysisData?.bottom_performers?.length) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Xếp hạng {type === 'industry' ? 'ngành' : type === 'group' ? 'nhóm' : 'cổ phiếu'} theo điểm số
        </h3>
        <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
        <p className="text-xs text-gray-400 mt-2">
          Debug: analysisData keys: {analysisData ? Object.keys(analysisData).join(', ') : 'null'}
        </p>
        <div className="text-xs text-gray-400 mt-2">
          <p>Array lengths:</p>
          <p>- top_performers: {Array.isArray(analysisData?.top_performers) ? analysisData.top_performers.length : typeof analysisData?.top_performers}</p>
          <p>- bottom_performers: {Array.isArray(analysisData?.bottom_performers) ? analysisData.bottom_performers.length : typeof analysisData?.bottom_performers}</p>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          <p>Sample data (first 2 items):</p>
          <p>- top_performers: {Array.isArray(analysisData?.top_performers) && analysisData.top_performers.length > 0 ? JSON.stringify(analysisData.top_performers.slice(0, 2)) : 'empty'}</p>
          <p>- bottom_performers: {Array.isArray(analysisData?.bottom_performers) && analysisData.bottom_performers.length > 0 ? JSON.stringify(analysisData.bottom_performers.slice(0, 2)) : 'empty'}</p>
        </div>
      </div>
    );
  }
  
  const typeLabels = {
    industry: {
      title: 'Xếp hạng ngành theo điểm số',
      topLabel: 'Ngành mạnh nhất',
      bottomLabel: 'Ngành yếu nhất',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      topTextColor: 'text-green-700',
      bottomTextColor: 'text-red-700'
    },
    group: {
      title: 'Xếp hạng nhóm vốn hóa theo điểm số',
      topLabel: 'Top nhóm vốn hóa mạnh nhất',
      bottomLabel: 'Top nhóm vốn hóa yếu nhất',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      topTextColor: 'text-blue-700',
      bottomTextColor: 'text-red-700'
    },
    ticker: {
      title: 'Xếp hạng cổ phiếu theo điểm số',
      topLabel: 'Cổ phiếu mạnh nhất',
      bottomLabel: 'Cổ phiếu yếu nhất',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-900',
      topTextColor: 'text-purple-700',
      bottomTextColor: 'text-red-700'
    }
  };

  const labels = typeLabels[type] || typeLabels.industry;

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
  
  return (
    <div className={`${labels.bgColor} border ${labels.borderColor} rounded-lg p-4`}>
      <h3 className={`text-lg font-semibold ${labels.textColor} mb-3`}>{labels.title}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        {analysisData.top_performers?.length > 0 && (
          <div>
            <h4 className={`font-medium ${labels.topTextColor} mb-2`}>{labels.topLabel}</h4>
            <div className="space-y-2">
              {analysisData.top_performers.slice(0, 10).map((item, index) => (
                <div key={index}>
                  {renderMinifiedPanel(item)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Performers */}
        {analysisData.bottom_performers?.length > 0 && (
          <div>
            <h4 className={`font-medium ${labels.bottomTextColor} mb-2`}>{labels.bottomLabel}</h4>
            <div className="space-y-2">
              {analysisData.bottom_performers.slice(0, 10).map((item, index) => (
                <div key={index}>
                  {renderMinifiedPanel(item)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedRankingByScore; 