import rrgData from '../data/rrg_data.json';
import analyzeRsData from '../data/analyze_rs.json';

// Cache for processed data
let processedData = null;
let industryMapping = null;

// Process RRG data and create industry mapping
export const loadRRGData = () => {
  if (processedData) {
    return processedData;
  }

  try {
    // Create industry mapping from analyze_rs.json for reference
    const tickerToIndustry = new Map();
    const industryList = new Map();

    // Process industries from analyze_rs.json
    analyzeRsData.industries.forEach(industry => {
      industryList.set(industry.custom_id, {
        id: industry.custom_id,
        name: industry.name
      });
    });

    // Process tickers and their industry mappings from analyze_rs.json (for backward compatibility)
    analyzeRsData.symbols.forEach(symbol => {
      const primaryIndustry = symbol.industries.find(ind => ind.is_primary);
      if (primaryIndustry) {
        tickerToIndustry.set(symbol.symbol, {
          id: primaryIndustry.custom_id,
          name: primaryIndustry.name
        });
      }
    });

    // Separate industries, groups, and tickers from RRG data using the new structure
    const industries = rrgData.series.filter(series => series.type === 'industry');
    const groups = rrgData.series.filter(series => series.type === 'group');
    const tickers = rrgData.series.filter(series => series.type === 'symbol');

    // Create a map of ticker to industry using the new industry field in RRG data
    const rrgTickerToIndustry = new Map();
    tickers.forEach(ticker => {
      if (ticker.industry) {
        const industryInfo = industryList.get(ticker.industry);
        if (industryInfo) {
          rrgTickerToIndustry.set(ticker.id, industryInfo);
        }
      }
    });

    processedData = {
      rrgDate: rrgData.rrg_date,
      tailLength: rrgData.tail_length,
      industries,
      groups,
      tickers,
      tickerToIndustry: rrgTickerToIndustry, // Use the new RRG-based mapping
      industryList: Array.from(industryList.values())
    };

    console.log('RRG Data loaded successfully:', {
      industries: industries.length,
      groups: groups.length,
      tickers: tickers.length,
      totalIndustries: industryList.size,
      tickersWithIndustry: rrgTickerToIndustry.size
    });

    return processedData;
  } catch (error) {
    console.error('Error loading RRG data:', error);
    throw error;
  }
};

// Get available industries for filtering
export const getAvailableIndustries = () => {
  const data = loadRRGData();
  return data.industryList;
};

// Get available groups
export const getAvailableGroups = () => {
  const data = loadRRGData();
  return data.groups.map(group => ({
    id: group.id,
    name: group.name
  }));
};

// Get tickers filtered by industry using the new industry field
export const getTickersByIndustry = (industryIds = []) => {
  const data = loadRRGData();
  
  if (industryIds.length === 0) {
    return data.tickers;
  }

  return data.tickers.filter(ticker => {
    // Use the industry field directly from the RRG data
    return ticker.industry && industryIds.includes(ticker.industry);
  });
};

// Get group data
export const getGroupData = (groupIds = []) => {
  const data = loadRRGData();
  
  if (groupIds.length === 0) {
    return data.groups;
  }

  return data.groups.filter(group => 
    groupIds.includes(group.id)
  );
};

// Get industry data
export const getIndustryData = (industryIds = []) => {
  const data = loadRRGData();
  
  if (industryIds.length === 0) {
    return data.industries;
  }

  return data.industries.filter(industry => 
    industryIds.includes(industry.id)
  );
};

// Get ticker industry info using the new structure
export const getTickerIndustry = (tickerId) => {
  const data = loadRRGData();
  
  // First try to get from the RRG data directly
  const ticker = data.tickers.find(t => t.id === tickerId);
  if (ticker && ticker.industry) {
    const industryInfo = data.industryList.find(ind => ind.id === ticker.industry);
    if (industryInfo) {
      return industryInfo;
    }
  }
  
  // Fallback to the old mapping if needed
  return data.tickerToIndustry.get(tickerId);
};

// Get all tickers for an industry using the new structure
export const getTickersForIndustry = (industryId) => {
  const data = loadRRGData();
  
  return data.tickers.filter(ticker => 
    ticker.industry === industryId
  ).map(ticker => ({
    ...ticker,
    industry: data.industryList.find(ind => ind.id === ticker.industry)
  }));
};