import React from 'react';

const TopdownInsightsHeader = ({ 
  timestamp, 
  analysis_version, 
  data_quality_score, 
  consistency_score,
  getConfidenceColor,
  formatTimestamp 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          📊 Báo cáo Phân tích Top-down
        </h3>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
            v{analysis_version}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <div className="flex items-center space-x-1">
          <span>🕐</span>
          <span>Cập nhật: {formatTimestamp(timestamp)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>📊 Chất lượng dữ liệu:</span>
          <span className={`font-semibold ${getConfidenceColor(data_quality_score / 100)}`}>
            {data_quality_score?.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>✅ Độ nhất quán:</span>
          <span className={`font-semibold ${getConfidenceColor(consistency_score / 100)}`}>
            {consistency_score?.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopdownInsightsHeader;
