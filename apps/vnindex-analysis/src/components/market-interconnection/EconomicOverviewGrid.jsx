import React from 'react';
import { Maximize2 } from 'lucide-react';
import FREDWidget from '../FREDWidget';
import LazyChart from '../LazyChart';

// Economic Overview Grid - Employment indicators
const EconomicOverviewGrid = ({ data, onChartClick }) => {
  const indicators = [
    { 
      title: "Tăng trưởng GDP", 
      type: "fred",
      graphId: '1LGeR', 
      description: "Tổng sản phẩm quốc nội - Tăng trưởng kinh tế tổng thể",
      interpretationGuide: [
        { condition: "GDP > 3%", meaning: "Tăng trưởng mạnh → Risk-on, rủi ro lạm phát" },
        { condition: "GDP 2-3%", meaning: "Tăng trưởng ổn định → Điều kiện bình thường" },
        { condition: "GDP < 2%", meaning: "Tăng trưởng chậm → Kinh tế yếu" },
        { condition: "GDP âm", meaning: "Suy thoái → Risk-off, Fed nới lỏng" }
      ]
    },
    { 
      title: "Tỷ lệ Thất nghiệp", 
      type: "fred",
      graphId: '1L3Ll', 
      description: "Tỷ lệ thất nghiệp Mỹ - Chỉ báo sức khỏe thị trường lao động",
      interpretationGuide: [
        { condition: "Tỷ lệ < 4%", meaning: "Full employment → Áp lực lương, rủi ro lạm phát" },
        { condition: "Tỷ lệ 4-6%", meaning: "Vùng bình thường → Thị trường lao động ổn định" },
        { condition: "Tỷ lệ > 6%", meaning: "Thất nghiệp cao → Kinh tế yếu" },
        { condition: "Tỷ lệ tăng nhanh", meaning: "Tín hiệu suy thoái → Fed nới lỏng chính sách" }
      ]
    },
    { 
      title: "Việc làm Non-Farm", 
      type: "fred",
      graphId: '1LJUQ', 
      description: "Tăng trưởng việc làm hàng tháng - Chỉ báo tăng trưởng kinh tế chính",
      interpretationGuide: [
        { condition: "NFP > 250k", meaning: "Tăng trưởng việc làm mạnh → Mở rộng kinh tế" },
        { condition: "NFP 150-250k", meaning: "Tăng trưởng ổn định → Kinh tế bình thường" },
        { condition: "NFP < 150k", meaning: "Tăng trưởng việc làm yếu → Kinh tế chậm lại" },
        { condition: "NFP âm", meaning: "Mất việc làm → Rủi ro suy thoái" }
      ]
    },
    { 
      title: "Tỷ lệ Tham gia Lực lượng Lao động", 
      type: "fred",
      graphId: '1Lc0T', 
      description: "Tỷ lệ dân số tham gia lực lượng lao động - Đo lường sự tham gia kinh tế",
      interpretationGuide: [
        { condition: "LFPR > 63%", meaning: "Tham gia cao → Kinh tế mạnh" },
        { condition: "LFPR 62-63%", meaning: "Tham gia bình thường → Điều kiện ổn định" },
        { condition: "LFPR < 62%", meaning: "Tham gia thấp → Vấn đề cấu trúc" },
        { condition: "LFPR giảm", meaning: "Người lao động nản lòng → Yếu kém ẩn" }
      ]
    },
    { 
      title: "Vị trí Việc làm Trống (JOLTS)", 
      type: "fred",
      graphId: '1LGdZ', 
      description: "Tổng số vị trí việc làm trống - Chỉ báo nhu cầu lao động",
      interpretationGuide: [
        { condition: "JOLTS > 10M", meaning: "Thiếu hụt lao động → Áp lực lạm phát lương" },
        { condition: "JOLTS 8-10M", meaning: "Nhu cầu tốt → Thị trường việc làm bình thường" },
        { condition: "JOLTS < 8M", meaning: "Nhu cầu yếu → Kinh tế làm mát" },
        { condition: "JOLTS giảm nhanh", meaning: "Tín hiệu suy thoái → Fed lo ngại" }
      ]
    },
    { 
      title: "Thu nhập Trung bình theo Giờ", 
      type: "fred",
      graphId: '1LGeD', 
      description: "Tỷ lệ tăng trưởng lương - Chỉ báo áp lực lạm phát trực tiếp",
      interpretationGuide: [
        { condition: "AHE > 4%", meaning: "Tăng lương mạnh → Áp lực lạm phát, Fed thắt chặt" },
        { condition: "AHE 3-4%", meaning: "Tăng lương vừa phải → Điều kiện cân bằng" },
        { condition: "AHE < 3%", meaning: "Tăng lương yếu → Áp lực giảm phát" },
        { condition: "AHE tăng tốc", meaning: "Rủi ro xoắn ốc lương → Fed lo ngại" }
      ]
    }
  ];
  
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-semibold text-sm text-slate-700">Các chỉ số kinh tế và việc làm (FRED Data)</h5>
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
              <FREDWidget 
                graphId={indicator.graphId}
                width={650}
                height={350}
              />
            </LazyChart>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EconomicOverviewGrid;