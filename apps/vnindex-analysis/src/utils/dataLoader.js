import { useState, useEffect, useCallback } from 'react';

// Global cache for all data
const globalDataCache = new Map();

// Data loading states
const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Data types configuration
const DATA_TYPES = {
  // RRG Analysis Data
  RRG_ANALYSIS: {
    files: (timeframe) => [`rrg_data_${timeframe}.json`, `analyze_rs_${timeframe}.json`],
    processor: processRRGAnalysisData
  },
  
  // Market Breadth Data
  MARKET_BREADTH: {
    files: (timeframe) => [`analyze_breadth_${timeframe}.json`],
    processor: processMarketBreadthData
  },
  
  // VSA Analysis Data
  VSA_ANALYSIS: {
    files: (timeframe) => [`vsa_market_analysis_${timeframe}.json`],
    processor: processVSAAnalysisData
  },
  
  // Industry Strength Data
  INDUSTRY_STRENGTH: {
    files: () => ['industry_strength_analysis.json', 'industry_strength_time_series.json'],
    processor: processIndustryStrengthData
  },
  
  // Abnormal Signals Data
  ABNORMAL_SIGNALS: {
    files: (timeframe) => [`abnormal_signals${timeframe === 'intra' ? '_intra' : ''}.json`],
    processor: processAbnormalSignalsData
  },
  
  // VCP Analysis Data
  VCP_ANALYSIS: {
    files: (timeframe) => [`filter_vcp_${timeframe}.json`],
    processor: processVCPAnalysisData
  },
  
  // VCP Analysis Data (lowercase for backward compatibility)
  vcp_analysis: {
    files: (timeframe) => [`filter_vcp_${timeframe}.json`],
    processor: processVCPAnalysisData
  },
  
  // Macroeconomic Data
  MACRO_DATA: {
    files: () => [
      'gdp_year.json', 'gdp_quarter.json',
      'cpi_month.json', 'cpi_year.json',
      'fdi_month.json', 'fdi_year.json',
      'import_export_month.json', 'import_export_year.json',
      'retail_sales_month.json', 'retail_sales_year.json',
      'industrial_production_month.json', 'industrial_production_year.json',
      'money_supply_month.json', 'money_supply_year.json'
    ],
    processor: processMacroData
  },
  
  // Market Overview Data
  MARKET_OVERVIEW: {
    files: () => ['market_overview_dashboard.json'],
    processor: processMarketOverviewData
  },
  
  // Top Performers Data
  TOP_PERFORMERS: {
    files: () => [
      'top_gainers_vnindex_20.json', 'top_losers_vnindex_20.json',
      'top_by_value_vnindex_20.json', 'top_by_volume_vnindex_20.json',
      'top_deals_vnindex_20.json', 'foreign_buy_20.json', 'foreign_sell_20.json'
    ],
    processor: processTopPerformersData
  },
  
  // Individual data files for backward compatibility
  analyze_breadth: {
    files: () => ['analyze_breadth.json'],
    processor: processMarketBreadthData
  },
  
  analyze_breadth_5: {
    files: () => ['analyze_breadth_5.json'],
    processor: processMarketBreadthData
  },
  
  analyze_breadth_4: {
    files: () => ['analyze_breadth_4.json'],
    processor: processMarketBreadthData
  },
  
  analyze_groups_mfi: {
    files: () => ['analyze_groups_mfi.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  // Individual data files for backward compatibility
  rs_analysis: {
    files: (timeframe) => [`analyze_rs_${timeframe}.json`],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  vsa_market_analysis: {
    files: (timeframe) => [`vsa_market_analysis_${timeframe}.json`],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  industry_strength_time_series: {
    files: () => ['industry_strength_time_series.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  // Individual top performers data
  top_gainers: {
    files: () => ['top_gainers_vnindex_20.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  top_losers: {
    files: () => ['top_losers_vnindex_20.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  top_by_volume: {
    files: () => ['top_by_volume_vnindex_20.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  top_by_value: {
    files: () => ['top_by_value_vnindex_20.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  top_deals: {
    files: () => ['top_deals_vnindex_20.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  foreign_buy: {
    files: () => ['foreign_buy_20.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  foreign_sell: {
    files: () => ['foreign_sell_20.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  // Macroeconomic data types
  gdp_quarter: {
    files: () => ['gdp_quarter.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  money_supply_month: {
    files: () => ['money_supply_month.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  retail_sales_year: {
    files: () => ['retail_sales_year.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  retail_sales_month: {
    files: () => ['retail_sales_month.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  cpi_month: {
    files: () => ['cpi_month.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  pe_ratio: {
    files: () => ['pe_ratio_5y.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  pb_ratio: {
    files: () => ['pb_ratio_5y.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  market_overview: {
    files: () => ['market_overview_dashboard.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  abnormal_signals: {
    files: (timeframe) => [`abnormal_signals${timeframe === 'intra' ? '_intra' : ''}.json`],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  // Abnormal signals intraday data (for backward compatibility)
  abnormal_signals_intra: {
    files: () => ['abnormal_signals_intra.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  analyze_greed_fear: {
    files: () => ['analyze_greed_fear.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  // Company and Industry Metadata
  companies: {
    files: () => ['data/companies.json'],
    processor: ([data]) => data
  },
  
  industries: {
    files: () => ['data/industries.json'],
    processor: ([data]) => data
  },
  
  // RRG Analysis data type for backward compatibility - DEPRECATED
  // Use RRG_ANALYSIS instead to avoid duplicate data loading
  rrg_analysis: {
    files: (timeframe) => [`rrg_data_${timeframe}.json`, `analyze_rs_${timeframe}.json`],
    processor: processRRGAnalysisData
  }
};

// AJAX data loader with caching
async function loadDataFile(filename) {
  const cacheKey = filename;
  
  // Check cache first
  if (globalDataCache.has(cacheKey)) {
    return globalDataCache.get(cacheKey);
  }

  try {
    const url = `/embed-tools/vnindex-analysis/data/${filename}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    globalDataCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    throw error;
  }
}

// Load ticker data function
async function loadTicker(ticker) {
  try {
    // Use the same base path as the old code, but work with loadDataFile's /data/ prefix
    const basePath = '/embed-tools/vnindex-analysis/data';
    const filename = `${basePath}/data/tickers/${ticker}.json`;
    
    // Create a custom fetch for ticker files since they have a different base path
    const cacheKey = filename;
    
    // Check cache first
    if (globalDataCache.has(cacheKey)) {
      return globalDataCache.get(cacheKey);
    }

    const response = await fetch(filename);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    globalDataCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error(`Error loading ticker ${ticker}:`, error);
    throw error;
  }
}

// Data processors for different data types
function processRRGAnalysisData([rrgData, analyzeRsData]) {

  
  const industries = analyzeRsData.industries || [];
  const groups = analyzeRsData.groups || [];
  const symbols = analyzeRsData.symbols || [];

  const rrgIndustries = rrgData.series.filter(series => series.type === 'industry');
  const rrgGroups = rrgData.series.filter(series => series.type === 'group');
  const rrgSymbols = rrgData.series.filter(series => series.type === 'symbol');

  // Merge and process data
  const mergedIndustries = industries.map(industry => {
    const rrgIndustry = rrgIndustries.find(rrg => rrg.custom_id === industry.custom_id);
    return {
      ...industry,
      tail: rrgIndustry?.tail || [],
      rrg_position: rrgIndustry?.tail && rrgIndustry.tail.length > 0 ? 
        getRRGPosition(rrgIndustry.tail[rrgIndustry.tail.length - 1]) : null
    };
  });

  const mergedGroups = groups.map(group => {
    const rrgGroup = rrgGroups.find(rrg => rrg.custom_id === group.custom_id);
    return {
      ...group,
      tail: rrgGroup?.tail || [],
      rrg_position: rrgGroup?.tail && rrgGroup.tail.length > 0 ? 
        getRRGPosition(rrgGroup.tail[rrgGroup.tail.length - 1]) : null
    };
  });

  const mergedSymbols = symbols.map(symbol => {
    const rrgSymbol = rrgSymbols.find(rrg => rrg.custom_id === symbol.symbol);
    return {
      ...symbol,
      tail: rrgSymbol?.tail || [],
      rrg_position: rrgSymbol?.tail && rrgSymbol.tail.length > 0 ? 
        getRRGPosition(rrgSymbol.tail[rrgSymbol.tail.length - 1]) : null
    };
  });

  return {
    industries: mergedIndustries.map(mapAnalyticsEntity),
    groups: mergedGroups.map(mapAnalyticsEntity),
    symbols: mergedSymbols.map(mapAnalyticsEntity),
    tickers: mergedSymbols.map(mapAnalyticsEntity),
    insights: analyzeRsData.insights || {},
    analysis_date: analyzeRsData.analysis_date,
    timeframe: analyzeRsData.timeframe,
  };
}

function processMarketBreadthData([breadthData]) {
  return {
    ...breadthData,
    processed_at: new Date().toISOString()
  };
}

function processVSAAnalysisData([vsaData]) {
  return {
    ...vsaData,
    processed_at: new Date().toISOString()
  };
}

function processIndustryStrengthData([strengthAnalysis, timeSeries]) {
  return {
    analysis: strengthAnalysis,
    timeSeries: timeSeries,
    processed_at: new Date().toISOString()
  };
}

function processAbnormalSignalsData([signalsData]) {
  return {
    ...signalsData,
    processed_at: new Date().toISOString()
  };
}

function processVCPAnalysisData([vcpData]) {
  return {
    ...vcpData,
    processed_at: new Date().toISOString()
  };
}

function processMacroData(macroFiles) {
  const result = {};
  macroFiles.forEach((data, index) => {
    const filename = DATA_TYPES.MACRO_DATA.files()[index];
    const key = filename.replace('.json', '');
    result[key] = data;
  });
  result.processed_at = new Date().toISOString();
  return result;
}

function processMarketOverviewData([overviewData]) {
  return {
    ...overviewData,
    processed_at: new Date().toISOString()
  };
}

function processTopPerformersData(performerFiles) {
  const result = {};
  performerFiles.forEach((data, index) => {
    const filename = DATA_TYPES.TOP_PERFORMERS.files()[index];
    const key = filename.replace('.json', '');
    result[key] = data;
  });
  result.processed_at = new Date().toISOString();
  return result;
}

// Utility functions
function mapAnalyticsEntity(entity) {
  const latest = Array.isArray(entity.tail) && entity.tail.length > 0 ? entity.tail[entity.tail.length - 1] : {};
  return {
    ...entity,
    industry: entity.name,
    rs: entity.metrics?.current_rs ?? null,
    crs: entity.metrics?.current_crs ?? null,
    momentum: entity.speed_analysis?.weighted_speed ?? null,
    direction: entity.direction_analysis?.direction ?? null,
    trend_strength: entity.direction_analysis?.trend_strength ?? null,
    momentum_confirmed: entity.direction_analysis?.momentum_confirmed ?? null,
    signal_to_noise_ratio: entity.direction_analysis?.signal_to_noise_ratio ?? null,
    rs_ratio: latest.x ?? null,
    rs_momentum: latest.y ?? null,
  };
}

function getRRGPosition(point) {
  if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
    return null;
  }
  const x = point.x;
  const y = point.y;
  if (x > 100 && y > 100) return 'Leading (Dẫn dắt)';
  if (x > 100 && y <= 100) return 'Weakening (Suy yếu)';
  if (x <= 100 && y <= 100) return 'Lagging (Tụt hậu)';
  if (x <= 100 && y > 100) return 'Improving (Cải thiện)';
  return null;
}

// Main data loader function
async function loadDataType(dataType, timeframe = null) {

  const config = DATA_TYPES[dataType];
  if (!config) {
    throw new Error(`Unknown data type: ${dataType}`);
  }

  // Ensure timeframe is a string
  const cleanTimeframe = typeof timeframe === 'string' ? timeframe : 
                        (timeframe && typeof timeframe === 'object' ? timeframe.timeframe || '1D' : '1D');

  // Create a cache key
  const cacheKey = `${dataType}_${cleanTimeframe}`;
  
  // Check if data is already in cache
  if (globalDataCache.has(cacheKey)) {
    return globalDataCache.get(cacheKey);
  }

  try {
    const files = config.files(cleanTimeframe);
    const fileData = await Promise.all(files.map(loadDataFile));
    const result = config.processor(fileData);
    
    // Cache the result
    globalDataCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error(`Error loading ${dataType}:`, error);
    throw error;
  }
}

// 1. Bulk Ticker Loading
export async function loadTickersData() {
  // Try to fetch the list of ticker files from the public directory
  // (Assume a manifest file exists, or fallback to a hardcoded list)
  let tickersList = [
    'VNINDEX_EW', 'VNINDEX', 'VN100', 'VN30', 'VNALL', 'VNAllShare', 'VNMID', 'VNMidCap', 'VNSmallCap', 'VNSML'
  ];
  // If a manifest file exists, load it
  try {
    const manifest = await loadDataFile('data/tickers/manifest.json');
    if (Array.isArray(manifest)) {
      tickersList = manifest;
    }
  } catch (e) {
    // fallback to hardcoded list
  }
  const results = await Promise.all(
    tickersList.map(async (ticker) => {
      try {
        const data = await loadTicker(ticker);
        return [ticker, data];
      } catch (e) {
        return [ticker, null];
      }
    })
  );
  return Object.fromEntries(results);
}

// 2. Cache Invalidation by DataType
export function clearCache(dataType) {
  // Clear specific cache entries for the dataType
  for (const key of globalDataCache.keys()) {
    if (key.startsWith(dataType + '_')) {
      globalDataCache.delete(key);
    }
  }
}

// 3. Global Reload Event
function dispatchDataReloaded(dataType) {
  const event = new CustomEvent('dataReloaded', { detail: { dataType } });
  window.dispatchEvent(event);
}

// 4. Enhanced useDataLoader with lastUpdated and auto-refresh
export function useDataLoader(dataType, timeframe = null, dependencies = [], options = {}) {
  const [state, setState] = useState(LOADING_STATES.IDLE);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async () => {
    setState(LOADING_STATES.LOADING);
    setError(null);
    try {
      const result = await loadDataType(dataType, timeframe);
      setData(result);
      setLastUpdated(new Date());
      setState(LOADING_STATES.SUCCESS);
    } catch (err) {
      console.error(`useDataLoader: Error loading ${dataType}:`, err);
      setError(err);
      setState(LOADING_STATES.ERROR);
    }
  }, [dataType, timeframe]);

  useEffect(() => {
    loadData();
  }, [dataType, timeframe]); // Only depend on dataType and timeframe

  // Listen for global reload events
  useEffect(() => {
    const handleGlobalReload = (event) => {
      const reloadedDataType = event.detail?.dataType;
      if (!reloadedDataType || reloadedDataType === dataType) {
        clearCache(dataType);
        loadData();
      }
    };
    window.addEventListener('dataReloaded', handleGlobalReload);
    return () => {
      window.removeEventListener('dataReloaded', handleGlobalReload);
    };
  }, [dataType, timeframe]); // Only depend on dataType and timeframe

  // Auto-refresh if refreshInterval is provided
  useEffect(() => {
    if (options.refreshInterval) {
      const interval = setInterval(() => {
        clearCache(dataType);
        loadData();
      }, options.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [options.refreshInterval, dataType, timeframe]); // Only depend on dataType and timeframe

  const result = {
    data,
    loading: state === LOADING_STATES.LOADING || (!data && !error), // Consider loading if no data and no error
    error,
    lastUpdated,
    refresh: () => {
      clearCache(dataType);
      loadData();
      dispatchDataReloaded(dataType);
    },
    reload: loadData,
  };
  
  return result;
}

// 5. useMultiDataLoader
export function useMultiDataLoader(dataTypes, options = {}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = dataTypes.map(async (dataType) => {
        clearCache(dataType);
        const result = await loadDataType(dataType, options.timeframe);
        return [dataType, result];
      });
      const results = await Promise.all(promises);
      setData(Object.fromEntries(results));
      setLastUpdated(new Date());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [dataTypes, options.timeframe]);

  useEffect(() => {
    loadAllData();
  }, [dataTypes, options.timeframe]);

  // Listen for global reload events
  useEffect(() => {
    const handleGlobalReload = (event) => {
      const reloadedDataType = event.detail?.dataType;
      if (!reloadedDataType || dataTypes.includes(reloadedDataType)) {
        loadAllData();
      }
    };
    window.addEventListener('dataReloaded', handleGlobalReload);
    return () => {
      window.removeEventListener('dataReloaded', handleGlobalReload);
    };
  }, [dataTypes, options.timeframe]);

  // Auto-refresh if refreshInterval is provided
  useEffect(() => {
    if (options.refreshInterval) {
      const interval = setInterval(() => {
        loadAllData();
      }, options.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [options.refreshInterval, dataTypes, options.timeframe]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh: loadAllData,
    reload: loadAllData,
  };
}



// Specific hooks for common data types
export function useRRGAnalysis(timeframe = '1D') {
  return useDataLoader('RRG_ANALYSIS', timeframe);
}

export function useMarketBreadth(timeframe = '1D') {
  return useDataLoader('MARKET_BREADTH', timeframe);
}

export function useVSAAnalysis(timeframe = '1D') {
  return useDataLoader('VSA_ANALYSIS', timeframe);
}

export function useIndustryStrength() {
  return useDataLoader('INDUSTRY_STRENGTH');
}

export function useAbnormalSignals(timeframe = '1D') {
  return useDataLoader('ABNORMAL_SIGNALS', timeframe);
}

export function useVCPAnalysis(timeframe = '1D') {
  return useDataLoader('VCP_ANALYSIS', timeframe);
}

export function useMacroData() {
  return useDataLoader('MACRO_DATA');
}

export function useMarketOverview() {
  return useDataLoader('MARKET_OVERVIEW');
}

export function useTopPerformers() {
  return useDataLoader('TOP_PERFORMERS');
}

export function useCompanies() {
  return useDataLoader('companies');
}

export function useIndustries() {
  return useDataLoader('industries');
}

// Cache management utilities
export const cacheUtils = {
  clearCache: () => globalDataCache.clear(),
  getCacheSize: () => globalDataCache.size,
  getCacheKeys: () => Array.from(globalDataCache.keys()),
  removeFromCache: (key) => globalDataCache.delete(key),
  getCacheStats: () => ({
    size: globalDataCache.size,
    keys: Array.from(globalDataCache.keys()),
    totalSize: Array.from(globalDataCache.values()).reduce((acc, val) => acc + JSON.stringify(val).length, 0)
  })
};

// Hook for cache statistics
export function useCacheStats() {
  const [stats, setStats] = useState({
    total: 0,
    valid: 0,
    expired: 0
  });

  const updateStats = useCallback(() => {
    const cacheStats = cacheUtils.getCacheStats();
    setStats({
      total: cacheStats.size,
      valid: cacheStats.size, // All cached items are considered valid in this implementation
      expired: 0 // No expiration mechanism in current implementation
    });
  }, []);

  useEffect(() => {
    updateStats();
  }, []); // updateStats is stable, no dependencies needed

  return { stats, updateStats };
}

// Utility functions for ticker information lookup
export function useTickerInfo() {
  const { data: companies } = useCompanies();
  const { data: industries } = useIndustries();
  
  const getTickerInfo = useCallback((ticker) => {
    if (!companies || !industries) return null;
    
    // Companies is now an object with symbol as key
    const company = companies[ticker];
    if (!company) return null;
    
    // Industries is now an object with custom_id as key
    const industry = industries[company.industry_id];
    
    return {
      ticker: ticker,
      name: company.name,
      industry: industry ? industry.name : 'Unknown',
      industry_id: company.industry_id
    };
  }, [companies, industries]);
  
  const getIndustryTickers = useCallback((industryId) => {
    if (!companies) return [];
    // Filter companies by industry_id and return their symbols
    return Object.entries(companies)
      .filter(([symbol, company]) => company.industry_id === industryId)
      .map(([symbol]) => symbol);
  }, [companies]);
  
  const getIndustryName = useCallback((industryId) => {
    if (!industries) return 'Unknown';
    
    // Industries is now an object with custom_id as key
    const industry = industries[industryId];
    return industry ? industry.name : 'Unknown';
  }, [industries]);
  
  return {
    companies,
    industries,
    getTickerInfo,
    getIndustryTickers,
    getIndustryName,
    loading: !companies || !industries
  };
}

// Hook for using pre-loaded ticker info data
export function useTickerInfoWithData(companies, industries) {
  const getTickerInfo = useCallback((ticker) => {
    if (!companies || !industries) return null;
    
    // Companies is now an object with symbol as key
    const company = companies[ticker];
    if (!company) return null;
    
    // Industries is now an object with custom_id as key
    const industry = industries[company.industry_id];
    
    return {
      ticker: ticker,
      name: company.name,
      industry: industry ? industry.name : 'Unknown',
      industry_id: company.industry_id
    };
  }, [companies, industries]);
  
  const getIndustryTickers = useCallback((industryId) => {
    if (!companies) return [];
    // Filter companies by industry_id and return their symbols
    return Object.entries(companies)
      .filter(([symbol, company]) => company.industry_id === industryId)
      .map(([symbol]) => symbol);
  }, [companies]);
  
  const getIndustryName = useCallback((industryId) => {
    if (!industries) return 'Unknown';
    
    // Industries is now an object with custom_id as key
    const industry = industries[industryId];
    return industry ? industry.name : 'Unknown';
  }, [industries]);
  
  return {
    companies,
    industries,
    getTickerInfo,
    getIndustryTickers,
    getIndustryName,
    loading: !companies || !industries
  };
}

// Export data types for reference
export { DATA_TYPES, LOADING_STATES };

// Default export for backward compatibility
export default {
  useDataLoader,
  useRRGAnalysis,
  useMarketBreadth,
  useVSAAnalysis,
  useIndustryStrength,
  useAbnormalSignals,
  useVCPAnalysis,
  useMacroData,
  useMarketOverview,
  useTopPerformers,
  useCompanies,
  useIndustries,
  useTickerInfo,
  useTickerInfoWithData,
  useCacheStats,
  cacheUtils,
  loadTicker,
  DATA_TYPES,
  LOADING_STATES
}; 