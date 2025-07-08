import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import Card from './Card';

const VSAStockCard = ({ stock, variant = 'normal' }) => {
    const analysis = stock.latest_analysis;
    const bullishScore = analysis?.bullish_score || 0;
    const allSignals = stock.recent_analyses?.flatMap(analysis => 
        analysis.signals?.map(signal => ({
            ...signal,
            date: analysis.timestamp,
            days_ago: analysis.days_ago
        })) || []
    ) || [];

    // Helper function to get sentiment color
    const getSentimentColor = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'bullish':
                return 'text-green-600 dark:text-green-400';
            case 'bearish':
                return 'text-red-600 dark:text-red-400';
            case 'neutral':
                return 'text-gray-600 dark:text-gray-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

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

    // Helper function to get signal strength color
    const getSignalStrengthColor = (strength) => {
        switch (strength?.toLowerCase()) {
            case 'strong':
                return 'text-red-600 dark:text-red-400';
            case 'medium':
                return 'text-yellow-600 dark:text-yellow-400';
            case 'weak':
                return 'text-green-600 dark:text-green-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    // Helper function to get signal icon
    const getSignalIcon = (bias) => {
        switch (bias?.toLowerCase()) {
            case 'bullish':
                return <TrendingUp className="h-4 w-4" />;
            case 'bearish':
                return <TrendingDown className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    // Filter signals based on variant
    const displaySignals = variant === 'strong' 
        ? allSignals.filter(signal => signal.strength === 'strong')
        : allSignals;

    // Helper function to format date
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown';
        const date = new Date(timestamp);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <Card className="p-4">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {stock.symbol}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {analysis?.market_state || 'Unknown'}
                    </p>
                </div>
                <div className="text-right">
                    <div className={`text-lg font-bold ${
                        bullishScore > 20 
                            ? 'text-green-600 dark:text-green-400' 
                            : bullishScore < -20 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'text-gray-600 dark:text-gray-400'
                    }`}>
                        {bullishScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">VSA Score</div>
                </div>
            </div>
            
            <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Khối lượng:</span>
                    <span className="font-medium">{analysis?.volume_significance?.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Độ tin cậy:</span>
                    <span className="font-medium">{analysis?.pattern_reliability?.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tín hiệu:</span>
                    <span className="font-medium">{allSignals.length}</span>
                </div>
            </div>

            {/* Signals */}
            {displaySignals.length > 0 ? (
                <div className="space-y-2">
                    {displaySignals.slice(0, variant === 'strong' ? displaySignals.length : 5).map((signal, signalIndex) => (
                        <div key={signalIndex} className="bg-gray-50 dark:bg-gray-800 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className={getSentimentColor(signal.bias)}>
                                        {getSignalIcon(signal.bias)}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {signal.signal_name}
                                    </span>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentBgColor(signal.bias)}`}>
                                    {signal.bias}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>{formatDate(signal.date)}</span>
                                <span className={getSignalStrengthColor(signal.strength)}>
                                    {signal.strength}
                                </span>
                            </div>
                            {signal.action_suggestion && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {signal.action_suggestion}
                                </p>
                            )}
                        </div>
                    ))}
                    {variant === 'normal' && allSignals.length > 5 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{allSignals.length - 5} tín hiệu khác
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Không có tín hiệu VSA
                </p>
            )}
        </Card>
    );
};

export default VSAStockCard; 