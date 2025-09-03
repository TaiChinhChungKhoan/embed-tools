import React from 'react';
import { Maximize2 } from 'lucide-react';
import InvestingWidget, { INVESTING_PAIRS } from '../InvestingWidget';
import LazyChart from '../LazyChart';

// Key Indicators Grid - 2 per row with individual chart scrolling
const KeyIndicatorsGrid = ({ data, onChartClick }) => {
  const indicators = [
    {
      title: "VIX (Chỉ số Sợ hãi)",
      description: "Đo lường mức độ sợ hãi của thị trường",
      type: "investing",
      pairId: INVESTING_PAIRS.VIX,
      interpretationGuide: [
        { condition: "VIX > 30", meaning: "Sợ hãi cực độ → Cân nhắc mua cổ phiếu chất lượng khi giảm" },
        { condition: "VIX 20-30", meaning: "Sợ hãi cao → Theo dõi cơ hội đầu tư" },
        { condition: "VIX < 20", meaning: "Sợ hãi thấp/Tự mãn → Cân nhắc chốt lời" },
        { condition: "VIX < 12", meaning: "Tự mãn cực độ → Chuẩn bị cho biến động" }
      ]
    },
    {
      title: "Lãi suất US 10Y",
      description: "Lợi suất trái phiếu kỳ hạn 10 năm",
      type: "investing",
      pairId: INVESTING_PAIRS.US10Y,
      interpretationGuide: [
        { condition: "Lãi suất > 4.5%", meaning: "Lãi suất cao → Áp lực lên cổ phiếu tăng trưởng" },
        { condition: "Lãi suất 3.5-4.5%", meaning: "Vùng bình thường → Thị trường cân bằng" },
        { condition: "Lãi suất < 3.5%", meaning: "Lãi suất thấp → Thuận lợi cho cổ phiếu" },
        { condition: "Lãi suất tăng nhanh", meaning: "Fed thắt chặt → Bán cổ phiếu định giá cao" }
      ]
    },
    {
      title: "DXY (Chỉ số USD)",
      description: "Chỉ số sức mạnh đồng USD",
      type: "investing",
      pairId: INVESTING_PAIRS.DXY,
      interpretationGuide: [
        { condition: "DXY > 105", meaning: "USD mạnh → Áp lực lên hàng hóa & thị trường mới nổi" },
        { condition: "DXY 100-105", meaning: "USD trung tính → Điều kiện bình thường" },
        { condition: "DXY < 100", meaning: "USD yếu → Thuận lợi cho hàng hóa" },
        { condition: "DXY xu hướng tăng", meaning: "Risk-off → Bán tài sản rủi ro, mua USD" }
      ]
    },
    {
      title: "Vàng (Gold)",
      description: "Vàng - Tài sản trú ẩn an toàn",
      type: "investing",
      pairId: INVESTING_PAIRS.GOLD,
      interpretationGuide: [
        { condition: "Vàng > $2000", meaning: "Lạm phát cao/sợ hãi → Nhu cầu trú ẩn an toàn" },
        { condition: "Vàng $1800-2000", meaning: "Vùng bình thường → Theo dõi lạm phát" },
        { condition: "Vàng < $1800", meaning: "Chế độ risk-on → Cân nhắc cổ phiếu" },
        { condition: "Vàng vs DXY phân kỳ", meaning: "Tín hiệu quan trọng → Kiểm tra tương quan" }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-semibold text-sm text-slate-700">Các chỉ số quan trọng</h5>
        <span className="text-xs text-gray-500">Click biểu đồ để phóng to</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {indicators.map((indicator, index) => (
          <div key={index} className="bg-slate-50 rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow"
               onClick={() => onChartClick(indicator)}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-700">{indicator.title}</div>
              <Maximize2 className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500 mb-3">{indicator.description}</div>
            <LazyChart>
              <InvestingWidget 
                pairId={indicator.pairId} 
                height={300} 
                width="100%"
                showVolume={indicator.title === "VIX (Fear Index)" || indicator.title === "Gold"} 
              />
            </LazyChart>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyIndicatorsGrid;