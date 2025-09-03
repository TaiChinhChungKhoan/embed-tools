import React, { useState, useMemo, useContext, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { MultiSelect } from "@embed-tools/components/components/ui/multi-select";
import { useTickerInfoWithData } from '../utils/dataLoader';
import { DataReloadContext } from '../contexts/DataReloadContext';

// Enhanced color mapping for different RS metrics
const getColorForRSClose = (value) => {
  if (value >= 1.5) return 'bg-green-600';
  if (value >= 1.2) return 'bg-green-500';
  if (value >= 1.05) return 'bg-green-400';
  if (value >= 0.95) return 'bg-gray-400';
  if (value >= 0.8) return 'bg-red-400';
  if (value >= 0.7) return 'bg-red-500';
  return 'bg-red-600';
};

const getColorForRSRatio = (value) => {
  if (value >= 110) return 'bg-green-600';
  if (value >= 105) return 'bg-green-500';
  if (value >= 102) return 'bg-green-400';
  if (value >= 98) return 'bg-gray-400';
  if (value >= 95) return 'bg-red-400';
  if (value >= 90) return 'bg-red-500';
  return 'bg-red-600';
};

const getColorForCRS = (value) => {
  if (value >= 0.15) return 'bg-green-600';
  if (value >= 0.08) return 'bg-green-500';
  if (value >= 0.03) return 'bg-green-400';
  if (value >= -0.03) return 'bg-gray-400';
  if (value >= -0.08) return 'bg-red-400';
  if (value >= -0.15) return 'bg-red-500';
  return 'bg-red-600';
};

const getMomentumIcon = (momentum) => {
  if (momentum > 102) return <TrendingUp className="w-3 h-3" />;
  if (momentum < 98) return <TrendingDown className="w-3 h-3" />;
  return <Minus className="w-3 h-3" />;
};

const TickerHeatmap = ({ analyticsData, timeframe }) => {
  // Get pre-loaded data from context
  const { companies, industries, essentialDataLoading } = useContext(DataReloadContext);
  
  // Use the pre-loaded data for ticker info
  const { getTickerInfo, getIndustryTickers, loading: tickerInfoLoading } = useTickerInfoWithData(companies, industries);
  
  
  // Use the pre-loaded industries data directly
  const availableIndustries = industries && typeof industries === 'object' && !Array.isArray(industries) 
    ? Object.entries(industries).map(([custom_id, industry]) => ({ custom_id, ...industry }))
    : Array.isArray(industries) ? industries : [];
  

  
  const [selectedMetric, setSelectedMetric] = useState('rs_ratio');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTickerIndustries, setSelectedTickerIndustries] = useState([]);
  const [specialTickerFilter, setSpecialTickerFilter] = useState("all");
  
  // Reset component state when timeframe changes
  React.useEffect(() => {
    setSelectedTickerIndustries([]);
    setSpecialTickerFilter("all");
    // Reset initialization flag when timeframe changes
    hasInitialized.current = false;
  }, [timeframe]);

  const { symbols: allTickers = [] } = analyticsData || {};

  // Auto-select all industries on initial load only
  const hasInitialized = useRef(false);
  
  React.useEffect(() => {
    if (
      specialTickerFilter === 'all' &&
      !hasInitialized.current &&
      selectedTickerIndustries.length === 0 &&
      availableIndustries.length > 0
    ) {
      // Select all industries by default on initial load
      const allIndustryIds = availableIndustries.map(industry => industry.custom_id);
      setSelectedTickerIndustries(allIndustryIds);
      hasInitialized.current = true;
    }
  }, [specialTickerFilter, availableIndustries, selectedTickerIndustries.length]);

  // Process ticker data with RS metrics
  const processedTickers = useMemo(() => {
    if (!allTickers) return [];
    
    return allTickers.map(ticker => {
      const latest = Array.isArray(ticker.tail) && ticker.tail.length > 0 ? ticker.tail[ticker.tail.length - 1] : {};
      const tickerInfo = getTickerInfo(ticker.symbol);
      return {
        ...ticker,
        symbol: ticker.symbol,
        rs_close: ticker.metrics?.current_rs ?? null,  // Current RS from metrics
        rs_ratio: latest.x ?? null,        // RRG RS-Ratio (x-axis)
        rs_momentum: latest.y ?? null,     // RRG RS-Momentum (y-axis)
        crs: ticker.metrics?.current_crs ?? null,      // Current CRS from metrics
        industry_id: tickerInfo?.industry_id || null,
        industry: tickerInfo?.industry || 'Unknown',
      };
    });
  }, [allTickers, getTickerInfo]);

  // Filter tickers based on selected criteria
  const filteredTickers = useMemo(() => {
    if (specialTickerFilter && specialTickerFilter !== 'all') {
      if (specialTickerFilter === 'top20rs') {
        // Top 20 by RS Score (latest x value)
        return processedTickers
          .map(ticker => ({ ...ticker, latestRS: ticker.rs_ratio || 0 }))
          .sort((a, b) => b.latestRS - a.latestRS)
          .slice(0, 20);
      } else if (specialTickerFilter === 'bottom20rs') {
        return processedTickers
          .map(ticker => ({ ...ticker, latestRS: ticker.rs_ratio || 0 }))
          .sort((a, b) => a.latestRS - b.latestRS)
          .slice(0, 20);
      } else if (specialTickerFilter === 'top20momentum') {
        // Top 20 by RS Momentum (latest y value)
        return processedTickers
          .map(ticker => ({ ...ticker, latestMomentum: ticker.rs_momentum || 0 }))
          .sort((a, b) => b.latestMomentum - a.latestMomentum)
          .slice(0, 20);
      } else if (specialTickerFilter === 'bottom20momentum') {
        return processedTickers
          .map(ticker => ({ ...ticker, latestMomentum: ticker.rs_momentum || 0 }))
          .sort((a, b) => a.latestMomentum - b.latestMomentum)
          .slice(0, 20);
      }
      return [];
    } else {
      // Filter by industry
      const filtered = selectedTickerIndustries.length > 0
        ? processedTickers.filter(symbol => 
            // For now, fall back to the original embedded industry data until we have proper mapping
            symbol.industries && symbol.industries.some(ind => selectedTickerIndustries.includes(ind.custom_id))
          )
        : processedTickers;
      return filtered;
    }
  }, [processedTickers, selectedTickerIndustries, specialTickerFilter]);

  const getColorForMetric = (ticker, metric) => {
    switch (metric) {
      case 'rs_close':
        return getColorForRSClose(ticker.rs_close);
      case 'rs_ratio':
        return getColorForRSRatio(ticker.rs_ratio);
      case 'rs_momentum':
        return getColorForRSRatio(ticker.rs_momentum);
      case 'crs':
        return getColorForCRS(ticker.crs);
      default:
        return 'bg-gray-400';
    }
  };

  const getValueDisplay = (ticker, metric) => {
    switch (metric) {
      case 'rs_close':
        return ticker.rs_close?.toFixed(2) || 'N/A';
      case 'rs_ratio':
        return ticker.rs_ratio?.toFixed(1) || 'N/A';
      case 'rs_momentum':
        return ticker.rs_momentum?.toFixed(1) || 'N/A';
      case 'crs':
        return `${(ticker.crs * 100)?.toFixed(1)}%` || 'N/A';
      default:
        return 'N/A';
    }
  };

  // Sort tickers by selected metric (descending)
  const sortedTickers = useMemo(() => {
    return [...filteredTickers].sort((a, b) => {
      const aValue = a[selectedMetric] || -Infinity;
      const bValue = b[selectedMetric] || -Infinity;
      return bValue - aValue;
    });
  }, [filteredTickers, selectedMetric]);





  const metricInfo = {
    rs_close: {
      name: "RS Close",
      description: "Traditional relative strength vs VN-Index",
      neutral: "1.0",
      interpretation: "> 1.0 = Outperforming, < 1.0 = Underperforming"
    },
    rs_ratio: {
      name: "RS Ratio",
      description: "RRG-style relative strength ratio",
      neutral: "100.0",
      interpretation: "> 100 = Outperforming, < 100 = Underperforming"
    },
    rs_momentum: {
      name: "RS Momentum",
      description: "RRG momentum indicator",
      neutral: "100.0",
      interpretation: "> 100 = Positive momentum, < 100 = Negative momentum"
    },
    crs: {
      name: "CRS",
      description: "21-day cumulative relative strength",
      neutral: "0.0%",
      interpretation: "> 0% = Outperforming, < 0% = Underperforming"
    }
  };

  if (!analyticsData || !allTickers || allTickers.length === 0 || essentialDataLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Không có dữ liệu cổ phiếu để hiển thị</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Ticker Strength Heatmap
        </h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Metric Selector and Filters */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Metric Selector */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(metricInfo).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedMetric === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {info.name}
            </button>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Lọc theo:</label>
            <select
              value={specialTickerFilter}
              onChange={e => setSpecialTickerFilter(e.target.value)}
              className="border rounded px-3 py-1 text-sm min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white cursor-pointer"
            >
              <option value="all">Theo ngành</option>
              <option value="top20rs">Top 20 RS Score</option>
              <option value="bottom20rs">Bottom 20 RS Score</option>
              <option value="top20momentum">Top 20 RS Momentum</option>
              <option value="bottom20momentum">Bottom 20 RS Momentum</option>
            </select>
          </div>

          {/* Industry Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ngành:</label>
            <MultiSelect
              options={availableIndustries.map(ind => ({ value: ind.custom_id, label: ind.name || ind.custom_id || 'Unknown' }))}
              onValueChange={setSelectedTickerIndustries}
              value={selectedTickerIndustries}
              placeholder="Chọn ngành"
              maxCount={3}
              variant="default"
              disabled={specialTickerFilter !== 'all'}
            />
            {/* Debug info */}
            <span className="text-xs text-gray-500 min-w-[120px]">
              ({availableIndustries.length} ngành, {selectedTickerIndustries.length} đã chọn)
            </span>
          </div>
        </div>
      </div>



      {/* Metric Information */}
      {showDetails && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {metricInfo[selectedMetric].name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {metricInfo[selectedMetric].description}
          </p>
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Neutral: </span>
            <span className="text-gray-600 dark:text-gray-400">{metricInfo[selectedMetric].neutral}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Interpretation: </span>
            <span className="text-gray-600 dark:text-gray-400">{metricInfo[selectedMetric].interpretation}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Strong</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Weak</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="flex-grow overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 h-full overflow-y-auto">
          {sortedTickers.map((ticker, index) => (
            <div 
              key={ticker.symbol} 
              className={`${getColorForMetric(ticker, selectedMetric)} p-3 rounded-lg text-white shadow-lg transition-all hover:brightness-110 hover:shadow-2xl hover:ring-2 hover:ring-white/30 cursor-pointer`}
              title={`${ticker.symbol}: ${getValueDisplay(ticker, selectedMetric)}`}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold leading-tight truncate pr-1">
                    {ticker.symbol}
                  </span>
                  {selectedMetric === 'rs_momentum' && (
                    <div className="flex-shrink-0">
                      {getMomentumIcon(ticker.rs_momentum)}
                    </div>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold">
                    {getValueDisplay(ticker, selectedMetric)}
                  </span>
                  <span className="text-xs opacity-75">
                    #{index + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-400">Strong</div>
          <div className="text-lg font-bold text-green-600">
            {sortedTickers.filter(t => getColorForMetric(t, selectedMetric).includes('green')).length}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-400">Neutral</div>
          <div className="text-lg font-bold text-gray-600">
            {sortedTickers.filter(t => getColorForMetric(t, selectedMetric).includes('gray')).length}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-400">Weak</div>
          <div className="text-lg font-bold text-red-600">
            {sortedTickers.filter(t => getColorForMetric(t, selectedMetric).includes('red')).length}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-400">Total</div>
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {sortedTickers.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TickerHeatmap; 