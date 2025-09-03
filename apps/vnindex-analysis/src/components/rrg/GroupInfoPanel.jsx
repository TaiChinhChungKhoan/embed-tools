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
    Clock,
    Target,
    CheckCircle,
    XCircle,
    Calendar
} from 'lucide-react';
import { getRiskColor, getCrsColor, getCrsStatusColor, getDirectionColor, getRecentVolumeRatioColor, getRsTrendColor, getRsChangeColor, getStrengthScoreColor, getColorForUpRatio, getColorForNetDecayed, getSlopeAgeColor } from '../detailed-analysis/utils/colorUtils';

// Thành phần con có thể tái sử dụng cho mỗi chỉ số
const MetricItem = ({ icon: Icon, label, value, valueClassName = '' }) => (
    <div className="flex items-center justify-between py-1">
        <div className="flex items-center text-xs text-gray-600">
            <Icon className="w-3.5 h-3.5 mr-2" />
            <span>{label}</span>
        </div>
        <span className={`font-mono text-xs font-medium ${valueClassName}`}>{value}</span>
    </div>
);

// Thẻ có thể tái sử dụng cho mỗi phần
const InfoCard = ({ title, children }) => (
    <div className="bg-gray-50 rounded-lg p-3">
        <h4 className="font-semibold text-gray-800 text-sm mb-2">{title}</h4>
        <div className="space-y-1">{children}</div>
    </div>
);

