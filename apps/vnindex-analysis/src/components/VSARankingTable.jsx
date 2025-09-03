import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import Card from './Card';
import { useDataLoader } from '../utils/dataLoader';

const VSARankingTable = ({ timeframe = '1D' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState('');
    const [sortField, setSortField] = useState('score');
    const [sortDirection, setSortDirection] = useState('desc');

    // Load VSA data
    const { data: vsaData, isLoading } = useDataLoader('VSA_ANALYSIS', timeframe);
    const { data: analyticsData } = useDataLoader('RRG_ANALYSIS', timeframe);
    const { industries: availableIndustries, symbols: availableSymbols } = analyticsData || { industries: [], symbols: [] };

    const stocks = vsaData?.stocks || [];

    // Helper function to get color for VSA score
    const getScoreColor = (score) => {
        if (score === null || score === undefined) return 'text-slate-500';
        
        if (score > 5) return 'text-green-400';
        if (score > 2) return 'text-green-300';
        if (score > -2) return 'text-yellow-300';
        if (score > -5) return 'text-red-300';
        return 'text-red-400';
    };

    // Helper function to format score values
    const formatScore = (score) => {
        if (score === null || score === undefined) return '-';
        return score.toFixed(2);
    };

    // Helper function to get individual bar score value
    const getBarScore = (scores, index) => {
        if (!scores || !scores[index]) return null;
        const dateKey = Object.keys(scores[index])[0];
        return scores[index][dateKey];
    };

    // Helper function to get sort value
    const getSortValue = (stock, field) => {
        if (field === 'symbol') return stock.symbol;
        if (field === 'score') return stock.score || 0;
        if (field === 'price') return stock.price || 0;
        if (field === 'pattern') return stock.pattern || '';
        if (field === 'rec') return stock.rec || '';
        if (field.startsWith('bar_')) {
            const barIndex = parseInt(field.replace('bar_', ''));
            return getBarScore(stock.scores, barIndex) || 0;
        }
        return 0;
    };

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let filtered = stocks.filter(stock => {
            const matchesSearch = searchTerm === '' || 
                stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Check industry filter
            const stockData = availableSymbols.find(s => s.symbol === stock.symbol);
            const stockIndustry = stockData?.industries?.[0];
            const matchesIndustry = industryFilter === '' || 
                (stockIndustry && stockIndustry.id === industryFilter);
            
            return matchesSearch && matchesIndustry;
        });

        // Sort data
        filtered.sort((a, b) => {
            const aValue = getSortValue(a, sortField);
            const bValue = getSortValue(b, sortField);
            
            if (aValue === null || aValue === undefined) return sortDirection === 'desc' ? 1 : -1;
            if (bValue === null || bValue === undefined) return sortDirection === 'desc' ? -1 : 1;
            
            const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            return sortDirection === 'desc' ? -comparison : comparison;
        });

        return filtered;
    }, [stocks, searchTerm, industryFilter, sortField, sortDirection, availableSymbols]);

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
            return <span className="text-slate-600">↕</span>;
        }
        return <span className="text-blue-400">{sortDirection === 'desc' ? '↓' : '↑'}</span>;
    };

    if (isLoading) {
        return (
            <Card className="p-4">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Loading VSA analysis...</span>
                </div>
            </Card>
        );
    }

    // Get the first stock's scores to determine date range for headers
    const sampleScores = stocks.length > 0 ? stocks[0].scores : [];
    const scoreDates = sampleScores ? sampleScores.map(scoreObj => {
        const dateKey = Object.keys(scoreObj)[0];
        return new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) : [];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    VSA Ranking Table
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredAndSortedData.length} / {stocks.length} stocks
                </span>
            </div>

            {/* Search and Filters */}
            <Card className="p-4">
                <div className="grid gap-4 md:grid-cols-4">
                    {/* Search Bar */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by symbol..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    {/* Industry Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Industry
                        </label>
                        <select
                            value={industryFilter}
                            onChange={(e) => setIndustryFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        >
                            <option value="">All Industries</option>
                            {availableIndustries.map((industry) => (
                                <option key={industry.id} value={industry.id}>
                                    {industry.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setIndustryFilter('');
                                setSearchTerm('');
                            }}
                            className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </Card>
            
            <div className="terminal-card rounded-md p-4 overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-slate-700 sticky top-0 bg-slate-800">
                            <th 
                                className="text-left py-2 px-2 cursor-pointer hover:text-white"
                                onClick={() => handleSort('symbol')}
                            >
                                Symbol <SortIcon field="symbol" />
                            </th>
                            <th className="text-left py-2 px-2">
                                Industry
                            </th>
                            <th 
                                className="text-right py-2 px-2 cursor-pointer hover:text-white"
                                onClick={() => handleSort('price')}
                            >
                                Price <SortIcon field="price" />
                            </th>
                            <th 
                                className="text-right py-2 px-2 cursor-pointer hover:text-white"
                                onClick={() => handleSort('score')}
                            >
                                Total Score <SortIcon field="score" />
                            </th>
                            <th 
                                className="text-left py-2 px-2 cursor-pointer hover:text-white"
                                onClick={() => handleSort('pattern')}
                            >
                                Pattern <SortIcon field="pattern" />
                            </th>
                            <th 
                                className="text-left py-2 px-2 cursor-pointer hover:text-white"
                                onClick={() => handleSort('rec')}
                            >
                                Recommendation <SortIcon field="rec" />
                            </th>
                            <th className="text-center py-2 px-2">
                                At Zone
                            </th>
                            {/* Individual Bar Score Columns */}
                            {scoreDates.map((date, index) => (
                                <th 
                                    key={index}
                                    className="text-right py-2 px-1 cursor-pointer hover:text-white text-xs"
                                    onClick={() => handleSort(`bar_${index}`)}
                                >
                                    {date} <SortIcon field={`bar_${index}`} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedData.map((stock, rowIndex) => {
                            const stockData = availableSymbols.find(s => s.symbol === stock.symbol);
                            const industry = stockData?.industries?.[0]?.name || '-';

                            return (
                                <tr 
                                    key={stock.symbol}
                                    className="border-b border-slate-800 hover:bg-slate-700"
                                >
                                    <td className="py-2 px-2 font-mono text-white">
                                        {stock.symbol}
                                    </td>
                                    <td className="py-2 px-2 text-slate-400 truncate max-w-[120px]">
                                        {industry}
                                    </td>
                                    <td className="py-2 px-2 text-right font-mono text-blue-300">
                                        {formatScore(stock.price)}
                                    </td>
                                    <td className={`py-2 px-2 text-right font-mono font-bold ${getScoreColor(stock.score)}`}>
                                        {formatScore(stock.score)}
                                    </td>
                                    <td className="py-2 px-2 text-slate-400 truncate max-w-[140px]">
                                        {stock.pattern || '-'}
                                    </td>
                                    <td className={`py-2 px-2 text-slate-400 truncate max-w-[120px] ${
                                        stock.rec === 'Buy Signal' ? 'text-green-400' :
                                        stock.rec === 'Sell Signal' ? 'text-red-400' :
                                        'text-slate-400'
                                    }`}>
                                        {stock.rec || '-'}
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        {stock.at_zone ? (
                                            <span className="text-yellow-400">●</span>
                                        ) : (
                                            <span className="text-slate-600">○</span>
                                        )}
                                    </td>
                                    {/* Individual Bar Scores */}
                                    {(stock.scores || []).map((scoreObj, barIndex) => {
                                        const dateKey = Object.keys(scoreObj)[0];
                                        const score = scoreObj[dateKey];
                                        return (
                                            <td 
                                                key={barIndex}
                                                className={`py-2 px-1 text-right font-mono text-xs ${getScoreColor(score)}`}
                                            >
                                                {formatScore(score)}
                                            </td>
                                        );
                                    })}
                                    {/* Fill empty cells if scores array is shorter than expected */}
                                    {Array.from({ length: Math.max(0, 20 - (stock.scores?.length || 0)) }).map((_, emptyIndex) => (
                                        <td key={`empty-${emptyIndex}`} className="py-2 px-1 text-right font-mono text-xs text-slate-500">
                                            -
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredAndSortedData.length === 0 && (
                    <div className="text-center text-slate-500 py-8">
                        No VSA data available.
                    </div>
                )}

                {/* Legend */}
                <div className="mt-4 pt-3 border-t border-slate-700">
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-2 bg-green-400 rounded"></div>
                            <span className="text-slate-400">Strong bullish (&gt; 5)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-2 bg-green-300 rounded"></div>
                            <span className="text-slate-400">Bullish (2-5)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-2 bg-yellow-300 rounded"></div>
                            <span className="text-slate-400">Neutral (-2 to 2)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-2 bg-red-300 rounded"></div>
                            <span className="text-slate-400">Bearish (-5 to -2)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-2 bg-red-400 rounded"></div>
                            <span className="text-slate-400">Strong bearish (&lt; -5)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VSARankingTable;