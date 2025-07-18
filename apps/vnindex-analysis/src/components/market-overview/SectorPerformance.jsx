import React from 'react';
import { PieChart } from 'lucide-react';
import IndustryStatistics from '../IndustryStatistics';

const SectorPerformance = ({ 
  marketOverview, 
  topSectors, 
  bottomSectors, 
  industries, 
  analyticsData, 
  getSentimentColor 
}) => {
  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-2">
      <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
        <PieChart className="w-3 h-3 mr-1 text-blue-600" />
        Thống kê ngành
      </h3>
      
      <IndustryStatistics
        industries={industries}
        analysisDate={analyticsData?.analysis_date}
        lookbackPeriod={analyticsData?.lookback_period}
        keyMetrics={marketOverview.key_metrics}
        getSentimentColor={getSentimentColor}
        marketOverview={marketOverview}
      />
    </div>
  );
};

export default SectorPerformance; 