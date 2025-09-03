import { INVESTING_PAIRS } from '../InvestingWidget';
import { FRED_GRAPHS } from '../FREDWidget';
import { TRADINGVIEW_SYMBOLS } from '../TradingViewWidget';

// Advanced risk analysis chart configurations - no duplicates with KeyIndicatorsGrid
export const getContextualChartConfigs = (inflationMode) => [
  {
    title: "SAHMREALTIME - Chỉ số Suy thoái Sahm",
    type: "fred",
    graphId: '1L91a',
    description: "Chỉ số suy thoái thời gian thực dựa trên tỷ lệ thất nghiệp - Dự báo suy thoái sớm",
    interpretationGuide: [
      { condition: "SAHM > 0.5", meaning: "Cảnh báo suy thoái → Tỷ lệ thất nghiệp tăng nhanh" },
      { condition: "SAHM > 0.75", meaning: "Suy thoái có khả năng cao → Fed cần can thiệp" },
      { condition: "SAHM < 0.5", meaning: "Kinh tế ổn định → Không có dấu hiệu suy thoái" },
      { condition: "SAHM giảm", meaning: "Triển vọng kinh tế cải thiện → Tỷ lệ thất nghiệp ổn định" }
    ]
  },
  {
    title: "Đường cong Lãi suất Treasury",
    type: "fred",
    graphId: '1LJk3',
    description: "Đường cong lãi suất trái phiếu chính phủ Mỹ - Chỉ báo kỳ vọng kinh tế",
    interpretationGuide: [
      { condition: "Đường cong dốc", meaning: "Kỳ vọng tăng trưởng mạnh → Lãi suất dài hạn cao" },
      { condition: "Đường cong phẳng", meaning: "Lo ngại tăng trưởng → Lãi suất dài hạn thấp" },
      { condition: "Đường cong đảo ngược", meaning: "Cảnh báo suy thoái → Lãi suất ngắn hạn cao hơn dài hạn" },
      { condition: "Đường cong phục hồi", meaning: "Triển vọng kinh tế cải thiện → Kỳ vọng tăng trưởng" }
    ]
  },
  {
    title: "Chênh lệch T10Y3M",
    type: "fred",
    graphId: '1LGdv',
    description: "Chênh lệch lãi suất 10 năm trừ 3 tháng - Dự báo suy thoái chính xác",
    interpretationGuide: [
      { condition: "Chênh lệch > 1%", meaning: "Đường cong bình thường → Kinh tế khỏe mạnh" },
      { condition: "Chênh lệch < 0%", meaning: "Đường cong đảo ngược → Cảnh báo suy thoái (12-18 tháng)" },
      { condition: "Chênh lệch mở rộng", meaning: "Kỳ vọng tăng trưởng cải thiện" },
      { condition: "Chênh lệch thu hẹp", meaning: "Lo ngại kinh tế xuất hiện" }
    ]
  },
  {
    title: "Chênh lệch T10Y2Y",
    type: "fred",
    graphId: '1LGdA',
    description: "Chênh lệch lãi suất 10 năm trừ 2 năm - Tín hiệu suy thoái quan trọng khác",
    interpretationGuide: [
      { condition: "Chênh lệch > 0.5%", meaning: "Đường cong bình thường → Kỳ vọng tăng trưởng tốt" },
      { condition: "Chênh lệch < 0%", meaning: "Đường cong đảo ngược → Tín hiệu suy thoái mạnh" },
      { condition: "Chênh lệch phục hồi", meaning: "Triển vọng kinh tế cải thiện" },
      { condition: "Chênh lệch dẹt", meaning: "Lo ngại tăng trưởng gia tăng" }
    ]
  },
  {
    title: "Tỷ lệ HYG/VGIT (Risk On/Off)",
    type: "tradingview",
    symbol: TRADINGVIEW_SYMBOLS.HYG_VGIT,
    description: "Trái phiếu rủi ro cao vs Chính phủ - Chỉ số khẩu vị rủi ro",
    interpretationGuide: [
      { condition: "Tỷ lệ tăng", meaning: "Risk-on → Trái phiếu rủi ro cao vượt trội, khẩu vị rủi ro tăng" },
      { condition: "Tỷ lệ giảm", meaning: "Risk-off → Chạy về nơi an toàn, trái phiếu chính phủ vượt trội" },
      { condition: "Tỷ lệ ở đỉnh", meaning: "Khẩu vị rủi ro đỉnh điểm → Cân nhắc chốt lời" },
      { condition: "Tỷ lệ ở đáy", meaning: "Sợ hãi tối đa → Cân nhắc mua tài sản chất lượng" }
    ]
  },
  {
    title: "AUD/JPY (Đo lường khẩu vị Rủi ro)",
    type: "tradingview",
    symbol: "FX:AUDJPY",
    description: "Đô la Úc vs Yên Nhật - Chỉ báo tâm lý rủi ro",
    interpretationGuide: [
      { condition: "AUD/JPY tăng", meaning: "Risk-on → Tiền tệ hàng hóa mạnh lên, nhu cầu carry trade" },
      { condition: "AUD/JPY giảm", meaning: "Risk-off → Chạy về JPY an toàn, giải đòn bẩy" },
      { condition: "AUD/JPY > 100", meaning: "Khẩu vị rủi ro mạnh → Cân nhắc chốt lời" },
      { condition: "AUD/JPY < 90", meaning: "Né tránh rủi ro → Tìm tài sản chất lượng giá rẻ" }
    ]
  }
];