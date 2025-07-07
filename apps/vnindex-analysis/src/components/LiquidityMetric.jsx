import React from 'react';
import { Activity } from 'lucide-react';
import Card from './Card';

const LiquidityMetric = ({ turnover, volume }) => (
    <Card>
        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
            <Activity size={20} className="text-blue-500" />
            <span className="ml-2">Thanh khoản thị trường</span>
        </h3>
        <div className="flex justify-between items-baseline">
            <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{turnover}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">VND</p>
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{volume}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-right">Cổ phiếu</p>
            </div>
        </div>
    </Card>
);

export default LiquidityMetric; 