import rrgData1D from '../data/rrg_data_1D.json';
import rrgData1W from '../data/rrg_data_1W.json';
import analyzeRsData1D from '../data/analyze_rs_1D.json';
import analyzeRsData1W from '../data/analyze_rs_1W.json';

// Cache for processed data
let processedData1D = null;
let processedData1W = null;
let industryMapping = null;

// Process RRG data and create industry mapping
export const loadRRGData = (timeframe = '1D') => {
  // Determine which data to use based on timeframe
  const rrgData = timeframe === '1W' ? rrgData1W : rrgData1D;
  const analyzeRsData = timeframe === '1W' ? analyzeRsData1W : analyzeRsData1D;
  
  // Use appropriate cache
  const cacheKey = timeframe === '1W' ? '1W' : '1D';
  const cache = timeframe === '1W' ? processedData1W : processedData1D;
  
  if (cache) {
    return cache;
  }

  try {
    // Create industry mapping from analyze_rs.json for reference
    const tickerToIndustry = new Map();
    const industryList = new Map();

    // Process industries from analyze_rs.json
    if (analyzeRsData.industries) {
      analyzeRsData.industries.forEach(industry => {
        industryList.set(industry.custom_id, {
          id: industry.custom_id,
          name: industry.name
        });
      });
    }

    // Process tickers and their industry mappings from analyze_rs.json (for backward compatibility)
    if (analyzeRsData.symbols) {
      analyzeRsData.symbols.forEach(symbol => {
        if (symbol.industries && symbol.industries.length > 0) {
          const primaryIndustry = symbol.industries.find(ind => ind.is_primary);
          if (primaryIndustry) {
            tickerToIndustry.set(symbol.symbol, {
              id: primaryIndustry.custom_id,
              name: primaryIndustry.name
            });
          }
        }
      });
    }

    // Extract data from the new analyze_rs structure
    const industries = analyzeRsData.industries || [];
    const groups = analyzeRsData.groups || [];
    const symbols = analyzeRsData.symbols || [];

    // Get RRG tail data from the rrg_data files
    const rrgIndustries = rrgData.series.filter(series => series.type === 'industry');
    const rrgGroups = rrgData.series.filter(series => series.type === 'group');
    const rrgSymbols = rrgData.series.filter(series => series.type === 'symbol');

    // Merge analyze_rs data with RRG tail data
    const mergedIndustries = industries.map(industry => {
      const rrgIndustry = rrgIndustries.find(rrg => rrg.id === industry.custom_id);
      if (!rrgIndustry) {
        console.warn(`No RRG data found for industry: ${industry.custom_id} (${industry.name})`);
      }
      return {
        ...industry,
        tail: rrgIndustry?.tail || [],
        // Add RRG position based on latest tail data
        rrg_position: rrgIndustry?.tail && rrgIndustry.tail.length > 0 ? 
          getRRGPosition(rrgIndustry.tail[rrgIndustry.tail.length - 1]) : null
      };
    });

    const mergedGroups = groups.map(group => {
      const rrgGroup = rrgGroups.find(rrg => rrg.id === group.custom_id);
      if (!rrgGroup) {
        console.warn(`No RRG data found for group: ${group.custom_id} (${group.name})`);
      }
      return {
        ...group,
        tail: rrgGroup?.tail || [],
        // Add RRG position based on latest tail data
        rrg_position: rrgGroup?.tail && rrgGroup.tail.length > 0 ? 
          getRRGPosition(rrgGroup.tail[rrgGroup.tail.length - 1]) : null
      };
    });

    const mergedSymbols = symbols.map(symbol => {
      const rrgSymbol = rrgSymbols.find(rrg => rrg.id === symbol.symbol);
      if (!rrgSymbol) {
        console.warn(`No RRG data found for symbol: ${symbol.symbol} (${symbol.name})`);
      }
      return {
        ...symbol,
        tail: rrgSymbol?.tail || [],
        // Add RRG position based on latest tail data
        rrg_position: rrgSymbol?.tail && rrgSymbol.tail.length > 0 ? 
          getRRGPosition(rrgSymbol.tail[rrgSymbol.tail.length - 1]) : null
      };
    });

    // Create a map of ticker to industry using the new structure
    const rrgTickerToIndustry = new Map();
    mergedSymbols.forEach(symbol => {
      if (symbol.industries && symbol.industries.length > 0) {
        const primaryIndustry = symbol.industries.find(ind => ind.is_primary);
        if (primaryIndustry) {
          rrgTickerToIndustry.set(symbol.symbol, {
            id: primaryIndustry.custom_id,
            name: primaryIndustry.name
          });
        }
      }
    });

    const processedData = {
      rrgDate: analyzeRsData.analysis_date || rrgData.rrg_date,
      tailLength: analyzeRsData.lookback_period || rrgData.tail_length,
      timeframe: timeframe,
      industries: mergedIndustries,
      groups: mergedGroups,
      tickers: mergedSymbols, // Use merged symbols as tickers for backward compatibility
      symbols: mergedSymbols, // Add merged symbols for new structure
      tickerToIndustry: rrgTickerToIndustry, // Use the new RRG-based mapping
      industryList: Array.from(industryList.values())
    };

    // Store in appropriate cache
    if (timeframe === '1W') {
      processedData1W = processedData;
    } else {
      processedData1D = processedData;
    }

    return processedData;
  } catch (error) {
    console.error(`Error loading RRG data (${timeframe}):`, error);
    throw error;
  }
};

