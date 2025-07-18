import React from 'react';
import {
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    TrendingDown,
    Zap,
    Shield,
    BarChart,
    Activity,
    Info
} from 'lucide-react';
import { getDirectionColor, getCrsColor, getCrsStatusColor, getRecentVolumeRatioColor, getRiskColor, getRsChangeColor } from '../detailed-analysis/utils/colorUtils';

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

const GroupInfoPanelMinified = ({ group, groupData, analyzeData }) => {
  // Use the passed groupData instead of searching through analyzeData
  const data = groupData || analyzeData?.groups?.find(g => g.custom_id === group.custom_id || g.id === group.custom_id);

  if (!data) {
    return (
      <div className="bg-white border rounded-lg p-3 shadow-sm text-center">
        <h3 className="text-sm font-bold text-gray-800">{group.name}</h3>
        <p className="text-gray-500 text-xs">Không có dữ liệu chi tiết cho nhóm này.</p>
      </div>
    );
  }

    const {
        metrics = {},
        performance_summary = {},
        speed_analysis = {},
        direction_analysis = {},
        risk_assessment = {}
    } = groupData;

    // --- Helpers for translation and formatting ---
    const formatPercent = (val) => (typeof val === 'number' ? `${(val * 100).toFixed(1)}%` : 'K/C');
    const formatNumber = (val) => (typeof val === 'number' ? val.toFixed(2) : 'K/C');

    return (
        <div className="bg-white border rounded-lg p-3 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-2 truncate">{group.name}</h3>

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
                        <CompactMetricItem
                            icon={direction_analysis?.direction === 'Tăng trưởng' ? TrendingUp : TrendingDown}
                            label="Hướng"
                            value={direction_analysis?.direction}
                            valueClassName={getDirectionColor(direction_analysis?.direction)}
                        />
                    </CompactInfoCard>
                </div>

                {/* Risk & CRS Row */}
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
                        title="CRS"
                        tooltip="Cumulative Relative Strength analysis"
                    >
                        <CompactMetricItem
                            icon={BarChart}
                            label="CRS"
                            value={formatPercent(metrics?.current_crs)}
                            valueClassName={getCrsColor(metrics?.current_crs)}
                        />
                        <CompactMetricItem
                            icon={Activity}
                            label="Trạng thái"
                            value={performance_summary?.crs_status}
                            valueClassName={getCrsStatusColor(performance_summary?.crs_status)}
                        />
                    </CompactInfoCard>
                </div>

                {/* Additional metrics in a single row */}
                <CompactInfoCard title="Chi tiết bổ sung">
                    <div className="grid grid-cols-3 gap-1 text-center">
                        <div>
                            <div className="text-xs text-gray-500">21d</div>
                            <div className={`font-mono font-semibold text-xs ${
                                getRsChangeColor(metrics?.rs_21d_change)
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
                            <div className="text-xs text-gray-500">Điểm</div>
                            <div className="font-mono font-semibold text-xs">
                                {formatNumber(performance_summary?.strength_score)}
                            </div>
                        </div>
                    </div>
                </CompactInfoCard>

                {/* Volume Analysis Row */}
                <CompactInfoCard title="Khối lượng">
                    <div className="grid grid-cols-2 gap-1 text-center">
                        <div>
                            <div className="text-xs text-gray-500">Xu hướng</div>
                            <div className="font-mono font-semibold text-xs text-blue-600">
                                {risk_assessment?.volume_analysis?.volume_trend || 'K/C'}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Tỷ lệ</div>
                            <div className={`font-mono font-semibold text-xs ${
                                getRecentVolumeRatioColor(risk_assessment?.volume_analysis?.recent_volume_ratio)
                            }`}>
                                {formatNumber(risk_assessment?.volume_analysis?.recent_volume_ratio)}
                            </div>
                        </div>
                    </div>
                </CompactInfoCard>
            </div>
        </div>
    );
};

export default GroupInfoPanelMinified; 