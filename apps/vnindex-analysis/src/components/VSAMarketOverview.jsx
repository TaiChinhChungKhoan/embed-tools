import React, { useMemo } from 'react';
import { Activity } from 'lucide-react';
import Card from './Card';
import MarketSentimentCharts from './MarketSentimentCharts';
import SignalFrequencyChart from './SignalFrequencyChart';

function getSignalFrequencyFromStocks(stocks) {
  // Since the new structure doesn't have detailed signal analysis,
  // we'll create approximate signal frequency based on daily scores
  const dateMap = {};
  
  stocks.forEach(stock => {
    (stock.scores || []).forEach(scoreObj => {
      const dateKey = Object.keys(scoreObj)[0];
      const score = scoreObj[dateKey];
      const date = dateKey.split('T')[0];
      
      if (!dateMap[date]) dateMap[date] = { bullish: 0, bearish: 0 };
      
      // Consider strong scores as signals
      if (Math.abs(score) > 1) {
        if (score > 1) dateMap[date].bullish += 1;
        if (score < -1) dateMap[date].bearish += 1;
      }
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

const VSAMarketOverview = ({ market_summary, stocks }) => {
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
        if (!stocks) return [];
        return getSignalFrequencyFromStocks(stocks);
    }, [stocks]);
    
    return (
        <div className="space-y-6">
            {/* Market Sentiment Charts */}
            {market_summary?.overview && (
                <Card className="p-6">
                    <div className="flex flex-col items-center">
                        <MarketSentimentCharts 
                            marketBreadth={{
                                bullish_percentage: (market_summary.overview.bullish / market_summary.overview.analyzed * 100),
                                bearish_percentage: (market_summary.overview.bearish / market_summary.overview.analyzed * 100),
                                neutral_percentage: ((market_summary.overview.analyzed - market_summary.overview.bullish - market_summary.overview.bearish) / market_summary.overview.analyzed * 100)
                            }}
                            title="Tâm lý thị trường"
                        />
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
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                market_summary?.overview?.bullish > market_summary?.overview?.bearish 
                                    ? getSentimentBgColor('bullish')
                                    : market_summary?.overview?.bearish > market_summary?.overview?.bullish
                                        ? getSentimentBgColor('bearish')
                                        : getSentimentBgColor('neutral')
                            }`}>
                                {market_summary?.overview?.bullish > market_summary?.overview?.bearish 
                                    ? 'BULLISH' 
                                    : market_summary?.overview?.bearish > market_summary?.overview?.bullish
                                        ? 'BEARISH'
                                        : 'NEUTRAL'}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tỷ lệ tăng giá:</span>
                                <span className="font-medium text-green-600 dark:text-green-400">
                                    {market_summary?.overview ? (market_summary.overview.bullish / market_summary.overview.analyzed * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tỷ lệ giảm giá:</span>
                                <span className="font-medium text-red-600 dark:text-red-400">
                                    {market_summary?.overview ? (market_summary.overview.bearish / market_summary.overview.analyzed * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tỷ lệ trung tính:</span>
                                <span className="font-medium text-gray-600 dark:text-gray-400">
                                    {market_summary?.overview ? ((market_summary.overview.analyzed - market_summary.overview.bullish - market_summary.overview.bearish) / market_summary.overview.analyzed * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            {market_summary?.overview?.at_zones && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">At Key Zones:</span>
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                        {market_summary.overview.at_zones}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Thống kê bổ sung</h4>
                        <div className="space-y-2">
                            {market_summary?.overview && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Total Analyzed:</span>
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                        {market_summary.overview.analyzed}
                                    </span>
                                </div>
                            )}
                            {market_summary?.overview && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Total Signals:</span>
                                    <span className="font-medium text-blue-600 dark:text-blue-400">
                                        {market_summary.overview.signals}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Top Bullish Stocks */}
            {market_summary?.top_bullish && market_summary.top_bullish.length > 0 && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Top Bullish Stocks
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {market_summary.top_bullish.slice(0, 6).map((stock, index) => (
                            <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                        {stock.symbol}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                                        {stock.score.toFixed(1)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Pattern:</span>
                                    <span className="text-gray-900 dark:text-gray-100">{stock.pattern}</span>
                                </div>
                                {stock.at_zone && (
                                    <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                                        ● At Key Zone
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Top Bearish Stocks */}
            {market_summary?.top_bearish && market_summary.top_bearish.length > 0 && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Top Bearish Stocks
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {market_summary.top_bearish.slice(0, 6).map((stock, index) => (
                            <div key={index} className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                        {stock.symbol}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200">
                                        {stock.score.toFixed(1)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Pattern:</span>
                                    <span className="text-gray-900 dark:text-gray-100">{stock.pattern}</span>
                                </div>
                                {stock.at_zone && (
                                    <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                                        ● At Key Zone
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default VSAMarketOverview; 