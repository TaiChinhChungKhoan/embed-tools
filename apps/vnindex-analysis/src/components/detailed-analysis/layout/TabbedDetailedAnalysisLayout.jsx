import React, { useState } from 'react';
import { TrendingUp, Activity, Shield, BarChart3, Globe } from 'lucide-react';

const TabbedDetailedAnalysisLayout = ({ title, tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || 'market-flow');

  // Icon mapping for tabs
  const getTabIcon = (tabKey) => {
    switch (tabKey) {
      case 'market-interconnection':
        return <Globe className="w-4 h-4" />;
      case 'market-flow':
        return <TrendingUp className="w-4 h-4" />;
      case 'momentum-analysis':
        return <Activity className="w-4 h-4" />;
      case 'risk-assessment':
        return <Shield className="w-4 h-4" />;
      case 'market-conditions':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">{title}</h3>
      
      {/* Tab Navigation */}
      <div className="border-b border-blue-200 mb-6">
        <nav className="flex space-x-1" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const icon = getTabIcon(tab.key);
            
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.key}`}
                className={`flex items-center space-x-2 py-3 px-4 rounded-t-lg font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-blue-100'
                }`}
              >
                {icon && <span className="flex-shrink-0">{icon}</span>}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            id={`tabpanel-${tab.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.key}`}
            className={`${activeTab === tab.key ? 'block' : 'hidden'}`}
          >
            <div className="space-y-4">
              {tab.content}
            </div>
          </div>
        ))}
      </div>

      {/* Tab Indicator */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Hiển thị: {tabs.find(tab => tab.key === activeTab)?.label}
          </span>
          <span>
            {tabs.findIndex(tab => tab.key === activeTab) + 1} / {tabs.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TabbedDetailedAnalysisLayout; 