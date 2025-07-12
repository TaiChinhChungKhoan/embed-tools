import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Compass,
  Shield,
  Info,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart,
  Users,
  Activity
} from 'lucide-react';

// Reusable component for displaying a single statistic - matching SymbolInfoPanel style
const MetricItem = ({ icon: Icon, label, value, valueClassName = '' }) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center text-xs text-gray-600">
      <Icon className="w-3.5 h-3.5 mr-2" />
      <span>{label}</span>
    </div>
    <span className={`font-mono text-xs font-medium ${valueClassName}`}>{value}</span>
  </div>
);

// Reusable card component for grouping information - matching SymbolInfoPanel style
const InfoCard = ({ title, tooltip, children }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
      {tooltip && (
        <span className="text-gray-400 cursor-pointer" title={tooltip}>
          <Info size={14} />
        </span>
      )}
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

const IndustryInfoPanel = ({ industry, analyzeData }) => {
  const [showTrendDesc, setShowTrendDesc] = useState(false);
  const industryData = analyzeData.industries?.find(
    ind => ind.custom_id === industry.id
  );

  if (!industryData) {
    return (
      <div
        key={industry.id}
        className="bg-white border rounded-lg p-4 shadow-sm text-center"
      >
        <h3 className="text-lg font-bold text-gray-800">{industry.name}</h3>
        <p className="text-gray-500 text-sm mt-1">
          Không có dữ liệu chi tiết cho ngành này.
        </p>
      </div>
    );
  }

  const {
    metrics = {},
    speed_analysis = {},
    direction_analysis = {},
    risk_assessment = {},
    trend_consistency = {}
  } = industryData;

  // Helper functions matching SymbolInfoPanel style
  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };
  
  const translateRiskLevel = (level) => {
    const translations = { 'High': 'Cao', 'Medium': 'Trung bình', 'Low': 'Thấp' };
    return translations[level] || 'K/C';
  };

  const translateDirection = (direction) => {
    const translations = { 'Uptrend': 'Xu hướng tăng', 'Downtrend': 'Xu hướng giảm', 'Sideways': 'Đi ngang' };
    return translations[direction] || 'K/C';
  };

  const formatPercent = (val) => (typeof val === 'number' ? `${(val * 100).toFixed(1)}%` : 'K/C');

  return (
    <div key={industry.id} className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{industry.name}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Performance Summary */}
        <InfoCard
          title="Hiệu suất"
          tooltip="Sức mạnh tương đối (Relative Strength) so với VNINDEX"
        >
          <MetricItem
            icon={TrendingUp}
            label="RS Hiện tại"
            value={formatPercent(metrics?.current_rs)}
            valueClassName="text-blue-600"
          />
          <MetricItem
            icon={metrics?.rs_5d_change > 0 ? ArrowUpRight : ArrowDownRight}
            label="Thay đổi 5 ngày"
            value={formatPercent(metrics?.rs_5d_change)}
            valueClassName={metrics?.rs_5d_change > 0 ? 'text-green-600' : 'text-red-600'}
          />
          <MetricItem
            icon={metrics?.rs_21d_change > 0 ? ArrowUpRight : ArrowDownRight}
            label="Thay đổi 21 ngày"
            value={formatPercent(metrics?.rs_21d_change)}
            valueClassName={metrics?.rs_21d_change > 0 ? 'text-green-600' : 'text-red-600'}
          />
        </InfoCard>

        {/* Speed & Direction Analysis */}
        <InfoCard
          title="Tốc độ & Hướng"
          tooltip="Phân tích tốc độ và hướng của xu hướng"
        >
          <MetricItem
            icon={Zap}
            label="Tốc độ 5 ngày"
            value={formatPercent(speed_analysis?.raw_speed_5d)}
          />
          <MetricItem
            icon={direction_analysis?.direction === 'Uptrend' ? TrendingUp : TrendingDown}
            label="Hướng"
            value={translateDirection(direction_analysis?.direction)}
            valueClassName={direction_analysis?.direction === 'Uptrend' ? 'text-green-600' : 'text-red-600'}
          />
          <MetricItem
            icon={Activity}
            label="Sức mạnh xu hướng"
            value={direction_analysis?.trend_strength || 'K/C'}
            valueClassName="text-purple-600"
          />
        </InfoCard>

        {/* Risk Assessment */}
        <InfoCard 
          title="Đánh giá Rủi ro" 
          tooltip="Mức độ rủi ro và quy mô vị thế gợi ý"
        >
          <MetricItem
            icon={Shield}
            label="Mức rủi ro"
            value={translateRiskLevel(risk_assessment?.risk_level)}
            valueClassName={getRiskColor(risk_assessment?.risk_level)}
          />
          <MetricItem
            icon={BarChart}
            label="Kích thước vị thế"
            value={risk_assessment?.suggested_position_size || 'K/C'}
          />
          <MetricItem
            icon={Users}
            label="Chân trời đầu tư"
            value={risk_assessment?.time_horizon || 'K/C'}
          />
        </InfoCard>
      </div>

      {/* Trend Consistency - Full width section */}
      <div className="mt-4">
        <InfoCard title="Tính Nhất Quán Xu Hướng Ngành">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
            <MetricItem
              icon={BarChart}
              label="Điểm nhất quán"
              value={formatPercent(trend_consistency?.consistency_score)}
            />
            <MetricItem
              icon={trend_consistency?.trend_alignment === 'bullish' ? TrendingUp : TrendingDown}
              label="Căn chỉnh xu hướng"
              value={
                trend_consistency?.trend_alignment === 'bullish'
                  ? 'Tăng giá'
                  : trend_consistency?.trend_alignment === 'bearish'
                  ? 'Giảm giá'
                  : 'Trung lập'
              }
              valueClassName={
                trend_consistency?.trend_alignment === 'bullish'
                  ? 'text-green-600'
                  : trend_consistency?.trend_alignment === 'bearish'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }
            />
            <MetricItem
              icon={Users}
              label="Số mã phân tích"
              value={trend_consistency?.symbol_count || 'K/C'}
            />
            <MetricItem
              icon={Activity}
              label="Độ tin cậy xu hướng"
              value={formatPercent(trend_consistency?.trend_confidence)}
            />
          </div>
          
          <div className="mt-2">
            <button
              className="flex items-center justify-between w-full text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
              onClick={() => setShowTrendDesc(prev => !prev)}
              type="button"
            >
              <span>{showTrendDesc ? 'Ẩn' : 'Xem'} giải thích</span>
              {showTrendDesc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
          
          {showTrendDesc && (
            <div className="mt-2 p-3 bg-blue-50/50 border border-blue-200/50 rounded text-xs text-gray-700 space-y-2">
              <p>
                <b>Tính nhất quán xu hướng</b> phân tích mức độ đồng nhất trong
                hướng di chuyển của các cổ phiếu trong ngành, qua đó xác nhận
                xu hướng chung.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <b>
                    Điểm Nhất Quán ({trend_consistency?.consistency_score?.toFixed(2)})
                  </b>
                  : Điểm cao cho thấy sự đồng thuận mạnh mẽ giữa các cổ phiếu.
                </li>
                <li>
                  <b>
                    Sức Mạnh Đồng Thuận (
                    {trend_consistency?.consensus_strength?.toFixed(2)})
                  </b>
                  : Dương là đồng thuận tăng, âm là đồng thuận giảm.
                </li>
              </ul>
            </div>
          )}
        </InfoCard>
      </div>
    </div>
  );
};

export default IndustryInfoPanel;