import React, { useState } from 'react';
import { useDataLoader } from '../utils/dataLoader';
import { AlertTriangle } from 'lucide-react';
import VSAHeader from './VSAHeader';
import VSASectionNav from './VSASectionNav';
import VSAMarketOverview from './VSAMarketOverview';
import VSAStockCard from './VSAStockCard';
import VSAStockTable from './VSAStockTable';

const VSAReport = () => {
    const [timeframe, setTimeframe] = useState('1D');
    const { data, loading, error } = useDataLoader('vsa_market_analysis', timeframe);
    const [activeSection, setActiveSection] = useState('market_overview');

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

    const { market_overview, individual_results } = data;

    const strongSignals = individual_results?.filter(stock => 
        stock.latest_analysis?.signals?.some(signal => signal.strength === 'strong')
    ) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <VSAHeader 
                market_overview={market_overview} 
                strongSignalsCount={strongSignals.length} 
            />

            {/* Timeframe Selector */}
            <div className="bg-white rounded-lg shadow-sm border p-4 flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Khung thời gian:</span>
                <button
                    className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1D' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
                    onClick={() => setTimeframe('1D')}
                >
                    Hàng ngày (1D)
                </button>
                <button
                    className={`cursor-pointer px-4 py-1 rounded font-medium text-sm border ${timeframe === '1W' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'}`}
                    onClick={() => setTimeframe('1W')}
                >
                    Hàng tuần (1W)
                </button>
            </div>

            {/* Section Navigation */}
            <VSASectionNav 
                activeSection={activeSection} 
                onSectionChange={setActiveSection} 
            />

            {/* Market Overview Section */}
            {activeSection === 'market_overview' && (
                <VSAMarketOverview market_overview={market_overview} individual_results={individual_results} />
            )}

            {/* Individual Stocks Section */}
            {activeSection === 'individual_stocks' && (
                <VSAStockTable individual_results={individual_results} timeframe={timeframe} />
            )}

            {/* Strong Signals Section */}
            {activeSection === 'strong_signals' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Tín hiệu VSA mạnh
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {strongSignals.length} tín hiệu mạnh
                        </span>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {strongSignals.slice(0, 12).map((stock, index) => (
                            <VSAStockCard 
                                key={index} 
                                stock={stock} 
                                variant="strong" 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VSAReport; 