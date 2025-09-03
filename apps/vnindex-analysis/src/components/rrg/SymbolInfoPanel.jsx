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
    XCircle
} from 'lucide-react';
import { getRiskColor, getCrsColor, getCrsStatusColor, getDirectionColor, getRsChangeColor, getRsTrendColor } from '../detailed-analysis/utils/colorUtils';

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

const SymbolInfoPanel = ({ symbol }) => {
    // Use the symbol object directly since it contains all the data we need
    const symbolData = symbol;

    if (!symbolData) {
        return (
            <div key={symbol.symbol} className="bg-white border rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{symbol.name}</h3>
                <p className="text-gray-500 text-sm">Không có dữ liệu chi tiết cho mã này.</p>
            </div>
        );
    }

    const {
        metrics = {},
        performance_summary = {},
        trend_consistency = {},
        risk_level,
        position_size,
        time_horizon,
        stop_loss_distance,
    } = symbolData;

    // --- Helpers for translation and formatting ---
    const formatPercent = (val) => (typeof val === 'number' ? `${(val * 100).toFixed(1)}%` : 'K/C');
    const formatNumber = (val) => (typeof val === 'number' ? val.toFixed(2) : 'K/C');

    return (
        <div key={symbol.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{symbol.name}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

                <InfoCard title="Hiệu suất">
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
                    <MetricItem
                        icon={Target}
                        label="Xu hướng RS"
                        value={performance_summary?.rs_trend}
                        valueClassName={getRsTrendColor(performance_summary?.rs_trend)}
                    />
                </InfoCard>

                <InfoCard title="Tốc độ & Hướng">
                    <MetricItem
                        icon={Zap}
                        label="Tốc độ 5 phiên"
                        value={formatPercent(metrics?.mps_acceleration)}
                    />
                    <MetricItem
                        icon={performance_summary?.rs_trend === 'Tăng trưởng' ? TrendingUp : TrendingDown}
                        label="Hướng"
                        value={performance_summary?.rs_trend}
                        valueClassName={getDirectionColor(performance_summary?.rs_trend)}
                    />
                    <MetricItem
                        icon={Activity}
                        label="Sức mạnh xu hướng"
                        value={performance_summary?.strength_score ? performance_summary.strength_score.toFixed(1) : 'K/C'}
                        valueClassName="text-purple-600"
                    />
                    <MetricItem
                        icon={Clock}
                        label="Tốc độ"
                        value={metrics?.mps > 70 ? 'Nhanh' : metrics?.mps > 30 ? 'Trung bình' : 'Chậm'}
                        valueClassName="text-orange-600"
                    />
                </InfoCard>

                <InfoCard title="Phân tích Chi tiết">
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
                        label="Điểm sức mạnh"
                        value={formatNumber(performance_summary?.strength_score)}
                        valueClassName={performance_summary?.strength_score > 0 ? 'text-green-600' : 'text-red-600'}
                    />
                    <MetricItem
                        icon={Zap}
                        label="Độ nhất quán"
                        value={formatPercent(trend_consistency?.consistency_score)}
                    />
                </InfoCard>

                <InfoCard title="Quản lý Rủi ro">
                    <MetricItem
                        icon={Shield}
                        label="Stop loss"
                        value={formatPercent(stop_loss_distance)}
                        valueClassName="text-red-600"
                    />
                </InfoCard>

                <InfoCard title="Thống kê Hiệu suất">
                    <MetricItem
                        icon={BarChart}
                        label="Biến động RS"
                        value={formatPercent(metrics?.rs_volatility)}
                    />
                </InfoCard>

            </div>
        </div>
    );
};

export default SymbolInfoPanel;