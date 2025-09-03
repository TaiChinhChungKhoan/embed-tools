import React from 'react';
import { Maximize2 } from 'lucide-react';
import InvestingWidget, { INVESTING_PAIRS } from '../InvestingWidget';
import FREDWidget, { FRED_GRAPHS } from '../FREDWidget';
import LazyChart from '../LazyChart';
import PMIChart from '../PMIChart';

// Enhanced inflation indicators grid - 2 per row with individual chart scrolling
const InflationIndicatorsGrid = ({ data, onChartClick }) => {
  const indicators = [
    { 
      title: "CPI Tổng thể", 
      type: "fred",
      graphId: '1LGbb', 
      description: "Chỉ số giá tiêu dùng - Thước đo lạm phát chính thống",
      interpretationGuide: [
        { condition: "CPI > 4%", meaning: "Lạm phát cao → Fed tăng lãi suất mạnh, bán cổ phiếu tăng trưởng" },
        { condition: "CPI 3-4%", meaning: "Lạm phát vừa phải → Fed thận trọng, thị trường biến động" },
        { condition: "CPI 2-3%", meaning: "Vùng mục tiêu → Chính sách bình thường, thị trường ổn định" },
        { condition: "CPI < 2%", meaning: "Lạm phát thấp → Fed có thể cắt lãi suất, tốt cho cổ phiếu" },
        { condition: "CPI tăng nhanh", meaning: "Xu hướng xấu → Tránh trái phiếu dài hạn, mua TIPS" }
      ]
    },
    { 
      title: "PCE Tổng thể", 
      type: "fred",
      graphId: '1LGaX', 
      description: "Chi tiêu tiêu dùng cá nhân - Chỉ số ưu tiên của Fed",
      interpretationGuide: [
        { condition: "PCE > 3%", meaning: "Vượt mục tiêu Fed → Tăng lãi suất chắc chắn, bán cổ phiếu" },
        { condition: "PCE 2.5-3%", meaning: "Gần mục tiêu trên → Fed cân nhắc tăng lãi suất" },
        { condition: "PCE 2-2.5%", meaning: "Mục tiêu Fed → Chính sách trung tính, thị trường cân bằng" },
        { condition: "PCE < 2%", meaning: "Dưới mục tiêu → Fed có thể nới lỏng, tốt cho tài sản rủi ro" },
        { condition: "PCE xu hướng", meaning: "Quan trọng hơn số tuyệt đối → Theo dõi 3-6 tháng liên tiếp" }
      ]
    },
    { 
      title: "CPI Cốt lõi", 
      type: "fred",
      graphId: '1LGby', 
      description: "CPI loại trừ thực phẩm và năng lượng - Đo lạm phát bền vững",
      interpretationGuide: [
        { condition: "Core CPI > 4%", meaning: "Lạm phát cứng đầu → Fed sẽ tăng lãi suất mạnh và lâu dài" },
        { condition: "Core CPI 3-4%", meaning: "Lạm phát cao → Fed tiếp tục thắt chặt, bán cổ phiếu" },
        { condition: "Core CPI 2-3%", meaning: "Vùng chấp nhận → Fed thận trọng, thị trường biến động" },
        { condition: "Core CPI < 2%", meaning: "Lạm phát thấp → Fed có thể cắt lãi suất, mua cổ phiếu" },
        { condition: "Core CPI ổn định", meaning: "Quan trọng nhất → Chỉ ra lạm phát bền vững hay tạm thời" }
      ]
    },
    { 
      title: "PCE Cốt lõi", 
      type: "fred",
      graphId: '1LGbx', 
      description: "PCE loại trừ thực phẩm và năng lượng - Mục tiêu chính của Fed",
      interpretationGuide: [
        { condition: "Core PCE > 3%", meaning: "Vượt mục tiêu nhiều → Fed sẽ tăng lãi suất mạnh" },
        { condition: "Core PCE 2.5-3%", meaning: "Trên mục tiêu → Fed thắt chặt, giảm tài sản rủi ro" },
        { condition: "Core PCE 2-2.5%", meaning: "Gần mục tiêu → Fed cân bằng, thị trường ổn định" },
        { condition: "Core PCE < 2%", meaning: "Dưới mục tiêu → Fed nới lỏng, tăng tài sản rủi ro" },
        { condition: "Xu hướng 6 tháng", meaning: "Fed xem xu hướng dài hạn → Đừng phản ứng với 1 tháng" }
      ]
    },
    { 
      title: "PPI Tổng thể", 
      type: "fred",
      graphId: '1LGbn', 
      description: "Chỉ số giá sản xuất - Chỉ báo dẫn trước lạm phát tiêu dùng",
      interpretationGuide: [
        { condition: "PPI tăng mạnh", meaning: "Áp lực chi phí → CPI sẽ tăng sau 1-2 tháng" },
        { condition: "PPI ổn định", meaning: "Chi phí kiểm soát → CPI sẽ ổn định" },
        { condition: "PPI giảm", meaning: "Giảm phát → CPI sẽ giảm, tốt cho trái phiếu" },
        { condition: "PPI > CPI", meaning: "Doanh nghiệp chưa chuyển giá → Sẽ tăng giá bán" },
        { condition: "Xu hướng 3 tháng", meaning: "Quan trọng hơn 1 tháng → Dự báo CPI tương lai" }
      ]
    },
    { 
      title: "Lãi suất Fed Fund", 
      type: "fred",
      graphId: '1L9zv', 
      description: "Lãi suất liên bang thực tế - Công cụ chính sách tiền tệ",
      interpretationGuide: [
        { condition: "Lãi suất tăng", meaning: "Fed thắt chặt → Làm mát kinh tế, bán cổ phiếu tăng trưởng" },
        { condition: "Lãi suất ổn định", meaning: "Fed tạm dừng → Đánh giá dữ liệu, thị trường biến động" },
        { condition: "Lãi suất giảm", meaning: "Fed nới lỏng → Kích thích tăng trưởng, mua tài sản rủi ro" },
        { condition: "Lãi suất > 5%", meaning: "Thắt chặt mạnh → Rủi ro suy thoái cao" },
        { condition: "Đường cong Phillips", meaning: "Lãi suất cao + thất nghiệp thấp = không bền vững" }
      ]
    },
    { 
      title: "ISM Manufacturing PMI", 
      type: "pmi",
      pmiType: "manufacturing",
      description: "Chỉ số quản lý mua hàng sản xuất - Đo lường hoạt động kinh tế",
      interpretationGuide: [
        { condition: "PMI > 50", meaning: "Kinh tế mở rộng → Tốt cho cổ phiếu, tăng trưởng GDP" },
        { condition: "PMI 45-50", meaning: "Tăng trưởng chậm → Thị trường biến động, thận trọng" },
        { condition: "PMI < 45", meaning: "Suy thoái → Bán cổ phiếu, mua trái phiếu" },
        { condition: "PMI tăng mạnh", meaning: "Phục hồi kinh tế → Mua cổ phiếu tăng trưởng" },
        { condition: "PMI giảm liên tục", meaning: "Rủi ro suy thoái → Giảm tài sản rủi ro" }
      ]
    },
    { 
      title: "ISM Services PMI", 
      type: "pmi",
      pmiType: "services",
      description: "Chỉ số quản lý mua hàng dịch vụ - Đo lường hoạt động dịch vụ",
      interpretationGuide: [
        { condition: "PMI > 50", meaning: "Dịch vụ mở rộng → Tốt cho cổ phiếu tiêu dùng" },
        { condition: "PMI 45-50", meaning: "Tăng trưởng chậm → Thị trường biến động" },
        { condition: "PMI < 45", meaning: "Suy thoái dịch vụ → Bán cổ phiếu tiêu dùng" },
        { condition: "PMI > Manufacturing", meaning: "Dịch vụ mạnh hơn sản xuất → Tốt cho kinh tế" },
        { condition: "PMI giảm nhanh", meaning: "Rủi ro suy thoái → Giảm tài sản rủi ro" }
      ]
    }
  ];
  
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-semibold text-sm text-slate-700">Chỉ số lạm phát chi tiết (FRED Data)</h5>
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
              {indicator.type === 'fred' ? (
                <FREDWidget 
                  graphId={indicator.graphId}
                  width={650}
                  height={350}
                />
              ) : indicator.type === 'pmi' ? (
                <PMIChart 
                  type={indicator.pmiType}
                  width="100%"
                  height={450}
                />
              ) : (
                <InvestingWidget 
                  pairId={indicator.pairId}
                  height={300}
                  width={500}
                  showVolume={false}
                  plotStyle="line"
                />
              )}
            </LazyChart>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InflationIndicatorsGrid;