const GroupInfoPanel = ({ group }) => {
  if (!group) {
    return (
      <div className="bg-white border rounded-lg p-4 shadow-sm text-center">
        <h3 className="text-lg font-bold text-gray-800">Không có dữ liệu chi tiết cho nhóm này.</h3>
      </div>
    );
  }

  // Destructure relevant fields from the group object
  const {
    custom_id,
    name,
    metrics = {},
    trend_consistency = {},
    performance_summary = {},
    latest_date,
    data_points,
    ...rest
  } = group;

  // --- Helpers for translation and formatting ---
    const formatPercent = (val) => (typeof val === 'number' ? `${(val * 100).toFixed(1)}%` : 'K/C');
    const formatNumber = (val) => (typeof val === 'number' ? val.toFixed(2) : 'K/C');

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{name}</h3>
      {/* Add your group metrics, performance, risk, etc. here, similar to IndustryInfoPanel */}
      {/* Example: */}
      <div className="text-sm text-gray-600 mb-2">Mã nhóm: {custom_id}</div>
      <div className="text-xs text-gray-500 mb-2">Ngày cập nhật: {latest_date}</div>
      {/* ...more group details... */}

            {/* Main metrics in a 2-column layout for better space usage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <InfoCard title="Sức mạnh Tương đối (RS)">
                    <MetricItem
                        icon={TrendingUp}
                        label="RS Hiện tại"
                        value={metrics?.current_rs ? `${metrics.current_rs.toFixed(1)}%` : 'K/C'}
                        valueClassName="text-blue-600"
                    />
                    <MetricItem
                        icon={BarChart}
                        label="CRS Hiện tại"
                        value={formatPercent(metrics?.current_crs)}
                        valueClassName={getCrsColor(metrics?.current_crs)}
                    />
                    <MetricItem
                        icon={Activity}
                        label="Trạng thái CRS"
                        value={performance_summary?.crs_status}
                        valueClassName={getCrsStatusColor(performance_summary?.crs_status)}
                    />
                    <MetricItem
                        icon={Target}
                        label="Xu hướng RS"
                        value={performance_summary?.rs_trend}
                        valueClassName={getRsTrendColor(performance_summary?.rs_trend)}
                    />
                    <MetricItem
                        icon={Target}
                        label="Điểm sức mạnh"
                        value={formatNumber(performance_summary?.strength_score)}
                        valueClassName={getStrengthScoreColor(performance_summary?.strength_score)}
                    />
                </InfoCard>

                <InfoCard title="Động lượng & Tốc độ (MPS)">
                    <MetricItem
                        icon={TrendingUp}
                        label="MPS Hiện tại"
                        value={metrics?.mps ? metrics.mps.toFixed(1) : 'K/C'}
                        valueClassName={metrics?.mps >= 70 ? 'text-green-600' : metrics?.mps >= 40 ? 'text-yellow-600' : 'text-red-600'}
                    />
                    <MetricItem
                        icon={Zap}
                        label="MPS Gia tăng"
                        value={metrics?.mps_acceleration ? (metrics.mps_acceleration > 0 ? '+' : '') + metrics.mps_acceleration.toFixed(3) : 'K/C'}
                        valueClassName={metrics?.mps_acceleration > 0.1 ? 'text-green-600' : metrics?.mps_acceleration < -0.1 ? 'text-red-600' : 'text-gray-600'}
                    />
                    <MetricItem
                        icon={Clock}
                        label="Phân loại Tốc độ"
                        value={metrics?.mps > 70 ? 'Nhanh' : metrics?.mps > 30 ? 'Trung bình' : 'Chậm'}
                        valueClassName={metrics?.mps > 70 ? 'text-green-600' : metrics?.mps > 30 ? 'text-yellow-600' : 'text-red-600'}
                    />
                    <MetricItem
                        icon={performance_summary?.rs_trend === 'Tăng trưởng' ? TrendingUp : TrendingDown}
                        label="Hướng"
                        value={performance_summary?.rs_trend}
                        valueClassName={getDirectionColor(performance_summary?.rs_trend)}
                    />
                    <MetricItem
                        icon={Zap}
                        label="Độ nhất quán"
                        value={formatPercent(trend_consistency?.consistency_score)}
                    />
                </InfoCard>


            </div>
            
            {/* Secondary metrics in a 3-column layout for detailed analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                
                <InfoCard title="Xu hướng & Biến động">
                    <MetricItem
                        icon={metrics?.rs_slope_fast > 0 ? ArrowUpRight : ArrowDownRight}
                        label="Slope Nhanh"
                        value={formatPercent(metrics?.rs_slope_fast)}
                        valueClassName={getRsChangeColor(metrics?.rs_slope_fast)}
                    />
                    <MetricItem
                        icon={metrics?.rs_slope_slow > 0 ? ArrowUpRight : ArrowDownRight}
                        label="Slope Chậm"
                        value={formatPercent(metrics?.rs_slope_slow)}
                        valueClassName={getRsChangeColor(metrics?.rs_slope_slow)}
                    />
                    <MetricItem
                        icon={BarChart}
                        label="Biến động RS"
                        value={formatPercent(metrics?.slope_delta ? Math.abs(metrics.slope_delta / 10) : undefined)}
                    />
                </InfoCard>
                
                <InfoCard title="Thống kê Nhất quán">
                    <MetricItem
                        icon={BarChart}
                        label="Tỷ lệ Tăng"
                        value={formatPercent(metrics?.up_ratio)}
                        valueClassName={getColorForUpRatio(metrics?.up_ratio)}
                    />
                    <MetricItem
                        icon={Activity}
                        label="Chất lượng xu hướng"
                        value={metrics?.net_decayed ? metrics.net_decayed.toFixed(3) : 'K/C'}
                        valueClassName={getColorForNetDecayed(metrics?.net_decayed)}
                    />
                    <MetricItem
                        icon={Clock}
                        label="Độ bền xu hướng"
                        value={metrics?.slope_age !== undefined ? `${metrics.slope_age} phiên` : 'K/C'}
                        valueClassName={getSlopeAgeColor(metrics?.slope_age)}
                    />
                </InfoCard>
                
                <InfoCard title="Thông tin Bổ sung">
                    <MetricItem
                        icon={Calendar}
                        label="Ngày cập nhật"
                        value={latest_date ? new Date(latest_date).toLocaleDateString('vi-VN') : 'K/C'}
                        valueClassName="text-gray-600"
                    />
                    <MetricItem
                        icon={BarChart}
                        label="Số điểm dữ liệu"
                        value={data_points ? data_points.toString() : 'K/C'}
                        valueClassName="text-gray-600"
                    />
                </InfoCard>

            </div>
        </div>
    );
};

export default GroupInfoPanel; 