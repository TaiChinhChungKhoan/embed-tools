import React from 'react';
import { useDataLoader } from '../utils/dataLoader';
import VolatilityRegimeDashboard from './detailed-analysis/sections/VolatilityRegimeDashboard';

// Main Market Overview Dashboard Component
const MarketOverviewDashboard = () => {
  const { data: analyticsData, loading, error } = useDataLoader('RRG_ANALYSIS', '1D');
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-500">Đang tải dữ liệu tổng quan thị trường...</div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return null;
  }

  // Extract detailed analysis data
  const detailedAnalysis = analyticsData?.insights?.detailed_analysis || {};
  const volatilityRegime = detailedAnalysis.volatility_regime;
  const industryTrendConsistency = detailedAnalysis.industry_trend_consistency;
  const breadthDetail = detailedAnalysis.breadth_detail;
  const systemicRisks = detailedAnalysis.systemic_risks;

  // Check if we have any market overview data
  if (!volatilityRegime) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Volatility Regime Dashboard - This contains all the market overview information */}
      <VolatilityRegimeDashboard
        volatilityRegime={volatilityRegime}
        industryTrendConsistency={industryTrendConsistency}
        breadthDetail={breadthDetail}
        systemicRisks={systemicRisks}
      />
    </div>
  );
};

export default MarketOverviewDashboard; 