import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Data Loader for VN Index Analysis
 * 
 * Updated to use API endpoints instead of static files:
 * - All data now loaded from https://api.taichinhchungkhoan.com
 * - Maintains same caching and loading behavior
 * - Backwards compatible with existing data structures
 */

// API Configuration
const API_CONFIG = {
  baseUrl: 'https://api.taichinhchungkhoan.com',
  endpoints: {
    reports: '/reports'
  }
};

// Global cache for all data
const globalDataCache = new Map();

// Global loading state to prevent duplicate requests
const globalLoadingState = new Map();

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
    files: (timeframe) => [`analysis/analyze_rs/rrg_data_${timeframe}.json`, `analysis/analyze_rs/analyze_rs_${timeframe}.json`, `analysis/analyze_rs/rs_21bar_viz_${timeframe}.json`],
    processor: processRRGAnalysisData
  },
  
  // Market Breadth Data
  MARKET_BREADTH: {
    files: (timeframe) => [`analysis/analyze_breadth_${timeframe}.json`],
    processor: processMarketBreadthData
  },
  
  // VSA Analysis Data
  VSA_ANALYSIS: {
    files: (timeframe) => [`analysis/analyze_vsa/vsa_market_analysis_${timeframe}.json`],
    processor: processVSAAnalysisData
  },
  
  // Industry Strength Data
  INDUSTRY_STRENGTH: {
    files: () => ['industry_strength_analysis.json', 'industry_strength_time_series.json'],
    processor: processIndustryStrengthData
  },
  
  // Abnormal Signals Data
  ABNORMAL_SIGNALS: {
    files: (timeframe) => [`filters/abnormal_signals${timeframe === 'intra' ? '_intra' : ''}.json`],
    processor: processAbnormalSignalsData
  },
  
  // VCP Analysis Data
  VCP_ANALYSIS: {
    files: (timeframe) => [`filters/filter_vcp_${timeframe}.json`],
    processor: processVCPAnalysisData
  },
  
  // VCP Analysis Data (lowercase for backward compatibility)
  vcp_analysis: {
    files: (timeframe) => [`filters/filter_vcp_${timeframe}.json`],
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
  
  // RS 21-Bar Heatmap Data
  RS_21BAR_HEATMAP: {
    files: (timeframe) => [`analysis/analyze_rs/rs_21bar_viz_${timeframe}.json`, `analysis/analyze_rs/analyze_rs_${timeframe}.json`],
    processor: processRS21BarHeatmapData
  },
  
  // RS 21-Bar Industry Data
  RS_21BAR_INDUSTRY: {
    files: (timeframe) => [`analysis/analyze_rs/rs_21bar_viz_${timeframe}.json`, `analysis/analyze_rs/analyze_rs_${timeframe}.json`],
    processor: processRS21BarIndustryData
  },
  
  // RS 21-Bar Ticker Data
  RS_21BAR_TICKER: {
    files: (timeframe) => [`analysis/analyze_rs/rs_21bar_viz_${timeframe}.json`, `analysis/analyze_rs/analyze_rs_${timeframe}.json`],
    processor: processRS21BarTickerData
  },
  
  // Individual data files for backward compatibility
  analyze_breadth: {
    files: () => ['analysis/analyze_breadth.json'],
    processor: processMarketBreadthData
  },
  
  analyze_breadth_5: {
    files: () => ['analysis/analyze_breadth_5.json'],
    processor: processMarketBreadthData
  },
  
  analyze_breadth_4: {
    files: () => ['analysis/analyze_breadth_4.json'],
    processor: processMarketBreadthData
  },
  
  // New breadth data structure
  breadth_data: {
    files: (type = 'market') => {
      if (type === 'market') {
        return ['analysis/analyze_breadth5/market.json'];
      } else {
        return [`analysis/analyze_breadth5/industries/${type}.json`];
      }
    },
    processor: processMarketBreadthData
  },
  
  breadth_industries_summary: {
    files: () => ['analysis/analyze_breadth5/industries/summary.json'],
    processor: ([data]) => data
  },
  
  analyze_groups_mfi: {
    files: () => ['analysis/analyze_groups_mfi.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  // Individual data files for backward compatibility
  rs_analysis: {
    files: (timeframe) => [`analysis/analyze_rs/analyze_rs_${timeframe}.json`],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  vsa_market_analysis: {
    files: (timeframe) => [`analysis/analyze_vsa/vsa_market_analysis_${timeframe}.json`],
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
  
  cpi_year: {
    files: () => ['cpi_year.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  // New inflation-related data types
  ppi_month: {
    files: () => ['ppi_month.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  pce_month: {
    files: () => ['pce_month.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  commodities_data: {
    files: () => ['commodities_data.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  // Enhanced inflation analysis data
  inflation_analysis: {
    files: () => ['inflation_analysis.json'],
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
    files: (timeframe) => [`filters/abnormal_signals${timeframe === 'intra' ? '_intra' : ''}.json`],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  // Abnormal signals intraday data (for backward compatibility)
  abnormal_signals_intra: {
    files: () => ['filters/abnormal_signals_intra.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  analyze_greed_fear: {
    files: () => ['analysis/analyze_greed_fear.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  // Company and Industry Metadata
  companies: {
    files: () => ['companies.json'],
    processor: ([data]) => data
  },
  
  industries: {
    files: () => ['industries.json'],
    processor: ([data]) => data
  },
  
  // RRG Analysis data type for backward compatibility - DEPRECATED
  // Use RRG_ANALYSIS instead to avoid duplicate data loading
  rrg_analysis: {
    files: (timeframe) => [`analysis/analyze_rs/rrg_data_${timeframe}.json`, `analysis/analyze_rs/analyze_rs_${timeframe}.json`],
    processor: processRRGAnalysisData
  },
  
  // Top-down analysis data types
  topdown_insights: {
    files: () => ['analysis/topdown/insights.json'],
    processor: ([data]) => ({ ...data, processed_at: new Date().toISOString() })
  },
  
  topdown_insights_md: {
    files: () => ['analysis/topdown/insights.md'],
    processor: ([data]) => ({ content: data, processed_at: new Date().toISOString() })
  }
};

// AJAX data loader with caching - now uses API endpoints
async function loadDataFile(filename) {
  const cacheKey = filename;
  
  // Check cache first
  if (globalDataCache.has(cacheKey)) {
    return globalDataCache.get(cacheKey);
  }

  try {
    // Convert file path to API endpoint
    let url;
    if (filename.startsWith('data/')) {
      // Files that already have data/ prefix should be loaded from the API as-is
      url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.reports}/${filename}`;
    } else if (filename.startsWith('analysis/')) {
      // Analysis files go to /reports/analysis/ endpoint
      url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.reports}/${filename}`;
    } else if (filename.startsWith('filters/')) {
      // Filter files go to /reports/filters/ endpoint
      url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.reports}/${filename}`;
    } else {
      // Other files go through the API with data/ prefix
      url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.reports}/data/${filename}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.status}`);
    }
    
    // Handle different file types
    let data;
    if (filename.endsWith('.md')) {
      // Load markdown files as text
      data = await response.text();
    } else {
      // Load JSON files as JSON with better error handling
      try {
        const text = await response.text();
        // Replace NaN values with null before parsing
        // Handle different NaN formats: NaN, "NaN", and NaN in arrays
        const cleanedText = text
          .replace(/:\s*NaN\s*([,}])/g, ': null$1')
          .replace(/:\s*"NaN"\s*([,}])/g, ': null$1')
          .replace(/\[\s*NaN\s*([,\]])/g, '[null$1')
          .replace(/,\s*NaN\s*([,\]])/g, ', null$1')
          .replace(/,\s*"NaN"\s*([,\]])/g, ', null$1');
        data = JSON.parse(cleanedText);
      } catch (jsonError) {
        console.error(`JSON parsing error for ${filename}:`, jsonError);
        // Return a fallback structure instead of throwing
        if (filename.includes('analyze_rs')) {
          return {
            industries: [],
            groups: [],
            symbols: [],
            insights: {},
            analysis_date: new Date().toISOString(),
            timeframe: '1D',
            error: `Failed to parse JSON: ${jsonError.message}`
          };
        }
        throw jsonError;
      }
    }
    
    // Cache the result
    globalDataCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    
    // Return fallback data for critical files instead of throwing
    if (filename.includes('analyze_rs')) {
      const fallbackData = {
        industries: [],
        groups: [],
        symbols: [],
        insights: {},
        analysis_date: new Date().toISOString(),
        timeframe: '1D',
        error: `Failed to load: ${error.message}`
      };
      globalDataCache.set(cacheKey, fallbackData);
      return fallbackData;
    }
    
    throw error;
  }
}

// Load ticker data function - now uses API endpoints
async function loadTicker(ticker) {
  try {
    // Ticker files are now served through the API
    const filename = `tickers/${ticker}.json`;
    
    // Use the same loadDataFile function to maintain consistency
    return await loadDataFile(filename);
  } catch (error) {
    console.error(`Error loading ticker ${ticker}:`, error);
    throw error;
  }
}

// Data processors for different data types
function processRRGAnalysisData([rrgData, analyzeRsData, rs21BarData]) {
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
    
    // Add industry information to the symbol
    const symbolWithIndustry = {
      ...symbol,
      tail: rrgSymbol?.tail || [],
      rrg_position: rrgSymbol?.tail && rrgSymbol.tail.length > 0 ? 
        getRRGPosition(rrgSymbol.tail[rrgSymbol.tail.length - 1]) : null,
      // Add industries array if it doesn't exist
      industries: symbol.industries || []
    };
    
    // If symbol has industry_id, try to find the corresponding industry
    if (symbol.industry_id && !symbolWithIndustry.industries.length) {
      const industry = industries.find(ind => ind.custom_id === symbol.industry_id);
      if (industry) {
        symbolWithIndustry.industries = [industry];
      }
    }
    
    // If still no industries, try to find by symbol name in industries
    if (!symbolWithIndustry.industries.length) {
      const industry = industries.find(ind => ind.symbols && ind.symbols.includes(symbol.symbol));
      if (industry) {
        symbolWithIndustry.industries = [industry];
      }
    }
    
    return symbolWithIndustry;
  });

  // Merge RS 21-Bar data with symbols if available
  const symbolsWithRS21Bar = mergedSymbols.map(symbol => {
    // First try to find ticker-specific RS 21-Bar data
    if (rs21BarData?.symbols) {
      const rs21BarSymbol = rs21BarData.symbols.find(rs => rs.id === symbol.symbol);
      if (rs21BarSymbol) {
        return {
          ...symbol,
          rs_bars: rs21BarSymbol.rs_bars || []
        };
      }
    }
    
    // If no ticker-specific data, try to map industry RS 21-Bar data to tickers
    if (rs21BarData?.industries && symbol.industries && symbol.industries.length > 0) {
      // Find the primary industry (first one in the array)
      const primaryIndustry = symbol.industries[0];
      const industryRS21Bar = rs21BarData.industries.find(ind => ind.id === primaryIndustry.custom_id);
      
      if (industryRS21Bar && industryRS21Bar.rs_bars) {
        return {
          ...symbol,
          rs_bars: industryRS21Bar.rs_bars || []
        };
      }
    }
    
    return symbol;
  });

  return {
    industries: mergedIndustries.map(mapAnalyticsEntity),
    groups: mergedGroups.map(mapAnalyticsEntity),
    symbols: symbolsWithRS21Bar.map(mapAnalyticsEntity),
    tickers: symbolsWithRS21Bar.map(mapAnalyticsEntity),
    insights: analyzeRsData.insights || {},
    analysis_date: analyzeRsData.analysis_date,
    timeframe: analyzeRsData.timeframe,
    rs21BarData: rs21BarData || null, // Add RS 21-Bar data
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

function processRS21BarHeatmapData([rs21BarData, analyzeRsData]) {
  // Create a map of industry data from analyze_rs for additional metrics
  const industryMetrics = {};
  if (analyzeRsData?.industries) {
    analyzeRsData.industries.forEach(industry => {
      industryMetrics[industry.custom_id] = {
        current_crs: industry.metrics?.current_crs,
        crs_status: industry.metrics?.crs_status,
        rs_slope_fast: industry.metrics?.rs_slope_fast,
        rs_slope_slow: industry.metrics?.rs_slope_slow,
        rs_trend_fast: industry.metrics?.rs_trend_fast,
        rs_trend_slow: industry.metrics?.rs_trend_slow,
        slope_delta: industry.metrics?.slope_delta,
        up_ratio: industry.metrics?.up_ratio,
        net_decayed: industry.metrics?.net_decayed,
        trend_strength: industry.direction_analysis?.trend_strength?.overall_trend_strength
      };
    });
  }
  
  // Handle both 'industries' and 'items' keys for backward compatibility
  const industries = rs21BarData?.industries || rs21BarData?.items || [];
  
  return {
    industries: industries.map(industry => ({
      ...industry,
      ...industryMetrics[industry.custom_id]
    })),
    symbols: rs21BarData?.symbols || []
  };
}

function processRS21BarIndustryData([rs21BarData, analyzeRsData]) {
  // Create a map of industry data from analyze_rs for additional metrics
  const industryMetrics = {};
  if (analyzeRsData?.industries) {
    analyzeRsData.industries.forEach(industry => {
      industryMetrics[industry.custom_id] = {
        current_crs: industry.metrics?.current_crs,
        crs_status: industry.metrics?.crs_status,
        rs_slope_fast: industry.metrics?.rs_slope_fast,
        rs_slope_slow: industry.metrics?.rs_slope_slow,
        rs_trend_fast: industry.metrics?.rs_trend_fast,
        rs_trend_slow: industry.metrics?.rs_trend_slow,
        slope_delta: industry.metrics?.slope_delta,
        up_ratio: industry.metrics?.up_ratio,
        net_decayed: industry.metrics?.net_decayed,
        trend_strength: industry.direction_analysis?.trend_strength?.overall_trend_strength
      };
    });
  }
  
  // Handle both 'industries' and 'items' keys for backward compatibility
  const industries = rs21BarData?.industries || rs21BarData?.items || [];
  
  const result = {
    industries: industries.map(industry => ({
      ...industry,
      ...industryMetrics[industry.custom_id] // Use custom_id to match with analyze_rs data
    }))
  };
  
  return result;
}

function processRS21BarTickerData([rs21BarData, analyzeRsData]) {
  // Create a map of ticker data from analyze_rs for additional metrics
  const tickerMetrics = {};
  if (analyzeRsData?.symbols) {
    analyzeRsData.symbols.forEach(symbol => {
      tickerMetrics[symbol.symbol] = {
        current_crs: symbol.metrics?.current_crs,
        crs_status: symbol.metrics?.crs_status,
        rs_slope_fast: symbol.metrics?.rs_slope_fast,
        rs_slope_slow: symbol.metrics?.rs_slope_slow,
        rs_trend_fast: symbol.metrics?.rs_trend_fast,
        rs_trend_slow: symbol.metrics?.rs_trend_slow,
        slope_delta: symbol.metrics?.slope_delta,
        up_ratio: symbol.metrics?.up_ratio,
        net_decayed: symbol.metrics?.net_decayed,
        trend_strength: symbol.direction_analysis?.trend_strength?.overall_trend_strength
      };
    });
  }
  
  const symbols = rs21BarData?.symbols || [];
  
  return {
    symbols: symbols.map(symbol => ({
      ...symbol,
      ...tickerMetrics[symbol.symbol] // Use symbol to match with analyze_rs data
    }))
  };
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
    trend_strength: entity.direction_analysis?.trend_strength?.overall_trend_strength ?? null,
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

// Global helper functions for company-industry mapping
export function enrichCompaniesWithIndustries(companies, industries) {
  if (!companies || !industries) return companies;
  
  return Object.entries(companies).reduce((enriched, [symbol, company]) => {
    const industry = industries[company.industry_id];
    enriched[symbol] = {
      ...company,
      industry_name: industry?.name || 'Unknown',
      industry: industry || null
    };
    return enriched;
  }, {});
}

export function enrichTickersWithIndustries(tickers, companies, industries) {
  if (!tickers || !companies || !industries) return tickers;
  
  return tickers.map(ticker => {
    const tickerSymbol = ticker.symbol || ticker.id;
    const company = companies[tickerSymbol];
    
    // Get the primary industry (first one in the array)
    const primaryIndustry = company?.industries?.[0];
    const industryId = primaryIndustry?.custom_id;
    const industry = industryId ? industries[industryId] : null;
    
    return {
      ...ticker,
      industry_name: industry?.name || 'Unknown',
      industry_id: industryId || null,
      industry: industry || null
    };
  });
}

export function getCompanyIndustry(symbol, companies, industries) {
  if (!companies || !industries) return null;
  
  const company = companies[symbol];
  if (!company) return null;
  
  const industry = industries[company.industry_id];
  return {
    company,
    industry,
    industry_name: industry?.name || 'Unknown'
  };
}

export function getIndustryCompanies(industryId, companies) {
  if (!companies) return [];
  
  return Object.entries(companies)
    .filter(([symbol, company]) => company.industry_id === industryId)
    .map(([symbol, company]) => ({
      symbol,
      ...company
    }));
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
  
  // Check if already loading globally
  if (globalLoadingState.has(cacheKey)) {
    // Wait for the existing request to complete
    while (globalLoadingState.has(cacheKey)) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    // Check cache again after waiting
    if (globalDataCache.has(cacheKey)) {
      return globalDataCache.get(cacheKey);
    }
  }
  
  // Set global loading state
  globalLoadingState.set(cacheKey, true);
  
  try {
    // Get file list
    const files = config.files(cleanTimeframe);
    
    // Load all files
    const fileData = await Promise.all(files.map(loadDataFile));
    
    // Process the data
    const processedData = config.processor(fileData);
    
    // Cache the result
    globalDataCache.set(cacheKey, processedData);
    
    // Clear loading state
    globalLoadingState.delete(cacheKey);
    
    // Dispatch reload event
    dispatchDataReloaded(dataType);
    
    return processedData;
  } catch (error) {
    console.error(`Error loading ${dataType}:`, error);
    throw error;
  } finally {
    // Clear global loading state
    globalLoadingState.delete(cacheKey);
  }
}

// 1. Bulk Ticker Loading
export async function loadTickersData() {
  // Try to fetch the list of ticker files from the public directory
  // (Assume a manifest file exists, or fallback to a hardcoded list)
  let tickersList = [
    'VNINDEX_EW', 'VNINDEX', 'VN100', 'VN30', 'VNALL', 'VNMID', 'VNSML'
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
    // Prevent duplicate requests if already loading
    if (state === LOADING_STATES.LOADING) {
      return;
    }
    
    // Check if data is already cached for the current timeframe
    const cacheKey = `${dataType}_${timeframe || '1D'}`;
    if (globalDataCache.has(cacheKey)) {
      // Only return early if we already have the correct data loaded
      // This prevents the issue where timeframe changes don't trigger data reload
      const cachedData = globalDataCache.get(cacheKey);
      if (data === cachedData) {
        return;
      }
    }
    
    setState(LOADING_STATES.LOADING);
    setError(null);
    try {
      const result = await loadDataType(dataType, timeframe);
      
      // Check if the result contains an error field (from fallback data)
      if (result && result.error) {
        console.warn(`useDataLoader: Data loaded with errors for ${dataType}:`, result.error);
        // Still set the data but also set a warning error
        setData(result);
        setError(new Error(`Data loaded with warnings: ${result.error}`));
        setState(LOADING_STATES.SUCCESS); // Still consider it success since we have data
      } else {
        setData(result);
        setLastUpdated(new Date());
        setState(LOADING_STATES.SUCCESS);
      }
    } catch (err) {
      console.error(`useDataLoader: Error loading ${dataType}:`, err);
      setError(err);
      setState(LOADING_STATES.ERROR);
    }
  }, [dataType, timeframe, state, data]);

  useEffect(() => {
    loadData();
  }, [loadData]); // Depend on loadData which is stable

  // Listen for global reload events
  useEffect(() => {
    const handleGlobalReload = (event) => {
      const reloadedDataType = event.detail?.dataType;
      if (!reloadedDataType || reloadedDataType === dataType) {
        loadData();
      }
    };
    window.addEventListener('dataReloaded', handleGlobalReload);
    return () => {
      window.removeEventListener('dataReloaded', handleGlobalReload);
    };
  }, [dataType, loadData]); // Depend on loadData which is stable

  // Auto-refresh if refreshInterval is provided
  useEffect(() => {
    if (options.refreshInterval) {
      const interval = setInterval(() => {
        loadData();
      }, options.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [options.refreshInterval, dataType, loadData]); // Depend on loadData which is stable

  const result = {
    data,
    loading: state === LOADING_STATES.LOADING || (!data && !error), // Consider loading if no data and no error
    error,
    lastUpdated,
    refresh: () => {
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
    // Prevent duplicate requests if already loading
    if (loading) {
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const promises = dataTypes.map(async (dataType) => {
        // Don't clear cache unnecessarily - let loadDataType handle caching
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
  }, [dataTypes, options.timeframe, loading]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

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
  }, [dataTypes, loadAllData]);

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

// New breadth data hooks
export function useBreadthData(type = 'market') {
  return useDataLoader('breadth_data', type, [type], {
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    cacheKey: `breadth_data_${type}`
  });
}

export function useBreadthIndustriesSummary() {
  return useDataLoader('breadth_industries_summary', null, [], {
    refreshInterval: 60 * 60 * 1000, // 1 hour
    cacheKey: 'breadth_industries_summary'
  });
}

// Hook for RS 21-Bar Heatmap data
export function useRS21BarHeatmap(timeframe, dataType = 'industry') {
  let dataTypeToLoad;
  
  if (dataType === 'industry') {
    dataTypeToLoad = 'RS_21BAR_INDUSTRY';
  } else if (dataType === 'ticker') {
    dataTypeToLoad = 'RS_21BAR_TICKER';
  } else {
    // Default to full data for backward compatibility
    dataTypeToLoad = 'RS_21BAR_HEATMAP';
  }
  
  return useDataLoader(dataTypeToLoad, timeframe);
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
  useRS21BarHeatmap,
  useCacheStats,
  cacheUtils,
  loadTicker,
  DATA_TYPES,
  LOADING_STATES
};