import { useDataLoader } from './dataLoader';

// Hook to get VCP data using centralized data loader
export const useVCPData = (timeframe = '1D') => {
  const { data, loading, error } = useDataLoader('vcp_analysis', timeframe);
  
  return {
    data,
    loading,
    error,
    // Legacy compatibility functions
    loadVCPData: () => data,
    getVCPSummary: () => {
      if (!data) return null;
      
      const signals = data.signals || [];
      const totalSignals = signals.length;
      const recentSignals = signals.filter(signal => signal.days_since_vcp <= 7).length;
      const highConfidenceSignals = signals.filter(signal => signal.last_vcp_confidence >= 0.5).length;
      
      return {
        totalSignals,
        recentSignals,
        highConfidenceSignals,
        averageConfidence: signals.length > 0 
          ? signals.reduce((sum, signal) => sum + signal.last_vcp_confidence, 0) / signals.length 
          : 0,
        averageDaysSince: signals.length > 0 
          ? signals.reduce((sum, signal) => sum + signal.days_since_vcp, 0) / signals.length 
          : 0
      };
    }
  };
};

// Legacy functions for backward compatibility
export const loadVCPData = (timeframe = '1D') => {
  // This function is now deprecated - use useVCPData hook instead
  console.warn('loadVCPData is deprecated. Use useVCPData hook instead.');
  return null;
};

export const getVCPSummary = (timeframe = '1D') => {
  // This function is now deprecated - use useVCPData hook instead
  console.warn('getVCPSummary is deprecated. Use useVCPData hook instead.');
  return null;
};

// Get VCP signals filtered by confidence level
export const getVCPSignalsByConfidence = (confidenceLevel = 'all', timeframe = '1D') => {
  // This function is now deprecated - use useVCPData hook instead
  console.warn('getVCPSignalsByConfidence is deprecated. Use useVCPData hook instead.');
  return [];
};

// Get VCP signals filtered by recency
export const getVCPSignalsByRecency = (recency = 'all', timeframe = '1D') => {
  // This function is now deprecated - use useVCPData hook instead
  console.warn('getVCPSignalsByRecency is deprecated. Use useVCPData hook instead.');
  return [];
};

// Get VCP signals for a specific symbol
export const getVCPSignalsForSymbol = (symbol, timeframe = '1D') => {
  // This function is now deprecated - use useVCPData hook instead
  console.warn('getVCPSignalsForSymbol is deprecated. Use useVCPData hook instead.');
  return null;
}; 