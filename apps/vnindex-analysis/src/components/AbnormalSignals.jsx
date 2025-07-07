import React, { useState } from 'react';
import { useDataLoader } from '../hooks/useDataLoader';
import { TrendingUp, TrendingDown, AlertTriangle, Activity, BarChart3, Target } from 'lucide-react';
import Card from './Card';

const AbnormalSignals = () => {
    const { data, loading, error } = useDataLoader('abnormal_signals');
    const [activeSection, setActiveSection] = useState('abnormalities');

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải dữ liệu tín hiệu bất thường...</span>
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
                <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu tín hiệu bất thường</p>
            </div>
        );
    }

    const { abnormalities, industry_abnormalities, performance, industry_performance, immediate, industry_immediate } = data;

    // Helper function to format percentage
    const formatPercentage = (value) => {
        return `${(value * 100).toFixed(2)}%`;
    };

    // Helper function to get signal type color
    const getSignalColor = (signalType) => {
        switch (signalType) {
            case 'WideSpread':
            case 'HighVolume':
            case 'ResultGTEffort':
                return 'text-green-600 dark:text-green-400';
            case 'NarrowSpread':
            case 'LowVolume':
            case 'EffortGTResult':
            case 'AbnormalERRatio':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    // Helper function to get signal icon
    const getSignalIcon = (signalType) => {
        switch (signalType) {
            case 'WideSpread':
            case 'HighVolume':
            case 'ResultGTEffort':
                return <TrendingUp className="h-4 w-4" />;
            case 'NarrowSpread':
            case 'LowVolume':
            case 'EffortGTResult':
            case 'AbnormalERRatio':
                return <TrendingDown className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    const sections = [
        { id: 'abnormalities', name: 'Tín hiệu bất thường (Cổ phiếu)', icon: AlertTriangle },
        { id: 'industry_abnormalities', name: 'Tín hiệu bất thường (Ngành)', icon: AlertTriangle },
        { id: 'performance', name: 'Xếp hạng hiệu suất (Cổ phiếu)', icon: BarChart3 },
        { id: 'industry_performance', name: 'Xếp hạng hiệu suất (Ngành)', icon: BarChart3 },
        { id: 'immediate', name: 'Lợi nhuận tức thì (Cổ phiếu)', icon: Target },
        { id: 'industry_immediate', name: 'Lợi nhuận tức thì (Ngành)', icon: Target }
    ];

    return (
        <div className="space-y-6">
            {/* Section Navigation */}
            <div className="flex flex-wrap gap-2">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeSection === section.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {section.name}
                        </button>
                    );
                })}
            </div>

            {/* Stock Abnormalities Section */}
            {activeSection === 'abnormalities' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Tín hiệu bất thường gần đây
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {abnormalities.length} tín hiệu
                        </span>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {abnormalities.slice(0, 12).map((item, index) => {
                            const activeSignals = Object.entries(item)
                                .filter(([key, value]) => 
                                    key !== 'Symbol' && key !== 'Date' && value === true
                                );

                            return (
                                <Card key={index} className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                {item.Symbol}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(item.Date).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                                                {activeSignals.length} tín hiệu
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {activeSignals.length > 0 ? (
                                        <div className="space-y-2">
                                            {activeSignals.map(([signalType]) => (
                                                <div key={signalType} className="flex items-center gap-2 text-sm">
                                                    <span className={getSignalColor(signalType)}>
                                                        {getSignalIcon(signalType)}
                                                    </span>
                                                    <span className={getSignalColor(signalType)}>
                                                        {signalType}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Không có tín hiệu bất thường
                                        </p>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Industry Abnormalities Section */}
            {activeSection === 'industry_abnormalities' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Tín hiệu bất thường ngành nghề gần đây
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {industry_abnormalities?.length || 0} tín hiệu
                        </span>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {industry_abnormalities?.slice(0, 12).map((item, index) => {
                            const activeSignals = Object.entries(item)
                                .filter(([key, value]) => 
                                    key !== 'Symbol' && key !== 'Name' && key !== 'Date' && value === true
                                );

                            return (
                                <Card key={index} className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                {item.Name || item.Symbol}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(item.Date).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
                                                {activeSignals.length} tín hiệu
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {activeSignals.length > 0 ? (
                                        <div className="space-y-2">
                                            {activeSignals.map(([signalType]) => (
                                                <div key={signalType} className="flex items-center gap-2 text-sm">
                                                    <span className={getSignalColor(signalType)}>
                                                        {getSignalIcon(signalType)}
                                                    </span>
                                                    <span className={getSignalColor(signalType)}>
                                                        {signalType}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Không có tín hiệu bất thường
                                        </p>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Stock Performance Section */}
            {activeSection === 'performance' && (
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Xếp hạng hiệu suất
                    </h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Top Gainers */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Tăng giá mạnh nhất
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {performance.top_gainers?.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {item.Symbol}
                                            </span>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Cải thiện: {formatPercentage(item.Improvement)}
                                            </div>
                                        </div>
                                        <span className="text-green-600 dark:text-green-400 font-semibold">
                                            +{formatPercentage(item.Return)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Top Losers */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingDown className="h-5 w-5 text-red-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Giảm giá mạnh nhất
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {performance.top_losers?.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {item.Symbol}
                                            </span>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Suy giảm: {formatPercentage(item.Improvement)}
                                            </div>
                                        </div>
                                        <span className="text-red-600 dark:text-red-400 font-semibold">
                                            {formatPercentage(item.Return)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Top Improving */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Cải thiện mạnh nhất
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {performance.top_improving?.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {item.Symbol}
                                            </span>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Lợi nhuận: {formatPercentage(item.Return)}
                                            </div>
                                        </div>
                                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                            +{formatPercentage(item.Improvement)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Top Degrading */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingDown className="h-5 w-5 text-orange-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Suy giảm mạnh nhất
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {performance.top_degrading?.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {item.Symbol}
                                            </span>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Lợi nhuận: {formatPercentage(item.Return)}
                                            </div>
                                        </div>
                                        <span className="text-orange-600 dark:text-orange-400 font-semibold">
                                            {formatPercentage(item.Improvement)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Industry Performance Section */}
            {activeSection === 'industry_performance' && (
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Xếp hạng hiệu suất ngành nghề
                    </h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Top Industry Gainers */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Ngành tăng giá mạnh nhất
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {industry_performance?.top_gainers?.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {item.Name || item.Symbol}
                                            </span>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Cải thiện: {formatPercentage(item.Improvement)}
                                            </div>
                                        </div>
                                        <span className="text-green-600 dark:text-green-400 font-semibold">
                                            +{formatPercentage(item.Return)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Top Industry Losers */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingDown className="h-5 w-5 text-red-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Ngành giảm giá mạnh nhất
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {industry_performance?.top_losers?.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {item.Name || item.Symbol}
                                            </span>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Suy giảm: {formatPercentage(item.Improvement)}
                                            </div>
                                        </div>
                                        <span className="text-red-600 dark:text-red-400 font-semibold">
                                            {formatPercentage(item.Return)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Top Improving Industries */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Ngành cải thiện mạnh nhất
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {industry_performance?.top_improving?.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {item.Name || item.Symbol}
                                            </span>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Lợi nhuận: {formatPercentage(item.Return)}
                                            </div>
                                        </div>
                                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                            +{formatPercentage(item.Improvement)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Top Degrading Industries */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingDown className="h-5 w-5 text-orange-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Ngành suy giảm mạnh nhất
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {industry_performance?.top_degrading?.slice(0, 5).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {item.Name || item.Symbol}
                                            </span>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Lợi nhuận: {formatPercentage(item.Return)}
                                            </div>
                                        </div>
                                        <span className="text-orange-600 dark:text-orange-400 font-semibold">
                                            {formatPercentage(item.Improvement)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Stock Immediate Section */}
            {activeSection === 'immediate' && (
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Lợi nhuận tức thì
                    </h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Top Immediate Gainers */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Tăng giá tức thì
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {immediate.top_immediate_gainers?.slice(0, 10).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {item.Symbol}
                                        </span>
                                        <span className="text-green-600 dark:text-green-400 font-semibold">
                                            +{formatPercentage(item.ImmediateReturn)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Top Immediate Losers */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingDown className="h-5 w-5 text-red-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Giảm giá tức thì
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {immediate.top_immediate_losers?.slice(0, 10).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {item.Symbol}
                                        </span>
                                        <span className="text-red-600 dark:text-red-400 font-semibold">
                                            {formatPercentage(item.ImmediateReturn)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Industry Immediate Section */}
            {activeSection === 'industry_immediate' && (
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Lợi nhuận tức thì ngành nghề
                    </h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Top Industry Immediate Gainers */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Ngành tăng giá tức thì
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {industry_immediate?.top_immediate_gainers?.slice(0, 10).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {item.Name || item.Symbol}
                                        </span>
                                        <span className="text-green-600 dark:text-green-400 font-semibold">
                                            +{formatPercentage(item.ImmediateReturn)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Top Industry Immediate Losers */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingDown className="h-5 w-5 text-red-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Ngành giảm giá tức thì
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {industry_immediate?.top_immediate_losers?.slice(0, 10).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {item.Name || item.Symbol}
                                        </span>
                                        <span className="text-red-600 dark:text-red-400 font-semibold">
                                            {formatPercentage(item.ImmediateReturn)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AbnormalSignals; 