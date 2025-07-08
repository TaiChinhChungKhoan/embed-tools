import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const VolumeAnalysisChart = ({ volumeAnalysis, title = "Phân tích khối lượng" }) => {
    // Prepare data for volume chart
    const prepareVolumeData = () => {
        if (!volumeAnalysis) return null;

        const { increasing, decreasing, stable } = volumeAnalysis;
        
        return [
            { 
                name: 'Tăng', 
                value: increasing, 
                color: '#10b981',
                icon: TrendingUp,
                description: 'Khối lượng tăng'
            },
            { 
                name: 'Giảm', 
                value: decreasing, 
                color: '#ef4444',
                icon: TrendingDown,
                description: 'Khối lượng giảm'
            },
            { 
                name: 'Ổn định', 
                value: stable, 
                color: '#6b7280',
                icon: Minus,
                description: 'Khối lượng ổn định'
            }
        ].filter(item => item.value > 0);
    };

    const volumeData = prepareVolumeData();

    if (!volumeData || volumeData.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400">
                Không có dữ liệu phân tích khối lượng
            </div>
        );
    }

    // Custom tooltip for volume chart
    const CustomVolumeTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const total = volumeData.reduce((sum, item) => sum + item.value, 0);
            const percentage = ((data.value / total) * 100).toFixed(1);
            
            return (
                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                        {data.payload.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {data.value} mã ({percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    const totalStocks = volumeData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
                {title}
            </h3>
            <div className="dark:bg-gray-800/50 rounded-lg p-4">
                <ResponsiveContainer width={300} height={250}>
                    <PieChart>
                        <Pie
                            data={volumeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {volumeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomVolumeTooltip />} />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            formatter={(value, entry) => {
                                const percentage = ((entry.payload.value / totalStocks) * 100).toFixed(1);
                                return (
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {value} ({percentage}%)
                                    </span>
                                );
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VolumeAnalysisChart; 