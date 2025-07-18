import React, { useState, useMemo } from 'react';
import { useDataLoader, useTickerInfo } from '../utils/dataLoader';
import { Search, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';
import SymbolInfoPanelMinified from './rrg/SymbolInfoPanelMinified';


const TickerRSTable = () => {
    const { data, loading, error } = useDataLoader('rs_analysis');
    const { getTickerInfo, getIndustryName, loading: tickerInfoLoading } = useTickerInfo();
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState('');
    const [trendFilter, setTrendFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortField, setSortField] = useState('current_crs');
    const [sortDirection, setSortDirection] = useState('desc');
    const [expandedSymbolId, setExpandedSymbolId] = useState(null);


    // Get symbols safely, defaulting to empty array if data is not available
    const symbols = data?.symbols || [];

    // Helper function for sorting - must be defined before useMemo
    const getSortValue = (symbol, field) => {
        switch (field) {
            case 'symbol':
                return symbol.symbol;
            case 'name':
                return symbol.name;
            case 'current_crs':
                return symbol.metrics?.current_crs || 0;
            case 'current_rs':
                return symbol.metrics?.current_rs || 0;
            case 'current_ma13':
                return symbol.metrics?.current_ma13 || 0;
            case 'current_ma49':
                return symbol.metrics?.current_ma49 || 0;
            case 'rs_trend':
                return symbol.performance_summary?.rs_trend || '';
            case 'crs_status':
                return symbol.performance_summary?.crs_status || '';
            case 'short_term_momentum':
                return symbol.speed_analysis?.short_term_momentum || 0;
            case 'long_term_momentum':
                return symbol.speed_analysis?.long_term_momentum || 0;
            case 'weighted_speed':
                return symbol.speed_analysis?.weighted_speed || 0;
            case 'speed_category':
                return symbol.speed_analysis?.speed_category || '';
            default:
                return 0;
        }
    };

    // Filter and sort symbols - moved before conditional returns
    const filteredAndSortedSymbols = useMemo(() => {
        if (!symbols || symbols.length === 0) return [];
        
        let filtered = symbols.filter(symbol => {
            const tickerInfo = getTickerInfo(symbol.symbol);
            const tickerName = tickerInfo?.name || symbol.name || '';
            const tickerIndustry = tickerInfo?.industry || '';
            
            const matchesSearch = symbol.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                tickerName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesIndustry = !industryFilter || 
                tickerIndustry.toLowerCase().includes(industryFilter.toLowerCase());
            const matchesTrend = !trendFilter || symbol.performance_summary?.rs_trend === trendFilter;
            const matchesStatus = !statusFilter || symbol.performance_summary?.crs_status === statusFilter;
            
            return matchesSearch && matchesIndustry && matchesTrend && matchesStatus;
        });

        // Sort
        filtered.sort((a, b) => {
            const aValue = getSortValue(a, sortField);
            const bValue = getSortValue(b, sortField);
            
            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [symbols, searchTerm, industryFilter, trendFilter, statusFilter, sortField, sortDirection, getTickerInfo]);

    // Get unique industries for filter - moved before conditional returns
    const industries = useMemo(() => {
        if (!symbols || symbols.length === 0) return [];
        
        const industrySet = new Set();
        symbols.forEach(symbol => {
            const tickerInfo = getTickerInfo(symbol.symbol);
            if (tickerInfo?.industry) {
                industrySet.add(tickerInfo.industry);
            }
        });
        return Array.from(industrySet).sort();
    }, [symbols, getTickerInfo]);

    // Helper functions
    const formatCRS = (crs) => {
        if (crs === null || crs === undefined) return 'N/A';
        const percentage = (crs * 100).toFixed(2);
        return `${percentage}%`;
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'tăng trưởng':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'suy giảm':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'ổn định':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getTickerDisplayInfo = (symbol) => {
        const tickerInfo = getTickerInfo(symbol.symbol);
        return {
            name: tickerInfo?.name || symbol.name || 'N/A',
            industry: tickerInfo?.industry || 'N/A'
        };
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const toggleExpanded = (symbolId) => {
        setExpandedSymbolId(expandedSymbolId === symbolId ? null : symbolId);
    };

    // Helper functions for formatting and styling
    const formatPercentage = (value) => {
        if (value === null || value === undefined) return 'N/A';
        return `${(value * 100).toFixed(2)}%`;
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'Tăng trưởng':
                return <TrendingUp className="w-3 h-3" />;
            case 'Suy giảm':
                return <TrendingDown className="w-3 h-3" />;
            default:
                return null;
        }
    };

    const getMomentumColor = (trend, momentum) => {
        if (!momentum) return 'text-gray-600 dark:text-gray-400';
        if (momentum > 0) return 'text-green-600 dark:text-green-400';
        if (momentum < 0) return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };



    // Now we can have conditional returns after all hooks
    if (loading || tickerInfoLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">Lỗi tải dữ liệu: {error}</div>
            </div>
        );
    }

    if (!data || !data.symbols) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500">Không có dữ liệu để hiển thị</div>
            </div>
        );
    }



    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Chi tiết tất cả mã chứng khoán
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredAndSortedSymbols.length} / {symbols.length} mã
                </span>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tìm kiếm
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Tìm theo mã hoặc tên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ngành
                    </label>
                    <select
                        value={industryFilter}
                        onChange={(e) => setIndustryFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Tất cả ngành</option>
                        {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Xu hướng
                    </label>
                    <select
                        value={trendFilter}
                        onChange={(e) => setTrendFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Tất cả xu hướng</option>
                        <option value="Tăng trưởng">Tăng trưởng</option>
                        <option value="Suy giảm">Suy giảm</option>
                        <option value="Trung lập">Trung lập</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Trạng thái
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Vượt trội">Vượt trội</option>
                        <option value="Kém hiệu quả">Kém hiệu quả</option>
                        <option value="Trung lập">Trung lập</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th 
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('symbol')}
                                >
                                    <div className="flex items-center gap-1">
                                        Mã
                                        <SortIcon field="symbol" />
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-1">
                                        Tên công ty
                                        <SortIcon field="name" />
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Ngành
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
                                    onClick={() => handleSort('current_ma13')}
                                >
                                    <div className="flex items-center gap-1">
                                        MA13
                                        <SortIcon field="current_ma13" />
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('current_ma49')}
                                >
                                    <div className="flex items-center gap-1">
                                        MA49
                                        <SortIcon field="current_ma49" />
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredAndSortedSymbols.map((symbol, index) => (
                                <React.Fragment key={index}>
                                    <tr 
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                        onClick={() => toggleExpanded(symbol.symbol)}
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {expandedSymbolId === symbol.symbol ? (
                                                    <ChevronUp className="w-4 h-4 text-gray-400 mr-2" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-gray-400 mr-2" />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {symbol.symbol}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        #{index + 1}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                                {getTickerDisplayInfo(symbol).name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {getTickerDisplayInfo(symbol).industry}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${
                                                symbol.metrics?.current_crs > 0 
                                                    ? 'text-green-600 dark:text-green-400' 
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {formatCRS(symbol.metrics?.current_crs)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {symbol.metrics?.current_rs?.toFixed(4) || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {symbol.metrics?.current_ma13?.toFixed(4) || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {symbol.metrics?.current_ma49?.toFixed(4) || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                symbol.performance_summary?.rs_trend === 'Tăng trưởng' 
                                                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                                    : symbol.performance_summary?.rs_trend === 'Suy giảm'
                                                    ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                                    : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
                                            }`}>
                                                {getTrendIcon(symbol.performance_summary?.rs_trend)}
                                                <span className="ml-1">{symbol.performance_summary?.rs_trend || 'N/A'}</span>
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                symbol.performance_summary?.crs_status === 'Vượt trội' 
                                                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                                    : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                            }`}>
                                                {symbol.performance_summary?.crs_status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${getMomentumColor(symbol.performance_summary?.rs_trend, symbol.speed_analysis?.short_term_momentum)}`}>
                                                {symbol.speed_analysis?.short_term_momentum ? 
                                                    (symbol.speed_analysis.short_term_momentum > 0 ? '+' : '') + formatPercentage(symbol.speed_analysis.short_term_momentum) 
                                                    : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${getMomentumColor(symbol.performance_summary?.rs_trend, symbol.speed_analysis?.long_term_momentum)}`}>
                                                {symbol.speed_analysis?.long_term_momentum ? 
                                                    (symbol.speed_analysis.long_term_momentum > 0 ? '+' : '') + formatPercentage(symbol.speed_analysis.long_term_momentum) 
                                                    : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${getMomentumColor(symbol.performance_summary?.rs_trend, symbol.speed_analysis?.weighted_speed)}`}>
                                                {symbol.speed_analysis?.weighted_speed ? 
                                                    (symbol.speed_analysis.weighted_speed > 0 ? '+' : '') + formatPercentage(symbol.speed_analysis.weighted_speed) 
                                                    : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-900 dark:text-gray-100">
                                                {symbol.speed_analysis?.speed_category || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                    {expandedSymbolId === symbol.symbol && (
                                        <tr>
                                                                                    <td colSpan={13} className="bg-gray-50 dark:bg-gray-900/50 p-4">
                                            <SymbolInfoPanelMinified symbol={symbol} analyzeData={data} />
                                        </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TickerRSTable; 