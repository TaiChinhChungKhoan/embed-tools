import { TrendingUp, Activity, Shield, BarChart3, Target, Gauge, AlertTriangle, PieChart, Globe } from 'lucide-react';

// Tab configuration with icons and metadata - reorganized for top-down analysis flow
export const TAB_CONFIG = {
  'market-interconnection': {
    key: 'market-interconnection',
    label: 'Liên thị trường',
    icon: Globe,
    description: 'Phân tích top-down từ macro đến micro, xác định chế độ thị trường',
    sections: ['market_interconnection']
  },
  // 'market-overview': {
  //   key: 'market-overview',
  //   label: 'Tổng quan thị trường',
  //   icon: PieChart,
  //   description: 'Tổng quan về điều kiện thị trường và biến động',
  //   sections: ['volatility_regime']
  // },
  // 'market-flow': {
  //   key: 'market-flow',
  //   label: 'Dòng tiền thị trường',
  //   icon: TrendingUp,
  //   description: 'Phân tích dòng tiền và luân chuyển vốn trong thị trường',
  //   sections: ['sector_rotation', 'market_cap_flow', 'institutional_flow']
  // },
  'momentum-analysis': {
    key: 'momentum-analysis',
    label: 'Phân tích động lượng',
    icon: Activity,
    description: 'Chu kỳ động lượng và phân bổ tốc độ',
    sections: ['momentum_cycles', 'speed_distribution']
  }
};

// Helper function to check if a section has meaningful data
export const hasSectionData = (detailedAnalysis, sectionKey) => {
  if (!detailedAnalysis) return false;
  
  const sectionData = detailedAnalysis[sectionKey];
  if (!sectionData) return false;

  // For risk-related sections, check if there's meaningful distribution
  if (sectionKey === 'risk_distribution') {
    const riskLevels = sectionData.risk_level_distribution;
    const volatility = sectionData.volatility_distribution;
    
    // Only show if there's meaningful distribution (not all low risk/volatility)
    const hasMeaningfulRisk = riskLevels && Object.values(riskLevels).some(level => 
      level && level.count > 0 && level.percentage !== '100.0%'
    );
    const hasMeaningfulVolatility = volatility && Object.values(volatility).some(vol => 
      vol && vol.count > 0 && vol.percentage !== '100.0%'
    );
    
    return hasMeaningfulRisk || hasMeaningfulVolatility;
  }

  if (sectionKey === 'systemic_risks') {
    const risks = sectionData.systemic_risks;
    const strategies = sectionData.mitigation_strategies;
    
    // Only show if there are actual risks or strategies
    return (risks && risks.length > 0) || (strategies && strategies.length > 0);
  }

  // For other sections, just check if data exists
  return true;
};

// Get available tabs based on data
export const getAvailableTabs = (detailedAnalysis) => {
  if (!detailedAnalysis) return [];

  return Object.keys(TAB_CONFIG).filter(tabKey => {
    const config = TAB_CONFIG[tabKey];
    return config.sections.some(section => hasSectionData(detailedAnalysis, section));
  });
}; 