import { useState, useEffect, useCallback } from 'react';
import dataLoader from '../utils/dataLoader';

// Custom hook for data loading with caching
export const useDataLoader = (dataType, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            let result;
            
            switch (dataType) {
                case 'market_breadth':
                    result = await dataLoader.loadMarketBreadth();
                    break;
                case 'market_breadth_4':
                    result = await dataLoader.loadMarketBreadth4();
                    break;
                case 'industries':
                    result = await dataLoader.loadIndustriesData();
                    break;
                case 'tickers':
                    result = await dataLoader.loadTickersData();
                    break;
                case 'market_overview':
                    result = await dataLoader.loadMarketOverviewData();
                    break;
                case 'abnormal_signals':
                    result = await dataLoader.loadAbnormalSignalsData();
                    break;
                case 'abnormal_signals_intra':
                    result = await dataLoader.loadAbnormalSignalsIntraData();
                    break;
                case 'top_deals':
                    result = await dataLoader.loadTopDealsData();
                    break;
                case 'top_by_value':
                    result = await dataLoader.loadTopByValueData();
                    break;
                case 'top_gainers':
                    result = await dataLoader.loadTopGainersData();
                    break;
                case 'top_losers':
                    result = await dataLoader.loadTopLosersData();
                    break;
                case 'top_by_volume':
                    result = await dataLoader.loadTopByVolumeData();
                    break;
                case 'foreign_buy':
                    result = await dataLoader.loadForeignBuyData();
                    break;
                case 'gdp_quarter':
                    result = await dataLoader.loadGDPQuarterData();
                    break;
                case 'money_supply_month':
                    result = await dataLoader.loadMoneySupplyMonthData();
                    break;
                case 'retail_sales_year':
                    result = await dataLoader.loadRetailSalesYearData();
                    break;
                case 'retail_sales_month':
                    result = await dataLoader.loadRetailSalesMonthData();
                    break;
                case 'cpi_month':
                    result = await dataLoader.loadCPIMonthData();
                    break;
                case 'pe_ratio':
                    result = await dataLoader.loadPERatioData();
                    break;
                case 'pb_ratio':
                    result = await dataLoader.loadPBRatioData();
                    break;
                case 'industry_strength_time_series':
                    result = await dataLoader.loadIndustryStrengthTimeSeriesData();
                    break;
                                    case 'rs_analysis':
                        result = await dataLoader.loadRSAnalysisData();
                        break;
                    case 'vsa_market_analysis':
                        result = await dataLoader.loadVSAMarketAnalysisData();
                        break;
                case 'vsa_market_analysis':
                    result = await dataLoader.loadVSAMarketAnalysisData();
                    break;
                default:
                    throw new Error(`Unknown data type: ${dataType}`);
            }

            setData(result);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message);
            console.error(`Error loading ${dataType} data:`, err);
        } finally {
            setLoading(false);
        }
    }, [dataType]);

    const refreshData = useCallback(() => {
        // Clear cache for this data type and reload
        dataLoader.clearCache(dataType);
        loadData();
    }, [dataType, loadData]);

    // Load data on mount and when dataType changes
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Listen for global reload events
    useEffect(() => {
        const handleGlobalReload = (event) => {
            const reloadedDataType = event.detail?.dataType;
            // If no specific data type is specified, or if it matches this hook's data type, reload
            if (!reloadedDataType || reloadedDataType === dataType) {
                refreshData();
            }
        };

        window.addEventListener('dataReloaded', handleGlobalReload);
        
        return () => {
            window.removeEventListener('dataReloaded', handleGlobalReload);
        };
    }, [dataType, refreshData]);

    // Auto-refresh if refreshInterval is provided
    useEffect(() => {
        if (options.refreshInterval) {
            const interval = setInterval(() => {
                refreshData();
            }, options.refreshInterval);

            return () => clearInterval(interval);
        }
    }, [options.refreshInterval, refreshData]);

    return {
        data,
        loading,
        error,
        lastUpdated,
        refresh: refreshData,
        reload: loadData
    };
};

