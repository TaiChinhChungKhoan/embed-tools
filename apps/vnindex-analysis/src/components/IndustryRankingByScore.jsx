import React from 'react';

const IndustryRankingByScore = ({ industryAnalysis, getQuadrantColor }) => {
  if (!industryAnalysis?.sector_performers) return null;
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-green-900 mb-3">Xếp hạng ngành theo điểm số</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Industries */}
        {industryAnalysis.sector_performers.top_industries?.length > 0 && (
          <div>
            <h4 className="font-medium text-green-700 mb-2">Top 10 ngành mạnh nhất</h4>
            <div className="space-y-2">
              {industryAnalysis.sector_performers.top_industries.slice(0, 10).map((industry, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{industry?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-600 mt-1">{industry?.description || 'N/A'}</div>
                      <div className={`text-xs mt-1 ${getQuadrantColor(industry?.rrg_position)}`}>
                        {industry?.rrg_position || 'N/A'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{(industry?.strength_score || 0).toFixed(2)}</div>
                      <div className="text-xs text-gray-500 mt-1">{industry?.money_flow || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Industries */}
        {industryAnalysis.sector_performers.bottom_industries?.length > 0 && (
          <div>
            <h4 className="font-medium text-red-700 mb-2">Top 10 ngành yếu nhất</h4>
            <div className="space-y-2">
              {industryAnalysis.sector_performers.bottom_industries.slice(0, 10).map((industry, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{industry?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-600 mt-1">{industry?.description || 'N/A'}</div>
                      <div className={`text-xs mt-1 ${getQuadrantColor(industry?.rrg_position)}`}>
                        {industry?.rrg_position || 'N/A'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">{(industry?.strength_score || 0).toFixed(2)}</div>
                      <div className="text-xs text-gray-500 mt-1">{industry?.money_flow || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryRankingByScore; 