import React, { useState } from 'react';
import { useDataLoader } from '../hooks/useDataLoader';
import { TrendingUp, TrendingDown, Activity, BarChart3, Target, AlertTriangle } from 'lucide-react';
import Card from './Card';

const IndustryRSAnalysis = () => {
    const { data, loading, error } = useDataLoader('rs_analysis');
    const [activeSection, setActiveSection] = useState('overview');
    const [trendFilter, setTrendFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải dữ liệu phân tích RS ngành nghề...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Lỗi tải dữ liệu</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
            </div>
        );
    }

    if (!data || !data.industries) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu phân tích RS ngành nghề</p>
            </div>
        );
    }

    const { industries } = data;

    // Helper function to format percentage
    const formatPercentage = (value) => {
        return `${(value * 100).toFixed(2)}%`;
    };

    // Helper function to format CRS with proper explanation
    const formatCRS = (value) => {
        const percentage = (value * 100).toFixed(2);
        if (value > 0) {
            return `+${percentage}% (vượt trội)`;
        } else if (value < 0) {
            return `${percentage}% (thua kém)`;
        } else {
            return `0.00% (ngang bằng)`;
        }
    };

    // Helper function to format volatility
    const formatVolatility = (value) => {
        return `${(value * 100).toFixed(2)}%`;
    };

    // Helper function to get performance consistency percentage
    const getPerformanceConsistency = (outperforming, total) => {
        return ((outperforming / total) * 100).toFixed(1);
    };

    // Helper function to get consistency color
    const getConsistencyColor = (percentage) => {
        if (percentage >= 60) return 'text-green-600 dark:text-green-400';
        if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    // Helper function to get volatility color
    const getVolatilityColor = (volatility) => {
        if (volatility < 0.03) return 'text-green-600 dark:text-green-400';
        if (volatility < 0.06) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    // Helper function to interpret MA trend
    const getMATrend = (ma13, ma49) => {
        if (ma13 > ma49) {
            return { text: 'Tăng trưởng', color: 'text-green-600 dark:text-green-400', icon: '↗️' };
        } else if (ma13 < ma49) {
            return { text: 'Suy giảm', color: 'text-red-600 dark:text-red-400', icon: '↘️' };
        } else {
            return { text: 'Ổn định', color: 'text-gray-600 dark:text-gray-400', icon: '→' };
        }
    };

    // Helper function to get trend strength
    const getTrendStrength = (ma13, ma49, currentRS) => {
        const maDiff = Math.abs(ma13 - ma49);
        const currentDiff = Math.abs(currentRS - ma13);
        
        if (maDiff > 0.01 && currentDiff < 0.005) {
            return { text: 'Mạnh', color: 'text-green-600 dark:text-green-400' };
        } else if (maDiff > 0.005) {
            return { text: 'Trung bình', color: 'text-yellow-600 dark:text-yellow-400' };
        } else {
            return { text: 'Yếu', color: 'text-gray-600 dark:text-gray-400' };
        }
    };

    // Helper function to get trend color
    const getTrendColor = (trend) => {
        switch (trend) {
            case 'bullish':
                return 'text-green-600 dark:text-green-400';
            case 'bearish':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    // Helper function to get trend icon
    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'bullish':
                return <TrendingUp className="h-4 w-4" />;
            case 'bearish':
                return <TrendingDown className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'outperforming':
                return 'text-green-600 dark:text-green-400';
            case 'underperforming':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    // Filter industries based on filters
    const filteredIndustries = industries.filter(industry => {
        const matchesTrend = trendFilter === '' || 
            industry.performance_summary.rs_trend === trendFilter;
        
        const matchesStatus = statusFilter === '' || 
            industry.performance_summary.crs_status === statusFilter;
        
        return matchesTrend && matchesStatus;
    });

    // Sort industries by strength score
    const sortedIndustries = [...filteredIndustries].sort((a, b) => 
        b.metrics.current_crs - a.metrics.current_crs
    );

    // Get top performers
    const topPerformers = sortedIndustries.slice(0, 10);
    const bottomPerformers = sortedIndustries.slice(-10).reverse();

    const sections = [
        { id: 'overview', name: 'Tổng quan', icon: BarChart3 },
        { id: 'top_performers', name: 'Ngành mạnh nhất', icon: TrendingUp },
        { id: 'bottom_performers', name: 'Ngành yếu nhất', icon: TrendingDown },
        { id: 'insights', name: 'Thống kê', icon: Activity },
        { id: 'detailed', name: 'Chi tiết', icon: Target }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Phân tích Sức mạnh Tương đối (RS) Ngành nghề
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Phân tích sức mạnh tương đối của các ngành nghề so với VN-Index
                </p>
                {data.analysis_date && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Cập nhật: {new Date(data.analysis_date).toLocaleString('vi-VN')}
                    </p>
                )}
                
                {/* CRS Explanation */}
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Giải thích CRS (Cumulative Relative Strength)
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        CRS là tỷ lệ thể hiện hiệu suất tương đối của ngành so với VN-Index trong 21 ngày. 
                        Giá trị được tính bằng cách chia lợi nhuận của ngành cho lợi nhuận VN-Index, sau đó trừ 1 để căn giữa quanh 0.
                    </p>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                        <li>• <strong>+4.56%</strong> = Ngành vượt trội VN-Index 4.56%</li>
                        <li>• <strong>-2.34%</strong> = Ngành thua kém VN-Index 2.34%</li>
                        <li>• <strong>0.00%</strong> = Ngành có hiệu suất ngang bằng VN-Index</li>
                    </ul>
                </div>
            </div>

            {/* Section Navigation */}
            <div className="flex flex-wrap gap-2">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                activeSection === section.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {section.name}
                        </button>
                    );
                })}
            </div>

            {/* Overview Section */}
            {activeSection === 'overview' && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                Ngành mạnh nhất
                            </h4>
                        </div>
                        {topPerformers[0] && (
                            <div className="space-y-2">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {topPerformers[0].name}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    CRS: {formatCRS(topPerformers[0].metrics.current_crs)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    RS: {topPerformers[0].metrics.current_rs.toFixed(4)}
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingDown className="h-5 w-5 text-red-500" />
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                Ngành yếu nhất
                            </h4>
                        </div>
                        {bottomPerformers[0] && (
                            <div className="space-y-2">
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {bottomPerformers[0].name}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    CRS: {formatCRS(bottomPerformers[0].metrics.current_crs)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    RS: {bottomPerformers[0].metrics.current_rs.toFixed(4)}
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="h-5 w-5 text-blue-500" />
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                Tổng quan
                            </h4>
                        </div>
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {industries.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Ngành được phân tích
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Chu kỳ: {data.lookback_period} ngày
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Top Performers Section */}
            {activeSection === 'top_performers' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Top 10 Ngành mạnh nhất
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {topPerformers.map((industry, index) => (
                            <Card key={index} className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                            {industry.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            #{index + 1} trong {industries.length} ngành
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            industry.performance_summary.rs_trend === 'bullish' 
                                                ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                                : industry.performance_summary.rs_trend === 'bearish'
                                                ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                                : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
                                        }`}>
                                            {industry.performance_summary.rs_trend}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">CRS:</span>
                                        <span className="font-medium text-green-600 dark:text-green-400">
                                            {formatCRS(industry.metrics.current_crs)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">RS:</span>
                                        <span className="font-medium">{industry.metrics.current_rs.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Xu hướng dài hạn:</span>
                                        <span className={`font-medium ${getMATrend(industry.metrics.current_ma13, industry.metrics.current_ma49).color}`}>
                                            {getMATrend(industry.metrics.current_ma13, industry.metrics.current_ma49).icon} {getMATrend(industry.metrics.current_ma13, industry.metrics.current_ma49).text}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Sức mạnh xu hướng:</span>
                                        <span className={`font-medium ${getTrendStrength(industry.metrics.current_ma13, industry.metrics.current_ma49, industry.metrics.current_rs).color}`}>
                                            {getTrendStrength(industry.metrics.current_ma13, industry.metrics.current_ma49, industry.metrics.current_rs).text}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Độ ổn định:</span>
                                        <span className={`font-medium ${getConsistencyColor(getPerformanceConsistency(industry.metrics.outperforming_days, industry.metrics.total_days))}`}>
                                            {getPerformanceConsistency(industry.metrics.outperforming_days, industry.metrics.total_days)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Độ biến động:</span>
                                        <span className={`font-medium ${getVolatilityColor(industry.metrics.rs_volatility)}`}>
                                            {formatVolatility(industry.metrics.rs_volatility)}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Performers Section */}
            {activeSection === 'bottom_performers' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Top 10 Ngành yếu nhất
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {bottomPerformers.map((industry, index) => (
                            <Card key={index} className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                            {industry.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            #{industries.length - bottomPerformers.length + index + 1} trong {industries.length} ngành
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            industry.performance_summary.rs_trend === 'bullish' 
                                                ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                                : industry.performance_summary.rs_trend === 'bearish'
                                                ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                                : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
                                        }`}>
                                            {industry.performance_summary.rs_trend}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">CRS:</span>
                                        <span className="font-medium text-red-600 dark:text-red-400">
                                            {formatCRS(industry.metrics.current_crs)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">RS:</span>
                                        <span className="font-medium">{industry.metrics.current_rs.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Xu hướng dài hạn:</span>
                                        <span className={`font-medium ${getMATrend(industry.metrics.current_ma13, industry.metrics.current_ma49).color}`}>
                                            {getMATrend(industry.metrics.current_ma13, industry.metrics.current_ma49).icon} {getMATrend(industry.metrics.current_ma13, industry.metrics.current_ma49).text}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Sức mạnh xu hướng:</span>
                                        <span className={`font-medium ${getTrendStrength(industry.metrics.current_ma13, industry.metrics.current_ma49, industry.metrics.current_rs).color}`}>
                                            {getTrendStrength(industry.metrics.current_ma13, industry.metrics.current_ma49, industry.metrics.current_rs).text}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Độ ổn định:</span>
                                        <span className={`font-medium ${getConsistencyColor(getPerformanceConsistency(industry.metrics.outperforming_days, industry.metrics.total_days))}`}>
                                            {getPerformanceConsistency(industry.metrics.outperforming_days, industry.metrics.total_days)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Độ biến động:</span>
                                        <span className={`font-medium ${getVolatilityColor(industry.metrics.rs_volatility)}`}>
                                            {formatVolatility(industry.metrics.rs_volatility)}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Insights Section */}
            {activeSection === 'insights' && (
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Thống kê và Phân tích
                    </h3>
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Performance Distribution */}
                        <Card className="p-6">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Phân bố Hiệu suất
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Outperforming:</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        {industries.filter(i => i.performance_summary.crs_status === 'outperforming').length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Underperforming:</span>
                                    <span className="font-medium text-red-600 dark:text-red-400">
                                        {industries.filter(i => i.performance_summary.crs_status === 'underperforming').length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Tổng cộng:</span>
                                    <span className="font-medium">{industries.length}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Trend Distribution */}
                        <Card className="p-6">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Phân bố Xu hướng
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Bullish:</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        {industries.filter(i => i.performance_summary.rs_trend === 'bullish').length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Bearish:</span>
                                    <span className="font-medium text-red-600 dark:text-red-400">
                                        {industries.filter(i => i.performance_summary.rs_trend === 'bearish').length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Neutral:</span>
                                    <span className="font-medium text-gray-600 dark:text-gray-400">
                                        {industries.filter(i => i.performance_summary.rs_trend === 'neutral').length}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Volatility Analysis */}
                        <Card className="p-6">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Phân tích Độ biến động
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Thấp (&lt;3%):</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        {industries.filter(i => i.metrics.rs_volatility < 0.03).length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Trung bình (3-6%):</span>
                                    <span className="font-medium text-yellow-600 dark:text-yellow-400">
                                        {industries.filter(i => i.metrics.rs_volatility >= 0.03 && i.metrics.rs_volatility < 0.06).length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Cao (&gt;6%):</span>
                                    <span className="font-medium text-red-600 dark:text-red-400">
                                        {industries.filter(i => i.metrics.rs_volatility >= 0.06).length}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Consistency Analysis */}
                        <Card className="p-6">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Phân tích Độ ổn định
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Tốt (&gt;60%):</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        {industries.filter(i => (i.metrics.outperforming_days / i.metrics.total_days) > 0.6).length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Trung bình (40-60%):</span>
                                    <span className="font-medium text-yellow-600 dark:text-yellow-400">
                                        {industries.filter(i => (i.metrics.outperforming_days / i.metrics.total_days) >= 0.4 && (i.metrics.outperforming_days / i.metrics.total_days) <= 0.6).length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Kém (&lt;40%):</span>
                                    <span className="font-medium text-red-600 dark:text-red-400">
                                        {industries.filter(i => (i.metrics.outperforming_days / i.metrics.total_days) < 0.4).length}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Average Metrics */}
                        <Card className="p-6">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Trung bình
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">CRS trung bình:</span>
                                    <span className="font-medium">
                                        {formatCRS(industries.reduce((sum, i) => sum + i.metrics.current_crs, 0) / industries.length)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Độ biến động TB:</span>
                                    <span className="font-medium">
                                        {formatVolatility(industries.reduce((sum, i) => sum + i.metrics.rs_volatility, 0) / industries.length)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Độ ổn định TB:</span>
                                    <span className="font-medium">
                                        {(industries.reduce((sum, i) => sum + (i.metrics.outperforming_days / i.metrics.total_days), 0) / industries.length * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Data Coverage */}
                        <Card className="p-6">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Độ phủ dữ liệu
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Tổng điểm dữ liệu:</span>
                                    <span className="font-medium">
                                        {industries.reduce((sum, i) => sum + i.metrics.total_days, 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Trung bình/ngành:</span>
                                    <span className="font-medium">
                                        {Math.round(industries.reduce((sum, i) => sum + i.metrics.total_days, 0) / industries.length)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Chu kỳ phân tích:</span>
                                    <span className="font-medium">
                                        {data.lookback_period} ngày
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Detailed Section */}
            {activeSection === 'detailed' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Chi tiết tất cả ngành nghề
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {filteredIndustries.length} / {industries.length} ngành
                        </span>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="grid gap-4 md:grid-cols-3">
                            {/* Trend Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Xu hướng
                                </label>
                                <select
                                    value={trendFilter}
                                    onChange={(e) => setTrendFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                                >
                                    <option value="">Tất cả xu hướng</option>
                                    <option value="bullish">Bullish</option>
                                    <option value="bearish">Bearish</option>
                                    <option value="neutral">Neutral</option>
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Trạng thái
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="outperforming">Outperforming</option>
                                    <option value="underperforming">Underperforming</option>
                                </select>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setTrendFilter('');
                                        setStatusFilter('');
                                    }}
                                    className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Ngành
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        CRS
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        RS
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Xu hướng dài hạn
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Sức mạnh xu hướng
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Độ ổn định
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Độ biến động
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Điểm mạnh
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {sortedIndustries.map((industry, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {industry.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${
                                                industry.metrics.current_crs > 0 
                                                    ? 'text-green-600 dark:text-green-400' 
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {formatCRS(industry.metrics.current_crs)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {industry.metrics.current_rs.toFixed(4)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`font-medium ${getMATrend(industry.metrics.current_ma13, industry.metrics.current_ma49).color}`}>
                                                {getMATrend(industry.metrics.current_ma13, industry.metrics.current_ma49).icon} {getMATrend(industry.metrics.current_ma13, industry.metrics.current_ma49).text}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`font-medium ${getTrendStrength(industry.metrics.current_ma13, industry.metrics.current_ma49, industry.metrics.current_rs).color}`}>
                                                {getTrendStrength(industry.metrics.current_ma13, industry.metrics.current_ma49, industry.metrics.current_rs).text}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                industry.performance_summary.crs_status === 'outperforming' 
                                                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                                    : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                            }`}>
                                                {industry.performance_summary.crs_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${getConsistencyColor(getPerformanceConsistency(industry.metrics.outperforming_days, industry.metrics.total_days))}`}>
                                                {getPerformanceConsistency(industry.metrics.outperforming_days, industry.metrics.total_days)}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${getVolatilityColor(industry.metrics.rs_volatility)}`}>
                                                {formatVolatility(industry.metrics.rs_volatility)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {industry.performance_summary.strength_score.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndustryRSAnalysis; 