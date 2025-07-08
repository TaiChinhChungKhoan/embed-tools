import React from 'react';
import { BarChart3, Target, Zap } from 'lucide-react';

const VSASectionNav = ({ activeSection, onSectionChange }) => {
    const sections = [
        { id: 'market_overview', name: 'Tổng quan thị trường', icon: BarChart3 },
        { id: 'individual_stocks', name: 'Phân tích từng mã', icon: Target },
        { id: 'strong_signals', name: 'Tín hiệu mạnh', icon: Zap }
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
                const Icon = section.icon;
                return (
                    <button
                        key={section.id}
                        onClick={() => onSectionChange(section.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
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
    );
};

export default VSASectionNav; 