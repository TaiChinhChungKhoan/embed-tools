import { useMemo } from 'react';
import { useDataLoader } from './dataLoader';

// Utility to map analytics entity (industry, group, symbol) to unified structure
function mapAnalyticsEntity(entity) {
  const latest = Array.isArray(entity.tail) && entity.tail.length > 0 ? entity.tail[entity.tail.length - 1] : {};
  return {
    ...entity,
    industry: entity.name, // for industries, or group/symbol name
    rs: entity.metrics?.current_rs ?? null,
    crs: entity.metrics?.current_crs ?? null,
    momentum: entity.speed_analysis?.weighted_speed ?? null,
    direction: entity.direction_analysis?.direction ?? null,
    trend_strength: entity.direction_analysis?.trend_strength ?? null,
    momentum_confirmed: entity.direction_analysis?.momentum_confirmed ?? null,
    signal_to_noise_ratio: entity.direction_analysis?.signal_to_noise_ratio ?? null,
    // RRG values (if present)
    rs_ratio: latest.x ?? null,
    rs_momentum: latest.y ?? null,
  };
}

// Helper function to determine RRG position based on x,y coordinates
function getRRGPosition(point) {
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
}

// Hook to get analytics data using centralized data loader
// Now uses the standardized RRG_ANALYSIS data type instead of rrg_analysis
export function useAnalyticsData(timeframe = '1D') {
  const { data, loading, error } = useDataLoader('RRG_ANALYSIS', { timeframe });
  
  const processedData = useMemo(() => {
    if (!data) return null;
    
    return {
      ...data,
      industries: data.industries?.map(mapAnalyticsEntity) || [],
      groups: data.groups?.map(mapAnalyticsEntity) || [],
      symbols: data.symbols?.map(mapAnalyticsEntity) || [],
      tickers: data.symbols?.map(mapAnalyticsEntity) || [],
      _timestamp: Date.now()
    };
  }, [data]);

  return { 
    data: processedData,  // Wrap in data property
    loading, 
    error 
  };
}

// Legacy function for backward compatibility
export async function getAnalyticsData(timeframe = '1D') {
  // This function is now deprecated - use useAnalyticsData hook instead
  console.warn('getAnalyticsData is deprecated. Use useAnalyticsData hook instead.');
  return {
    industries: [],
    groups: [],
    symbols: [],
    tickers: [],
    insights: {},
    analysis_date: null,
    timeframe,
  };
}

// Export cache management functions for debugging/testing
export const cacheUtils = {
  clearCache: () => {
    // This is now handled by the centralized data loader
    console.warn('cacheUtils.clearCache is deprecated. Cache is now managed by centralized data loader.');
  },
  getCacheSize: () => {
    // This is now handled by the centralized data loader
    console.warn('cacheUtils.getCacheSize is deprecated. Cache is now managed by centralized data loader.');
    return 0;
  },
  getCacheKeys: () => {
    // This is now handled by the centralized data loader
    console.warn('cacheUtils.getCacheKeys is deprecated. Cache is now managed by centralized data loader.');
    return [];
  },
};
