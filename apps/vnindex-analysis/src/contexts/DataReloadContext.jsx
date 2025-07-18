import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { clearCache } from '../utils/dataLoader';
import { useCompanies, useIndustries } from '../utils/dataLoader';

// Create the context with a default value
const DataReloadContext = createContext({
  isReloading: false,
  lastReloadTime: null,
  reloadAllData: () => {},
  reloadSpecificData: () => {},
  triggerReload: () => {},
  reloadTrigger: 0,
  // Add essential data
  companies: [],
  industries: [],
  essentialDataLoading: true,
  essentialDataError: null
});

// Provider component
export function DataReloadProvider({ children }) {
  const [isReloading, setIsReloading] = useState(false);
  const [lastReloadTime, setLastReloadTime] = useState(null);
  const [initialLoadTime, setInitialLoadTime] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Pre-load essential data (companies and industries)
  const { data: companies, loading: companiesLoading, error: companiesError } = useCompanies();
  const { data: industries, loading: industriesLoading, error: industriesError } = useIndustries();

  const essentialDataLoading = companiesLoading || industriesLoading;
  const essentialDataError = companiesError || industriesError;

  // Set initial load time when the provider mounts (simulating when dataLoader first initializes)
  useEffect(() => {
    if (!initialLoadTime) {
      const now = new Date();
      setInitialLoadTime(now);
      setLastReloadTime(now);
    }
  }, [initialLoadTime]);

  // Listen for data loading events to track when data is first loaded
  useEffect(() => {
    const handleDataLoaded = (event) => {
      // If this is the first time data is loaded, update the initial load time
      if (!lastReloadTime && event.detail?.dataType) {
        const now = new Date();
        setInitialLoadTime(now);
        setLastReloadTime(now);
      }
    };

    window.addEventListener('dataReloaded', handleDataLoaded);
    return () => {
      window.removeEventListener('dataReloaded', handleDataLoaded);
    };
  }, []);

  const reloadAllData = useCallback(async () => {
    setIsReloading(true);
    try {
      // Clear all cache
      clearCache();
      
      // Set reload time
      const now = new Date();
      setLastReloadTime(now);
      
      // Increment reload trigger
      setReloadTrigger(prev => prev + 1);
      
      // Dispatch global event for backward compatibility
      const event = new CustomEvent('dataReloaded', { detail: { dataType: null } });
      window.dispatchEvent(event);
      
      console.log('Global reload completed successfully');
    } catch (error) {
      console.error('Error during global reload:', error);
    } finally {
      setIsReloading(false);
    }
  }, []);

  const reloadSpecificData = useCallback(async (dataType) => {
    setIsReloading(true);
    try {
      // Clear cache for specific data type
      clearCache(dataType);
      
      // Set reload time
      const now = new Date();
      setLastReloadTime(now);
      
      // Increment reload trigger
      setReloadTrigger(prev => prev + 1);
      
      // Dispatch global event with data type
      const event = new CustomEvent('dataReloaded', { detail: { dataType } });
      window.dispatchEvent(event);
      
      console.log(`Data type ${dataType} reloaded successfully`);
    } catch (error) {
      console.error(`Error reloading ${dataType}:`, error);
    } finally {
      setIsReloading(false);
    }
  }, []);

  const triggerReload = useCallback((dataType = null) => {
    if (dataType) {
      reloadSpecificData(dataType);
    } else {
      reloadAllData();
    }
  }, [reloadAllData, reloadSpecificData]);

  const value = {
    isReloading,
    lastReloadTime: lastReloadTime || initialLoadTime, // Use initial load time if no reload has happened yet
    reloadAllData,
    reloadSpecificData,
    triggerReload,
    reloadTrigger,
    // Add essential data to context
    companies,
    industries,
    essentialDataLoading,
    essentialDataError
  };

  return (
    <DataReloadContext.Provider value={value}>
      {children}
    </DataReloadContext.Provider>
  );
}

// Hook to use the context
export function useDataReload() {
  const context = useContext(DataReloadContext);
  if (!context || !context.reloadAllData) {
    throw new Error('useDataReload must be used within a DataReloadProvider');
  }
  return context;
}

// Export the context for direct usage if needed
export { DataReloadContext }; 