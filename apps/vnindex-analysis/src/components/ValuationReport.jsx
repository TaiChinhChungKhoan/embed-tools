import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from './Card';
import { useDataLoader } from '../hooks/useDataLoader';

const ValuationReport = () => {
    // Load valuation data using the data loader
    const { data: peRatio, loading: peLoading, error: peError } = useDataLoader('pe_ratio');
    const { data: pbRatio, loading: pbLoading, error: pbError } = useDataLoader('pb_ratio');

    // Merge PE and PB by date, use full available data
    const peData = peRatio?.data || [];
    const pbData = pbRatio?.data || [];
    const merged = useMemo(() => {
        const pbMap = new Map(pbData.map(d => [d.reportDate, d.pb]));
        return peData.map(d => ({
            date: d.reportDate.slice(0, 10),
            pe: d.pe,
            pb: pbMap.get(d.reportDate)
        })).filter(d => d.pb !== undefined);
    }, [peData, pbData]);
    
    // Use all available data
    const chartData = useMemo(() => merged, [merged]);

    // Calculate current and historical statistics
    const stats = useMemo(() => {
        if (chartData.length === 0) return null;
        
        const latest = chartData[chartData.length - 1];
        const latestDate = new Date(latest.date);
        const oneYearAgo = new Date(latestDate);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        // Find the closest data point to exactly 1 year ago
        const oneYearAgoData = chartData.find(d => {
            const date = new Date(d.date);
            return date >= oneYearAgo;
        }) || chartData[0]; // Fallback to earliest if no data 1 year ago
        
        const allPE = chartData.map(d => d.pe).filter(p => p !== null && !isNaN(p));
        const allPB = chartData.map(d => d.pb).filter(p => p !== null && !isNaN(p));
        
        return {
            current: {
                pe: latest.pe,
                pb: latest.pb,
                date: latest.date
            },
            change: {
                pe: oneYearAgoData ? latest.pe - oneYearAgoData.pe : 0,
                pb: oneYearAgoData ? latest.pb - oneYearAgoData.pb : 0,
                oneYearAgoDate: oneYearAgoData?.date
            },
            range: {
                pe: { min: Math.min(...allPE), max: Math.max(...allPE) },
                pb: { min: Math.min(...allPB), max: Math.max(...allPB) }
            },
            average: {
                pe: allPE.reduce((a, b) => a + b, 0) / allPE.length,
                pb: allPB.reduce((a, b) => a + b, 0) / allPB.length
            }
        };
    }, [chartData]);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Báo cáo Định giá VN-Index
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Phân tích tỷ lệ P/E và P/B của VN-Index trong toàn bộ dữ liệu có sẵn
                </p>
            </div>

            {/* Current Statistics */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <div className="text-center">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">P/E Hiện tại</h3>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {stats.current.pe.toFixed(2)}
                            </p>
                            <p className={`text-sm ${stats.change.pe >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stats.change.pe >= 0 ? '+' : ''}{stats.change.pe.toFixed(2)} so với 1 năm trước
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">P/B Hiện tại</h3>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {stats.current.pb.toFixed(2)}
                            </p>
                            <p className={`text-sm ${stats.change.pb >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stats.change.pb >= 0 ? '+' : ''}{stats.change.pb.toFixed(2)} so với 1 năm trước
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">P/E Trung bình</h3>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {stats.average.pe.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Khoảng: {stats.range.pe.min.toFixed(2)} - {stats.range.pe.max.toFixed(2)}
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">P/B Trung bình</h3>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {stats.average.pb.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Khoảng: {stats.range.pb.min.toFixed(2)} - {stats.range.pb.max.toFixed(2)}
                            </p>
                        </div>
                    </Card>
                </div>
            )}

            {/* Chart */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                    Biểu đồ P/E và P/B VN-Index (Toàn bộ dữ liệu)
                </h3>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fill: 'rgb(156 163 175)', fontSize: 12 }} 
                                minTickGap={30}
                                interval="preserveStartEnd"
                            />
                            <YAxis 
                                yAxisId="left" 
                                tick={{ fill: 'rgb(156 163 175)', fontSize: 12 }} 
                                domain={['auto', 'auto']} 
                                label={{ value: 'P/E', angle: -90, position: 'insideLeft', fill: '#22c55e' }} 
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                tick={{ fill: 'rgb(156 163 175)', fontSize: 12 }} 
                                domain={['auto', 'auto']} 
                                label={{ value: 'P/B', angle: 90, position: 'insideRight', fill: '#3b82f6' }} 
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                                    border: '1px solid rgba(128, 128, 128, 0.2)', 
                                    borderRadius: '0.5rem',
                                    color: '#fff'
                                }}
                                formatter={(value, name) => [value.toFixed(2), name]}
                                labelFormatter={(label) => `Ngày: ${label}`}
                            />
                            <Legend />
                            <Line 
                                yAxisId="left" 
                                type="monotone" 
                                dataKey="pe" 
                                stroke="#22c55e" 
                                strokeWidth={2} 
                                dot={false} 
                                name="P/E" 
                            />
                            <Line 
                                yAxisId="right" 
                                type="monotone" 
                                dataKey="pb" 
                                stroke="#3b82f6" 
                                strokeWidth={2} 
                                dot={false} 
                                name="P/B" 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Analysis */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                    Phân tích Định giá
                </h3>
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">P/E Ratio (Tỷ lệ Giá/Lợi nhuận)</h4>
                        <p>
                            P/E ratio đo lường mức độ đắt đỏ của thị trường. P/E cao thường cho thấy thị trường kỳ vọng 
                            tăng trưởng lợi nhuận cao, nhưng cũng có thể báo hiệu thị trường quá nóng.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">P/B Ratio (Tỷ lệ Giá/Giá trị Sổ sách)</h4>
                        <p>
                            P/B ratio so sánh giá thị trường với giá trị sổ sách của công ty. P/B thấp có thể cho thấy 
                            cổ phiếu bị định giá thấp, trong khi P/B cao có thể phản ánh tài sản vô hình hoặc kỳ vọng tăng trưởng.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Ý nghĩa của Biểu đồ</h4>
                        <p>
                            Biểu đồ này giúp nhà đầu tư theo dõi xu hướng định giá của thị trường theo thời gian. 
                            Sự thay đổi trong P/E và P/B có thể phản ánh thay đổi trong kỳ vọng tăng trưởng, 
                            lãi suất, hoặc tâm lý thị trường.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ValuationReport; 