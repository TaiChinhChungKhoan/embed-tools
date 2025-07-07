import React from 'react';
import Card from './Card';

const TopListCard = ({ title, icon, data, unit, valueKey = 'value', nameKey = 'id' }) => (
    <Card>
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 ml-2">{title}</h3>
        </div>
        <ul className="space-y-3">
            {data.map(item => (
                <li key={item.id} className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-blue-600 dark:text-blue-400 truncate pr-2">
                        {item[nameKey]}
                    </span>
                    <span className={`font-medium whitespace-nowrap ${item[valueKey] >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item[valueKey] > 0 ? '+' : ''}{item[valueKey].toFixed(2)}{unit}
                    </span>
                </li>
            ))}
        </ul>
    </Card>
);

export default TopListCard; 