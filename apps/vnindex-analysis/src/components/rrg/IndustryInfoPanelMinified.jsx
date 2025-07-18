import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  BarChart,
  Users,
  Activity
} from 'lucide-react';
import { getDirectionIconAndColor, getRsChangeColor, getRiskColor } from '../detailed-analysis/utils/colorUtils';

// Compact metric item for minified display
const CompactMetricItem = ({ icon: Icon, label, value, valueClassName = '', tooltip = '' }) => (
  <div className="flex items-center justify-between py-0.5" title={tooltip}>
    <div className="flex items-center text-xs text-gray-600">
      <Icon className="w-3 h-3 mr-1.5" />
      <span className="truncate">{label}</span>
    </div>
    <span className={`font-mono text-xs font-medium ml-2 ${valueClassName}`}>{value}</span>
  </div>
);

// Compact info card for minified display
const CompactInfoCard = ({ title, tooltip, children, className = '' }) => (
  <div className={`bg-gray-50 rounded-md p-2 ${className}`}>
    <div className="flex items-center justify-between mb-1.5">
      <h4 className="font-semibold text-gray-800 text-xs">{title}</h4>
      {tooltip && (
        <span className="text-gray-400 cursor-pointer" title={tooltip}>
          <Info size={12} />
        </span>
      )}
    </div>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const IndustryInfoPanelMinified = ({ industry }) => {
  if (!industry) {
    return (
      <div className="bg-white border rounded-lg p-3 shadow-sm text-center">
        <h3 className="text-sm font-bold text-gray-800">Không có dữ liệu chi tiết cho ngành này.</h3>
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
  } = industry;

  // Helper functions
  const formatPercent = (val) => (typeof val === 'number' ? `${(val * 100).toFixed(1)}%` : 'K/C');

  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-2 truncate">{industry.name}</h3>

      {/* Compact grid layout for half-width display */}
      <div className="space-y-2">
        {/* Performance & Speed Row */}
        <div className="grid grid-cols-2 gap-2">
          <CompactInfoCard
            title="Hiệu suất"
            tooltip="Sức mạnh tương đối (Relative Strength) so với VNINDEX"
          >
            <CompactMetricItem
              icon={TrendingUp}
              label="RS"
              value={formatPercent(metrics?.current_rs)}
              valueClassName="text-blue-600"
            />
            <CompactMetricItem
              icon={metrics?.rs_5d_change > 0 ? ArrowUpRight : ArrowDownRight}
              label="5d"
              value={formatPercent(metrics?.rs_5d_change)}
              valueClassName={getRsChangeColor(metrics?.rs_5d_change)}
            />
          </CompactInfoCard>

          <CompactInfoCard
            title="Tốc độ & Hướng"
            tooltip="Phân tích tốc độ và hướng của xu hướng"
          >
            <CompactMetricItem
              icon={Zap}
              label="Tốc độ"
              value={formatPercent(speed_analysis?.raw_speed_5d)}
            />
            {(() => {
              const { icon: DirectionIcon, color: directionColor } = getDirectionIconAndColor(direction_analysis?.direction);
              return (
                <CompactMetricItem
                  icon={DirectionIcon}
                  label="Hướng"
                  value={direction_analysis?.direction?.split(' ')[0] || 'K/C'}
                  valueClassName={directionColor}
                />
              );
            })()}
          </CompactInfoCard>
        </div>

        {/* Risk & Trend Consistency Row */}
        <div className="grid grid-cols-2 gap-2">
          <CompactInfoCard
            title="Rủi ro"
            tooltip="Mức độ rủi ro và quy mô vị thế gợi ý"
          >
            <CompactMetricItem
              icon={Shield}
              label="Mức độ"
              value={risk_assessment?.risk_level}
              valueClassName={getRiskColor(risk_assessment?.risk_level)}
            />
            <CompactMetricItem
              icon={BarChart}
              label="Vị thế"
              value={risk_assessment?.suggested_position_size || 'K/C'}
            />
          </CompactInfoCard>

          <CompactInfoCard
            title="Nhất quán"
            tooltip="Tính nhất quán xu hướng ngành"
          >
            <CompactMetricItem
              icon={Activity}
              label="Điểm"
              value={formatPercent(trend_consistency?.consistency_score)}
            />
            <CompactMetricItem
              icon={Users}
              label="Số mã"
              value={trend_consistency?.symbol_count || 'K/C'}
            />
          </CompactInfoCard>
        </div>

        {/* Additional metrics in a single row */}
        <CompactInfoCard title="Chi tiết bổ sung">
          <div className="grid grid-cols-3 gap-1 text-center">
            <div>
              <div className="text-xs text-gray-500">21d</div>
              <div className={`font-mono font-semibold text-xs ${
                metrics?.rs_21d_change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercent(metrics?.rs_21d_change)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Sức mạnh</div>
              <div className="font-mono font-semibold text-xs text-purple-600">
                {direction_analysis?.trend_strength || 'K/C'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Tin cậy</div>
              <div className="font-mono font-semibold text-xs">
                {formatPercent(trend_consistency?.trend_confidence)}
              </div>
            </div>
          </div>
        </CompactInfoCard>
      </div>
    </div>
  );
};

export default IndustryInfoPanelMinified; 