import React, { useState } from 'react';
import { BarChart3, TrendingUp, Activity, Target } from 'lucide-react';
import IndustryRSAnalysis from './IndustryRSAnalysis';
import RRGAnalysis from './RRGAnalysis';
import IndustryStrengthChart from './IndustryStrengthChart';

const RelativeStrengthAnalysis = () => {
    const [activeTab, setActiveTab] = useState('rrg');

    // Define tabs for industries only
    const tabs = [
        { id: 'rankings', name: 'Xếp hạng & Phân tích', icon: BarChart3 },
        { id: 'rrg', name: 'Phân tích RRG', icon: TrendingUp },
        { id: 'trends', name: 'Xu hướng sức mạnh', icon: Activity }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'rankings':
                return <IndustryRSAnalysis />;
            case 'rrg':
                return <RRGAnalysis type="industries" />;
            case 'trends':
                return <IndustryStrengthChart />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Phân tích sức mạnh tương đối ngành
                    </h2>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.name}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default RelativeStrengthAnalysis; 