// Helper function to determine RRG position based on x,y coordinates
const getRRGPosition = (point) => {
  if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
    return null;
  }
  
  const x = point.x;
  const y = point.y;
  
  if (x > 100 && y > 100) {
    return 'Leading (Dẫn dắt)';
  } else if (x > 100 && y <= 100) {
    return 'Weakening (Suy yếu)';
  } else if (x <= 100 && y <= 100) {
    return 'Lagging (Tụt hậu)';
  } else if (x <= 100 && y > 100) {
    return 'Improving (Cải thiện)';
  }
  
  return null;
};

// Get available industries for filtering
export const getAvailableIndustries = (timeframe = '1D') => {
  const data = loadRRGData(timeframe);
  return data.industryList;
};

// Get available groups
export const getAvailableGroups = (timeframe = '1D') => {
  const data = loadRRGData(timeframe);
  return data.groups.map(group => ({
    id: group.custom_id,
    name: group.name
  }));
};

// Get tickers filtered by industry using the new industry field
export const getTickersByIndustry = (industryIds = [], timeframe = '1D') => {
  const data = loadRRGData(timeframe);
  
  if (industryIds.length === 0) {
    return data.symbols;
  }

  return data.symbols.filter(symbol => {
    // Use the industries array from the new structure
    if (symbol.industries && symbol.industries.length > 0) {
      return symbol.industries.some(industry => industryIds.includes(industry.custom_id));
    }
    return false;
  });
};

// Get group data
export const getGroupData = (groupIds = [], timeframe = '1D') => {
  const data = loadRRGData(timeframe);
  
  if (groupIds.length === 0) {
    return data.groups;
  }

  return data.groups.filter(group => 
    groupIds.includes(group.custom_id)
  );
};

// Get industry data
export const getIndustryData = (industryIds = [], timeframe = '1D') => {
  const data = loadRRGData(timeframe);
  
  if (industryIds.length === 0) {
    return data.industries;
  }

  return data.industries.filter(industry => 
    industryIds.includes(industry.custom_id)
  );
};

// Get ticker industry info using the new structure
export const getTickerIndustry = (tickerId, timeframe = '1D') => {
  const data = loadRRGData(timeframe);
  
  // First try to get from the new structure directly
  const symbol = data.symbols.find(s => s.symbol === tickerId);
  if (symbol && symbol.industries && symbol.industries.length > 0) {
    const primaryIndustry = symbol.industries.find(ind => ind.is_primary);
    if (primaryIndustry) {
      // Always return a clean object with only id and name
      return {
        id: primaryIndustry.custom_id,
        name: primaryIndustry.name
      };
    }
  }
  
  // Fallback to the old mapping if needed
  const fallbackIndustry = data.tickerToIndustry.get(tickerId);
  if (fallbackIndustry) {
    return fallbackIndustry;
  }
  
  return null;
};

