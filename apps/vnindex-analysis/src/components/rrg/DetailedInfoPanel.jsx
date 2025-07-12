import React, { useState, useEffect } from 'react';
import { getAnalyzeRsData } from '../../utils/rrgDataLoader';
import IndustryInfoPanel from './IndustryInfoPanel';
import SymbolInfoPanel from './SymbolInfoPanel';
import GroupInfoPanel from './GroupInfoPanel';

// Detailed Information Panel Component
const DetailedInfoPanel = ({ selectedItems, type, timeframe }) => {
  const [analyzeData, setAnalyzeData] = useState(null);

  useEffect(() => {
    try {
      const data = getAnalyzeRsData(timeframe);
      setAnalyzeData(data);
    } catch (error) {
      console.error('Error loading analyze data:', error);
    }
  }, [timeframe]);

  if (!selectedItems || selectedItems.length === 0 || !analyzeData) {
    return null;
  }

  // Check if we have any valid data to display
  const hasValidData = selectedItems.some(item => {
    if (item.type === 'symbol') {
      return analyzeData.symbols?.some(s => s.symbol === item.id);
    } else if (item.type === 'group') {
      return analyzeData.groups?.some(g => g.custom_id === item.id);
    } else {
      return analyzeData.industries?.some(ind => ind.custom_id === item.id);
    }
  });

  if (!hasValidData) {
    return (
      <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
        <p className="text-gray-600 text-sm">Không có dữ liệu chi tiết cho các mục đã chọn.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        Thông tin chi tiết
      </h2>
      <div className="space-y-4">
        {selectedItems.map(item => {
          if (item.type === 'symbol') {
            return <SymbolInfoPanel key={item.id} symbol={item} analyzeData={analyzeData} />;
          } else if (item.type === 'group') {
            return <GroupInfoPanel key={item.id} group={item} analyzeData={analyzeData} />;
          } else {
            return <IndustryInfoPanel key={item.id} industry={item} analyzeData={analyzeData} />;
          }
        })}
      </div>
    </div>
  );
};

export default DetailedInfoPanel; 