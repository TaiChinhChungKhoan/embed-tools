import filterVcp1D from '../data/filter_vcp_1D.json';
import filterVcp1W from '../data/filter_vcp_1W.json';

// Cache for processed data
let processedVcpData1D = null;
let processedVcpData1W = null;

// Load VCP data for a specific timeframe
export const loadVCPData = (timeframe = '1D') => {
  // Determine which data to use based on timeframe
  const vcpData = timeframe === '1W' ? filterVcp1W : filterVcp1D;
  
  // Use appropriate cache
  const cache = timeframe === '1W' ? processedVcpData1W : processedVcpData1D;
  
  if (cache) {
    return cache;
  }

  try {
    // Process VCP data
    const processedData = {
      timeframe: timeframe,
      totalSignals: vcpData.length,
      recentSignals: vcpData.filter(signal => signal.days_since_vcp <= 7).length,
      highConfidenceSignals: vcpData.filter(signal => signal.last_vcp_confidence >= 0.5).length,
      signals: vcpData.map(signal => ({
        ...signal,
        confidenceLevel: signal.last_vcp_confidence >= 0.7 ? 'high' : 
                        signal.last_vcp_confidence >= 0.5 ? 'medium' : 'low',
        recency: signal.days_since_vcp <= 3 ? 'recent' : 
                signal.days_since_vcp <= 7 ? 'moderate' : 'old'
      }))
    };

    // Store in appropriate cache
    if (timeframe === '1W') {
      processedVcpData1W = processedData;
    } else {
      processedVcpData1D = processedData;
    }

    console.log(`VCP Data loaded successfully (${timeframe}):`, {
      totalSignals: processedData.totalSignals,
      recentSignals: processedData.recentSignals,
      highConfidenceSignals: processedData.highConfidenceSignals,
      sampleSignal: processedData.signals[0] ? {
        symbol: processedData.signals[0].symbol,
        confidence: processedData.signals[0].last_vcp_confidence,
        daysSince: processedData.signals[0].days_since_vcp
      } : null
    });

    return processedData;
  } catch (error) {
    console.error(`Error loading VCP data (${timeframe}):`, error);
    throw error;
  }
};

// Get VCP signals filtered by confidence level
export const getVCPSignalsByConfidence = (confidenceLevel = 'all', timeframe = '1D') => {
  const data = loadVCPData(timeframe);
  
  if (confidenceLevel === 'all') {
    return data.signals;
  }
  
  return data.signals.filter(signal => signal.confidenceLevel === confidenceLevel);
};

// Get VCP signals filtered by recency
export const getVCPSignalsByRecency = (recency = 'all', timeframe = '1D') => {
  const data = loadVCPData(timeframe);
  
  if (recency === 'all') {
    return data.signals;
  }
  
  return data.signals.filter(signal => signal.recency === recency);
};

// Get VCP signals for a specific symbol
export const getVCPSignalsForSymbol = (symbol, timeframe = '1D') => {
  const data = loadVCPData(timeframe);
  return data.signals.find(signal => signal.symbol === symbol);
};

// Get VCP summary statistics
export const getVCPSummary = (timeframe = '1D') => {
  const data = loadVCPData(timeframe);
  
  return {
    totalSignals: data.totalSignals,
    recentSignals: data.recentSignals,
    highConfidenceSignals: data.highConfidenceSignals,
    averageConfidence: data.signals.reduce((sum, signal) => sum + signal.last_vcp_confidence, 0) / data.totalSignals,
    averageDaysSince: data.signals.reduce((sum, signal) => sum + signal.days_since_vcp, 0) / data.totalSignals
  };
}; 