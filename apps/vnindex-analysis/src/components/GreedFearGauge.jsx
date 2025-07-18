import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { useDataLoader } from '../utils/dataLoader';
import Card from './Card';
import GaugeChart from 'react-gauge-chart';

// Helper function to get text color based on sentiment value
const getSentimentColor = (value) => {
    if (value < 25) return 'text-red-600';
    if (value < 45) return 'text-orange-500';
    if (value <= 55) return 'text-yellow-500';
    if (value <= 75) return 'text-green-500';
    return 'text-green-600';
};

// Helper function to get background/stroke color based on sentiment value
const getSentimentBgColor = (value) => {
    if (value < 25) return '#dc2626'; // red-600
    if (value < 45) return '#f97316'; // orange-500
    if (value <= 55) return '#eab308'; // yellow-500
    if (value <= 75) return '#22c55e'; // green-500
    return '#16a34a'; // green-600
};

// Custom Gauge Chart Component using react-gauge-chart
const GreedFearGaugeChart = ({ value, sentiment }) => {
    // Convert value from 0-100 scale to 0-1 scale for the gauge
    const percent = value / 100;
    
    // Define colors for different sentiment levels
    const colors = ["#dc2626", "#f97316", "#eab308", "#22c55e", "#16a34a"];
    
    return (
        <div className="relative w-full h-48 flex items-center justify-center">
            <div className="relative">
                <GaugeChart
                    id="greed-fear-gauge"
                    nrOfLevels={5}
                    percent={percent}
                    colors={colors}
                    arcWidth={0.3}
                    textColor="#374151"
                    needleColor="#2E2E2E"
                    needleBaseColor="#2E2E2E"
                    hideText={true}
                    animate={true}
                    formatTextValue={() => value.toFixed(1)}
                />
                
                {/* Custom value and sentiment display */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                    <div className={`text-4xl font-bold ${getSentimentColor(value)}`}>{value.toFixed(1)}</div>
                    <div className="text-lg text-gray-500">{sentiment}</div>
                </div>
            </div>
        </div>
    );
};

// Main Component
export default function GreedFearGauge() {
    const { data: rawData, loading, error } = useDataLoader('analyze_greed_fear');

    // Format the data when it's loaded
    const data = React.useMemo(() => {
        if (!rawData) return null;
        
        return {
            ...rawData,
            last_20_days: rawData.last_20_days.map(d => ({
                ...d,
                formattedDate: new Date(d.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
            }))
        };
    }, [rawData]);

    if (loading) {
        return (
            <Card>
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Đang tải dữ liệu chỉ số Greed & Fear...</div>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <div className="flex items-center justify-center h-64">
                    <div className="text-red-500">Không thể tải dữ liệu chỉ số Greed & Fear</div>
                </div>
            </Card>
        );
    }

    if (!data) {
        return null;
    }
    
    const latestDataPoint = data.last_20_days[data.last_20_days.length - 1];
    const previousDataPoint = data.last_20_days[data.last_20_days.length - 2];
    const dailyChange = latestDataPoint.greed_fear_index - (previousDataPoint?.greed_fear_index || latestDataPoint.greed_fear_index);

    return (
        <Card>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Chỉ số Greed & Fear</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Cập nhật lúc: {new Date(data.generated_at).toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Gauge and Key Metrics */}
                    <div className="lg:col-span-1 flex flex-col">
                        <div className="flex-shrink-0">
                            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Tâm lý hiện tại</h3>
                            <GreedFearGaugeChart value={data.latest_value} sentiment={data.latest_sentiment} />
                            <hr className="my-6 border-gray-200 dark:border-gray-700" />
                            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Chỉ số chính</h3>
                        </div>
                        <div className="space-y-3 flex-shrink-0">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Giá trị hiện tại</span>
                                <span className={`font-bold ${getSentimentColor(data.latest_value)}`}>{data.latest_value.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Thay đổi hàng ngày</span>
                                <span className={`font-bold flex items-center ${dailyChange > 0 ? 'text-green-600' : dailyChange < 0 ? 'text-red-600' : 'text-yellow-500'}`}>
                                    {dailyChange > 0 ? <ArrowUp size={14} className="mr-1"/> : dailyChange < 0 ? <ArrowDown size={14} className="mr-1"/> : <Minus size={14} className="mr-1"/>}
                                    {dailyChange.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">RSI 14 ngày</span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">{data.components.rsi14 ? data.components.rsi14.toFixed(2) : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Độ biến động</span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">{data.components.volatility ? data.components.volatility.toFixed(2) : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Tỷ lệ khối lượng</span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">{data.components.volume_ratio ? data.components.volume_ratio.toFixed(2) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Chart */}
                    <div className="lg:col-span-2 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex-shrink-0">Diễn biến chỉ số (20 ngày gần nhất)</h3>
                        <div className="flex-grow">
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={data.last_20_days} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="formattedDate" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false}/>
                                    
                                    {/* Sentiment zone background areas */}
                                    <ReferenceArea y1={80} y2={100} fill="#86efac" fillOpacity={0.2} stroke="none" />
                                    <ReferenceArea y1={60} y2={80} fill="#bbf7d0" fillOpacity={0.2} stroke="none" />
                                    <ReferenceArea y1={40} y2={60} fill="#fef3c7" fillOpacity={0.2} stroke="none" />
                                    <ReferenceArea y1={20} y2={40} fill="#fed7aa" fillOpacity={0.2} stroke="none" />
                                    <ReferenceArea y1={0} y2={20} fill="#fecaca" fillOpacity={0.2} stroke="none" />
                                    
                                    {/* Sentiment level reference lines */}
                                    <ReferenceArea y1={80} y2={80} fill="none" stroke="#16a34a" strokeWidth={1} strokeDasharray="3 3" />
                                    <ReferenceArea y1={60} y2={60} fill="none" stroke="#22c55e" strokeWidth={1} strokeDasharray="3 3" />
                                    <ReferenceArea y1={40} y2={40} fill="none" stroke="#eab308" strokeWidth={1} strokeDasharray="3 3" />
                                    <ReferenceArea y1={20} y2={20} fill="none" stroke="#f97316" strokeWidth={1} strokeDasharray="3 3" />
                                    
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                        labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#374151' }}
                                    />
                                    <Line type="monotone" dataKey="greed_fear_index" name="Chỉ số" stroke={getSentimentBgColor(data.latest_value)} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
