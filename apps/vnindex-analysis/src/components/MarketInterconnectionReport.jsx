import React, { useState, useMemo, useCallback } from 'react';

// Import extracted components
import ChartModal from './ChartModal';
import TradingSummaryTLDR from './market-interconnection/TradingSummaryTLDR';
import KeyIndicatorsGrid from './market-interconnection/KeyIndicatorsGrid';
import InflationIndicatorsGrid from './market-interconnection/InflationIndicatorsGrid';
import MarketChartsGrid from './market-interconnection/MarketChartsGrid';
import EconomicOverviewGrid from './market-interconnection/EconomicOverviewGrid';
import OverallMarketGrid from './market-interconnection/OverallMarketGrid';
import TopdownSubTabs from './market-interconnection/TopdownSubTabs';

import TopdownInsights from './market-interconnection/TopdownInsights';

// Import utility functions and configurations
import { 
  defaultData, 
  SectionHeader, 
  MarketModeIndicators, 
  CorrelationMatrix, 
  MarketAnalysisSummary 
} from './market-interconnection/utils';
import { getContextualChartConfigs } from './market-interconnection/chartConfigurations';
import { useDataLoader } from '../utils/dataLoader';

// Main Market Interconnection Report Component
const MarketInterconnectionReport = () => {
  const [timeframe, setTimeframe] = useState('1D');
  const [modalChart, setModalChart] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Load topdown analysis data
  const { data: topdownInsights, loading: insightsLoading, error: insightsError } = useDataLoader('topdown_insights');
  
  // Use default data for real-time analysis
  const processedData = useMemo(() => {
    return defaultData;
  }, []);
  
  // Get chart configurations
  const chartConfigs = useMemo(() => {
    return getContextualChartConfigs(false);
  }, []);
  
  const handleTimeframeChange = useCallback((newTimeframe) => {
    setTimeframe(newTimeframe);
  }, []);
  
  const handleChartClick = useCallback((chart) => {
    setModalChart(chart);
    setIsModalOpen(true);
  }, []);
  
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setModalChart(null);
  }, []);

  // Prepare content for sub-tabs
  const chartsContent = (
    <div className="space-y-6">
      {/* Enhanced Inflation Indicators - Top Priority for Topdown Analysis */}
      <SectionHeader
        title="Chỉ số Lạm phát Toàn diện"
        intent="Theo dõi tất cả các chỉ số lạm phát quan trọng để dự đoán xu hướng kinh tế và chính sách Fed"
        howToUse="CPI/Core CPI > 3% → đầu tư hedge lạm phát. PCE là chỉ số ưu tiên của Fed. PPI dẫn trước CPI 1-2 tháng"
      >
        <InflationIndicatorsGrid data={processedData} onChartClick={handleChartClick} />
      </SectionHeader>



      {/* Key Risk Indicators - VIX, Yields, DXY, Gold */}
      <SectionHeader
        title="Chỉ số Rủi ro Chính - Chế độ Risk On/Off"
        intent="Xác định thị trường đang trong giai đoạn tìm kiếm rủi ro hay né tránh rủi ro"
        howToUse="VIX > 30 = sợ hãi cực độ, cơ hội mua. US10Y tăng = tăng trưởng/lạm phát. DXY mạnh = risk-off. Vàng tăng = trú ẩn an toàn"
      >
        <KeyIndicatorsGrid data={processedData} onChartClick={handleChartClick} />
      </SectionHeader>

      {/* Advanced Risk Analysis Charts - HYG/VGIT, Yield Curve */}
      <SectionHeader
        title="Phân tích Rủi ro Nâng cao"
        intent="Phân tích chuyên sâu đường cong lãi suất và tỷ lệ rủi ro để dự báo suy thoái"
        howToUse="T10Y3M < 0 = cảnh báo suy thoái sau 12-18 tháng. HYG/VGIT = chỉ số risk appetite. AUD/JPY = tâm lý thị trường"
      >
        <MarketChartsGrid configs={chartConfigs} onChartClick={handleChartClick} />
      </SectionHeader>

      {/* Economic Overview - Employment Indicators */}
      <SectionHeader
        title="Tổng quan Kinh tế - Việc làm và Tăng trưởng"
        intent="Đánh giá sức khỏe kinh tế qua thị trường lao động và GDP để dự đoán chính sách Fed"
        howToUse="Thất nghiệp < 4% = full employment, áp lực lương. NFP > 250k = tăng trưởng mạnh. AHE > 4% = lạm phát lương"
      >
        <EconomicOverviewGrid data={processedData} onChartClick={handleChartClick} />
      </SectionHeader>

      {/* Overall Market and Sector Analysis */}
      <SectionHeader
        title="Tổng quan Thị trường Toàn cầu và Crypto"
        intent="Theo dõi xu hướng S&P 500, Bitcoin, USD/VND và sự luân chuyển sector để đánh giá risk appetite toàn cầu"
        howToUse="SPY > MA200 = bull market. BTC > $70k = risk-on cực độ. USD/VND > 25k = VND yếu. Tech dẫn đầu = growth mode"
      >
        <OverallMarketGrid data={processedData} onChartClick={handleChartClick} />
      </SectionHeader>
    </div>
  );

  const reportContent = (
    <div className="space-y-6">
      {/* Loading state */}
      {insightsLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải dữ liệu báo cáo...</span>
        </div>
      )}

      {/* Error state */}
      {insightsError && (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">Lỗi tải dữ liệu báo cáo</div>
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            {insightsError}
          </div>
        </div>
      )}

      {/* Insights Report */}
      {!insightsLoading && !insightsError && (
        <TopdownInsights data={topdownInsights} />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Báo cáo Liên thị trường
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Phân tích top-down từ macro đến micro, xác định chế độ thị trường
        </p>
      </div>

      {/* Sub-tabs Layout */}
      <TopdownSubTabs 
        chartsContent={chartsContent}
        reportContent={reportContent}
      />

      {/* Chart Modal */}
      {isModalOpen && modalChart && (
        <ChartModal
          chart={modalChart}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default MarketInterconnectionReport;