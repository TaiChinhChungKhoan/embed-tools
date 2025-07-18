import React from 'react';
import { Database, RefreshCw, Trash2 } from 'lucide-react';
import { useCacheStats } from '../utils/dataLoader';
import { useDataReload } from '../contexts/DataReloadContext';
import Card from './Card';

const CacheStatus = () => {
    const { stats, updateStats } = useCacheStats();
    const { reloadAllData } = useDataReload();

    const handleClearCache = () => {
        reloadAllData();
        updateStats();
    };

    return (
        <Card>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-blue-500" />
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Trạng thái cache
                    </h3>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={updateStats}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                        title="Cập nhật thống kê"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleClearCache}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        title="Xóa tất cả cache"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{stats.total}</div>
                    <div className="text-gray-500 dark:text-gray-400">Tổng cộng</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{stats.valid}</div>
                    <div className="text-gray-500 dark:text-gray-400">Hợp lệ</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{stats.expired}</div>
                    <div className="text-gray-500 dark:text-gray-400">Hết hạn</div>
                </div>
            </div>
        </Card>
    );
};

export default CacheStatus; 