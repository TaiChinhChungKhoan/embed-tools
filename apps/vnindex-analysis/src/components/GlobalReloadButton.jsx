import React from 'react';
import { RefreshCw, Database } from 'lucide-react';
import { useDataReload } from '../contexts/DataReloadContext';

const GlobalReloadButton = () => {
    const { isReloading, lastReloadTime, reloadAllData } = useDataReload();

    const formatLastReloadTime = () => {
        if (!lastReloadTime) return 'Chưa tải';
        const now = new Date();
        const diff = now - lastReloadTime;
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (minutes > 0) {
            return `${minutes} phút trước`;
        } else if (seconds > 0) {
            return `${seconds} giây trước`;
        } else {
            // Show exact time for very recent reloads (less than 1 second)
            return lastReloadTime.toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <Database className="w-3 h-3" />
                <span>{formatLastReloadTime()}</span>
            </div>
            <button
                onClick={reloadAllData}
                disabled={isReloading}
                className={`p-2 rounded-md transition-colors cursor-pointer ${
                    isReloading 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Tải lại tất cả dữ liệu"
            >
                <RefreshCw 
                    className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} 
                />
            </button>
        </div>
    );
};

export default GlobalReloadButton; 