// Hook for loading multiple data types
export const useMultiDataLoader = (dataTypes, options = {}) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const loadAllData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const promises = dataTypes.map(async (dataType) => {
                let result;
                
                switch (dataType) {
                    case 'market_breadth':
                        result = await dataLoader.loadMarketBreadth();
                        break;
                    case 'market_breadth_4':
                        result = await dataLoader.loadMarketBreadth4();
                        break;
                    case 'industries':
                        result = await dataLoader.loadIndustriesData();
                        break;
                    case 'tickers':
                        result = await dataLoader.loadTickersData();
                        break;
                    case 'market_overview':
                        result = await dataLoader.loadMarketOverviewData();
                        break;
                    case 'abnormal_signals':
                        result = await dataLoader.loadAbnormalSignalsData();
                        break;
                    case 'abnormal_signals_intra':
                        result = await dataLoader.loadAbnormalSignalsIntraData();
                        break;
                    case 'top_deals':
                        result = await dataLoader.loadTopDealsData();
                        break;
                    case 'top_by_value':
                        result = await dataLoader.loadTopByValueData();
                        break;
                    case 'top_gainers':
                        result = await dataLoader.loadTopGainersData();
                        break;
                    case 'top_losers':
                        result = await dataLoader.loadTopLosersData();
                        break;
                    case 'top_by_volume':
                        result = await dataLoader.loadTopByVolumeData();
                        break;
                    case 'foreign_buy':
                        result = await dataLoader.loadForeignBuyData();
                        break;
                    case 'gdp_quarter':
                        result = await dataLoader.loadGDPQuarterData();
                        break;
                    case 'money_supply_month':
                        result = await dataLoader.loadMoneySupplyMonthData();
                        break;
                    case 'retail_sales_year':
                        result = await dataLoader.loadRetailSalesYearData();
                        break;
                    case 'retail_sales_month':
                        result = await dataLoader.loadRetailSalesMonthData();
                        break;
                    case 'cpi_month':
                        result = await dataLoader.loadCPIMonthData();
                        break;
                    case 'pe_ratio':
                        result = await dataLoader.loadPERatioData();
                        break;
                    case 'pb_ratio':
                        result = await dataLoader.loadPBRatioData();
                        break;
                    case 'industry_strength_time_series':
                        result = await dataLoader.loadIndustryStrengthTimeSeriesData();
                        break;
                    case 'rs_analysis':
                        result = await dataLoader.loadRSAnalysisData();
                        break;
                    default:
                        throw new Error(`Unknown data type: ${dataType}`);
                }

                return { [dataType]: result };
            });

            const results = await Promise.all(promises);
            const combinedData = results.reduce((acc, result) => ({ ...acc, ...result }), {});
            
            setData(combinedData);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message);
            console.error('Error loading multiple data types:', err);
        } finally {
            setLoading(false);
        }
    }, [dataTypes]);

    const refreshData = useCallback(() => {
        // Clear cache for all data types and reload
        dataTypes.forEach(dataType => dataLoader.clearCache(dataType));
        loadAllData();
    }, [dataTypes, loadAllData]);

    // Load data on mount and when dataTypes change
    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    // Listen for global reload events
    useEffect(() => {
        const handleGlobalReload = (event) => {
            const reloadedDataType = event.detail?.dataType;
            // If no specific data type is specified, or if it matches any of this hook's data types, reload
            if (!reloadedDataType || dataTypes.includes(reloadedDataType)) {
                refreshData();
            }
        };

        window.addEventListener('dataReloaded', handleGlobalReload);
        
        return () => {
            window.removeEventListener('dataReloaded', handleGlobalReload);
        };
    }, [dataTypes, refreshData]);

    // Auto-refresh if refreshInterval is provided
    useEffect(() => {
        if (options.refreshInterval) {
            const interval = setInterval(() => {
                refreshData();
            }, options.refreshInterval);

            return () => clearInterval(interval);
        }
    }, [options.refreshInterval, refreshData]);

    return {
        data,
        loading,
        error,
        lastUpdated,
        refresh: refreshData,
        reload: loadAllData
    };
};

// Hook for getting cache statistics
export const useCacheStats = () => {
    const [stats, setStats] = useState(dataLoader.getCacheStats());

    const updateStats = useCallback(() => {
        setStats(dataLoader.getCacheStats());
    }, []);

    const clearCache = useCallback((url = null) => {
        dataLoader.clearCache(url);
        updateStats();
    }, [updateStats]);

    return {
        stats,
        updateStats,
        clearCache
    };
}; 