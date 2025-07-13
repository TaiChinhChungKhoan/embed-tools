import React, { useState } from 'react';
import TabNav from './TabNav';

const ResponsiveTabbedLayout = ({ title, tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || 'market-flow');

  // Prepare tab data for TabNav
  const tabNavData = tabs.map(tab => ({ key: tab.key, label: tab.label }));

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">{title}</h3>
      {/* Desktop Tab Navigation (shared style) */}
      <div className="border-b border-gray-200 mb-6 hidden md:block">
        <TabNav tabs={tabNavData} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      {/* Mobile Tab Navigation (simple select) */}
      <div className="md:hidden mb-4">
        <select
          className="w-full p-2 rounded border border-blue-200 text-blue-900 bg-white"
          value={activeTab}
          onChange={e => setActiveTab(e.target.value)}
        >
          {tabs.map(tab => (
            <option key={tab.key} value={tab.key}>{tab.label}</option>
          ))}
        </select>
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

export default ResponsiveTabbedLayout; 