// Get all tickers for an industry using the new structure
export const getTickersForIndustry = (industryId, timeframe = '1D') => {
  const data = loadRRGData(timeframe);
  
  return data.symbols.filter(symbol => 
    symbol.industries && symbol.industries.some(ind => ind.custom_id === industryId)
  ).map(symbol => ({
    ...symbol,
    industry: symbol.industries.find(ind => ind.custom_id === industryId)
  }));
};

// Get analyze_rs data for the specified timeframe
export const getAnalyzeRsData = (timeframe = '1D') => {
  const analyzeRsData = timeframe === '1W' ? analyzeRsData1W : analyzeRsData1D;
  
  // Ensure the data has the standardized structure
  const standardizedData = {
    ...analyzeRsData,
    // Ensure insights structure exists
    insights: analyzeRsData.insights || {
      title: "Phân tích chuẩn hóa (Standardized Analysis)",
      industries: {},
      groups: {},
      tickers: {}
    },
    // Ensure main arrays exist
    industries: analyzeRsData.industries || [],
    groups: analyzeRsData.groups || [],
    symbols: analyzeRsData.symbols || []
  };

  // Ensure detailed_analysis structure exists and include momentum_distribution
  if (!standardizedData.insights.detailed_analysis) {
    standardizedData.insights.detailed_analysis = {
      title: "Phân tích chi tiết",
      sector_rotation: {},
      market_cap_flow: {},
      momentum_cycles: {},
      institutional_flow: {},
      speed_distribution: {},
      risk_distribution: {},
      systemic_risks: {},
      breadth_detail: {},
      volatility_regime: {}
    };
  }

  // Add momentum_distribution to detailed_analysis if it exists in market_overview
  if (standardizedData.insights.market_overview?.market_health?.key_metrics?.momentum_distribution) {
    standardizedData.insights.detailed_analysis.momentum_distribution = 
      standardizedData.insights.market_overview.market_health.key_metrics.momentum_distribution;
  }

  // Ensure each section has the standardized structure
  if (!standardizedData.insights.industries) {
    standardizedData.insights.industries = {
      title: "Phân tích industry",
      summary: {},
      top_performers: [],
      bottom_performers: [],
      improving_momentum: [],
      degrading_momentum: [],
      accumulation_candidates: [],
      distribution_candidates: [],
      breakout_candidates: [],
      consolidation_candidates: [],
      stealth_accumulation: [],
      stealth_distribution: [],
      institutional_activity: [],
      high_volatility: [],
      deteriorating_fundamentals: [],
      falling_knife: [],
      rrg_performers: {
        leading_quadrant: [],
        lagging_quadrant: [],
        improving_quadrant: [],
        weakening_quadrant: []
      }
    };
  }

  if (!standardizedData.insights.groups) {
    standardizedData.insights.groups = {
      title: "Phân tích groups",
      summary: {},
      top_performers: [],
      bottom_performers: [],
      improving_momentum: [],
      degrading_momentum: [],
      accumulation_candidates: [],
      distribution_candidates: [],
      breakout_candidates: [],
      consolidation_candidates: [],
      stealth_accumulation: [],
      stealth_distribution: [],
      institutional_activity: [],
      high_volatility: [],
      deteriorating_fundamentals: [],
      falling_knife: [],
      rrg_performers: {
        leading_quadrant: [],
        lagging_quadrant: [],
        improving_quadrant: [],
        weakening_quadrant: []
      }
    };
  }

  if (!standardizedData.insights.tickers) {
    standardizedData.insights.tickers = {
      title: "Phân tích tickers",
      summary: {},
      top_performers: [],
      bottom_performers: [],
      improving_momentum: [],
      degrading_momentum: [],
      accumulation_candidates: [],
      distribution_candidates: [],
      breakout_candidates: [],
      consolidation_candidates: [],
      stealth_accumulation: [],
      stealth_distribution: [],
      institutional_activity: [],
      high_volatility: [],
      deteriorating_fundamentals: [],
      falling_knife: [],
      rrg_performers: {
        leading_quadrant: [],
        lagging_quadrant: [],
        improving_quadrant: [],
        weakening_quadrant: []
      }
    };
  }

  return standardizedData;
};