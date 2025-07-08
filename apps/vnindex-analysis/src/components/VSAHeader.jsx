import React from 'react';
import { Volume2 } from 'lucide-react';

const VSAHeader = ({ market_overview, strongSignalsCount }) => {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <Volume2 className="h-8 w-8 text-blue-500" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Phân tích VSA (Volume Spread Analysis)
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Phân tích thị trường dựa trên mối quan hệ giữa khối lượng và biến động giá
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {market_overview?.total_stocks_analyzed || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Mã được phân tích</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {market_overview?.bullish_stocks?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Mã tăng giá</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {market_overview?.bearish_stocks?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Mã giảm giá</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {strongSignalsCount}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Tín hiệu mạnh</div>
                </div>
            </div>
        </div>
    );
};

export default VSAHeader; 