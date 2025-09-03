import React from 'react';
import { TrendingUp, AlertTriangle, Activity, Target } from 'lucide-react';

// Trading Summary TLDR Component
const TradingSummaryTLDR = ({ data }) => {
  const getTradeRecommendations = () => {
    // Simplified logic for real-time recommendations
    return {
      primary: { asset: "Theo dõi VIX", action: "CHỜ TÍN HIỆU", reason: "Đang phân tích real-time từ TradingView" },
      secondary: { asset: "DXY Index", action: "THEO DÕI", reason: "Xu hướng USD ảnh hưởng toàn cầu" },
      avoid: { asset: "Quyết định vội", action: "TRÁNH", reason: "Chờ xác nhận từ nhiều chỉ số" }
    };
  };

  const recommendations = getTradeRecommendations();
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <Target className="w-6 h-6 text-green-600 mr-2" />
        <h3 className="text-xl font-bold text-green-800">📊 Tóm tắt Giao dịch (Real-time)</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Primary Recommendation */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
            <span className="font-semibold text-green-800">Khuyến nghị chính</span>
          </div>
          <div className="text-lg font-bold text-green-700">{recommendations.primary.asset}</div>
          <div className={`text-sm font-medium mb-2 text-blue-600`}>
            {recommendations.primary.action}
          </div>
          <div className="text-xs text-gray-600">{recommendations.primary.reason}</div>
        </div>

        {/* Secondary Recommendation */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center mb-2">
            <Activity className="w-4 h-4 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-800">Lựa chọn phụ</span>
          </div>
          <div className="text-lg font-bold text-blue-700">{recommendations.secondary.asset}</div>
          <div className="text-sm font-medium mb-2 text-blue-600">
            {recommendations.secondary.action}
          </div>
          <div className="text-xs text-gray-600">{recommendations.secondary.reason}</div>
        </div>

        {/* What to Avoid */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
            <span className="font-semibold text-red-800">Nên tránh</span>
          </div>
          <div className="text-lg font-bold text-red-700">{recommendations.avoid.asset}</div>
          <div className="text-sm font-medium text-red-600 mb-2">{recommendations.avoid.action}</div>
          <div className="text-xs text-gray-600">{recommendations.avoid.reason}</div>
        </div>
      </div>

      {/* Market Context */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2">🎯 Phân tích Real-time</h4>
        <p className="text-sm text-gray-700">
          Dữ liệu được cập nhật real-time từ TradingView. Theo dõi VIX để đánh giá mức độ sợ hãi, 
          DXY cho xu hướng USD, và các chỉ số lạm phát qua biểu đồ bên dưới.
        </p>
      </div>
    </div>
  );
};

export default TradingSummaryTLDR;