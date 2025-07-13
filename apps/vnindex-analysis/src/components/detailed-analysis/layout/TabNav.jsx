import React from 'react';

const TabNav = ({ tabs, activeTab, onTabChange }) => (
  <nav className="-mb-px flex space-x-8 px-6">
    {tabs.map(tab => (
      <button
        key={tab.key}
        onClick={() => onTabChange(tab.key)}
        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
          activeTab === tab.key
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
        type="button"
      >
        {tab.label}
      </button>
    ))}
  </nav>
);

export default TabNav; 