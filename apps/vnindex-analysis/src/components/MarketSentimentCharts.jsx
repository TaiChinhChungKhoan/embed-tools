import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MarketSentimentCharts = ({ marketBreadth, title = "Phân tích tâm lý thị trường" }) => {
    // Prepare data for charts
    const prepareChartData = () => {
        if (!marketBreadth) return null;

        const { bullish_percentage, bearish_percentage, neutral_percentage } = marketBreadth;
        
        // Pie chart data
        const pieData = [
            { name: 'Bullish', value: bullish_percentage, color: '#10b981', icon: TrendingUp },
            { name: 'Bearish', value: bearish_percentage, color: '#ef4444', icon: TrendingDown },
            { name: 'Neutral', value: neutral_percentage, color: '#6b7280', icon: Minus }
        ].filter(item => item.value > 0);

        return pieData;
    };

    const chartData = prepareChartData();

    if (!chartData || chartData.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400">
                Không có dữ liệu tâm lý thị trường
            </div>
        );
    }

    // Custom tooltip for pie chart
    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                        {data.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {data.value.toFixed(1)}% ({data.payload.count || 0} mã)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
                {title}
            </h3>
            <div className="rounded-lg p-4">
                <ResponsiveContainer width={300} height={250}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            formatter={(value, entry) => (
                                <span className="text-gray-700 dark:text-gray-300">
                                    {value} ({entry.payload.value.toFixed(1)}%)
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MarketSentimentCharts; 