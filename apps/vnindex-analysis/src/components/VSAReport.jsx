import React, { useState } from 'react';
import { useDataLoader } from '../hooks/useDataLoader';
import { AlertTriangle } from 'lucide-react';
import VSAHeader from './VSAHeader';
import VSASectionNav from './VSASectionNav';
import VSAMarketOverview from './VSAMarketOverview';
import VSAStockCard from './VSAStockCard';
import VSAStockTable from './VSAStockTable';

const VSAReport = () => {
    const { data, loading, error } = useDataLoader('vsa_market_analysis');
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
                <VSAStockTable individual_results={individual_results} />
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