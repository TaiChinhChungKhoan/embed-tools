import React, { useMemo } from 'react';
import { Activity } from 'lucide-react';
import Card from './Card';
import MarketSentimentCharts from './MarketSentimentCharts';
import VolumeAnalysisChart from './VolumeAnalysisChart';
import SignalFrequencyChart from './SignalFrequencyChart';

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
    .slice(-20);
}

const VSAMarketOverview = ({ market_overview, individual_results }) => {
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

    const signalFrequencyData = useMemo(() => {
        if (!individual_results) return [];
        return getSignalFrequencyFromIndividualResults(individual_results);
    }, [individual_results]);
    
    return (
        <div className="space-y-6">
            {/* Market Sentiment Charts - Side by Side */}
            {(market_overview?.market_breadth || market_overview?.volume_analysis) && (
                <Card className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {market_overview?.market_breadth && (
                            <div className="flex flex-col items-center">
                                <MarketSentimentCharts 
                                    marketBreadth={market_overview.market_breadth}
                                    title="Tâm lý thị trường"
                                />
                            </div>
                        )}
                        {market_overview?.volume_analysis && (
                            <div className="flex flex-col items-center">
                                <VolumeAnalysisChart 
                                    volumeAnalysis={market_overview.volume_analysis}
                                    title="Phân tích khối lượng"
                                />
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {/* Signal Frequency Chart */}
            {signalFrequencyData.length > 0 && (
                <Card className="p-6">
                    <SignalFrequencyChart 
                        signalData={signalFrequencyData}
                        title="Tần suất tín hiệu theo thời gian"
                    />
                </Card>
            )}

            {/* Market Sentiment Details */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Activity className="h-6 w-6 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Chi tiết tâm lý thị trường
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSentimentBgColor(market_overview?.market_sentiment)}`}>
                                {market_overview?.market_sentiment?.toUpperCase() || 'NEUTRAL'}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tỷ lệ tăng giá:</span>
                                <span className="font-medium text-green-600 dark:text-green-400">
                                    {market_overview?.market_breadth?.bullish_percentage?.toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tỷ lệ giảm giá:</span>
                                <span className="font-medium text-red-600 dark:text-red-400">
                                    {market_overview?.market_breadth?.bearish_percentage?.toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tỷ lệ trung tính:</span>
                                <span className="font-medium text-gray-600 dark:text-gray-400">
                                    {market_overview?.market_breadth?.neutral_percentage?.toFixed(1)}%
                                </span>
                            </div>
                            {market_overview?.market_breadth?.strong_signals_count && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tín hiệu mạnh:</span>
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                        {market_overview.market_breadth.strong_signals_count}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Phân tích khối lượng</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Khối lượng tăng:</span>
                                <span className="font-medium text-green-600 dark:text-green-400">
                                    {market_overview?.volume_analysis?.increasing || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Khối lượng giảm:</span>
                                <span className="font-medium text-red-600 dark:text-red-400">
                                    {market_overview?.volume_analysis?.decreasing || 0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Khối lượng ổn định:</span>
                                <span className="font-medium text-gray-600 dark:text-gray-400">
                                    {market_overview?.volume_analysis?.stable || 0}
                                </span>
                            </div>
                            {market_overview?.market_breadth?.average_score && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Điểm trung bình:</span>
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                        {(market_overview.market_breadth.average_score * 100).toFixed(1)}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Top Opportunities */}
            {market_overview?.top_opportunities && market_overview.top_opportunities.length > 0 && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Cơ hội đầu tư hàng đầu
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {market_overview.top_opportunities.slice(0, 6).map((opportunity, index) => (
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

export default VSAMarketOverview; 