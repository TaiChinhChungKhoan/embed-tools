import React from 'react';

const DetailedAnalysisLayout = ({ title, leftColumn, rightColumn }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">{title}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {leftColumn}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {rightColumn}
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysisLayout; 