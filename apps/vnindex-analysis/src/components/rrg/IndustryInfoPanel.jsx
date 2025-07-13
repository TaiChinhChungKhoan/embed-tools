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

const IndustryInfoPanel = ({ industry }) => {
  console.log('IndustryInfoPanel received:', industry); // DEBUG
  const [showTrendDesc, setShowTrendDesc] = useState(false);

  if (!industry) {
    return (
      <div className="bg-white border rounded-lg p-4 shadow-sm text-center">
        <h3 className="text-lg font-bold text-gray-800">Không có dữ liệu chi tiết cho ngành này.</h3>
      </div>
    );
  }

  // Destructure all relevant fields from the industry object
  const {
    name,
    metrics = {},
    speed_analysis = {},
    direction_analysis = {},
    risk_assessment = {},
    trend_consistency = {},
    performance_summary = {},
    custom_id,
    latest_date,
    breadth_detail = {}
  } = industry;

  // Helper functions matching SymbolInfoPanel style
  const getRiskColor = (level) => {
    switch (level) {
      case 'Cao': return 'text-red-500';
      case 'Trung bình': return 'text-yellow-500';
      case 'Thấp': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  // Helper to determine icon and color based on direction string
  const getDirectionIconAndColor = (direction) => {
    if (!direction) return { icon: TrendingDown, color: 'text-gray-600' };
    if (direction === 'Tăng trưởng mạnh' || direction === 'Tăng trưởng')
      return { icon: TrendingUp, color: 'text-green-600' };
    if (direction === 'Đứng yên')
      return { icon: Activity, color: 'text-yellow-600' };
    if (direction === 'Suy giảm' || direction === 'Suy giảm mạnh')
      return { icon: TrendingDown, color: 'text-red-600' };
    return { icon: TrendingDown, color: 'text-gray-600' };
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
          {(() => {
            const { icon: DirectionIcon, color: directionColor } = getDirectionIconAndColor(direction_analysis?.direction);
            return (
              <MetricItem
                icon={DirectionIcon}
                label="Hướng"
                value={direction_analysis?.direction || 'K/C'}
                valueClassName={directionColor}
              />
            );
          })()}
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
            value={risk_assessment?.risk_level}
            valueClassName={getRiskColor(risk_assessment?.risk_level)}
          />
          <MetricItem
            icon={BarChart}
            label="Kích thước vị thế"
            value={risk_assessment?.suggested_position_size || 'K/C'}
          />
          <MetricItem
            icon={Users}
            label="Khung thời gian"
            value={risk_assessment?.time_horizon || 'K/C'}
          />
        </InfoCard>
      </div>

      {/* Breadth Detail and Trend Consistency - Side by Side */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trend Consistency Section */}
        <InfoCard title="Tính Nhất Quán Xu Hướng Ngành">
          <div className="grid grid-cols-4 gap-x-6 text-center">
            <div>
              <div className="text-xs text-gray-500">Điểm nhất quán</div>
              <div className="font-mono font-semibold text-base">
                {formatPercent(trend_consistency?.consistency_score)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Căn chỉnh xu hướng</div>
              <div className="font-mono font-semibold text-base">
                {trend_consistency?.trend_alignment === 'Tích cực'
                  ? 'Tăng giá'
                  : trend_consistency?.trend_alignment === 'Tiêu cực'
                  ? 'Giảm giá'
                  : 'Trung lập'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Số mã phân tích</div>
              <div className="font-mono font-semibold text-base">
                {trend_consistency?.symbol_count || 'K/C'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Độ tin cậy xu hướng</div>
              <div className="font-mono font-semibold text-base">
                {formatPercent(trend_consistency?.trend_confidence)}
              </div>
            </div>
          </div>
        </InfoCard>
      </div>
    </div>
  );
};

export default IndustryInfoPanel;