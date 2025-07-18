import React from 'react';
import MomentumCycles from './sections/MomentumCycles';
import SpeedDistribution from './sections/SpeedDistribution';

const DetailedAnalysis = ({ detailedAnalysis }) => {
  if (!detailedAnalysis || !detailedAnalysis.title) return null;

  // Check if we have momentum analysis data
  const hasMomentumData = detailedAnalysis.momentum_cycles || detailedAnalysis.speed_distribution;

  if (!hasMomentumData) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center text-gray-500">
          Không có dữ liệu phân tích chi tiết khả dụng.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích động lượng</h3>
      <div className="space-y-6">
        {detailedAnalysis.momentum_cycles && (
          <MomentumCycles momentumCycles={detailedAnalysis.momentum_cycles} />
        )}
        {detailedAnalysis.speed_distribution && (
          <SpeedDistribution speedDistribution={detailedAnalysis.speed_distribution} />
        )}
      </div>
    </div>
  );
};

export default DetailedAnalysis; 