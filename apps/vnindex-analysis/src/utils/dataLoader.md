# Centralized Data Loader

This is a unified data hub that serves as a single source of truth for all data in the application.

## Features

- **Centralized Caching**: All data is cached in memory for better performance
- **Type-Safe Loading**: Predefined data types with proper processing
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Loading States**: Built-in loading states for better UX
- **Parallel Loading**: Multiple files loaded in parallel when needed

## Available Data Types

### RRG Analysis Data
```javascript
import { useRRGAnalysis } from '../utils/dataLoader';

const { data, loading, error, refetch } = useRRGAnalysis('1D');
// Returns: industries, groups, symbols, insights, analysis_date, timeframe
```

### Market Breadth Data
```javascript
import { useMarketBreadth } from '../utils/dataLoader';

const { data, loading, error } = useMarketBreadth('1D');
```

### VSA Analysis Data
```javascript
import { useVSAAnalysis } from '../utils/dataLoader';

const { data, loading, error } = useVSAAnalysis('1D');
```

### Industry Strength Data
```javascript
import { useIndustryStrength } from '../utils/dataLoader';

const { data, loading, error } = useIndustryStrength();
// Returns: { analysis, timeSeries, processed_at }
```

### Abnormal Signals Data
```javascript
import { useAbnormalSignals } from '../utils/dataLoader';

const { data, loading, error } = useAbnormalSignals('1D');
```

### VCP Analysis Data
```javascript
import { useVCPAnalysis } from '../utils/dataLoader';

const { data, loading, error } = useVCPAnalysis('1D');
```

### Macroeconomic Data
```javascript
import { useMacroData } from '../utils/dataLoader';

const { data, loading, error } = useMacroData();
// Returns: gdp_year, gdp_quarter, cpi_month, cpi_year, etc.
```

### Market Overview Data
```javascript
import { useMarketOverview } from '../utils/dataLoader';

const { data, loading, error } = useMarketOverview();
```

### Top Performers Data
```javascript
import { useTopPerformers } from '../utils/dataLoader';

const { data, loading, error } = useTopPerformers();
// Returns: top_gainers, top_losers, top_by_value, etc.
```

## Generic Data Loading

For custom data types or multiple data types:

```javascript
import { useDataLoader } from '../utils/dataLoader';

const { data, loading, error, refetch } = useDataLoader('RRG_ANALYSIS', '1D');
```

## Cache Management

```javascript
import { cacheUtils } from '../utils/dataLoader';

// Clear all cache
cacheUtils.clearCache();

// Get cache statistics
console.log(stats); // { size: 5, keys: [...], totalSize: 1234567 }

// Remove specific item from cache
cacheUtils.removeFromCache('rrg_data_1D.json');
```

## Benefits

1. **Performance**: Centralized caching reduces redundant requests
2. **Consistency**: Single source of truth for all data
3. **Maintainability**: Easy to add new data types
4. **Error Handling**: Consistent error handling across the app
5. **Loading States**: Built-in loading states for better UX
6. **Type Safety**: Predefined data types with proper processing

## Adding New Data Types

To add a new data type:

1. Add configuration to `DATA_TYPES`
2. Create a processor function
3. Export a specific hook if needed

```javascript
// In dataLoader.js
const DATA_TYPES = {
  NEW_DATA_TYPE: {
    files: (timeframe) => [`new_data_${timeframe}.json`],
    processor: processNewData
  }
};

function processNewData([data]) {
  return {
    ...data,
    processed_at: new Date().toISOString()
  };
}

// Export specific hook
export function useNewData(timeframe = '1D') {
  return useDataLoader('NEW_DATA_TYPE', timeframe, [timeframe]);
}
``` 