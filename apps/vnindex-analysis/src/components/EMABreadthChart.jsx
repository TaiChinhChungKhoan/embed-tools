import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';
import { HelpCircle, BarChart3, AlertCircle, TrendingUp, Target, Eye, ChevronDown, ChevronUp, Zap, Scale, Activity } from 'lucide-react';
import { useDataLoader } from '../hooks/useDataLoader';

// --- Reusable UI Components (Không thay đổi) ---

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

const Metric = ({ label, value, children, className = "" }) => (
    <div className={`flex items-start justify-between text-sm ${className}`}>
        <span className="font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap mr-2">{label}:</span>
        {value && <span className="text-gray-800 dark:text-gray-200 text-right">{value}</span>}
        {children && <div className="font-semibold text-right">{children}</div>}
    </div>
);


// --- Main Chart Component ---

const EMABreadthChart = () => {
    // --- State and Data Loading ---
    const [activeTab, setActiveTab] = useState('overview');
    const [showHelp, setShowHelp] = useState(false);
    const [hiddenLines, setHiddenLines] = useState(new Set());
    const [timeAgo, setTimeAgo] = useState('');
    const [chartType, setChartType] = useState('line'); // 'line' or 'area'

    const { data, loading, error } = useDataLoader('market_breadth_5', {
        refreshInterval: 5 * 60 * 1000,
    });
    
    // --- Configuration ---
    const EMA_CONFIG = useMemo(() => [
        { key: 'EMA 5', color: '#3B82F6', dataKey: 'ema_5' },
        { key: 'EMA 10', color: '#10B981', dataKey: 'ema_10' },
        { key: 'EMA 20', color: '#F59E0B', dataKey: 'ema_20' },
        { key: 'EMA 50', color: '#EF4444', dataKey: 'ema_50' },
        { key: 'EMA 200', color: '#8B5CF6', dataKey: 'ema_200' },
    ], []);

    // --- Memoized Data Processing ---
    const { chartData, latestData } = useMemo(() => {
        if (!data?.breadth_data) return { chartData: [], latestData: null };
        
        const sortedDates = Object.keys(data.breadth_data).sort((a, b) => new Date(a) - new Date(b));
        const latestDate = sortedDates[sortedDates.length - 1];

        const chartData = sortedDates.map(date => {
            const dayData = data.breadth_data[date];
            const entry = { date: new Date(date).getTime() };
            EMA_CONFIG.forEach(config => {
                entry[config.key] = dayData[config.dataKey]?.above_percentage;
            });
            return entry;
        });
        
        return { chartData, latestData: data.breadth_data[latestDate] };
    }, [data, EMA_CONFIG]);

    const { analysis_summary, vietnamese_insights } = data || {};

    // --- NEW: Relative time ago calculation ---
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
        const interval = setInterval(calculateTimeAgo, 60000); // Update every minute
        return () => clearInterval(interval); // Cleanup on unmount
    }, [vietnamese_insights?.metadata?.analysis_timestamp]);


    // --- Loading and Error States ---
    if (loading) return <div className="p-6 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p></div>;
    if (error) return <div className="p-6 text-center text-red-600 dark:text-red-400">Lỗi: {error}</div>;
    if (!data || !latestData) return <div className="p-6 text-center text-gray-600 dark:text-gray-400">Không có dữ liệu.</div>;

    // --- Chart-specific Components ---
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload?.length) {
            return (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">{new Date(label).toLocaleDateString('vi-VN')}</p>
                    <div className="space-y-1">
                        {payload.map(entry => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}: {entry.value?.toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => {
        const handleLegendClick = (entry) => setHiddenLines(prev => {
            const newHidden = new Set(prev);
            newHidden.has(entry.value) ? newHidden.delete(entry.value) : newHidden.add(entry.value);
            return newHidden;
        });

        return (
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                {payload.map((entry) => {
                    const isHidden = hiddenLines.has(entry.value);
                    return (
                        <div key={entry.value} className="flex items-center gap-2 cursor-pointer hover:opacity-80" onClick={() => handleLegendClick(entry)}>
                            <div className={`w-4 h-4 rounded ${isHidden ? 'opacity-40' : ''}`} style={{ backgroundColor: entry.color }}></div>
                            <span className={`text-sm ${isHidden ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>{entry.value}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    // --- Render ---
    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Phân tích Độ rộng Thị trường</h2>
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

            {/* Help Section */}
            {showHelp && (
                <InsightCard title="Hướng dẫn" icon={<HelpCircle className="h-5 w-5 text-blue-600" />} gradientColors={{ from: 'from-blue-50', to: 'to-indigo-50' }} className="mb-4">
                     <p className="text-sm text-gray-600 dark:text-gray-400">Chỉ báo này đo lường "sức khỏe" bên trong của thị trường bằng cách xem xét tỷ lệ cổ phiếu có xu hướng tăng so với giảm, cung cấp các tín hiệu sớm về sự thay đổi của VN-Index.</p>
                </InsightCard>
            )}

            {/* High-Level Dashboard */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <InsightCard title="Tín hiệu" icon={<Zap size={16} className="text-yellow-500"/>}>
                    <Metric label="Hướng" value={vietnamese_insights.signal_coordination?.overall_signal?.direction} />
                    <Metric label="Cường độ" value={vietnamese_insights.signal_coordination?.overall_signal?.strength} />
                </InsightCard>
                 <InsightCard title="Chỉ số chính" icon={<Activity size={16} className="text-green-500"/>}>
                    <Metric label="Sức mạnh" value={`${analysis_summary.key_metrics.breadth_strength.toFixed(1)}%`} />
                    <Metric label="Tham gia" value={`${analysis_summary.key_metrics.participation_level.toFixed(1)}%`} />
                </InsightCard>
                 <InsightCard title="Rủi ro" icon={<AlertCircle size={16} className="text-red-500"/>}>
                    <Metric label="Mức độ" value={vietnamese_insights.market_analysis?.risk_assessment?.risk_level} />
                    <Metric label="Hành động" value={vietnamese_insights.market_analysis?.trading_recommendation?.action} />
                 </InsightCard>
                 <InsightCard title="Triển vọng" icon={<Eye size={16} className="text-purple-500"/>}>
                     <Metric label="Ngắn hạn" value={vietnamese_insights.market_analysis?.market_outlook?.short_term?.outlook} />
                     <Metric label="Trung hạn" value={vietnamese_insights.market_analysis?.market_outlook?.medium_term?.outlook} />
                </InsightCard>
            </div>
            
            {/* Chart */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
                <ResponsiveContainer width="100%" height={400}>
                    {chartType === 'line' ? (
                        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
                            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} tickFormatter={(ts) => new Date(ts).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}/>
                            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(val) => `${val}%`}/>
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine y={50} stroke="#9CA3AF" strokeDasharray="4 4" strokeWidth={1} />
                            {EMA_CONFIG.map(line => !hiddenLines.has(line.key) && ( <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} /> ))}
                        </LineChart>
                    ) : (
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
                            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} tickFormatter={(ts) => new Date(ts).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}/>
                            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(val) => `${val}%`}/>
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine y={50} stroke="#9CA3AF" strokeDasharray="4 4" strokeWidth={1} />
                            {EMA_CONFIG.map(line => !hiddenLines.has(line.key) && ( <Area key={line.key} type="monotone" dataKey={line.key} stroke={line.color} fill={line.color} fillOpacity={0.3} strokeWidth={2} /> ))}
                        </AreaChart>
                    )}
                </ResponsiveContainer>
                <CustomLegend payload={EMA_CONFIG.map(config => ({ value: config.key, color: config.color }))} />
            </div>

            {/* Analysis Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <nav className="flex space-x-2" aria-label="Tabs">
                    <TabButton tabName="overview" activeTab={activeTab} setActiveTab={setActiveTab}>Tổng quan</TabButton>
                    <TabButton tabName="details" activeTab={activeTab} setActiveTab={setActiveTab}>Tín hiệu Chi tiết</TabButton>
                    <TabButton tabName="risk" activeTab={activeTab} setActiveTab={setActiveTab}>Rủi ro & Khuyến nghị</TabButton>
                </nav>
            </div>
            
            {/* Tab Content */}
            <div className="mt-4">
                {/* --- MODIFIED: 3-column layout --- */}
                {activeTab === 'overview' && vietnamese_insights && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Column 1 */}
                        <InsightCard title="Diễn giải & Thông tin chính" icon={<Eye className="h-5 w-5 text-teal-600" />}>
                            {vietnamese_insights.market_analysis?.key_insights?.map((insight, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="mt-1">💡</span>
                                    <span>{insight}</span>
                                </div>
                            ))}
                        </InsightCard>

                        {/* Column 2 */}
                        <InsightCard title="Trạng thái Thị trường" icon={<Scale className="h-5 w-5 text-blue-600" />}>
                            <Metric label="Trạng thái" value={analysis_summary.current_market_state.regime} />
                            <Metric label="Sức mạnh" value={analysis_summary.current_market_state.strength} />
                            <Metric label="Xu hướng" value={analysis_summary.current_market_state.trend_direction} />
                            <Metric label="Độ tin cậy" value={`${(analysis_summary.current_market_state.confidence * 100).toFixed(0)}%`} />
                        </InsightCard>

                        {/* Column 3 */}
                        <InsightCard title="Nhất quán Xu hướng" icon={<TrendingUp className="h-5 w-5 text-pink-600" />}>
                            <Metric label="Mức độ" value={analysis_summary.key_metrics.trend_consistency} />
                            <Metric label="Tín hiệu hỗ trợ" value={vietnamese_insights.market_analysis.market_regime.supporting_signals} />
                            <p className='text-xs text-gray-500 pt-2'>{vietnamese_insights.market_analysis.market_regime.description}</p>
                        </InsightCard>
                    </div>
                )}
                
                {activeTab === 'details' && vietnamese_insights && (
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vietnamese_insights.signal_coordination?.component_signals?.map((signal, index) => (
                                <InsightCard key={index} title={signal.name} icon={<BarChart3 className="h-5 w-5 text-blue-600" />}>
                                    <Metric label="Hướng" value={signal.direction} />
                                    <Metric label="Cường độ" value={signal.strength} />
                                    <Metric label="Giá trị" value={signal.value != null ? signal.value.toFixed(2) : 'N/A'} />
                                    <p className='text-xs text-gray-500 pt-2'>{signal.description}</p>
                                </InsightCard>
                            ))}
                        </div>
                        
                        {vietnamese_insights.signal_coordination?.conflicts_detected?.length > 0 && (
                            <InsightCard title="Xung đột tín hiệu" icon={<AlertCircle className="h-5 w-5 text-orange-500" />}>
                                {vietnamese_insights.signal_coordination.conflicts_detected.map((conflict, index) => (
                                    <div key={index} className="text-sm text-orange-700 p-2 rounded">⚠️ {conflict}</div>
                                ))}
                            </InsightCard>
                        )}
                    </div>
                )}

                {activeTab === 'risk' && vietnamese_insights && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InsightCard title="Phân tích Rủi ro" icon={<AlertCircle className="h-5 w-5 text-red-600" />}>
                            <Metric label="Mức rủi ro" value={vietnamese_insights.market_analysis.risk_assessment.risk_level} />
                            <Metric label="Đồng thuận" value={`${(vietnamese_insights.market_analysis.risk_assessment.consensus_score * 100).toFixed(0)}%`} />
                            <div className="pt-2 space-y-2">
                                {vietnamese_insights.market_analysis.risk_assessment.risk_factors.map((factor, index) => (
                                    <div key={index} className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded">{factor}</div>
                                ))}
                            </div>
                        </InsightCard>
                        <InsightCard title="Khuyến nghị Giao dịch" icon={<Target className="h-5 w-5 text-purple-600" />}>
                            <Metric label="Hành động" value={vietnamese_insights.market_analysis.trading_recommendation.action} />
                            <Metric label="Cường độ Tín hiệu" value={vietnamese_insights.market_analysis.trading_recommendation.signal_strength} />
                            <Metric label="Độ tin cậy" value={`${(vietnamese_insights.market_analysis.trading_recommendation.confidence * 100).toFixed(0)}%`} />
                            <p className='text-sm text-gray-600 dark:text-gray-300 pt-2'>{vietnamese_insights.market_analysis.trading_recommendation.reasoning}</p>
                        </InsightCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EMABreadthChart;