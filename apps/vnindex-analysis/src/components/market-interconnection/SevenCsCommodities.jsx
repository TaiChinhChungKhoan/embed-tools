import React from 'react';
import { Maximize2, Flame, Wheat, Droplets, Circle, Coffee, Activity, Zap } from 'lucide-react';
import InvestingWidget, { INVESTING_PAIRS } from '../InvestingWidget';
import TradingViewWidget, { TRADINGVIEW_SYMBOLS } from '../TradingViewWidget';
import LazyChart from '../LazyChart';

// Seven C's Commodities - 2 per row with individual chart scrolling
const SevenCsCommodities = ({ data, onChartClick }) => {
  const commodities = [
    { 
      title: "Dầu thô (Crude Oil)", 
      pairId: INVESTING_PAIRS.CRUDE_OIL, 
      icon: Droplets, 
      color: "text-gray-900", 
      description: "Năng lượng - Giá dầu",
      type: "investing",
      interpretationGuide: [
        { condition: "Dầu > $80", meaning: "Áp lực lạm phát năng lượng" },
        { condition: "Dầu $60-80", meaning: "Chi phí năng lượng ổn định" },
        { condition: "Dầu < $60", meaning: "Áp lực giảm phát" }
      ]
    },
    { 
      title: "Khí đốt (Natural Gas)", 
      pairId: INVESTING_PAIRS.NATURAL_GAS, 
      icon: Zap, 
      color: "text-blue-600", 
      description: "Năng lượng - Chi phí sưởi ấm",
      type: "investing",
      interpretationGuide: [
        { condition: "Khí đốt tăng giá", meaning: "Áp lực lạm phát năng lượng" },
        { condition: "Mùa đông lạnh", meaning: "Nhu cầu sưởi ấm tăng" }
      ]
    },
    { 
      title: "Đồng (Copper)", 
      pairId: INVESTING_PAIRS.COPPER, 
      icon: Circle, 
      color: "text-orange-600", 
      description: "Kim loại công nghiệp - Tăng trưởng",
      type: "investing",
      interpretationGuide: [
        { condition: "Đồng tăng giá", meaning: "Tăng trưởng kinh tế → Rủi ro lạm phát" },
        { condition: "Đồng giảm giá", meaning: "Tăng trưởng chậm lại → Giảm phát" }
      ]
    },
    { 
      title: "Quặng sắt (Iron Ore)", 
      symbol: TRADINGVIEW_SYMBOLS.IRON_ORE_TSI, 
      icon: Circle, 
      color: "text-gray-700", 
      description: "Kim loại công nghiệp - Xây dựng",
      type: "tradingview",
      interpretationGuide: [
        { condition: "Quặng sắt tăng giá", meaning: "Tăng trưởng xây dựng → Lạm phát" },
        { condition: "Quặng sắt giảm giá", meaning: "Ngành xây dựng chậm lại" }
      ]
    },
    { 
      title: "Ngô (Corn)", 
      pairId: INVESTING_PAIRS.CORN, 
      icon: Wheat, 
      color: "text-yellow-600", 
      description: "Nông nghiệp - Lạm phát thực phẩm",
      type: "investing",
      interpretationGuide: [
        { condition: "Ngô tăng giá", meaning: "Áp lực lạm phát thực phẩm sắp tới" },
        { condition: "Vấn đề thời tiết", meaning: "Lo ngại nguồn cung → Giá tăng vọt" },
        { condition: "Ngô ổn định", meaning: "Nông nghiệp ổn định" }
      ]
    },
    { 
      title: "Lúa mì (Wheat)", 
      pairId: INVESTING_PAIRS.WHEAT, 
      icon: Wheat, 
      color: "text-amber-600", 
      description: "Nông nghiệp - Lương thực cơ bản",
      type: "investing",
      interpretationGuide: [
        { condition: "Lúa mì tăng giá", meaning: "Lạm phát lương thực cơ bản" },
        { condition: "Xung đột Ukraine", meaning: "Nguồn cung bị ảnh hưởng" }
      ]
    },
    { 
      title: "Bông (Cotton)", 
      pairId: INVESTING_PAIRS.COTTON, 
      icon: Wheat, 
      color: "text-gray-600", 
      description: "Dệt may - Hàng tiêu dùng",
      type: "investing",
      interpretationGuide: [
        { condition: "Bông tăng giá", meaning: "Lạm phát dệt may sắp tới" },
        { condition: "Bông giảm giá", meaning: "Giá quần áo có thể giảm" }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-sm text-slate-700 flex items-center">
            <Flame className="w-4 h-4 mr-2" />
            Seven C's Commodities - Early Inflation Signals
          </h4>
          <span className="text-xs text-gray-500">Click biểu đồ để phóng to</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {commodities.map((commodity, index) => {
            const Icon = commodity.icon;
            
            return (
              <div key={index} className="bg-slate-50 rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow"
                   onClick={() => onChartClick(commodity)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Icon className={`w-4 h-4 mr-2 ${commodity.color}`} />
                    <span className="text-sm font-medium">{commodity.title}</span>
                  </div>
                  <Maximize2 className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-xs text-gray-500 mb-3">{commodity.description}</div>
                <LazyChart>
                  {commodity.type === 'tradingview' ? (
                    <TradingViewWidget 
                      symbol={commodity.symbol}
                      height="300px"
                      width="100%"
                      hideVolume={false}
                      hideSideToolbar={true}
                      hideTopToolbar={false}
                      allowSymbolChange={false}
                      chartStyle="1"
                    />
                  ) : (
                    <InvestingWidget 
                      pairId={commodity.pairId}
                      height={300}
                      width="100%"
                      showVolume={true}
                    />
                  )}
                </LazyChart>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
        <p className="text-sm text-yellow-800">
          <strong>💡 Thông tin quan trọng:</strong> Hàng hóa Seven C's là tín hiệu lạm phát sớm nhất. 
          Khi nhiều hàng hóa cùng tăng giá (đặc biệt Coffee đạt đỉnh lịch sử và Copper ở mức 2022), 
          đó là dấu hiệu áp lực lạm phát sẽ xuất hiện sau 3-6 tháng.
        </p>
      </div>
    </div>
  );
};

export default SevenCsCommodities;