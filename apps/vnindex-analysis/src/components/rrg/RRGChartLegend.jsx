import React from 'react';

const RRGChartLegend = ({ limitedData, getSeriesColor }) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>RS-Ratio (X-axis):</strong> Sức mạnh tương đối so với VNINDEX (values &gt;100 = vượt trội, &lt;100 = kém)</p>
        <p><strong>RS-Momentum (Y-axis):</strong> Tốc độ thay đổi sức mạnh tương đối (values &gt;100 = cải thiện, &lt;100 = suy yếu)</p>
        <p><strong>Quadrants:</strong> Leading (Dẫn dắt) (góc phải-trên), Weakening (Suy yếu) (góc phải-dưới), Lagging (Tụt hậu) (góc trái-dưới), Improving (Cải thiện) (góc trái-trên)</p>
      </div>
      
      {limitedData.length > 0 && (
        <div className="border-t pt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Cấu phần:</p>
          <div className="flex flex-wrap gap-2">
            {limitedData.map((series, index) => (
              <div key={series.symbol || series.custom_id} className="flex items-center gap-1 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getSeriesColor(series.symbol || series.custom_id, index, limitedData.length) }}
                />
                <span className="text-gray-600">
                  {typeof series.name === 'string' ? series.name : String(series.name || series.symbol || 'Unknown')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RRGChartLegend; 