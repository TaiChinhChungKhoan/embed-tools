import { createChart } from 'lightweight-charts';

// Base chart configuration
export const baseChartConfig = {
  layout: {
    background: { color: '#1f2937' },
    textColor: '#9ca3af',
  },
  grid: {
    vertLines: { color: '#374151' },
    horzLines: { color: '#374151' },
  },
  crosshair: {
    mode: 1,
  },
  rightPriceScale: {
    borderColor: '#374151',
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
  },
  timeScale: {
    borderColor: '#374151',
    timeVisible: true,
    secondsVisible: false,
  },
};

// Chart types and their configurations
export const chartTypes = {
  // Line chart for indicators
  line: {
    seriesType: 'line',
    options: {
      ...baseChartConfig,
      height: 400,
    },
  },
  
  // Candlestick chart for price data
  candlestick: {
    seriesType: 'candlestick',
    options: {
      ...baseChartConfig,
      height: 400,
      rightPriceScale: {
        ...baseChartConfig.rightPriceScale,
        scaleMargins: {
          top: 0.1,
          bottom: 0.3,
        },
      },
    },
  },
  
  // Area chart for volume or other cumulative data
  area: {
    seriesType: 'area',
    options: {
      ...baseChartConfig,
      height: 400,
      rightPriceScale: {
        ...baseChartConfig.rightPriceScale,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    },
  },
  
  // Bar chart for volume
  histogram: {
    seriesType: 'histogram',
    options: {
      ...baseChartConfig,
      height: 200,
      rightPriceScale: {
        ...baseChartConfig.rightPriceScale,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    },
  },
  
  // Multi-pane chart (price + volume)
  multiPane: {
    seriesType: 'multi',
    options: {
      ...baseChartConfig,
      height: 600,
      rightPriceScale: {
        ...baseChartConfig.rightPriceScale,
        scaleMargins: {
          top: 0.1,
          bottom: 0.3,
        },
      },
    },
  },
};

// Color schemes for different indicators
export const colorSchemes = {
  bullish: {
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#a7f3d0',
  },
  bearish: {
    primary: '#ef4444',
    secondary: '#f87171',
    accent: '#fecaca',
  },
  neutral: {
    primary: '#6b7280',
    secondary: '#9ca3af',
    accent: '#d1d5db',
  },
  volume: {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#93c5fd',
  },
};

// Helper function to create a chart
export const createFinancialChart = (container, type = 'line', customOptions = {}) => {
  const config = chartTypes[type];
  if (!config) {
    throw new Error(`Unknown chart type: ${type}`);
  }

  const options = {
    ...config.options,
    ...customOptions,
    width: container.clientWidth,
  };

  return createChart(container, options);
};

// Helper function to format time data for Lightweight Charts
export const formatTimeData = (dates, values) => {
  return dates.map((date, index) => ({
    time: Math.floor(new Date(date).getTime() / 1000),
    value: values[index] || 0,
  }));
};

// Helper function to format candlestick data
export const formatCandlestickData = (dates, open, high, low, close) => {
  return dates.map((date, index) => ({
    time: Math.floor(new Date(date).getTime() / 1000),
    open: open[index] || 0,
    high: high[index] || 0,
    low: low[index] || 0,
    close: close[index] || 0,
  }));
};

// Helper function to format volume data
export const formatVolumeData = (dates, volumes) => {
  return dates.map((date, index) => ({
    time: Math.floor(new Date(date).getTime() / 1000),
    value: volumes[index] || 0,
    color: '#3b82f6',
  }));
};

// Helper function to add technical indicators
export const addTechnicalIndicator = (chart, data, indicatorType, options = {}) => {
  switch (indicatorType) {
    case 'sma':
      return addSMA(chart, data, options);
    case 'ema':
      return addEMA(chart, data, options);
    case 'bollinger':
      return addBollingerBands(chart, data, options);
    case 'rsi':
      return addRSI(chart, data, options);
    default:
      console.warn(`Unknown indicator type: ${indicatorType}`);
      return null;
  }
};

// Simple Moving Average
const addSMA = (chart, data, { period = 20, color = '#ff6b6b' } = {}) => {
  const smaData = calculateSMA(data, period);
  const smaSeries = chart.addLineSeries({
    color,
    lineWidth: 1,
    title: `SMA(${period})`,
  });
  smaSeries.setData(smaData);
  return smaSeries;
};

// Exponential Moving Average
const addEMA = (chart, data, { period = 20, color = '#4ecdc4' } = {}) => {
  const emaData = calculateEMA(data, period);
  const emaSeries = chart.addLineSeries({
    color,
    lineWidth: 1,
    title: `EMA(${period})`,
  });
  emaSeries.setData(emaData);
  return emaSeries;
};

// Calculate SMA
const calculateSMA = (data, period) => {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.value, 0);
    result.push({
      time: data[i].time,
      value: sum / period,
    });
  }
  return result;
};

// Calculate EMA
const calculateEMA = (data, period) => {
  const result = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  let ema = data.slice(0, period).reduce((acc, item) => acc + item.value, 0) / period;
  result.push({
    time: data[period - 1].time,
    value: ema,
  });
  
  // Calculate subsequent EMAs
  for (let i = period; i < data.length; i++) {
    ema = (data[i].value * multiplier) + (ema * (1 - multiplier));
    result.push({
      time: data[i].time,
      value: ema,
    });
  }
  
  return result;
};

// Placeholder functions for other indicators
const addBollingerBands = (chart, data, options = {}) => {
  // Implementation for Bollinger Bands
  console.log('Bollinger Bands not implemented yet');
  return null;
};

const addRSI = (chart, data, options = {}) => {
  // Implementation for RSI
  console.log('RSI not implemented yet');
  return null;
};

// Export all chart types for easy access
export { chartTypes as ChartTypes, colorSchemes as ColorSchemes }; 