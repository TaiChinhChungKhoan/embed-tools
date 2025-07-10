import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Info, HelpCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from './Card';
import { useDataLoader } from '../hooks/useDataLoader';

const EMABreadthChart = () => {
    const [showHelp, setShowHelp] = useState(false);
    const [selectedPeriods, setSelectedPeriods] = useState(['5', '10', '20', '50', '200']);

    const { data, loading, error, lastUpdated, refresh } = useDataLoader('market_breadth_5', {
        refreshInterval: 5 * 60 * 1000 // Refresh every 5 minutes
    });

    // Prepare data for the chart
    const prepareChartData = () => {
        if (!data) return [];

        return Object.entries(data)
            .map(([date, dayData]) => ({
                date: date,
                'Dòng tiền siêu ngắn hạn': dayData.pct_above_ema_5,
                'Dòng tiền ngắn hạn': dayData.pct_above_ema_10,
                'Dòng tiền trung hạn': dayData.pct_above_ema_20,
                'Dòng tiền dài hạn': dayData.pct_above_ema_50,
                'Dòng tiền rất dài hạn': dayData.pct_above_ema_200,
                total_stocks: dayData.total_stocks,
                stocks_with_data: dayData.stocks_with_data
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-100); // Show last 100 days
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
                                    {entry.name}: {entry.value?.toFixed(1)}%
                                </span>
                            </div>
                        ))}
                        <div className="pt-1 border-t border-gray-200 dark:border-gray-600">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Tổng cổ phiếu: {payload[0]?.payload?.total_stocks || 0}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Custom legend
    const CustomLegend = ({ payload }) => {
        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    // Calculate current statistics
    const getCurrentStats = () => {
        if (!chartData.length) return null;
        
        const latest = chartData[chartData.length - 1];
        const prev = chartData[chartData.length - 2];
        
        if (!latest || !prev) return null;

        return {
            'Dòng tiền siêu ngắn hạn': {
                current: latest['Dòng tiền siêu ngắn hạn'],
                change: latest['Dòng tiền siêu ngắn hạn'] - prev['Dòng tiền siêu ngắn hạn'],
                trend: latest['Dòng tiền siêu ngắn hạn'] > prev['Dòng tiền siêu ngắn hạn'] ? 'up' : 'down'
            },
            'Dòng tiền ngắn hạn': {
                current: latest['Dòng tiền ngắn hạn'],
                change: latest['Dòng tiền ngắn hạn'] - prev['Dòng tiền ngắn hạn'],
                trend: latest['Dòng tiền ngắn hạn'] > prev['Dòng tiền ngắn hạn'] ? 'up' : 'down'
            },
            'Dòng tiền trung hạn': {
                current: latest['Dòng tiền trung hạn'],
                change: latest['Dòng tiền trung hạn'] - prev['Dòng tiền trung hạn'],
                trend: latest['Dòng tiền trung hạn'] > prev['Dòng tiền trung hạn'] ? 'up' : 'down'
            },
            'Dòng tiền dài hạn': {
                current: latest['Dòng tiền dài hạn'],
                change: latest['Dòng tiền dài hạn'] - prev['Dòng tiền dài hạn'],
                trend: latest['Dòng tiền dài hạn'] > prev['Dòng tiền dài hạn'] ? 'up' : 'down'
            },
            'Dòng tiền rất dài hạn': {
                current: latest['Dòng tiền rất dài hạn'],
                change: latest['Dòng tiền rất dài hạn'] - prev['Dòng tiền rất dài hạn'],
                trend: latest['Dòng tiền rất dài hạn'] > prev['Dòng tiền rất dài hạn'] ? 'up' : 'down'
            }
        };
    };

    const currentStats = getCurrentStats();

    // Get market sentiment based on current values
    const getMarketSentiment = () => {
        if (!currentStats) return 'neutral';
        
        const values = Object.values(currentStats).map(stat => stat.current);
        const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        if (avgValue > 60) return 'bullish';
        if (avgValue < 40) return 'bearish';
        return 'neutral';
    };

    const marketSentiment = getMarketSentiment();

    if (loading) {
        return (
            <Card>
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <div className="text-center text-red-600 p-8">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Lỗi khi tải dữ liệu: {error}</p>
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

    if (chartData.length === 0) {
        return (
            <Card>
                <div className="text-center text-gray-500 p-8">
                    Không có dữ liệu để hiển thị
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Phân tích dòng tiền theo EMA
                    </h3>
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <HelpCircle className="h-4 w-4" />
                    </button>
                </div>
                {/* <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Cập nhật lần cuối: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString('vi-VN') : 'N/A'}</span>
                    <button
                        onClick={refresh}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Làm mới
                    </button>
                </div> */}
            </div>

            {showHelp && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Giải thích:</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li><strong>Dòng tiền siêu ngắn hạn (EMA 5):</strong> Phản ánh xu hướng rất ngắn hạn, nhạy cảm với biến động hàng ngày</li>
                        <li><strong>Dòng tiền ngắn hạn (EMA 10):</strong> Xu hướng ngắn hạn, ít nhạy cảm hơn EMA 5</li>
                        <li><strong>Dòng tiền trung hạn (EMA 20):</strong> Xu hướng trung hạn, cân bằng giữa nhạy cảm và ổn định</li>
                        <li><strong>Dòng tiền dài hạn (EMA 50):</strong> Xu hướng dài hạn, ít bị ảnh hưởng bởi biến động ngắn hạn</li>
                        <li><strong>Dòng tiền rất dài hạn (EMA 200):</strong> Xu hướng rất dài hạn, phản ánh cấu trúc thị trường</li>
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
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                            {marketSentiment === 'bullish' ? 'Tích cực' : 
                             marketSentiment === 'bearish' ? 'Tiêu cực' : 'Trung tính'}
                        </span>
                    </div>
                    <span className="text-sm text-gray-500">
                        {chartData.length} ngày gần nhất
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height={400}>
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
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                        
                        <Line 
                            type="monotone" 
                            dataKey="Dòng tiền siêu ngắn hạn" 
                            stroke="#ef4444" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Dòng tiền ngắn hạn" 
                            stroke="#f97316" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Dòng tiền trung hạn" 
                            stroke="#eab308" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Dòng tiền dài hạn" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Dòng tiền rất dài hạn" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Current Statistics */}
            {currentStats && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    {Object.entries(currentStats).map(([period, stats]) => (
                        <div key={period} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    {period}
                                </span>
                                {stats.trend === 'up' ? (
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-600" />
                                )}
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {stats.current.toFixed(1)}%
                            </div>
                            <div className={`text-xs ${
                                stats.change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)}%
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default EMABreadthChart; 