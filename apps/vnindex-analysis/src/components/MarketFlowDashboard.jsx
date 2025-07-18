import React from 'react';
import { useDataLoader } from '../utils/dataLoader';
import Card from './Card';
import { getSentimentColor } from './detailed-analysis/utils/colorUtils';
import SectorRotation from './detailed-analysis/sections/SectorRotation';
import MarketCapFlow from './detailed-analysis/sections/MarketCapFlow';
import InstitutionalFlow from './detailed-analysis/sections/InstitutionalFlow';



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
    return null;
  }

  // Extract detailed analysis data
  const detailedAnalysis = analyticsData?.insights?.detailed_analysis || {};
  const sectorRotation = detailedAnalysis.sector_rotation;
  const marketCapFlow = detailedAnalysis.market_cap_flow;
  const institutionalFlow = detailedAnalysis.institutional_flow;

  // Check if we have any market flow data
  if (!sectorRotation && !marketCapFlow && !institutionalFlow) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Sector Rotation Analysis */}
      {sectorRotation && <SectorRotation sectorRotation={sectorRotation} />}

      {/* Market Cap Flow Analysis */}
      {marketCapFlow && <MarketCapFlow marketCapFlow={marketCapFlow} />}

      {/* Institutional Flow Analysis */}
      {institutionalFlow && <InstitutionalFlow institutionalFlow={institutionalFlow} />}
    </div>
  );
};

export default MarketFlowDashboard; 