import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const IndustryLeaderboard = ({ title, industries, icon: Icon, iconColor }) => {
  if (!industries || industries.length === 0) {
    return (
      <div className="w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          {Icon && <Icon className={`w-6 h-6 mr-2 ${iconColor}`} />}
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">No data available.</p>
      </div>
    );
  }

  return (
    <div className="w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3">
        {Icon && <Icon className={`w-6 h-6 mr-2 ${iconColor}`} />}
        {title}
      </h2>
      <ul className="space-y-2">
        {industries.slice(0, 5).map((industry, index) => (
          <li key={index} className="flex justify-between items-center text-sm p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
            <span className="font-medium text-gray-700 dark:text-gray-300">{industry.industry || industry.name}</span>
            <span className={`font-bold ${industry.rs_score > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {industry.rs_score ? industry.rs_score.toFixed(2) : 'N/A'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndustryLeaderboard;
