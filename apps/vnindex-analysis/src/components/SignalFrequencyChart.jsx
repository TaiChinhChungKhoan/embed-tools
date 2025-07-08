import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SignalFrequencyChart = ({ signalData, title = "Tần suất tín hiệu theo thời gian" }) => {
    // Prepare data for the chart
    const prepareChartData = () => {
        if (!signalData || !Array.isArray(signalData) || signalData.length === 0) {
            return [];
        }

        return signalData.map((day, index) => ({
            date: day.date || `Ngày ${index + 1}`,
            bullish: day.bullish_signals || 0,
            bearish: day.bearish_signals || 0,
            total: (day.bullish_signals || 0) + (day.bearish_signals || 0),
            net_sentiment: (day.bullish_signals || 0) - (day.bearish_signals || 0)
        }));
    };

    const chartData = prepareChartData();

    if (chartData.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 p-8">
                Không có dữ liệu tín hiệu
            </div>
        );
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const bullishData = payload.find(p => p.dataKey === 'bullish');
            const bearishData = payload.find(p => p.dataKey === 'bearish');
            
            return (
                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {label}
                    </p>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Tín hiệu tăng: {bullishData?.value || 0}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Tín hiệu giảm: {bearishData?.value || 0}
                            </span>
                        </div>
                        <div className="pt-1 border-t border-gray-200 dark:border-gray-600">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Tổng: {(bullishData?.value || 0) + (bearishData?.value || 0)} tín hiệu
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
            <div className="flex justify-center gap-6 mt-4">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {entry.value === 'bullish' ? 'Tín hiệu tăng' : 'Tín hiệu giảm'}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
                {title}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                            dataKey="date" 
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                        />
                        <YAxis 
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                        <Bar 
                            dataKey="bullish" 
                            fill="#10b981" 
                            radius={[4, 4, 0, 0]}
                            name="Tín hiệu tăng"
                        />
                        <Bar 
                            dataKey="bearish" 
                            fill="#ef4444" 
                            radius={[4, 4, 0, 0]}
                            name="Tín hiệu giảm"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            {/* Summary Statistics */}
            <div className="mt-4 grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            Tổng tín hiệu tăng
                        </span>
                    </div>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {chartData.reduce((sum, day) => sum + day.bullish, 0)}
                    </span>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">
                            Tổng tín hiệu giảm
                        </span>
                    </div>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                        {chartData.reduce((sum, day) => sum + day.bearish, 0)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SignalFrequencyChart; 