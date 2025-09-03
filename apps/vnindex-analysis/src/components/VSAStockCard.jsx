import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import Card from './Card';

const VSAStockCard = ({ stock, variant = 'normal' }) => {
    // Use the new data structure directly
    const score = stock.score || 0;
    const price = stock.price || 0;
    const pattern = stock.pattern || '';
    const recommendation = stock.rec || '';
    const atZone = stock.at_zone || false;

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

    // Helper function to get score icon based on sentiment
    const getScoreIcon = (score) => {
        if (score > 2) return <TrendingUp className="h-4 w-4" />;
        if (score < -2) return <TrendingDown className="h-4 w-4" />;
        return <Activity className="h-4 w-4" />;
    };

    // Helper function to get score color
    const getScoreColor = (score) => {
        if (score > 5) return 'text-green-600 dark:text-green-400';
        if (score > 2) return 'text-green-500 dark:text-green-300';
        if (score < -5) return 'text-red-600 dark:text-red-400';
        if (score < -2) return 'text-red-500 dark:text-red-300';
        return 'text-gray-600 dark:text-gray-400';
    };

    return (
        <Card className="p-4">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {stock.symbol}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {pattern || 'No Pattern'}
                    </p>
                </div>
                <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(score)}`}>
                        {score.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">VSA Score</div>
                </div>
            </div>
            
            <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Price:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">{price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Pattern:</span>
                    <span className="font-medium">{pattern || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">At Zone:</span>
                    <span className={`font-medium ${atZone ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500'}`}>
                        {atZone ? '●' : '○'}
                    </span>
                </div>
            </div>

            {/* Recommendation */}
            {recommendation && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={getScoreColor(score)}>
                            {getScoreIcon(score)}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Recommendation
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            recommendation === 'Buy Signal' 
                                ? getSentimentBgColor('bullish')
                                : recommendation === 'Sell Signal'
                                    ? getSentimentBgColor('bearish')
                                    : getSentimentBgColor('neutral')
                        }`}>
                            {recommendation}
                        </span>
                        {atZone && (
                            <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                Key Zone Alert
                            </span>
                        )}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default VSAStockCard; 