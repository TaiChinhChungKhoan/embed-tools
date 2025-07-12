import React from 'react';

// Custom Tooltip Component - Compact Design
const CustomTooltip = ({ data, x, y }) => {
  if (!data) return null;
  
  return (
    <div 
      className="absolute px-3 py-2 bg-gray-900/95 backdrop-blur-sm shadow-xl rounded-md border border-gray-700 text-white text-xs z-50 pointer-events-none"
      style={{
        left: x + 10,
        top: y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="font-semibold text-sm mb-1">
        {typeof data.name === 'string' ? data.name : String(data.name || 'Unknown')}
      </div>
      <div className="space-y-0.5">
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Tỷ số RS:</span>
          <span className="font-mono">{data.x.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">RS-Mom:</span>
          <span className="font-mono">{data.y.toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Ngày:</span>
          <span>{data.date}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip; 