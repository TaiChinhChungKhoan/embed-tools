import React, { useState, useMemo, useContext } from 'react';
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

  const { symbols: allTickers = [] } = analyticsData || {};

  // Ensure a default industry is always selected when special filter is 'all'
  React.useEffect(() => {
    if (
      specialTickerFilter === 'all' &&
      selectedTickerIndustries.length === 0 &&
      availableIndustries.length > 0
    ) {
      setSelectedTickerIndustries([availableIndustries[0].custom_id]);
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

  const sortedTickers = useMemo(() => {
    return [...filteredTickers].sort((a, b) => {
      const aValue = a[selectedMetric] || -Infinity;
      const bValue = b[selectedMetric] || -Infinity;
      return bValue - aValue;
    });
  }, [filteredTickers, selectedMetric]);

  const getMetricLabel = (metric) => {
    switch (metric) {
      case 'rs_close': return 'RS Close';
      case 'rs_ratio': return 'RS Ratio';
      case 'rs_momentum': return 'RS Momentum';
      case 'crs': return 'CRS';
      default: return metric;
    }
  };

  const getMetricDescription = (metric) => {
    switch (metric) {
      case 'rs_close': return 'Relative Strength Close - So sánh giá đóng cửa hiện tại';
      case 'rs_ratio': return 'RS Ratio - Tỷ lệ sức mạnh tương đối (RRG X-axis)';
      case 'rs_momentum': return 'RS Momentum - Động lượng sức mạnh tương đối (RRG Y-axis)';
      case 'crs': return 'Cumulative Relative Strength - Sức mạnh tương đối tích lũy';
      default: return '';
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Heatmap Cổ phiếu
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Hiển thị sức mạnh tương đối của các cổ phiếu theo {getMetricLabel(selectedMetric).toLowerCase()}
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center mt-4 lg:mt-0">
          {/* Metric Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chỉ số:</label>
            <select
              value={selectedMetric}
              onChange={e => setSelectedMetric(e.target.value)}
              className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white cursor-pointer"
            >
              <option value="rs_ratio">RS Ratio</option>
              <option value="rs_momentum">RS Momentum</option>
              <option value="rs_close">RS Close</option>
              <option value="crs">CRS</option>
            </select>
          </div>

          {/* Filter Controls */}
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

          {/* Industry Filter (only show when "By Industry" is selected) */}
          {specialTickerFilter === 'all' && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ngành:</label>
              <MultiSelect
                options={availableIndustries.map(ind => ({ value: ind.custom_id, label: ind.name || ind.custom_id || 'Unknown' }))}
                onValueChange={setSelectedTickerIndustries}
                value={selectedTickerIndustries}
                placeholder="Chọn ngành"
                maxCount={3}
                variant="default"
              />
            </div>
          )}

          {/* Info Button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Thông tin chi tiết"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Status */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-300">
            Hiển thị: <span className="font-medium text-blue-600">{filteredTickers.length}</span> cổ phiếu
          </span>
          {specialTickerFilter !== 'all' ? (
            <span className="text-blue-600 font-medium">
              {(() => {
                switch (specialTickerFilter) {
                  case 'top20rs': return 'Top 20 RS Score';
                  case 'bottom20rs': return 'Bottom 20 RS Score';
                  case 'top20momentum': return 'Top 20 RS Momentum';
                  case 'bottom20momentum': return 'Bottom 20 RS Momentum';
                  default: return '';
                }
              })()}
            </span>
          ) : (
                          <span className="text-gray-600 dark:text-gray-300">
                Ngành: {selectedTickerIndustries.map(id => 
                  availableIndustries.find(ind => ind.custom_id === id)?.name
                ).join(', ')}
              </span>
          )}
        </div>
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            {getMetricLabel(selectedMetric)}
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {getMetricDescription(selectedMetric)}
          </p>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-green-800 dark:text-green-200">Mạnh</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-gray-800 dark:text-gray-200">Trung bình</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-red-800 dark:text-red-200">Yếu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-red-800 dark:text-red-200">Rất yếu</span>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Grid */}
      <div className="flex-grow overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 h-full overflow-y-auto max-h-96">
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
      {sortedTickers.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {sortedTickers.filter(t => getColorForMetric(t, selectedMetric).includes('green')).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Mạnh</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {sortedTickers.filter(t => getColorForMetric(t, selectedMetric).includes('gray')).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Trung bình</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {sortedTickers.filter(t => getColorForMetric(t, selectedMetric).includes('red')).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Yếu</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sortedTickers.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng cộng</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TickerHeatmap; 