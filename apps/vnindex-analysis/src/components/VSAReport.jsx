import React, { useState } from 'react';
import { useDataLoader } from '../utils/dataLoader';
import { AlertTriangle } from 'lucide-react';
import VSAStockTable from './VSAStockTable';

const VSAReport = () => {
    const [timeframe, setTimeframe] = useState('1D');
    const { data, loading, error } = useDataLoader('VSA_ANALYSIS', timeframe);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải dữ liệu phân tích VSA...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Lỗi tải dữ liệu</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu phân tích VSA</p>
            </div>
        );
    }

    const { stocks } = data;

    return (
        <div className="space-y-6">
            {/* Simple header with timeframe selector */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    VSA Analysis
                </h2>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Timeframe:</span>
                    <button
                        className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1D' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
                        onClick={() => setTimeframe('1D')}
                    >
                        Daily (1D)
                    </button>
                    <button
                        className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1W' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
                        onClick={() => setTimeframe('1W')}
                    >
                        Weekly (1W)
                    </button>
                </div>
            </div>

            {/* VSA Ranking Table */}
            <VSAStockTable stocks={stocks} timeframe={timeframe} />
        </div>
    );
};

export default VSAReport; 