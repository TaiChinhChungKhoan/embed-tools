import { TrendingUp, Activity, Shield, BarChart3, Target, Gauge, AlertTriangle, PieChart } from 'lucide-react';

// Tab configuration with icons and metadata - reorganized for top-down analysis flow
export const TAB_CONFIG = {
  'market-overview': {
    key: 'market-overview',
    label: 'Tổng quan thị trường',
    icon: PieChart,
    description: 'Tổng quan về điều kiện thị trường và biến động',
    sections: ['volatility_regime']
  },
  'market-flow': {
    key: 'market-flow',
    label: 'Dòng tiền thị trường',
    icon: TrendingUp,
    description: 'Phân tích dòng tiền và luân chuyển vốn trong thị trường',
    sections: ['sector_rotation', 'market_cap_flow', 'institutional_flow']
  },
  'momentum-analysis': {
    key: 'momentum-analysis',
    label: 'Phân tích động lượng',
    icon: Activity,
    description: 'Chu kỳ động lượng và phân bổ tốc độ',
    sections: ['momentum_cycles', 'speed_distribution']
  },
  'risk-assessment': {
    key: 'risk-assessment',
    label: 'Đánh giá rủi ro',
    icon: Shield,
    description: 'Phân bổ rủi ro và rủi ro hệ thống',
    sections: ['risk_distribution', 'systemic_risks']
  }
};

// Helper function to get tab order - reorganized for top-down analysis flow
export const getTabOrder = () => [
  'market-overview',    // Start with market conditions/overview
  'market-flow',        // Then market flow and capital rotation
  'momentum-analysis',  // Then momentum and speed analysis
  'risk-assessment'     // Finally risk assessment
];

// Helper function to check if a section has data
export const hasSectionData = (detailedAnalysis, sectionKey) => {
  return detailedAnalysis && detailedAnalysis[sectionKey] && 
         Object.keys(detailedAnalysis[sectionKey]).length > 0;
};

// Helper function to get available tabs based on data
export const getAvailableTabs = (detailedAnalysis) => {
  return getTabOrder().filter(tabKey => {
    const tabConfig = TAB_CONFIG[tabKey];
    return tabConfig.sections.some(section => hasSectionData(detailedAnalysis, section));
  });
}; 