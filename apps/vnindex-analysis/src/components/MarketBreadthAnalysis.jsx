import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, BarChart3, AlertCircle } from 'lucide-react';
import Card from './Card';
import { useDataLoader } from '../hooks/useDataLoader';

const MarketBreadthAnalysis = () => {
    const { data: marketBreadthData, loading, error, lastUpdated, refresh } = useDataLoader('analyze_breadth', {
        refreshInterval: 5 * 60 * 1000 // Refresh every 5 minutes
    });

    // Transform data for charts
    const chartData = useMemo(() => {
        if (!marketBreadthData?.market_breadth) return [];
        
        return marketBreadthData.market_breadth.dates.map((date, index) => ({
            date: new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
            cho_mua: marketBreadthData.market_breadth.indicators.cho_mua.smoothed[index],
            cho_ban: marketBreadthData.market_breadth.indicators.cho_ban.smoothed[index],
            ban: marketBreadthData.market_breadth.indicators.ban.smoothed[index],
            mua: marketBreadthData.market_breadth.indicators.mua.smoothed[index],
            vnindex: marketBreadthData.vnindex.close[index]
        }));
    }, [marketBreadthData]);

    // Calculate current market sentiment
    const currentSentiment = useMemo(() => {
        if (!chartData.length) return 'neutral';
        
        const latest = chartData[chartData.length - 1];
        const buySignals = latest.cho_mua + latest.mua;
        const sellSignals = latest.cho_ban + latest.ban;
        
        if (buySignals > sellSignals * 1.5) return 'bullish';
        if (sellSignals > buySignals * 1.5) return 'bearish';
        return 'neutral';
    }, [chartData]);

    const sentimentColors = {
        bullish: 'text-green-500',
        bearish: 'text-red-500',
        neutral: 'text-yellow-500'
    };

    const sentimentText = {
        bullish: 'Tích cực',
        bearish: 'Tiêu cực',
        neutral: 'Trung tính'
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </Card>
                    ))}
                </div>
                <Card>
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Lỗi tải dữ liệu
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {error}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Sử dụng nút tải lại toàn cục ở header để thử lại
                    </p>
                </div>
            </Card>
        );
    }

    if (!marketBreadthData) {
        return (
            <Card>
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                        Không có dữ liệu phân tích độ rộng thị trường
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with refresh button */}
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Phân tích độ rộng thị trường
                </h3>
                <div className="flex items-center space-x-4">
                    {lastUpdated && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}
                        </p>
                    )}
                </div>
            </div>

            {/* Market Sentiment Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tâm lý thị trường</h3>
                            <p className={`text-2xl font-bold ${sentimentColors[currentSentiment]}`}>
                                {sentimentText[currentSentiment]}
                            </p>
                        </div>
                        <Activity className={`w-8 h-8 ${sentimentColors[currentSentiment]}`} />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tín hiệu mua</h3>
                            <p className="text-2xl font-bold text-green-500">
                                {chartData[chartData.length - 1]?.cho_mua.toFixed(0)}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tín hiệu bán</h3>
                            <p className="text-2xl font-bold text-red-500">
                                {chartData[chartData.length - 1]?.cho_ban.toFixed(0)}
                            </p>
                        </div>
                        <TrendingDown className="w-8 h-8 text-red-500" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Mã phân tích</h3>
                            <p className="text-2xl font-bold text-blue-500">
                                {marketBreadthData.metadata.symbols_analyzed}
                            </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-blue-500" />
                    </div>
                </Card>
            </div>

            {/* Market Breadth Chart */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                    Độ rộng thị trường (Market Breadth)
                </h3>
                <div className="h-80 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fill: 'rgb(156 163 175)', fontSize: 12 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis tick={{ fill: 'rgb(156 163 175)', fontSize: 12 }} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                                    border: '1px solid rgba(128, 128, 128, 0.2)', 
                                    borderRadius: '0.5rem' 
                                }}
                                labelStyle={{ color: 'white' }}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="cho_mua" 
                                stroke="#22c55e" 
                                strokeWidth={2}
                                name="Chờ mua"
                                dot={false}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="cho_ban" 
                                stroke="#ef4444" 
                                strokeWidth={2}
                                name="Chờ bán"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                {/* Description Section for Market Breadth Chart */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div>
                        <span className="font-semibold text-green-500">Chờ mua:</span> {marketBreadthData?.signals?.descriptions?.cho_mua || 'Buy Signal: RSI < 40, Close > 1.03 * LLV, Volume > threshold'}
                    </div>
                    <div>
                        <span className="font-semibold text-red-500">Chờ bán:</span> {marketBreadthData?.signals?.descriptions?.cho_ban || 'Sell Signal: RSI > 60, Close < 0.97 * HHV, Volume > threshold'}
                    </div>
                    <div>
                        <span className="font-semibold text-orange-500">Mua mạnh:</span> {marketBreadthData?.signals?.descriptions?.mua || 'Strong Buy: Close >= High for 4 consecutive days, Volume > threshold'}
                    </div>
                    <div>
                        <span className="font-semibold text-red-600">Bán mạnh:</span> {marketBreadthData?.signals?.descriptions?.ban || 'Strong Sell: Close <= Low for 8 consecutive days, Volume > threshold'}
                    </div>
                </div>
            </Card>

            {/* Strong Buy/Sell Signals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                        Tín hiệu mua/bán mạnh
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorMua" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorBan" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                <XAxis 
                                    dataKey="date" 
                                    tick={{ fill: 'rgb(156 163 175)', fontSize: 12 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis tick={{ fill: 'rgb(156 163 175)', fontSize: 12 }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                                        border: '1px solid rgba(128, 128, 128, 0.2)', 
                                        borderRadius: '0.5rem' 
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="mua" 
                                    stroke="#22c55e" 
                                    fill="url(#colorMua)"
                                    name="Mua mạnh"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="ban" 
                                    stroke="#ef4444" 
                                    fill="url(#colorBan)"
                                    name="Bán mạnh"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                        Thông tin phân tích
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Tham số phân tích:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Chu kỳ RSI: <span className="font-semibold">{marketBreadthData.metadata.parameters.periodR}</span></div>
                                <div>Ngưỡng RSI trên: <span className="font-semibold">{marketBreadthData.metadata.parameters.r_up}</span></div>
                                <div>Ngưỡng RSI dưới: <span className="font-semibold">{marketBreadthData.metadata.parameters.r_down}</span></div>
                                <div>Ngưỡng khối lượng: <span className="font-semibold">{marketBreadthData.metadata.parameters.volume_threshold.toLocaleString()}</span></div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Mô tả tín hiệu:</h4>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <div><span className="font-semibold text-green-500">Chờ mua:</span> {marketBreadthData.signals.descriptions.cho_mua}</div>
                                <div><span className="font-semibold text-red-500">Chờ bán:</span> {marketBreadthData.signals.descriptions.cho_ban}</div>
                                <div><span className="font-semibold text-orange-500">Mua mạnh:</span> {marketBreadthData.signals.descriptions.mua}</div>
                                <div><span className="font-semibold text-red-600">Bán mạnh:</span> {marketBreadthData.signals.descriptions.ban}</div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Cập nhật lần cuối: {new Date(marketBreadthData.metadata.analysis_date).toLocaleString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MarketBreadthAnalysis; 