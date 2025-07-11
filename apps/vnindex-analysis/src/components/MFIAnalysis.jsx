import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Info, HelpCircle, AlertCircle, BarChart3, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import Card from './Card';
import { useDataLoader } from '../hooks/useDataLoader';

const MFIAnalysis = () => {
    const [showHelp, setShowHelp] = useState(false);
    const [selectedIndices, setSelectedIndices] = useState(['VN30', 'VN100', 'VNAllShare', 'VNMidCap', 'VNSmallCap']);
    const [chartType, setChartType] = useState('line'); // 'line' or 'area'
    const [hiddenLines, setHiddenLines] = useState(new Set()); // Track hidden lines

    const { data, loading, error, lastUpdated, refresh } = useDataLoader('analyze_groups_mfi', {
        refreshInterval: 5 * 60 * 1000 // Refresh every 5 minutes
    });

    // Prepare data for the chart
    const prepareChartData = () => {
        if (!data || !data.indices) return [];

        // Get all unique dates from all indices
        const allDates = new Set();
        data.indices.forEach(index => {
            index.mfi_data.forEach(item => {
                if (item.mfi !== null) {
                    allDates.add(item.date);
                }
            });
        });

        // Convert to array and sort
        const sortedDates = Array.from(allDates).sort();

        // Create chart data points
        return sortedDates.map(date => {
            const point = { date };
            
            data.indices.forEach(index => {
                const mfiData = index.mfi_data.find(item => item.date === date);
                if (mfiData && mfiData.mfi !== null) {
                    point[index.symbol] = mfiData.mfi;
                }
            });
            
            return point;
        }).slice(-200); // Show last 200 data points
    };

    const chartData = prepareChartData();

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {new Date(label).toLocaleDateString('vi-VN')}
                    </p>
                    <div className="space-y-1">
                        {payload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div 
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: entry.color }}
                                ></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {entry.name}: {entry.value?.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Custom legend with click functionality
    const CustomLegend = ({ payload }) => {
        const handleLegendClick = (entry) => {
            setHiddenLines(prev => {
                const newHidden = new Set(prev);
                if (newHidden.has(entry.value)) {
                    newHidden.delete(entry.value);
                } else {
                    newHidden.add(entry.value);
                }
                return newHidden;
            });
        };

        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload.map((entry, index) => {
                    const isHidden = hiddenLines.has(entry.value);
                    return (
                        <div 
                            key={index} 
                            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleLegendClick(entry)}
                        >
                            <div 
                                className={`w-4 h-4 rounded ${isHidden ? 'opacity-40' : ''}`}
                                style={{ backgroundColor: entry.color }}
                            ></div>
                            <span className={`text-sm ${isHidden ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                                {entry.value}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Get current statistics for each index
    const getCurrentStats = () => {
        if (!data || !data.indices) return {};

        const stats = {};
        
        data.indices.forEach(index => {
            const validData = index.mfi_data.filter(item => item.mfi !== null);
            if (validData.length === 0) return;

            const latest = validData[validData.length - 1];
            const prev = validData[validData.length - 2];
            
            if (!latest || !prev) return;

            const mfiValues = validData.map(item => item.mfi).filter(mfi => mfi !== null);
            const avgMFI = mfiValues.reduce((sum, val) => sum + val, 0) / mfiValues.length;
            
            stats[index.symbol] = {
                name: index.name,
                current: latest.mfi,
                change: latest.mfi - prev.mfi,
                trend: latest.mfi > prev.mfi ? 'up' : 'down',
                signal: latest.signal,
                avgMFI,
                minMFI: Math.min(...mfiValues),
                maxMFI: Math.max(...mfiValues),
                overboughtDays: validData.filter(item => item.mfi > 80).length,
                oversoldDays: validData.filter(item => item.mfi < 20).length,
                totalDays: validData.length
            };
        });

        return stats;
    };

    const currentStats = getCurrentStats();

    // Get market sentiment based on current values
    const getMarketSentiment = () => {
        if (!currentStats || Object.keys(currentStats).length === 0) return 'neutral';
        
        const values = Object.values(currentStats).map(stat => stat.current);
        const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        if (avgValue > 70) return 'overbought';
        if (avgValue < 30) return 'oversold';
        if (avgValue > 60) return 'bullish';
        if (avgValue < 40) return 'bearish';
        return 'neutral';
    };

    const marketSentiment = getMarketSentiment();

    // Get signal strength
    const getSignalStrength = (mfi) => {
        if (mfi >= 80 || mfi <= 20) return 'strong';
        if (mfi >= 70 || mfi <= 30) return 'moderate';
        return 'weak';
    };

    // Get signal color
    const getSignalColor = (signal) => {
        switch (signal) {
            case 'buy': return 'text-green-600';
            case 'sell': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    // Get signal background color
    const getSignalBgColor = (signal) => {
        switch (signal) {
            case 'buy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'sell': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    if (loading) {
        return (
            <Card>
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Đang tải dữ liệu MFI...</span>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <div className="text-center text-red-600 p-8">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Lỗi khi tải dữ liệu MFI: {error}</p>
                    <button 
                        onClick={refresh}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </Card>
        );
    }

    if (!data || !data.indices || chartData.length === 0) {
        return (
            <Card>
                <div className="text-center text-gray-500 p-8">
                    Không có dữ liệu MFI để hiển thị
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Phân tích Money Flow Index (MFI)
                    </h3>
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <HelpCircle className="h-4 w-4" />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setChartType(chartType === 'line' ? 'area' : 'line')}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title={chartType === 'line' ? 'Chuyển sang biểu đồ vùng' : 'Chuyển sang biểu đồ đường'}
                    >
                        {chartType === 'line' ? <Area className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
                    </button>
                    {hiddenLines.size > 0 && (
                        <span className="text-xs text-gray-500">
                            {hiddenLines.size} đường bị ẩn
                        </span>
                    )}
                    <button
                        onClick={() => setHiddenLines(new Set())}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                        title="Hiển thị tất cả đường"
                    >
                        Hiển thị tất cả
                    </button>
                </div>
            </div>

            {showHelp && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Giải thích Money Flow Index (MFI):</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li><strong>MFI là gì:</strong> Chỉ số dòng tiền (Money Flow Index) kết hợp giá và khối lượng để xác định điều kiện quá mua/quá bán</li>
                        <li><strong>Thang đo:</strong> Từ 0 đến 100, với 50 là mức trung bình</li>
                        <li><strong>Quá mua (Overbought):</strong> MFI &gt; 80 - có thể báo hiệu xu hướng giảm</li>
                        <li><strong>Quá bán (Oversold):</strong> MFI &lt; 20 - có thể báo hiệu xu hướng tăng</li>
                        <li><strong>Vùng trung tính:</strong> 20-80 - thị trường cân bằng</li>
                        <li><strong>Ý nghĩa:</strong> MFI cao với khối lượng lớn thường báo hiệu đỉnh, MFI thấp với khối lượng lớn thường báo hiệu đáy</li>
                    </ul>                                    
                </div>
            )}
            
            {/* Market Sentiment Summary */}
            <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tâm lý thị trường:
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                            marketSentiment === 'bullish' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                            marketSentiment === 'bearish' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                            marketSentiment === 'overbought' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                            marketSentiment === 'oversold' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                            {marketSentiment === 'bullish' ? 'Tích cực' : 
                             marketSentiment === 'bearish' ? 'Tiêu cực' : 
                             marketSentiment === 'overbought' ? 'Quá mua' :
                             marketSentiment === 'oversold' ? 'Quá bán' : 'Trung tính'}
                        </span>
                    </div>
                    <span className="text-sm text-gray-500">
                        {chartData.length} điểm dữ liệu gần nhất
                    </span>
                </div>
            </div>

            {/* Market Overview Summary */}
            {data.market_overview && (
                <div className="my-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Tổng quan thị trường
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{data.market_overview.money_flow_distribution.overbought_indices}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Chỉ số quá mua</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{data.market_overview.money_flow_distribution.oversold_indices}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Chỉ số quá bán</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">{data.market_overview.money_flow_distribution.neutral_indices}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Chỉ số trung tính</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{data.market_overview.overall_sentiment}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Tâm lý tổng thể</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chart */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
                <ResponsiveContainer width="100%" height={400}>
                    {chartType === 'line' ? (
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="date" 
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis 
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            
                            {/* Reference lines for overbought/oversold */}
                            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} label="Quá mua (80)" />
                            <ReferenceLine y={20} stroke="#10b981" strokeDasharray="5 5" strokeWidth={1} label="Quá bán (20)" />
                            
                            {/* Index lines */}
                            {selectedIndices.map((symbol, index) => {
                                const colors = ['#3b82f6', '#f97316', '#eab308', '#10b981', '#8b5cf6'];
                                const isHidden = hiddenLines.has(symbol);
                                
                                if (isHidden) return null;
                                
                                return (
                                    <Line 
                                        key={symbol}
                                        type="monotone" 
                                        dataKey={symbol} 
                                        stroke={colors[index % colors.length]} 
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                    />
                                );
                            })}
                        </LineChart>
                    ) : (
                        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="date" 
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis 
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            
                            {/* Reference lines for overbought/oversold */}
                            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} label="Quá mua (80)" />
                            <ReferenceLine y={20} stroke="#10b981" strokeDasharray="5 5" strokeWidth={1} label="Quá bán (20)" />
                            
                            {selectedIndices.map((symbol, index) => {
                                const colors = ['#3b82f6', '#f97316', '#eab308', '#10b981', '#8b5cf6'];
                                const isHidden = hiddenLines.has(symbol);
                                
                                if (isHidden) return null;
                                
                                return (
                                    <Area 
                                        key={symbol}
                                        type="monotone" 
                                        dataKey={symbol} 
                                        stroke={colors[index % colors.length]} 
                                        fill={colors[index % colors.length]}
                                        fillOpacity={0.3}
                                        strokeWidth={2}
                                    />
                                );
                            })}
                        </AreaChart>
                    )}
                </ResponsiveContainer>
                
                {/* Custom legend outside of chart container */}
                <CustomLegend payload={selectedIndices.map((symbol, index) => ({
                    value: symbol,
                    color: ['#3b82f6', '#f97316', '#eab308', '#10b981', '#8b5cf6'][index % 5]
                }))} />
            </div>

            {/* Current Statistics */}
            {Object.keys(currentStats).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {Object.entries(currentStats).map(([symbol, stats]) => (
                        <div key={symbol} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                    {stats.name}
                                </h4>
                                {stats.trend === 'up' ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">MFI hiện tại:</span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {stats.current.toFixed(2)}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Thay đổi:</span>
                                    <span className={`text-sm font-medium ${
                                        stats.change > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {stats.change > 0 ? '+' : ''}{stats.change.toFixed(2)}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Tín hiệu:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSignalBgColor(stats.signal)}`}>
                                        {stats.signal === 'buy' ? 'Mua' : 
                                         stats.signal === 'sell' ? 'Bán' : 'Trung tính'}
                                    </span>
                                </div>
                                
                                {/* <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-500">Trung bình:</span>
                                            <div className="font-medium">{stats.avgMFI.toFixed(1)}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Quá mua:</span>
                                            <div className="font-medium">{stats.overboughtDays} ngày</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Quá bán:</span>
                                            <div className="font-medium">{stats.oversoldDays} ngày</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Tổng:</span>
                                            <div className="font-medium">{stats.totalDays} ngày</div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    ))}
                </div>
            )}            
        </Card>
    );
};

export default MFIAnalysis; 