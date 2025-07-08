import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import Card from './Card';

const VSAStockTable = ({ individual_results }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [marketStateFilter, setMarketStateFilter] = useState('');
    const [sentimentFilter, setSentimentFilter] = useState('');
    const [strengthFilter, setStrengthFilter] = useState('');
    const [sortField, setSortField] = useState('bullish_score');
    const [sortDirection, setSortDirection] = useState('desc');
    const [expandedRows, setExpandedRows] = useState(new Set());

    // Helper function to get sentiment color
    const getSentimentColor = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'bullish':
                return 'text-green-600 dark:text-green-400';
            case 'bearish':
                return 'text-red-600 dark:text-red-400';
            case 'neutral':
                return 'text-gray-600 dark:text-gray-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    // Helper function to get sentiment background color
    const getSentimentBgColor = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'bullish':
                return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
            case 'bearish':
                return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';
            case 'neutral':
                return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200';
            default:
                return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200';
        }
    };

    // Helper function to get signal strength color
    const getSignalStrengthColor = (strength) => {
        switch (strength?.toLowerCase()) {
            case 'strong':
                return 'text-red-600 dark:text-red-400';
            case 'medium':
                return 'text-yellow-600 dark:text-yellow-400';
            case 'weak':
                return 'text-green-600 dark:text-green-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    // Helper function to get signal icon
    const getSignalIcon = (bias) => {
        switch (bias?.toLowerCase()) {
            case 'bullish':
                return <TrendingUp className="h-4 w-4" />;
            case 'bearish':
                return <TrendingDown className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    // Helper function to format date
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown';
        const date = new Date(timestamp);
        return date.toLocaleDateString('vi-VN');
    };

    // Get unique values for filters
    const uniqueMarketStates = useMemo(() => {
        const states = [...new Set(individual_results.map(stock => stock.latest_analysis?.market_state).filter(Boolean))];
        return states.sort();
    }, [individual_results]);

    const uniqueSentiments = ['bullish', 'bearish', 'neutral'];

    const uniqueStrengths = ['strong', 'medium', 'weak'];

    // Helper function to get sort value
    const getSortValue = (stock, field) => {
        const analysis = stock.latest_analysis;

        switch (field) {
            case 'symbol':
                return stock.symbol;
            case 'bullish_score':
                return analysis?.bullish_score || 0;
            case 'volume_significance':
                return analysis?.volume_significance || 0;
            case 'pattern_reliability':
                return analysis?.pattern_reliability || 0;
            case 'signal_count':
                return stock.recent_analyses?.reduce((total, analysis) => 
                    total + (analysis.signals?.length || 0), 0
                ) || 0;
            case 'strong_signals':
                return stock.recent_analyses?.reduce((total, analysis) => 
                    total + (analysis.signals?.filter(signal => signal.strength === 'strong').length || 0), 0
                ) || 0;
            default:
                return 0;
        }
    };

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let filtered = individual_results.filter(stock => {
            const analysis = stock.latest_analysis;
            const allSignals = stock.recent_analyses?.flatMap(analysis => 
                analysis.signals?.map(signal => ({
                    ...signal,
                    date: analysis.timestamp,
                    days_ago: analysis.days_ago
                })) || []
            ) || [];

            const matchesSearch = searchTerm === '' || 
                stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesMarketState = marketStateFilter === '' || 
                analysis?.market_state === marketStateFilter;
            
            const matchesSentiment = sentimentFilter === '' || 
                allSignals.some(signal => signal.bias === sentimentFilter);
            
            const matchesStrength = strengthFilter === '' || 
                allSignals.some(signal => signal.strength === strengthFilter);
            
            return matchesSearch && matchesMarketState && matchesSentiment && matchesStrength;
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
    }, [individual_results, searchTerm, marketStateFilter, sentimentFilter, strengthFilter, sortField, sortDirection]);

    // Handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Handle row expansion
    const toggleRowExpansion = (symbol) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(symbol)) {
            newExpandedRows.delete(symbol);
        } else {
            newExpandedRows.add(symbol);
        }
        setExpandedRows(newExpandedRows);
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Phân tích từng mã chứng khoán
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredAndSortedData.length} / {individual_results.length} mã
                </span>
            </div>

            {/* Search and Filters */}
            <Card className="p-4">
                <div className="grid gap-4 md:grid-cols-6">
                    {/* Search Bar */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo mã..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                    {/* Market State Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Trạng thái thị trường
                        </label>
                        <select
                            value={marketStateFilter}
                            onChange={(e) => setMarketStateFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        >
                            <option value="">Tất cả trạng thái</option>
                            {uniqueMarketStates.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Sentiment Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tâm lý
                        </label>
                        <select
                            value={sentimentFilter}
                            onChange={(e) => setSentimentFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        >
                            <option value="">Tất cả tâm lý</option>
                            {uniqueSentiments.map((sentiment) => (
                                <option key={sentiment} value={sentiment}>
                                    {sentiment}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Strength Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Độ mạnh
                        </label>
                        <select
                            value={strengthFilter}
                            onChange={(e) => setStrengthFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        >
                            <option value="">Tất cả độ mạnh</option>
                            {uniqueStrengths.map((strength) => (
                                <option key={strength} value={strength}>
                                    {strength}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Clear Filters */}
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setMarketStateFilter('');
                                setSentimentFilter('');
                                setStrengthFilter('');
                                setSearchTerm('');
                            }}
                            className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            </Card>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Mã
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('bullish_score')}
                            >
                                <div className="flex items-center gap-1">
                                    VSA Score
                                    <SortIcon field="bullish_score" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('volume_significance')}
                            >
                                <div className="flex items-center gap-1">
                                    Khối lượng
                                    <SortIcon field="volume_significance" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('pattern_reliability')}
                            >
                                <div className="flex items-center gap-1">
                                    Độ tin cậy
                                    <SortIcon field="pattern_reliability" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('signal_count')}
                            >
                                <div className="flex items-center gap-1">
                                    Tín hiệu
                                    <SortIcon field="signal_count" />
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={() => handleSort('strong_signals')}
                            >
                                <div className="flex items-center gap-1">
                                    Tín hiệu mạnh
                                    <SortIcon field="strong_signals" />
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Trạng thái
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredAndSortedData.map((stock, index) => {
                            const analysis = stock.latest_analysis;
                            const bullishScore = analysis?.bullish_score || 0;
                            const isExpanded = expandedRows.has(stock.symbol);
                            
                            // Only calculate signals if row is expanded or we need counts
                            const allSignals = useMemo(() => {
                                if (!isExpanded && !sentimentFilter && !strengthFilter) {
                                    // Just return count for non-expanded rows without filters
                                    return stock.recent_analyses?.reduce((total, analysis) => 
                                        total + (analysis.signals?.length || 0), 0
                                    ) || 0;
                                }
                                return stock.recent_analyses?.flatMap(analysis => 
                                    analysis.signals?.map(signal => ({
                                        ...signal,
                                        date: analysis.timestamp,
                                        days_ago: analysis.days_ago
                                    })) || []
                                ) || [];
                            }, [stock.recent_analyses, isExpanded, sentimentFilter, strengthFilter]);
                            
                            const signalCount = typeof allSignals === 'number' ? allSignals : allSignals.length;
                            const strongSignals = typeof allSignals === 'number' ? 0 : allSignals.filter(signal => signal.strength === 'strong').length;

                            return (
                                <React.Fragment key={index}>
                                    <tr 
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                        onClick={() => toggleRowExpansion(stock.symbol)}
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {stock.symbol}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${
                                                bullishScore > 20 
                                                    ? 'text-green-600 dark:text-green-400' 
                                                    : bullishScore < -20 
                                                        ? 'text-red-600 dark:text-red-400' 
                                                        : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                                {bullishScore.toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {analysis?.volume_significance?.toFixed(1)}%
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {analysis?.pattern_reliability?.toFixed(1)}%
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {signalCount}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {strongSignals}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                analysis?.market_state === 'accumulation' 
                                                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                                                    : analysis?.market_state === 'distribution'
                                                    ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                                    : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
                                            }`}>
                                                {analysis?.market_state || 'Unknown'}
                                            </span>
                                        </td>
                                    </tr>
                                    {/* Expanded row with signals */}
                                    {isExpanded && (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-3 bg-gray-50 dark:bg-gray-800">
                                                <div className="space-y-3">
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                        Tín hiệu VSA cho {stock.symbol}
                                                    </h4>
                                                    {typeof allSignals === 'object' && allSignals.length > 0 ? (
                                                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                                                            {allSignals.map((signal, signalIndex) => (
                                                                <div key={signalIndex} className="bg-white dark:bg-gray-700 rounded p-3 border border-gray-200 dark:border-gray-600">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={getSentimentColor(signal.bias)}>
                                                                                {getSignalIcon(signal.bias)}
                                                                            </span>
                                                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                                {signal.signal_name}
                                                                            </span>
                                                                        </div>
                                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentBgColor(signal.bias)}`}>
                                                                            {signal.bias}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                        <span>{formatDate(signal.date)}</span>
                                                                        <span className={getSignalStrengthColor(signal.strength)}>
                                                                            {signal.strength}
                                                                        </span>
                                                                    </div>
                                                                    {signal.action_suggestion && (
                                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                            {signal.action_suggestion}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            Không có tín hiệu VSA
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VSAStockTable; 