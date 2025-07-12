import React, { useState, useMemo } from 'react';
import { useDataLoader } from '../hooks/useDataLoader';
import { TrendingUp, TrendingDown, Activity, BarChart3, Target, AlertTriangle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import Card from './Card';

const TickerRSAnalysis = () => {
    const { data, loading, error } = useDataLoader('rs_analysis');
    const [activeSection, setActiveSection] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState('');
    const [trendFilter, setTrendFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortField, setSortField] = useState('current_crs');
    const [sortDirection, setSortDirection] = useState('desc');

    // Helper function to get sort value
    const getSortValue = (symbol, field) => {
        switch (field) {
            case 'symbol':
                return symbol.symbol;
            case 'name':
                return symbol.name;
            case 'current_crs':
                return symbol.metrics.current_crs;
            case 'current_rs':
                return symbol.metrics.current_rs;
            case 'current_ma13':
                return symbol.metrics.current_ma13;
            case 'current_ma49':
                return symbol.metrics.current_ma49;
            case 'rs_trend':
                return symbol.performance_summary.rs_trend;
            case 'crs_status':
                return symbol.performance_summary.crs_status;
            default:
                return 0;
        }
    };

    // Extract unique industries for filter dropdown - must be called before any conditional returns
    const uniqueIndustries = useMemo(() => {
        if (!data || !data.symbols) return [];
        const industries = new Set();
        data.symbols.forEach(symbol => {
            if (symbol.industries && symbol.industries.length > 0) {
                symbol.industries.forEach(industry => {
                    if (industry.name) {
                        industries.add(industry.name);
                    }
                });
            }
        });
        return Array.from(industries).sort();
    }, [data]);

    // Filter and sort symbols - must be called before any conditional returns
    const filteredAndSortedSymbols = useMemo(() => {
        if (!data || !data.symbols) return [];
        
        let filtered = data.symbols.filter(symbol => {
            const matchesSearch = searchTerm === '' || 
                symbol.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                symbol.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesIndustry = industryFilter === '' || 
                symbol.industries?.some(industry => industry.name === industryFilter);
            
            const matchesTrend = trendFilter === '' || 
                symbol.performance_summary.rs_trend === trendFilter;
            
            const matchesStatus = statusFilter === '' || 
                symbol.performance_summary.crs_status === statusFilter;
            
            return matchesSearch && matchesIndustry && matchesTrend && matchesStatus;
        });

        // Sort data
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
    }, [data, searchTerm, industryFilter, trendFilter, statusFilter, sortField, sortDirection]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải dữ liệu phân tích RS mã chứng khoán...</span>
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

    if (!data || !data.symbols) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu phân tích RS mã chứng khoán</p>
            </div>
        );
    }

    const { symbols } = data;

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

    // Helper function to safely get industry name
    const getIndustryName = (industries) => {
      if (!industries || !industries.length) return 'Unknown Industry';
      const primary = industries.find(i => i.is_primary);
      const first = industries[0];
      const name = primary?.name || first?.name;
      return typeof name === 'string' ? name : 'Unknown Industry';
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

    // Get top performers
    const topPerformers = filteredAndSortedSymbols.slice(0, 10);
    const bottomPerformers = filteredAndSortedSymbols.slice(-10).reverse();

    const sections = [
        { id: 'overview', name: 'Tổng quan', icon: BarChart3 },
        { id: 'top_performers', name: 'Mã mạnh nhất', icon: TrendingUp },
        { id: 'bottom_performers', name: 'Mã yếu nhất', icon: TrendingDown },
        { id: 'detailed', name: 'Chi tiết', icon: Target }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Phân tích Sức mạnh Tương đối (RS) Mã chứng khoán
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Phân tích sức mạnh tương đối của các mã chứng khoán so với VN-Index
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
                        CRS là tỷ lệ thể hiện hiệu suất tương đối của mã chứng khoán so với VN-Index trong 21 ngày. 
                        Giá trị được tính bằng cách chia lợi nhuận của mã cho lợi nhuận VN-Index, sau đó trừ 1 để căn giữa quanh 0.
                    </p>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                        <li>• <strong>+4.56%</strong> = Mã vượt trội VN-Index 4.56%</li>
                        <li>• <strong>-2.34%</strong> = Mã thua kém VN-Index 2.34%</li>
                        <li>• <strong>0.00%</strong> = Mã có hiệu suất ngang bằng VN-Index</li>
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
                                Mã mạnh nhất
                            </h4>
                        </div>
                        {topPerformers[0] && (
                            <div className="space-y-2">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {topPerformers[0].symbol}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
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
                                Mã yếu nhất
                            </h4>
                        </div>
                        {bottomPerformers[0] && (
                            <div className="space-y-2">
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {bottomPerformers[0].symbol}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
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
                                {symbols.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Mã được phân tích
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
                        Top 10 Mã mạnh nhất
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {topPerformers.map((symbol, index) => (
                            <Card key={index} className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                            {symbol.symbol}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {symbol.name}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            #{index + 1} trong {symbols.length} mã
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            symbol.performance_summary.rs_trend === 'bullish' 
                                                ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                                : symbol.performance_summary.rs_trend === 'bearish'
                                                ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                                : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
                                        }`}>
                                            {symbol.performance_summary.rs_trend}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">CRS:</span>
                                        <span className="font-medium text-green-600 dark:text-green-400">
                                            {formatCRS(symbol.metrics.current_crs)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">RS:</span>
                                        <span className="font-medium">{symbol.metrics.current_rs.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">MA13:</span>
                                        <span className="font-medium">{symbol.metrics.current_ma13.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">MA49:</span>
                                        <span className="font-medium">{symbol.metrics.current_ma49.toFixed(4)}</span>
                                    </div>
                                    {symbol.industries && symbol.industries.length > 0 && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Ngành: {getIndustryName(symbol.industries)}
                                        </div>
                                    )}
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
                        Top 10 Mã yếu nhất
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {bottomPerformers.map((symbol, index) => (
                            <Card key={index} className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                            {symbol.symbol}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {symbol.name}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            #{symbols.length - bottomPerformers.length + index + 1} trong {symbols.length} mã
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            symbol.performance_summary.rs_trend === 'bullish' 
                                                ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                                : symbol.performance_summary.rs_trend === 'bearish'
                                                ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                                : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
                                        }`}>
                                            {symbol.performance_summary.rs_trend}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">CRS:</span>
                                        <span className="font-medium text-red-600 dark:text-red-400">
                                            {formatCRS(symbol.metrics.current_crs)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">RS:</span>
                                        <span className="font-medium">{symbol.metrics.current_rs.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">MA13:</span>
                                        <span className="font-medium">{symbol.metrics.current_ma13.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">MA49:</span>
                                        <span className="font-medium">{symbol.metrics.current_ma49.toFixed(4)}</span>
                                    </div>
                                    {symbol.industries && symbol.industries.length > 0 && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Ngành: {getIndustryName(symbol.industries)}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Detailed Section */}
            {activeSection === 'detailed' && (
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
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="grid gap-4 md:grid-cols-5">
                            {/* Search Bar */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tìm kiếm
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo mã hoặc tên công ty..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                            </div>
                            {/* Industry Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ngành nghề
                                </label>
                                <select
                                    value={industryFilter}
                                    onChange={(e) => setIndustryFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                                >
                                    <option value="">Tất cả ngành</option>
                                    {uniqueIndustries.map((industry) => (
                                        <option key={industry} value={industry}>
                                            {industry}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                                        setIndustryFilter('');
                                        setTrendFilter('');
                                        setStatusFilter('');
                                        setSearchTerm('');
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
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredAndSortedSymbols.map((symbol, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {symbol.symbol}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                                {symbol.name}
                                            </div>
                                            {symbol.industries && symbol.industries.length > 0 && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {getIndustryName(symbol.industries)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${
                                                symbol.metrics.current_crs > 0 
                                                    ? 'text-green-600 dark:text-green-400' 
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {formatCRS(symbol.metrics.current_crs)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {symbol.metrics.current_rs.toFixed(4)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {symbol.metrics.current_ma13.toFixed(4)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {symbol.metrics.current_ma49.toFixed(4)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                symbol.performance_summary.rs_trend === 'bullish' 
                                                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                                    : symbol.performance_summary.rs_trend === 'bearish'
                                                    ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                                    : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
                                            }`}>
                                                {getTrendIcon(symbol.performance_summary.rs_trend)}
                                                <span className="ml-1">{symbol.performance_summary.rs_trend}</span>
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                symbol.performance_summary.crs_status === 'outperforming' 
                                                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                                    : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                            }`}>
                                                {symbol.performance_summary.crs_status}
                                            </span>
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

export default TickerRSAnalysis; 