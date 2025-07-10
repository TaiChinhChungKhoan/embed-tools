import React, { createContext, useContext, useState, useCallback } from 'react';
import dataLoader from '../utils/dataLoader';

const DataReloadContext = createContext();

export const useDataReload = () => {
    const context = useContext(DataReloadContext);
    if (!context) {
        throw new Error('useDataReload must be used within a DataReloadProvider');
    }
    return context;
};

export const DataReloadProvider = ({ children }) => {
    const [isReloading, setIsReloading] = useState(false);
    const [lastReloadTime, setLastReloadTime] = useState(new Date()); // Initialize to current time since data loads on startup

    const reloadAllData = useCallback(async () => {
        setIsReloading(true);
        try {
            // Clear all cache
            dataLoader.clearCache();
            
            // Set reload time
            setLastReloadTime(new Date());
            
            // Trigger a custom event that components can listen to
            window.dispatchEvent(new CustomEvent('dataReloaded'));
            
            console.log('All data reloaded successfully');
        } catch (error) {
            console.error('Error reloading data:', error);
        } finally {
            setIsReloading(false);
        }
    }, []);

    const reloadSpecificData = useCallback(async (dataType) => {
        setIsReloading(true);
        try {
            // Clear cache for specific data type
            dataLoader.clearCache(dataType);
            
            // Set reload time
            setLastReloadTime(new Date());
            
            // Trigger a custom event with data type
            window.dispatchEvent(new CustomEvent('dataReloaded', { detail: { dataType } }));
            
            console.log(`Data type ${dataType} reloaded successfully`);
        } catch (error) {
            console.error(`Error reloading ${dataType}:`, error);
        } finally {
            setIsReloading(false);
        }
    }, []);

    const value = {
        isReloading,
        lastReloadTime,
        reloadAllData,
        reloadSpecificData
    };

    return (
        <DataReloadContext.Provider value={value}>
            {children}
        </DataReloadContext.Provider>
    );
}; 