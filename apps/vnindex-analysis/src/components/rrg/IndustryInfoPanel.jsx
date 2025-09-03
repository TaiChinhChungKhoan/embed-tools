import React, { useState } from 'react';
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
import { getDirectionIconAndColor, getRiskColor, getRsChangeColor } from '../detailed-analysis/utils/colorUtils';

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
    metrics = {},
    performance_summary = {},
    trend_consistency = {},
  } = industry;

  const formatPercent = (val) => (typeof val === 'number' ? `${(val * 100).toFixed(1)}%` : 'K/C');
  const formatNumber = (val) => (typeof val === 'number' ? val.toFixed(2) : 'K/C');
  
  return (
    <div key={industry.id} className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{industry.name}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Performance Summary */}
        <InfoCard
          title="Hiệu suất"
          tooltip="Sức mạnh tương đối (Relative Strength) so với VNINDEX"
        >
          <MetricItem
            icon={TrendingUp}
            label="RS Hiện tại"
            value={metrics?.current_rs ? `${metrics.current_rs.toFixed(1)}%` : 'K/C'}
            valueClassName="text-blue-600"
          />
                              <MetricItem
                        icon={metrics?.rs_slope_fast > 0 ? ArrowUpRight : ArrowDownRight}
                        label="Xu hướng nhanh"
                        value={formatPercent(metrics?.rs_slope_fast)}
                        valueClassName={getRsChangeColor(metrics?.rs_slope_fast)}
                    />
                    <MetricItem
                        icon={metrics?.rs_slope_slow > 0 ? ArrowUpRight : ArrowDownRight}
                        label="Xu hướng chậm"
                        value={formatPercent(metrics?.rs_slope_slow)}
                        valueClassName={getRsChangeColor(metrics?.rs_slope_slow)}
                    />
        </InfoCard>

        {/* Speed & Direction Analysis */}
        <InfoCard
          title="Tốc độ & Hướng"
          tooltip="Phân tích tốc độ và hướng của xu hướng"
        >
          <MetricItem
            icon={Zap}
            label="MPS Gia tăng"
            value={formatPercent(metrics?.mps_acceleration)}
          />
          {(() => {
            const { icon: DirectionIcon, color: directionColor } = getDirectionIconAndColor(performance_summary?.rs_trend);
            return (
              <MetricItem
                icon={DirectionIcon}
                label="Hướng"
                value={performance_summary?.rs_trend || 'K/C'}
                valueClassName={directionColor}
              />
            );
          })()}
          <MetricItem
            icon={Activity}
            label="Sức mạnh xu hướng"
            value={performance_summary?.strength_score ? performance_summary.strength_score.toFixed(1) : 'K/C'}
            valueClassName="text-purple-600"
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