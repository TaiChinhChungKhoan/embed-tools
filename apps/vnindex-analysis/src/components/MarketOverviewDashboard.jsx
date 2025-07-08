import React, { useState, useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown, BarChart3, Target, Signal } from 'lucide-react';
import Card from './Card';
import MarketSummaryPieCharts from './MarketSummaryPieCharts';
// Remove import SignalFrequencyChart from './SignalFrequencyChart';

// Helper to process signal frequency from individual_results
function getSignalFrequencyFromIndividualResults(individual_results) {
    const dateMap = {};
    individual_results.forEach(stock => {
        (stock.recent_analyses || []).forEach(analysis => {
            const date = analysis.timestamp.split('T')[0];
            (analysis.signals || []).forEach(signal => {
                if (signal.strength === 'strong') {
                    if (!dateMap[date]) dateMap[date] = { bullish: 0, bearish: 0 };
                    if (signal.bias === 'bullish') dateMap[date].bullish += 1;
                    if (signal.bias === 'bearish') dateMap[date].bearish += 1;
                }
            });
        });
    });
    return Object.entries(dateMap)
        .map(([date, counts]) => ({
            date,
            bullish_signals: counts.bullish,
            bearish_signals: counts.bearish
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-10);
}

const MarketOverviewDashboard = (props) => {
    const [activeTab, setActiveTab] = useState('overview');

    // Memoize signal frequency data
    // Remove useMemo(() => { ... }, [individual_results]);

    // Helper function to get sentiment background color
    const getSentimentBgColor = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'bullish':
                return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
            case 'bearish':
                return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';
            case 'neutral':
                return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200';
            default:
                return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200';
        }
    };

    const tabs = [
        { id: 'overview', name: 'Tổng quan', icon: BarChart3 },
        { id: 'sentiment', name: 'Tâm lý', icon: TrendingUp },
        { id: 'volume', name: 'Khối lượng', icon: Activity },
        { id: 'signals', name: 'Tín hiệu', icon: Signal },
        { id: 'opportunities', name: 'Cơ hội', icon: Target }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Bảng điều khiển thị trường
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Phân tích toàn diện tâm lý và khối lượng thị trường
                        </p>
                    </div>
                </div>

                {/* Market Sentiment Badge */}
                {market_overview?.market_sentiment && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Tâm lý thị trường:</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSentimentBgColor(market_overview.market_sentiment)}`}>
                            {market_overview.market_sentiment.toUpperCase()}
                        </span>
                    </div>
                )}
            </Card>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                activeTab === tab.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.name}
                        </button>
                    );
                })}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Pie Charts Side by Side */}
                    <MarketSummaryPieCharts 
                        marketBreadth={market_overview?.market_breadth}
                        volumeAnalysis={market_overview?.volume_analysis}
                    />
                    {/* Signal Frequency Chart always visible in overview */}
                    {/* Remove the block that renders the SignalFrequencyChart */}
                </div>
            )}

            {/* Sentiment Tab */}
            {activeTab === 'sentiment' && market_overview?.market_breadth && (
                <MarketSummaryPieCharts 
                    marketBreadth={market_overview.market_breadth}
                    volumeAnalysis={null}
                />
            )}

            {/* Volume Tab */}
            {activeTab === 'volume' && market_overview?.volume_analysis && (
                <MarketSummaryPieCharts 
                    marketBreadth={null}
                    volumeAnalysis={market_overview.volume_analysis}
                />
            )}

            {/* Signals Tab */}
            {activeTab === 'signals' && market_overview?.signal_frequency && (
                <Card className="p-6">
                    {/* SignalFrequencyChart 
                        signalData={market_overview.signal_frequency}
                        title="Tần suất tín hiệu theo thời gian"
                    /> */}
                </Card>
            )}

            {/* Opportunities Tab */}
            {activeTab === 'opportunities' && market_overview?.top_opportunities && market_overview.top_opportunities.length > 0 && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Cơ hội đầu tư hàng đầu
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {market_overview.top_opportunities.slice(0, 9).map((opportunity, index) => (
                            <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                        {opportunity.symbol}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentBgColor(opportunity.sentiment)}`}>
                                        {opportunity.sentiment}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {opportunity.reason}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default MarketOverviewDashboard; 