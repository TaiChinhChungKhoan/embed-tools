import React from 'react';
import {
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    TrendingDown,
    Zap,
    Shield,
    BarChart,
    Users,
    Activity,
    Clock,
    Target,
    AlertTriangle,
    CheckCircle,
    XCircle
} from 'lucide-react';

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

const SymbolInfoPanel = ({ symbol, analyzeData }) => {
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
        speed_analysis = {},
        direction_analysis = {},
        risk_assessment = {}
    } = symbolData;

    // --- Helpers for translation and formatting ---
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
        const translations = { 
            'Uptrend': 'Xu hướng tăng', 
            'Downtrend': 'Xu hướng giảm', 
            'Sideways': 'Đi ngang',
            'Suy giảm': 'Suy giảm',
            'Tăng trưởng': 'Tăng trưởng'
        };
        return translations[direction] || 'K/C';
    };

    const translateRSTrend = (trend) => {
        const translations = { 'bullish': 'Tăng giá', 'bearish': 'Giảm giá', 'neutral': 'Trung lập' };
        return translations[trend] || 'K/C';
    };

    const translateCRSStatus = (status) => {
        const translations = { 'outperforming': 'Vượt trội', 'underperforming': 'Tụt hậu', 'neutral': 'Trung lập' };
        return translations[status] || 'K/C';
    };

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
                    <MetricItem
                        icon={Target}
                        label="Xu hướng RS"
                        value={translateRSTrend(performance_summary?.rs_trend)}
                        valueClassName={performance_summary?.rs_trend === 'bullish' ? 'text-green-600' : 'text-red-600'}
                    />
                </InfoCard>

                <InfoCard title="Tốc độ & Hướng">
                    <MetricItem
                        icon={Zap}
                        label="Tốc độ 5 ngày"
                        value={formatPercent(speed_analysis?.raw_speed_5d)}
                    />
                    <MetricItem
                        icon={direction_analysis?.direction === 'Tăng trưởng' ? TrendingUp : TrendingDown}
                        label="Hướng"
                        value={translateDirection(direction_analysis?.direction)}
                        valueClassName={direction_analysis?.direction === 'Tăng trưởng' ? 'text-green-600' : 'text-red-600'}
                    />
                    <MetricItem
                        icon={Activity}
                        label="Sức mạnh xu hướng"
                        value={direction_analysis?.trend_strength || 'K/C'}
                        valueClassName="text-purple-600"
                    />
                    <MetricItem
                        icon={Clock}
                        label="Tốc độ"
                        value={speed_analysis?.speed_category || 'K/C'}
                        valueClassName="text-orange-600"
                    />
                </InfoCard>

                <InfoCard title="Đánh giá Rủi ro">
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
                        label="Hoạt động tổ chức"
                        value={risk_assessment?.volume_analysis?.institutional_activity ? 'Có' : 'Không'}
                        valueClassName={risk_assessment?.volume_analysis?.institutional_activity ? 'text-green-600' : 'text-gray-500'}
                    />
                    <MetricItem
                        icon={Target}
                        label="Chân trời đầu tư"
                        value={risk_assessment?.time_horizon || 'K/C'}
                    />
                </InfoCard>

                <InfoCard title="Phân tích Chi tiết">
                    <MetricItem
                        icon={BarChart}
                        label="CRS Hiện tại"
                        value={formatPercent(metrics?.current_crs)}
                        valueClassName={metrics?.current_crs > 0 ? 'text-green-600' : 'text-red-600'}
                    />
                    <MetricItem
                        icon={Activity}
                        label="Trạng thái CRS"
                        value={translateCRSStatus(performance_summary?.crs_status)}
                        valueClassName={performance_summary?.crs_status === 'outperforming' ? 'text-green-600' : 'text-red-600'}
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
                        value={formatPercent(speed_analysis?.consistency_score)}
                    />
                </InfoCard>

                <InfoCard title="Phân tích Khối lượng">
                    <MetricItem
                        icon={BarChart}
                        label="Xu hướng khối lượng"
                        value={risk_assessment?.volume_analysis?.volume_trend || 'K/C'}
                        valueClassName="text-blue-600"
                    />
                    <MetricItem
                        icon={Activity}
                        label="Chất lượng khối lượng"
                        value={risk_assessment?.volume_analysis?.volume_quality || 'K/C'}
                        valueClassName="text-purple-600"
                    />
                    <MetricItem
                        icon={TrendingUp}
                        label="Tỷ lệ khối lượng"
                        value={formatNumber(risk_assessment?.volume_analysis?.recent_volume_ratio)}
                        valueClassName={risk_assessment?.volume_analysis?.recent_volume_ratio > 1 ? 'text-green-600' : 'text-red-600'}
                    />
                    <MetricItem
                        icon={Shield}
                        label="Stop loss"
                        value={formatPercent(risk_assessment?.stop_loss_distance)}
                        valueClassName="text-red-600"
                    />
                </InfoCard>

                <InfoCard title="Thống kê Hiệu suất">
                    <MetricItem
                        icon={CheckCircle}
                        label="Ngày vượt trội"
                        value={`${metrics?.outperforming_days || 0}/${metrics?.total_days || 0}`}
                        valueClassName="text-green-600"
                    />
                    <MetricItem
                        icon={XCircle}
                        label="Ngày tụt hậu"
                        value={`${metrics?.underperforming_days || 0}/${metrics?.total_days || 0}`}
                        valueClassName="text-red-600"
                    />
                    <MetricItem
                        icon={BarChart}
                        label="Biến động RS"
                        value={formatPercent(metrics?.rs_volatility)}
                    />
                    <MetricItem
                        icon={Activity}
                        label="Biến động CRS"
                        value={formatPercent(metrics?.crs_volatility)}
                    />
                </InfoCard>

            </div>
        </div>
    );
};

export default SymbolInfoPanel;