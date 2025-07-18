import React, { useState, useContext } from 'react';
import { useDataLoader, useTickerInfoWithData } from '../utils/dataLoader';
import { DataReloadContext } from '../contexts/DataReloadContext';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import IndustryInfoPanel from './rrg/IndustryInfoPanel';

const IndustryRSAnalysis = () => {
    const { data, loading, error } = useDataLoader('rs_analysis');
    
    // Get pre-loaded data from context
    const { companies, industries, essentialDataLoading } = useContext(DataReloadContext);
    
    // Use the pre-loaded data for ticker info
    const { getIndustryName, loading: tickerInfoLoading } = useTickerInfoWithData(companies, industries);
    
    const [trendFilter, setTrendFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortField, setSortField] = useState('current_crs');
    const [sortDirection, setSortDirection] = useState('desc');
    const [expandedIndustryId, setExpandedIndustryId] = useState(null);

    if (loading || essentialDataLoading) {
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

    const { industries: rsIndustries } = data;

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

    // Helper function to get sort value
    const getSortValue = (industry, field) => {
        switch (field) {
            case 'name':
                return industry.name;
            case 'current_crs':
                return industry.metrics.current_crs;
            case 'current_rs':
                return industry.metrics.current_rs;
            case 'current_ma13':
                return industry.metrics.current_ma13;
            case 'current_ma49':
                return industry.metrics.current_ma49;
            case 'rs_trend':
                return industry.performance_summary.rs_trend;
            case 'crs_status':
                return industry.performance_summary.crs_status;
            case 'short_term_momentum':
                return industry.speed_analysis?.short_term_momentum || 0;
            case 'long_term_momentum':
                return industry.speed_analysis?.long_term_momentum || 0;
            case 'weighted_speed':
                return industry.speed_analysis?.weighted_speed || 0;
            case 'momentum_ratio':
                return industry.speed_analysis?.momentum_ratio || 0;
            case 'speed_category':
                return industry.speed_analysis?.speed_category || '';
            case 'strength_score':
                return industry.performance_summary.strength_score;
            case 'consistency':
                return industry.metrics.outperforming_days / industry.metrics.total_days;
            case 'volatility':
                return industry.metrics.rs_volatility;
            case 'consensus_strength':
                return industry.trend_consistency?.consensus_strength || 0;
            default:
                return 0;
        }
    };

    // Handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Sort icon component
    const SortIcon = ({ field }) => {
        if (sortField !== field) {
            return <ChevronDown className="h-4 w-4 text-gray-400" />;
        }
        return sortDirection === 'asc' 
            ? <ChevronUp className="h-4 w-4 text-blue-500" />
            : <ChevronDown className="h-4 w-4 text-blue-500" />;
    };

    // Filter industries based on filters
    const filteredIndustries = rsIndustries.filter(industry => {
        const matchesTrend = trendFilter === '' || 
            industry.performance_summary.rs_trend === trendFilter;
        
        const matchesStatus = statusFilter === '' || 
            industry.performance_summary.crs_status === statusFilter;
        
        return matchesTrend && matchesStatus;
    });

    // Sort industries based on current sort field and direction
    const sortedIndustries = [...filteredIndustries].sort((a, b) => {
        const aValue = getSortValue(a, sortField);
        const bValue = getSortValue(b, sortField);
        
        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    // Helper function to get contextual momentum color
    const getMomentumColor = (trend, momentum) => {
        if (trend === 'Tăng trưởng') {
            if (momentum > 0) return 'text-green-600 dark:text-green-400'; // accelerating up
            if (momentum < 0) return 'text-red-600 dark:text-red-400'; // losing steam
        } else if (trend === 'Suy giảm') {
            if (momentum > 0) return 'text-red-600 dark:text-red-400'; // accelerating down
            if (momentum < 0) return 'text-green-600 dark:text-green-400'; // decline slowing
        }
        return 'text-gray-600 dark:text-gray-400'; // neutral
    };

    // Helper function to get industry display name
    const getIndustryDisplayName = (industry) => {
        // Try to get the industry name from the centralized data
        // The RS data might use custom_id, but centralized data uses id
        const industryId = industry.custom_id || industry.id;
        const industryName = getIndustryName(industryId);
        return industryName !== 'Unknown' ? industryName : industry.name;
    };

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
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Xu hướng (Trend) Filter */}
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
                            <option value="Tăng trưởng">Tăng trưởng</option>
                            <option value="Suy giảm">Suy giảm</option>
                            <option value="Trung lập">Trung lập</option>
                        </select>
                    </div>

                    {/* Trạng thái (Status) Filter */}
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
                            <option value="Vượt trội">Vượt trội</option>
                            <option value="Kém hiệu quả">Kém hiệu quả</option>
                            <option value="Trung lập">Trung lập</option>
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

            {/* Results Summary */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Kết quả phân tích
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredIndustries.length} / {rsIndustries.length} ngành
                </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center gap-1">
                                    Ngành
                                    <SortIcon field="name" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('current_crs')}
                            >
                                <div className="flex items-center gap-1">
                                    CRS
                                    <SortIcon field="current_crs" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('current_rs')}
                            >
                                <div className="flex items-center gap-1">
                                    RS
                                    <SortIcon field="current_rs" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('short_term_momentum')}
                            >
                                <div className="flex items-center gap-1">
                                    Momentum ngắn hạn
                                    <SortIcon field="short_term_momentum" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('long_term_momentum')}
                            >
                                <div className="flex items-center gap-1">
                                    Momentum dài hạn
                                    <SortIcon field="long_term_momentum" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('weighted_speed')}
                            >
                                <div className="flex items-center gap-1">
                                    Tốc độ tổng hợp
                                    <SortIcon field="weighted_speed" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('speed_category')}
                            >
                                <div className="flex items-center gap-1">
                                    Phân loại tốc độ
                                    <SortIcon field="speed_category" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('rs_trend')}
                            >
                                <div className="flex items-center gap-1">
                                    Xu hướng
                                    <SortIcon field="rs_trend" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('crs_status')}
                            >
                                <div className="flex items-center gap-1">
                                    Trạng thái
                                    <SortIcon field="crs_status" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('consistency')}
                            >
                                <div className="flex items-center gap-1">
                                    Độ ổn định
                                    <SortIcon field="consistency" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('volatility')}
                            >
                                <div className="flex items-center gap-1">
                                    Độ biến động
                                    <SortIcon field="volatility" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('consensus_strength')}
                            >
                                <div className="flex items-center gap-1">
                                    Đồng thuận
                                    <SortIcon field="consensus_strength" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('strength_score')}
                            >
                                <div className="flex items-center gap-1">
                                    Điểm mạnh
                                    <SortIcon field="strength_score" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedIndustries.map((industry, index) => (
                            <React.Fragment key={index}>
                                <tr 
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => setExpandedIndustryId(expandedIndustryId === industry.custom_id ? null : industry.custom_id)}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {getIndustryDisplayName(industry)}
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
                                        <span className={`text-sm font-medium ${getMomentumColor(industry.performance_summary.rs_trend, industry.speed_analysis?.short_term_momentum)}`}>
                                            {industry.speed_analysis?.short_term_momentum ? 
                                                (industry.speed_analysis.short_term_momentum > 0 ? '+' : '') + formatPercentage(industry.speed_analysis.short_term_momentum) 
                                                : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`text-sm font-medium ${getMomentumColor(industry.performance_summary.rs_trend, industry.speed_analysis?.long_term_momentum)}`}>
                                            {industry.speed_analysis?.long_term_momentum ? 
                                                (industry.speed_analysis.long_term_momentum > 0 ? '+' : '') + formatPercentage(industry.speed_analysis.long_term_momentum) 
                                                : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`text-sm font-medium ${getMomentumColor(industry.performance_summary.rs_trend, industry.speed_analysis?.weighted_speed)}`}>
                                            {industry.speed_analysis?.weighted_speed ? 
                                                (industry.speed_analysis.weighted_speed > 0 ? '+' : '') + formatPercentage(industry.speed_analysis.weighted_speed) 
                                                : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="text-sm text-gray-900 dark:text-gray-100">
                                            {industry.speed_analysis?.speed_category || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            industry.performance_summary.rs_trend === 'Tăng trưởng'
                                                ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                                : industry.performance_summary.rs_trend === 'Suy giảm'
                                                ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                                : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
                                        }`}>
                                            {industry.performance_summary.rs_trend}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            industry.performance_summary.crs_status === 'Vượt trội' 
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
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`text-sm font-medium ${
                                            industry.trend_consistency?.consensus_strength > 0 ? 'text-green-600 dark:text-green-400' : industry.trend_consistency?.consensus_strength < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                            {industry.trend_consistency?.consensus_strength !== undefined ? industry.trend_consistency.consensus_strength.toFixed(2) : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {typeof industry.performance_summary?.strength_score === 'number' ? industry.performance_summary.strength_score.toFixed(2) : 'N/A'}
                                    </td>
                                </tr>
                                {expandedIndustryId === industry.custom_id && (
                                    <tr>
                                        <td colSpan={14} className="bg-gray-50 dark:bg-gray-900/50 p-4">
                                            <IndustryInfoPanel industry={industry} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CRS Explanation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Giải thích các chỉ số
                </h4>
                
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            CRS (Cumulative Relative Strength)
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            CRS là tỷ lệ thể hiện hiệu suất tương đối của ngành so với VN-Index trong 21 ngày. 
                            Giá trị được tính bằng cách chia lợi nhuận của ngành cho lợi nhuận VN-Index, sau đó trừ 1 để căn giữa quanh 0.
                        </p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• <strong>+4.56%</strong> = Ngành vượt trội VN-Index 4.56%</li>
                            <li>• <strong>-2.34%</strong> = Ngành thua kém VN-Index 2.34%</li>
                            <li>• <strong>0.00%</strong> = Ngành có hiệu suất ngang bằng VN-Index</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            RS (Relative Strength)
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            RS là tỷ lệ giá hiện tại của ngành so với VN-Index. Giá trị &gt; 1 nghĩa là ngành đang có hiệu suất tốt hơn VN-Index.
                        </p>
                        
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 mt-4">
                            Momentum
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Momentum đo lường tốc độ thay đổi của RS. Giá trị dương cho thấy xu hướng tăng tốc, giá trị âm cho thấy xu hướng chậm lại.
                        </p>
                        
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 mt-4">
                            Độ ổn định & Độ biến động
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Độ ổn định: Tỷ lệ ngày ngành vượt trội VN-Index. Độ biến động: Mức độ dao động của RS.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndustryRSAnalysis; 