import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Info, HelpCircle, AlertCircle, BarChart3, Activity, Target, Eye, Zap, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import Card from './Card';
import { useDataLoader } from '../hooks/useDataLoader';

// Reusable components
const InsightCard = ({ title, icon, children, gradientColors, className = "" }) => {
    const fromColor = gradientColors?.from || 'from-gray-50';
    const toColor = gradientColors?.to || 'to-gray-100';
    const darkFromColor = gradientColors?.darkFrom || 'dark:from-gray-800/50';
    const darkToColor = gradientColors?.darkTo || 'dark:to-gray-900/50';

    return (
        <div className={`p-4 h-full rounded-lg bg-gradient-to-r ${fromColor} ${toColor} ${darkFromColor} ${darkToColor} ${className}`}>
            {title && (
                <div className="flex items-center gap-2 mb-3">
                    {icon}
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
                </div>
            )}
            <div className="space-y-2">{children}</div>
        </div>
    );
};

const TabButton = ({ tabName, activeTab, setActiveTab, children }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`cursor-pointer px-3 py-2 font-medium text-sm transition-colors focus:outline-none ${
            activeTab === tabName
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-500'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
    >
        {children}
    </button>
);

const CollapsibleSection = ({ title, children, defaultExpanded = false }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    return (
        <div className="border border-gray-200 dark:border-gray-600 rounded-md">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
            >
                {title}
                <span className="text-gray-400">{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
            </button>
            {isExpanded && (
                <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-600">
                    {children}
                </div>
            )}
        </div>
    );
};

const Metric = ({ label, value, children, className = "" }) => (
    <div className={`flex items-start justify-between text-sm ${className}`}>
        <span className="font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap mr-2">{label}:</span>
        {value && <span className="text-gray-800 dark:text-gray-200 text-right">{value}</span>}
        {children && <div className="font-semibold text-right">{children}</div>}
    </div>
);

const SignalStrengthIndicator = ({ strength, value, direction }) => {
    const getStrengthColor = (strength) => {
        switch (strength?.toLowerCase()) {
            case 'rất mạnh': return 'text-red-600 dark:text-red-400';
            case 'mạnh': return 'text-orange-600 dark:text-orange-400';
            case 'vừa phải': return 'text-yellow-600 dark:text-yellow-400';
            case 'yếu': return 'text-blue-600 dark:text-blue-400';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };

    const getDirectionIcon = (direction) => {
        switch (direction?.toLowerCase()) {
            case 'tích cực': return <TrendingUp className="h-3 w-3 text-green-600" />;
            case 'tiêu cực': return <TrendingDown className="h-3 w-3 text-red-600" />;
            default: return <Activity className="h-3 w-3 text-gray-600" />;
        }
    };

    return (
        <div className="flex items-center gap-2">
            {getDirectionIcon(direction)}
            <span className={`text-xs font-medium ${getStrengthColor(strength)}`}>
                {strength}
            </span>
            {value !== null && value !== undefined && (
                <span className="text-xs text-gray-500">({value.toFixed(2)})</span>
            )}
        </div>
    );
};

const MFIAnalysis = () => {
    const [showHelp, setShowHelp] = useState(false);
    const [selectedIndices, setSelectedIndices] = useState(['VN30', 'VN100', 'VNALL', 'VNMID', 'VNSML']);
    const [chartType, setChartType] = useState('line');
    const [hiddenLines, setHiddenLines] = useState(new Set());
    const [activeTab, setActiveTab] = useState('summary');
    const [timeAgo, setTimeAgo] = useState('');

    const { data, loading, error, lastUpdated, refresh } = useDataLoader('analyze_groups_mfi', {
        refreshInterval: 5 * 60 * 1000
    });

    // Extract Vietnamese insights
    const { vietnamese_insights } = data || {};

    // Calculate time ago for data freshness
    useEffect(() => {
        const calculateTimeAgo = () => {
            if (!vietnamese_insights?.metadata?.analysis_timestamp) return;

            const analysisDate = new Date(vietnamese_insights.metadata.analysis_timestamp);
            const now = new Date();
            const seconds = Math.round((now - analysisDate) / 1000);
            const minutes = Math.round(seconds / 60);
            const hours = Math.round(minutes / 60);

            if (seconds < 60) {
                setTimeAgo('vài giây trước');
            } else if (minutes < 60) {
                setTimeAgo(`${minutes} phút trước`);
            } else if (hours < 24) {
                setTimeAgo(`${hours} giờ trước`);
            } else {
                setTimeAgo(analysisDate.toLocaleDateString('vi-VN'));
            }
        };

        calculateTimeAgo();
        const interval = setInterval(calculateTimeAgo, 60000);
        return () => clearInterval(interval);
    }, [vietnamese_insights?.metadata?.analysis_timestamp]);

    // Prepare data for the chart
    const prepareChartData = () => {
        if (!data || !data.indices) return [];

        const allDates = new Set();
        data.indices.forEach(index => {
            index.mfi_data.forEach(item => {
                if (item.mfi !== null) {
                    allDates.add(item.date);
                }
            });
        });

        const sortedDates = Array.from(allDates).sort();

        return sortedDates.map(date => {
            const point = { date };
            
            data.indices.forEach(index => {
                const mfiData = index.mfi_data.find(item => item.date === date);
                if (mfiData && mfiData.mfi !== null) {
                    point[index.symbol] = mfiData.mfi;
                }
            });
            
            return point;
        }).slice(-200);
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
                    {timeAgo && (
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                            Cập nhật {timeAgo}
                        </span>
                    )}
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <HelpCircle className="h-4 w-4" />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setChartType(chartType === 'line' ? 'area' : 'line')}
                        className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title={chartType === 'line' ? 'Chuyển sang biểu đồ vùng' : 'Chuyển sang biểu đồ đường'}
                    >
                        {chartType === 'line' ? <BarChart3 className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
                    </button>
                    {hiddenLines.size > 0 && (
                        <span className="text-xs text-gray-500">
                            {hiddenLines.size} đường bị ẩn
                        </span>
                    )}
                    <button
                        onClick={() => setHiddenLines(new Set())}
                        className="cursor-pointer px-3 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
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
                        <li><strong>Ý nghĩa so sánh:</strong> Việc so sánh các chỉ số vốn hóa giúp theo dõi sự dịch chuyển của dòng tiền trong thị trường</li>
                    </ul>
                    
                    <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Về VNAllShare Index:</h5>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                            VNAllShare là chỉ số vốn hóa bao gồm các mã cổ phiếu được niêm yết trên sàn HOSE, thỏa mãn 4 tiêu chí bắt buộc:
                        </p>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-4">
                            <li><strong>Tư cách:</strong> Cổ phiếu hoạt động bình thường, niêm yết tối thiểu 6 tháng (3 tháng cho top 5 vốn hóa)</li>
                            <li><strong>Free-float:</strong> Tối thiểu 10% (5% cho top 10 vốn hóa)</li>
                            <li><strong>Thanh khoản:</strong> ≥ 0.05%</li>
                            <li><strong>Tỷ trọng vốn hóa:</strong> Giới hạn 10%</li>
                        </ul>
                    </div>
                </div>
            )}
            
            {/* High-Level Dashboard */}
            {vietnamese_insights && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <InsightCard title="Tín hiệu Tổng thể" icon={<Zap size={16} className="text-yellow-500"/>}>
                        <Metric label="Hướng" value={vietnamese_insights.signal_coordination?.overall_signal?.direction} />
                        <Metric label="Cường độ" value={vietnamese_insights.signal_coordination?.overall_signal?.strength} />
                        <Metric label="Độ tin cậy" value={`${(vietnamese_insights.signal_coordination?.overall_signal?.confidence * 100).toFixed(0)}%`} />
                    </InsightCard>
                    <InsightCard title="Trạng thái Thị trường" icon={<Activity size={16} className="text-green-500"/>}>
                        <Metric label="Chế độ" value={vietnamese_insights.market_analysis?.market_regime?.regime} />
                        <Metric label="MFI TB" value={`${vietnamese_insights.market_analysis?.market_regime?.average_mfi?.toFixed(1)}`} />
                        <Metric label="Spread" value={`${vietnamese_insights.current_state?.mfi_spread_VNSML_vs_VN30?.toFixed(1)}`} />
                    </InsightCard>
                    <InsightCard title="Rủi ro & Khuyến nghị" icon={<AlertCircle size={16} className="text-red-500"/>}>
                        <Metric label="Mức rủi ro" value={vietnamese_insights.market_analysis?.risk_assessment?.risk_level} />
                        <Metric label="Hành động" value={vietnamese_insights.market_analysis?.trading_recommendation?.action} />
                        <Metric label="Độ tin cậy" value={`${(vietnamese_insights.market_analysis?.trading_recommendation?.confidence * 100).toFixed(0)}%`} />
                    </InsightCard>
                    <InsightCard title="Triển vọng" icon={<Eye size={16} className="text-purple-500"/>}>
                        <Metric label="Ngắn hạn" value={vietnamese_insights.market_analysis?.market_outlook?.short_term?.outlook} />
                        <Metric label="Trung hạn" value={vietnamese_insights.market_analysis?.market_outlook?.medium_term?.outlook} />
                    </InsightCard>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
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
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- Analysis Tabs --- */}
            {vietnamese_insights && (
                <>
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                        <nav className="flex space-x-2" aria-label="Tabs">
                            <TabButton tabName="summary" activeTab={activeTab} setActiveTab={setActiveTab}>Tổng quan</TabButton>
                            <TabButton tabName="signals" activeTab={activeTab} setActiveTab={setActiveTab}>Tín hiệu Chi tiết</TabButton>
                            <TabButton tabName="strategy" activeTab={activeTab} setActiveTab={setActiveTab}>Chiến lược & Rủi ro</TabButton>
                        </nav>
                    </div>
                    
                    {/* Tab Content */}
                    <div className="mt-4">
                        {activeTab === 'summary' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <InsightCard title="Thông tin Chính" icon={<Eye className="h-5 w-5 text-teal-600" />} gradientColors={{ from: 'from-teal-50', to: 'to-cyan-50' }}>
                                    {vietnamese_insights.market_analysis?.key_insights?.map((insight, index) => (
                                        <div key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="mt-1">💡</span>
                                            <span>{insight}</span>
                                        </div>
                                    ))}
                                </InsightCard>
                                <InsightCard title="Trạng thái Hiện tại" icon={<Scale className="h-5 w-5 text-blue-600" />} gradientColors={{ from: 'from-blue-50', to: 'to-indigo-50' }}>
                                    <Metric label="Chế độ thị trường" value={vietnamese_insights.market_analysis?.market_regime?.regime} />
                                    <Metric label="MFI trung bình" value={`${vietnamese_insights.market_analysis?.market_regime?.average_mfi?.toFixed(1)}`} />
                                    <Metric label="Spread VNSML-VN30" value={`${vietnamese_insights.current_state?.mfi_spread_VNSML_vs_VN30?.toFixed(1)}`} />
                                    <p className='text-xs text-gray-500 pt-2'>{vietnamese_insights.market_analysis?.market_regime?.description}</p>
                                </InsightCard>
                                <InsightCard title="Tín hiệu Tổng hợp" icon={<TrendingUp className="h-5 w-5 text-pink-600" />} gradientColors={{ from: 'from-pink-50', to: 'to-rose-50' }}>
                                    <Metric label="Hướng" value={vietnamese_insights.signal_coordination?.overall_signal?.direction} />
                                    <Metric label="Cường độ" value={vietnamese_insights.signal_coordination?.overall_signal?.strength} />
                                    <Metric label="Độ tin cậy" value={`${(vietnamese_insights.signal_coordination?.overall_signal?.confidence * 100).toFixed(0)}%`} />
                                    <Metric label="Điểm đồng thuận" value={`${(vietnamese_insights.signal_coordination?.overall_signal?.consensus_score * 100).toFixed(0)}%`} />
                                </InsightCard>
                            </div>
                        )}

                        {activeTab === 'signals' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {vietnamese_insights.signal_coordination?.component_signals?.map((signal, index) => (
                                        <InsightCard key={index} title={signal.name} icon={<BarChart3 className="h-5 w-5 text-blue-600" />}>
                                            <SignalStrengthIndicator 
                                                strength={signal.strength} 
                                                value={signal.value} 
                                                direction={signal.direction} 
                                            />
                                            <Metric label="Trọng số" value={`${(signal.weight * 100).toFixed(0)}%`} />
                                            <p className='text-xs text-gray-500 pt-2'>{signal.description}</p>
                                        </InsightCard>
                                    ))}
                                </div>
                                
                                {vietnamese_insights.signal_coordination?.conflicts_detected?.length > 0 && (
                                    <InsightCard title="Xung đột Tín hiệu" icon={<AlertCircle className="h-5 w-5 text-orange-500" />} gradientColors={{ from: 'from-orange-50', to: 'to-red-50' }}>
                                        {vietnamese_insights.signal_coordination.conflicts_detected.map((conflict, index) => (
                                            <div key={index} className="text-sm text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">⚠️ {conflict}</div>
                                        ))}
                                    </InsightCard>
                                )}
                            </div>
                        )}


                        
                        {activeTab === 'strategy' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InsightCard title="Phân tích Rủi ro" icon={<AlertCircle className="h-5 w-5 text-red-600" />} gradientColors={{ from: 'from-red-50', to: 'to-pink-50' }}>
                                    <Metric label="Rủi ro tổng thể" value={vietnamese_insights.market_analysis?.risk_assessment?.risk_level} />
                                    <Metric label="Điểm đồng thuận" value={`${(vietnamese_insights.market_analysis?.risk_assessment?.consensus_score * 100).toFixed(0)}%`} />
                                    <div className="pt-2 space-y-2">
                                        {vietnamese_insights.market_analysis?.risk_assessment?.risk_factors?.map((factor, index) => (
                                            <div key={index} className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded">⚠️ {factor}</div>
                                        ))}
                                    </div>
                                </InsightCard>
                                <InsightCard title="Chiến lược Giao dịch" icon={<Target className="h-5 w-5 text-purple-600" />} gradientColors={{ from: 'from-purple-50', to: 'to-violet-50' }}>
                                    <Metric label="Hành động" value={vietnamese_insights.market_analysis?.trading_recommendation?.action} />
                                    <Metric label="Độ tin cậy" value={`${(vietnamese_insights.market_analysis?.trading_recommendation?.confidence * 100).toFixed(0)}%`} />
                                    <p className='text-sm text-gray-600 dark:text-gray-300 pt-2'>{vietnamese_insights.market_analysis?.trading_recommendation?.reasoning}</p>
                                </InsightCard>
                            </div>
                        )}
                    </div>
                </>
            )}            
        </Card>
    );
};

export default MFIAnalysis; 