import React from 'react';
import ResponsiveTabbedLayout from './layout/ResponsiveTabbedLayout';
import SectorRotation from './sections/SectorRotation';
import MarketCapFlow from './sections/MarketCapFlow';
import MomentumCycles from './sections/MomentumCycles';
import InstitutionalFlow from './sections/InstitutionalFlow';
import RiskDistribution from './sections/RiskDistribution';
import SystemicRisks from './sections/SystemicRisks';
import VolatilityRegimeDashboard from './sections/VolatilityRegimeDashboard';
import SpeedDistribution from './sections/SpeedDistribution';
import { TAB_CONFIG, getAvailableTabs, hasSectionData } from './config/tabConfig';

const DetailedAnalysis = ({ detailedAnalysis }) => {
  if (!detailedAnalysis || !detailedAnalysis.title) return null;

  // Get available tabs based on data
  const availableTabKeys = getAvailableTabs(detailedAnalysis);

  // Generate tabs dynamically based on available data
  const tabs = availableTabKeys.map(tabKey => {
    const config = TAB_CONFIG[tabKey];
    
    // Map sections to components - ordered for logical analysis flow
    const sectionComponents = {
      // Market Overview (top level)
      volatility_regime: (
        <VolatilityRegimeDashboard
          volatilityRegime={detailedAnalysis.volatility_regime}
          industryTrendConsistency={detailedAnalysis.industry_trend_consistency}
          breadthDetail={detailedAnalysis.breadth_detail}
          systemicRisks={detailedAnalysis.systemic_risks}
        />
      ),
      
      // Market Flow (capital rotation analysis)
      sector_rotation: <SectorRotation sectorRotation={detailedAnalysis.sector_rotation} />,
      market_cap_flow: <MarketCapFlow marketCapFlow={detailedAnalysis.market_cap_flow} />,
      institutional_flow: <InstitutionalFlow institutionalFlow={detailedAnalysis.institutional_flow} />,
      
      // Momentum Analysis (trend and speed)
      momentum_cycles: <MomentumCycles momentumCycles={detailedAnalysis.momentum_cycles} />,
      speed_distribution: <SpeedDistribution speedDistribution={detailedAnalysis.speed_distribution} />,
      
      // Risk Assessment (risk analysis)
      risk_distribution: <RiskDistribution riskDistribution={detailedAnalysis.risk_distribution} />,
      systemic_risks: <SystemicRisks systemicRisks={detailedAnalysis.systemic_risks} />
    };

    // Filter sections that have data and get their components
    const availableSections = config.sections.filter(section => 
      hasSectionData(detailedAnalysis, section)
    );

    const content = (
      <div className="space-y-6">
        {availableSections.map(section => (
          <div key={section}>
            {sectionComponents[section]}
          </div>
        ))}
      </div>
    );

    return {
      key: config.key,
      label: config.label,
      content
    };
  });

  // If no tabs have data, show a message
  if (tabs.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">{detailedAnalysis.title}</h3>
        <p className="text-gray-500">Không có dữ liệu phân tích chi tiết để hiển thị</p>
      </div>
    );
  }

  return (
    <ResponsiveTabbedLayout
      title={detailedAnalysis.title}
      tabs={tabs}
    />
  );
};

export default DetailedAnalysis; 