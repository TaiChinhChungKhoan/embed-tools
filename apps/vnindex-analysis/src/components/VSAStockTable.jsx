import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import Card from './Card';
import { useDataLoader } from '../utils/dataLoader';
import { getColorForVSAScore, getColorForVSAPattern, getColorForVSARecommendation, getColorForAtZone } from '../utils/vsaColorUtils';
import { MultiSelect } from "@embed-tools/components/components/ui/multi-select";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

const VSAStockTable = ({ stocks, timeframe = '1D' }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState([]);
    const [marketStateFilter, setMarketStateFilter] = useState('');
    const [sentimentFilter, setSentimentFilter] = useState('');
    const [strengthFilter, setStrengthFilter] = useState('');
    const [industryFilter, setIndustryFilter] = useState([]);
    const [expandedRows, setExpandedRows] = useState(new Set());

    // Get available industries and symbols for filtering using centralized data loader
    const { data: analyticsData } = useDataLoader('RRG_ANALYSIS', timeframe);
    const { industries: availableIndustries, symbols: availableSymbols } = analyticsData || { industries: [], symbols: [] };

    // Create column helper for TanStack Table
    const columnHelper = createColumnHelper();

    // Get all unique dates from the VSA score data for column headers
    const allDates = useMemo(() => {
        if (!stocks || !Array.isArray(stocks)) return [];
        const dates = new Set();
        stocks.forEach(stock => {
            if (stock.scores) {
                stock.scores.forEach(scoreObj => {
                    const dateKey = Object.keys(scoreObj)[0];
                    if (dateKey) {
                        dates.add(dateKey);
                    }
                });
            }
        });
        
        // Sort dates chronologically with latest dates first (most recent to oldest)
        const sortedDates = Array.from(dates).sort((a, b) => new Date(b) - new Date(a));
        return sortedDates.slice(0, 20); // Take the most recent 20 dates
    }, [stocks]);

    // Define columns
    const columns = useMemo(() => {
        const baseColumns = [
            // Symbol column
            columnHelper.accessor('symbol', {
                header: () => (
                    <div className="text-left text-xs font-medium">
                        Symbol
                    </div>
                ),
                cell: ({ getValue }) => (
                    <div className="font-medium text-gray-900 text-left">
                        {getValue()}
                    </div>
                ),
                enableSorting: true,
                enableGlobalFilter: true,
            }),
            // Industry column
            columnHelper.accessor(row => {
                const stockData = availableSymbols.find(s => s.symbol === row.symbol);
                return stockData?.industries?.[0]?.name || 'Unknown';
            }, {
                id: 'industry',
                header: () => (
                    <div className="text-left text-xs font-medium">
                        Industry
                    </div>
                ),
                cell: ({ getValue }) => (
                    <div className="text-xs text-gray-600 truncate max-w-[120px] text-left">
                        {getValue()}
                    </div>
                ),
                enableSorting: true,
                enableGlobalFilter: true,
            }),
            // VSA Score column
            columnHelper.accessor('score', {
                header: 'VSA Score',
                cell: ({ getValue }) => {
                    const score = getValue();
                    return (
                        <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForVSAScore(score)}`}>
                            {score?.toFixed(1) || 0}
                        </div>
                    );
                },
                enableSorting: true,
            }),
            // Pattern column
            columnHelper.accessor('pattern', {
                header: 'Pattern',
                cell: ({ getValue }) => {
                    const pattern = getValue();
                    return (
                        <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForVSAPattern(pattern)}`}>
                            {pattern ? pattern.substring(0, 8) + '...' : '-'}
                        </div>
                    );
                },
                enableSorting: true,
            }),
            // Recommendation column
            columnHelper.accessor('rec', {
                header: 'Rec',
                cell: ({ getValue }) => {
                    const rec = getValue();
                    return (
                        <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForVSARecommendation(rec)}`}>
                            {rec === 'Buy Signal' ? 'BUY' : 
                             rec === 'Sell Signal' ? 'SELL' : 
                             rec === 'No Clear Signal' ? 'NEUTRAL' :
                             rec || '-'}
                        </div>
                    );
                },
                enableSorting: true,
            }),
            // Zone column
            columnHelper.accessor('at_zone', {
                header: 'Zone',
                cell: ({ getValue }) => {
                    const atZone = getValue();
                    return (
                        <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForAtZone(atZone)}`}>
                            {atZone ? '●' : '○'}
                        </div>
                    );
                },
                enableSorting: true,
            }),
        ];

        // Date columns
        allDates.forEach(date => {
            baseColumns.push(
                columnHelper.accessor(row => {
                    const scoreObj = row.scores?.find(scoreObj => {
                        const dateKey = Object.keys(scoreObj)[0];
                        return dateKey === date;
                    });
                    return scoreObj ? Object.values(scoreObj)[0] : null;
                }, {
                    id: `date_${date}`,
                    header: () => (
                        <div className="text-center text-xs font-medium">
                            {new Date(date).toLocaleDateString('vi-VN', { 
                                day: '2-digit', 
                                month: '2-digit' 
                            })}
                        </div>
                    ),
                    cell: ({ getValue, row }) => {
                        const score = getValue();
                        return (
                            <div 
                                className={`w-full h-6 flex items-center justify-center text-xs font-medium ${getColorForVSAScore(score)}`}
                                title={`${row.original.symbol}: ${score ? score.toFixed(2) : 'N/A'} (${new Date(date).toLocaleDateString('vi-VN')})`}
                            >
                                {score === null ? '-' : score.toFixed(1)}
                            </div>
                        );
                    },
                    enableSorting: true,
                })
            );
        });

        return baseColumns;
    }, [columnHelper, allDates, availableSymbols]);

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

    // Get unique values for filters based on new data structure
    const uniqueMarketStates = useMemo(() => {
        if (!stocks || !Array.isArray(stocks)) return [];
        // In the new structure, we have pattern and rec instead of market_state
        const patterns = [...new Set(stocks.map(stock => stock.pattern).filter(Boolean))];
        return patterns.sort();
    }, [stocks]);

    const uniqueSentiments = ['bullish', 'bearish', 'neutral'];

    const uniqueStrengths = ['strong', 'medium', 'weak'];

    // Helper function to get sort value (simplified for new data structure)
    const getSortValue = (stock, field) => {
        switch (field) {
            case 'symbol':
                return stock.symbol;
            case 'score':
                return stock.score || 0;
            case 'pattern':
                return stock.pattern || '';
            case 'rec':
                return stock.rec || '';
            default:
                // Handle date-based score columns (date_2025-08-01, etc.)
                if (field.startsWith('date_')) {
                    const targetDate = field.replace('date_', '');
                    if (stock.scores) {
                        const scoreObj = stock.scores.find(scoreObj => {
                            const dateKey = Object.keys(scoreObj)[0];
                            return dateKey === targetDate;
                        });
                        if (scoreObj) {
                            return Object.values(scoreObj)[0] || 0;
                        }
                    }
                    return 0;
                }
                return 0;
        }
    };

    // Process data with custom filters before passing to TanStack Table
    const processedData = useMemo(() => {
        if (!stocks || !Array.isArray(stocks)) return [];
        
        let filtered = stocks.filter(stock => {
            const matchesPattern = marketStateFilter === '' || 
                stock.pattern === marketStateFilter;
            
            // Simplified sentiment filtering based on score
            const matchesSentiment = sentimentFilter === '' || 
                (sentimentFilter === 'bullish' && stock.score > 2) ||
                (sentimentFilter === 'bearish' && stock.score < -2) ||
                (sentimentFilter === 'neutral' && stock.score >= -2 && stock.score <= 2);
            
            // Simplified strength filtering based on absolute score
            const matchesStrength = strengthFilter === '' || 
                (strengthFilter === 'strong' && Math.abs(stock.score) > 7) ||
                (strengthFilter === 'medium' && Math.abs(stock.score) > 3 && Math.abs(stock.score) <= 7) ||
                (strengthFilter === 'weak' && Math.abs(stock.score) <= 3);
            
            // Check industry filter (array-based)
            const stockData = availableSymbols.find(s => s.symbol === stock.symbol);
            const stockIndustry = stockData?.industries?.[0];
            const matchesIndustry = industryFilter.length === 0 || 
                (stockIndustry && industryFilter.includes(stockIndustry.id));
            
            return matchesPattern && matchesSentiment && matchesStrength && matchesIndustry;
        });

        return filtered;
    }, [stocks, marketStateFilter, sentimentFilter, strengthFilter, industryFilter, availableSymbols]);

    // Create table instance
    const table = useReactTable({
        data: processedData,
        columns,
        state: {
            globalFilter,
            columnFilters,
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: 'includesString',
        initialState: {
            pagination: {
                pageSize: 50,
            },
            sorting: [
                {
                    id: 'score',
                    desc: true,
                },
            ],
        },
    });

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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Phân tích từng mã chứng khoán
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {table.getFilteredRowModel().rows.length} / {table.getCoreRowModel().rows.length} mã
                </span>
            </div>

            {/* Search and Filters */}
            <Card className="p-4">
                <div className="grid gap-4 md:grid-cols-6">
                    {/* Search Bar - Made smaller */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Symbol
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                    {/* Market State Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pattern
                        </label>
                        <select
                            value={marketStateFilter}
                            onChange={(e) => setMarketStateFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        >
                            <option value="">Tất cả patterns</option>
                            {uniqueMarketStates.map((pattern) => (
                                <option key={pattern} value={pattern}>
                                    {pattern}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Industry Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ngành
                        </label>
                        <MultiSelect
                            options={availableIndustries.map(industry => ({
                                value: industry.id,
                                label: industry.name
                            }))}
                            value={industryFilter}
                            onValueChange={setIndustryFilter}
                            placeholder="Chọn ngành..."
                            className="w-full"
                        />
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
                                setIndustryFilter([]);
                                setGlobalFilter('');
                            }}
                            className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            </Card>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="bg-gray-50 border-b border-gray-200">
                                    {headerGroup.headers.map(header => {
                                        const isLeftAligned = header.id === 'symbol' || header.id === 'industry';
                                        return (
                                            <th
                                                key={header.id}
                                                className={`px-1 py-1 text-xs font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors ${
                                                    isLeftAligned ? 'text-left' : 'text-center'
                                                }`}
                                                onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                            >
                                                <div className={`flex items-center gap-1 ${
                                                    isLeftAligned ? 'justify-start' : 'justify-center'
                                                }`}>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getCanSort() && (
                                                        <div className="flex flex-col">
                                                            {header.column.getIsSorted() === 'asc' ? (
                                                                <ChevronUp className="w-3 h-3" />
                                                            ) : header.column.getIsSorted() === 'desc' ? (
                                                                <ChevronDown className="w-3 h-3" />
                                                            ) : (
                                                                <div className="w-3 h-3 opacity-30">
                                                                    <ChevronUp className="w-3 h-3" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                    <tbody>
                        {paginatedData.map((stock, index) => {
                            const isExpanded = expandedRows.has(stock.symbol);
                            const stockData = availableSymbols.find(s => s.symbol === stock.symbol);
                            const industry = stockData?.industries?.[0]?.name || 'Unknown';

                            return (
                                <React.Fragment key={index}>
                                    <tr 
                                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => toggleRowExpansion(stock.symbol)}
                                    >
                                        <td className="px-1 py-1 text-left text-xs">
                                            <div className="font-medium text-gray-900">
                                                {stock.symbol}
                                            </div>
                                        </td>
                                        <td className="px-1 py-1 text-left text-xs">
                                            <div className="text-xs text-gray-600 truncate max-w-[120px]">
                                                {industry}
                                            </div>
                                        </td>
                                        <td className="px-1 py-1 text-center text-xs">
                                            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForVSAScore(stock.score)}`}>
                                                {stock.score?.toFixed(1) || 0}
                                            </div>
                                        </td>
                                        <td className="px-1 py-1 text-center text-xs">
                                            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForVSAPattern(stock.pattern)}`}>
                                                {stock.pattern ? stock.pattern.substring(0, 8) + '...' : '-'}
                                            </div>
                                        </td>
                                        <td className="px-1 py-1 text-center text-xs">
                                            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForVSARecommendation(stock.rec)}`}>
                                                {stock.rec === 'Buy Signal' ? 'BUY' : 
                                                 stock.rec === 'Sell Signal' ? 'SELL' : 
                                                 stock.rec === 'No Clear Signal' ? 'NEUTRAL' :
                                                 stock.rec || '-'}
                                            </div>
                                        </td>
                                        <td className="px-1 py-1 text-center text-xs">
                                            <div className={`px-1 py-0.5 rounded text-xs font-medium ${getColorForAtZone(stock.at_zone)}`}>
                                                {stock.at_zone ? '●' : '○'}
                                            </div>
                                        </td>
                                        {/* 20 Daily Score Columns */}
                                        {allDates.map((date) => {
                                            // Find the score for this specific date
                                            const scoreObj = stock.scores?.find(scoreObj => {
                                                const dateKey = Object.keys(scoreObj)[0];
                                                return dateKey === date;
                                            });
                                            const score = scoreObj ? Object.values(scoreObj)[0] : null;
                                            
                                            return (
                                                <td 
                                                    key={`date-${date}`}
                                                    className="px-1 py-1 text-center text-xs"
                                                >
                                                    <div 
                                                        className={`w-full h-6 flex items-center justify-center text-xs font-medium ${getColorForVSAScore(score)}`}
                                                        title={`${stock.symbol}: ${score ? score.toFixed(2) : 'N/A'} (${new Date(date).toLocaleDateString('vi-VN')})`}
                                                    >
                                                        {score === null ? '-' : score.toFixed(1)}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {/* Expanded row with daily scores */}
                                    {isExpanded && (
                                        <tr>
                                            <td colSpan={6 + allDates.length} className="px-4 py-3 bg-gray-50">
                                                <div className="space-y-3">
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                        Daily VSA Scores for {stock.symbol}
                                                    </h4>
                                                    {stock.scores && stock.scores.length > 0 ? (
                                                        <div className="grid gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
                                                            {stock.scores.map((scoreObj, scoreIndex) => {
                                                                const dateKey = Object.keys(scoreObj)[0];
                                                                const score = scoreObj[dateKey];
                                                                const formattedDate = new Date(dateKey).toLocaleDateString('vi-VN', {
                                                                    month: 'short', 
                                                                    day: 'numeric'
                                                                });
                                                                
                                                                return (
                                                                    <div key={scoreIndex} className="bg-white dark:bg-gray-700 rounded p-2 border border-gray-200 dark:border-gray-600 text-center">
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                            {formattedDate}
                                                                        </div>
                                                                        <div className={`text-sm font-medium ${
                                                                            score > 1 
                                                                                ? 'text-green-600 dark:text-green-400' 
                                                                                : score < -1 
                                                                                    ? 'text-red-600 dark:text-red-400' 
                                                                                    : 'text-gray-600 dark:text-gray-400'
                                                                        }`}>
                                                                            {score?.toFixed(2) || '0.00'}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            No daily VSA scores available
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

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 0}
                        className="cursor-pointer px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Trước
                    </button>
                    <span className="text-sm text-gray-600">
                        Trang {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage >= totalPages - 1}
                        className="cursor-pointer px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Sau
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Hiển thị:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                        {[25, 50, 100, 200].map(size => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-600">
                        {paginatedData.length} / {filteredAndSortedData.length} stocks
                    </span>
                </div>
            </div>

        </div>
    );
};

export default VSAStockTable; 