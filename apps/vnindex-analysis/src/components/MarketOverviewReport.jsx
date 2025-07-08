import React, { useMemo } from 'react';
import { BarChart2, DollarSign, AlertTriangle, Zap } from 'lucide-react';
import Card from './Card';
import TopListCard from './TopListCard';
import { useDataLoader } from '../hooks/useDataLoader';

const MarketOverviewReport = () => {
    // Load data using the data loader
    const { data: abnormalSignalsIntra, loading: abnormalSignalsLoading, error: abnormalSignalsError } = useDataLoader('abnormal_signals_intra');
    const { data: topDeals, loading: topDealsLoading, error: topDealsError } = useDataLoader('top_deals');
    const { data: topByValue, loading: topByValueLoading, error: topByValueError } = useDataLoader('top_by_value');

    // Top deals and value data
    const deals = useMemo(() => topDeals?.data?.slice(0, 10) || [], [topDeals]);
    const byValue = useMemo(() => topByValue?.data?.slice(0, 10) || [], [topByValue]);

    // Process abnormal intraday signals data
    const abnormalSignalsData = useMemo(() => {
        if (!abnormalSignalsIntra || abnormalSignalsLoading) {
            return {
                topSignals: [],
                summary: {},
                totalSignals: 0
            };
        }

        const signals = abnormalSignalsIntra.abnormalities || [];
        const summary = abnormalSignalsIntra.summary || {};
        
        // Get top signals by composite score
        const topSignals = signals
            .sort((a, b) => b.CompositeScore - a.CompositeScore)
            .slice(0, 10)
            .map(signal => {
                // Get active signal types
                const activeSignals = Object.entries(signal)
                    .filter(([key, value]) => 
                        ['AbnormalPrice', 'AbnormalVolume', 'PriceVelocityAbnormal', 'EffortGTResult', 'ResultGTEffort', 'AbnormalERRatio'].includes(key) && value === true
                    )
                    .map(([key]) => key);

                return {
                    id: signal.Symbol,
                    name: signal.Symbol,
                    date: signal.Date,
                    value: signal.CompositeScore,
                    sentiment: signal.Interpretation?.overall_sentiment || 'NEUTRAL',
                    confidence: signal.Interpretation?.confidence || 'MEDIUM',
                    signalCount: signal.Interpretation?.signal_count || 0,
                    riskLevel: signal.Interpretation?.risk_level || 'MEDIUM',
                    activeSignals: activeSignals,
                    tradingImplications: signal.Interpretation?.trading_implications || [],
                    signalTypes: signal.Interpretation?.signal_types || []
                };
            });

        return {
            topSignals,
            summary,
            totalSignals: signals.length
        };
    }, [abnormalSignalsIntra, abnormalSignalsLoading]);



    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Báo cáo Tổng quan Thị trường
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Phân tích toàn diện về giao dịch và tín hiệu bất thường
                </p>
            </div>

            {/* Top Deals and Value */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopListCard
                    title="Giao dịch thỏa thuận nhiều nhất"
                    icon={<BarChart2 className="text-blue-500" />}
                    data={deals.map(item => ({
                        id: item.symbol,
                        name: item.symbol,
                        value: item.accumulated_value / 1000000000, // Convert to billions
                        subValue: item.price_change_pct_1d,
                    }))}
                    unit="Tỷ VNĐ"
                    valueKey="value"
                    nameKey="name"
                    valueClass={() => 'text-blue-500'}
                    subValueKey="subValue"
                    subValueClass={v => v > 0 ? 'text-green-500' : 'text-red-500'}
                    subValueUnit="%"
                    subValuePrefix=""
                />
                <TopListCard
                    title="Giá trị Giao dịch Cao nhất"
                    icon={<DollarSign className="text-green-500" />}
                    data={byValue.map(item => ({
                        id: item.symbol,
                        name: item.symbol,
                        value: item.accumulated_value / 1000000000, // Convert to billions
                        subValue: item.price_change_pct_1d,
                    }))}
                    unit="Tỷ VNĐ"
                    valueKey="value"
                    nameKey="name"
                    valueClass={() => 'text-green-500'}
                    subValueKey="subValue"
                    subValueClass={v => v > 0 ? 'text-green-500' : 'text-red-500'}
                    subValueUnit="%"
                    subValuePrefix=""
                />
            </div>

            {/* Abnormal Intraday Signals */}
            {abnormalSignalsLoading ? (
                <Card>
                    <div className="flex items-center justify-center h-32">
                        <div className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu tín hiệu bất thường...</div>
                    </div>
                </Card>
            ) : abnormalSignalsError ? (
                <Card>
                    <div className="flex items-center justify-center h-32">
                        <div className="text-red-500">Lỗi tải dữ liệu: {abnormalSignalsError}</div>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="text-orange-500" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Tín hiệu Bất thường Nội ngày
                            </h3>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {abnormalSignalsData.totalSignals} tín hiệu
                        </span>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {abnormalSignalsData.topSignals.slice(0, 12).map((item, index) => {
                            const sentimentColor = item.sentiment === 'BULLISH' ? 'text-green-600 dark:text-green-400' :
                                                  item.sentiment === 'BEARISH' ? 'text-red-600 dark:text-red-400' :
                                                  'text-yellow-600 dark:text-yellow-400';
                            
                            return (
                                <Card key={index} className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                {item.name}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(item.date).toLocaleDateString('vi-VN')}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Điểm: {(item.value * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                                                {item.signalCount} tín hiệu
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Signal Types */}
                                    {item.activeSignals.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Loại tín hiệu:
                                            </h5>
                                            <div className="space-y-1">
                                                {item.activeSignals.map((signalType, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                                        <span className="text-blue-500">•</span>
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            {signalType === 'AbnormalPrice' ? 'Giá bất thường' :
                                                             signalType === 'AbnormalVolume' ? 'Khối lượng bất thường' :
                                                             signalType === 'PriceVelocityAbnormal' ? 'Tốc độ giá bất thường' :
                                                             signalType === 'EffortGTResult' ? 'Nỗ lực > Kết quả' :
                                                             signalType === 'ResultGTEffort' ? 'Kết quả > Nỗ lực' :
                                                             signalType === 'AbnormalERRatio' ? 'Tỷ lệ ER bất thường' :
                                                             signalType}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Trading Implications */}
                                    {item.tradingImplications.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Ý nghĩa giao dịch:
                                            </h5>
                                            <div className="space-y-1">
                                                {item.tradingImplications.slice(0, 2).map((implication, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-xs">
                                                        <span className="text-green-500 flex-shrink-0">•</span>
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            {implication}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Sentiment and Risk */}
                                    <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className={sentimentColor}>
                                                {item.sentiment === 'BULLISH' ? '📈' : 
                                                 item.sentiment === 'BEARISH' ? '📉' : '➡️'}
                                            </span>
                                            <span className={sentimentColor}>
                                                {item.sentiment === 'BULLISH' ? 'Tích cực' :
                                                 item.sentiment === 'BEARISH' ? 'Tiêu cực' : 'Trung tính'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-purple-600 dark:text-purple-400">
                                                {item.confidence === 'HIGH' ? '🔴' : 
                                                 item.confidence === 'MEDIUM' ? '🟡' : '🟢'}
                                            </span>
                                            <span className="text-purple-600 dark:text-purple-400">
                                                {item.confidence === 'HIGH' ? 'Cao' :
                                                 item.confidence === 'MEDIUM' ? 'Trung bình' : 'Thấp'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-orange-600 dark:text-orange-400">
                                                {item.riskLevel === 'HIGH' ? '⚠️' : 
                                                 item.riskLevel === 'MEDIUM' ? '⚡' : 'ℹ️'}
                                            </span>
                                            <span className="text-orange-600 dark:text-orange-400">
                                                {item.riskLevel === 'HIGH' ? 'Rủi ro cao' :
                                                 item.riskLevel === 'MEDIUM' ? 'Rủi ro trung bình' : 'Rủi ro thấp'}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Market Sentiment Summary */}
                    {abnormalSignalsData.summary.market_sentiment && (
                        <Card className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="text-yellow-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Tổng quan Tâm lý Thị trường
                                </h4>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Tâm lý thị trường:</span>
                                    <span className={`font-semibold ${
                                        abnormalSignalsData.summary.market_sentiment === 'BULLISH' 
                                            ? 'text-green-600 dark:text-green-400' 
                                            : abnormalSignalsData.summary.market_sentiment === 'BEARISH'
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-yellow-600 dark:text-yellow-400'
                                    }`}>
                                        {abnormalSignalsData.summary.market_sentiment === 'BULLISH' ? 'Tích cực' :
                                         abnormalSignalsData.summary.market_sentiment === 'BEARISH' ? 'Tiêu cực' : 'Trung tính'}
                                    </span>
                                </div>
                                {abnormalSignalsData.summary.trading_recommendations && (
                                    <div className="mt-3">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                                            Khuyến nghị Giao dịch:
                                        </h5>
                                        <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                            {abnormalSignalsData.summary.trading_recommendations.slice(0, 2).map((rec, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <span className="text-blue-500 mt-1">•</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            )}


        </div>
    );
};

export default MarketOverviewReport; 