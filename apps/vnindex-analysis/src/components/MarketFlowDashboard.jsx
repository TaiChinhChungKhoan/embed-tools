import React from 'react';
import { useDataLoader } from '../utils/dataLoader';
import Card from './Card';
import { getSentimentColor } from './detailed-analysis/utils/colorUtils';
import SectorRotation from './detailed-analysis/sections/SectorRotation';
import MarketCapFlow from './detailed-analysis/sections/MarketCapFlow';



// Main Market Flow Dashboard Component
const MarketFlowDashboard = () => {
  const { data: analyticsData, loading, error } = useDataLoader('RRG_ANALYSIS', '1D');
  
  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Đang tải dữ liệu dòng tiền thị trường...</div>
        </div>
      </Card>
    );
  }

  if (error || !analyticsData) {
    return (
      <Card>
        <div className="text-center text-gray-500 space-y-2">
          {error ? (
            <div>
              <div className="text-red-600 font-medium">Lỗi tải dữ liệu dòng tiền:</div>
              <div className="text-sm">{error}</div>
            </div>
          ) : (
            <div>
              <div className="font-medium">Trạng thái dữ liệu dòng tiền:</div>
              <div className="text-sm space-y-1">
                <div>• Có dữ liệu Analytics: {analyticsData ? '✅' : '❌'}</div>
                {analyticsData && <div>• Khóa dữ liệu: {Object.keys(analyticsData).join(', ')}</div>}
                {analyticsData?.insights && <div>• Insights có: {Object.keys(analyticsData.insights).join(', ')}</div>}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Extract detailed analysis data
  const detailedAnalysis = analyticsData?.insights?.detailed_analysis || {};
  const sectorRotation = detailedAnalysis.sector_rotation;
  const marketCapFlow = detailedAnalysis.market_cap_flow;

  // Check if we have any market flow data
  if (!sectorRotation && !marketCapFlow) {
    return (
      <Card>
        <div className="text-center text-gray-500 space-y-2">
          <div className="font-medium">Không có dữ liệu dòng tiền thị trường</div>
          <div className="text-sm space-y-1">
            <div>• Sector Rotation: {sectorRotation ? '✅' : '❌'}</div>
            <div>• Market Cap Flow: {marketCapFlow ? '✅' : '❌'}</div>
            <div>• Detailed Analysis Keys: {Object.keys(detailedAnalysis).join(', ')}</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sector Rotation Analysis */}
      {sectorRotation && <SectorRotation sectorRotation={sectorRotation} />}

      {/* Market Cap Flow Analysis */}
      {marketCapFlow && <MarketCapFlow marketCapFlow={marketCapFlow} />}
    </div>
  );
};

export default MarketFlowDashboard; 