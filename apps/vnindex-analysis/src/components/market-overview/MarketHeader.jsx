import React from 'react';

const MarketHeader = ({ marketOverview }) => {
  if (!marketOverview) return null;

  return (
    <div className="border-b border-gray-200 pb-2">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-gray-900">
          {marketOverview.title || 'Tổng quan thị trường (Macro)'}
        </h2>
        <div className="text-xs text-gray-600">
          {marketOverview.analysis_date && (
            <span>
              Cập nhật: {new Date(marketOverview.analysis_date).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>
      </div>
      
      {marketOverview.benchmark && (
        <div className="text-xs text-gray-500">
          Chuẩn so sánh: {marketOverview.benchmark}
        </div>
      )}
    </div>
  );
};

export default MarketHeader; 