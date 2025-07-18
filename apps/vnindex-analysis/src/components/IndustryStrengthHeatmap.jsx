import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

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

const IndustryStrengthHeatmap = ({ industries }) => {
  const [selectedMetric, setSelectedMetric] = useState('rs_ratio');
  const [showDetails, setShowDetails] = useState(false);

  // Remove the sample data definition here. Only use the industries prop.

  const getColorForMetric = (industry, metric) => {
    switch (metric) {
      case 'rs_close':
        return getColorForRSClose(industry.rs_close);
      case 'rs_ratio':
        return getColorForRSRatio(industry.rs_ratio);
      case 'rs_momentum':
        return getColorForRSRatio(industry.rs_momentum);
      case 'crs':
        return getColorForCRS(industry.crs);
      default:
        return 'bg-gray-400';
    }
  };

  const getValueDisplay = (industry, metric) => {
    switch (metric) {
      case 'rs_close':
        return industry.rs_close?.toFixed(2) || 'N/A';
      case 'rs_ratio':
        return industry.rs_ratio?.toFixed(1) || 'N/A';
      case 'rs_momentum':
        return industry.rs_momentum?.toFixed(1) || 'N/A';
      case 'crs':
        return `${(industry.crs * 100)?.toFixed(1)}%` || 'N/A';
      default:
        return 'N/A';
    }
  };

  const sortedIndustries = useMemo(() => {
    return [...industries].sort((a, b) => {
      const aValue = a[selectedMetric] || -Infinity;
      const bValue = b[selectedMetric] || -Infinity;
      return bValue - aValue;
    });
  }, [industries, selectedMetric]);

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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Industry Strength Heatmap
        </h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(metricInfo).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(key)}
            className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedMetric === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {info.name}
          </button>
        ))}
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
          {sortedIndustries.map((industry, index) => (
            <div 
              key={index} 
              className={`${getColorForMetric(industry, selectedMetric)} p-3 rounded-lg text-white shadow-lg transition-all hover:brightness-110 hover:shadow-2xl hover:ring-2 hover:ring-white/30 cursor-pointer`}
              title={`${industry.industry}: ${getValueDisplay(industry, selectedMetric)}`}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold leading-tight truncate pr-1">
                    {industry.industry}
                  </span>
                  {selectedMetric === 'rs_momentum' && (
                    <div className="flex-shrink-0">
                      {getMomentumIcon(industry.rs_momentum)}
                    </div>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold">
                    {getValueDisplay(industry, selectedMetric)}
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
            {sortedIndustries.filter(ind => {
              const value = ind[selectedMetric];
              if (selectedMetric === 'rs_close') return value >= 1.05;
              if (selectedMetric === 'rs_ratio' || selectedMetric === 'rs_momentum') return value >= 102;
              if (selectedMetric === 'crs') return value >= 0.03;
              return false;
            }).length}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-400">Neutral</div>
          <div className="text-lg font-bold text-gray-600">
            {sortedIndustries.filter(ind => {
              const value = ind[selectedMetric];
              if (selectedMetric === 'rs_close') return value >= 0.95 && value < 1.05;
              if (selectedMetric === 'rs_ratio' || selectedMetric === 'rs_momentum') return value >= 98 && value < 102;
              if (selectedMetric === 'crs') return value >= -0.03 && value < 0.03;
              return false;
            }).length}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-400">Weak</div>
          <div className="text-lg font-bold text-red-600">
            {sortedIndustries.filter(ind => {
              const value = ind[selectedMetric];
              if (selectedMetric === 'rs_close') return value < 0.95;
              if (selectedMetric === 'rs_ratio' || selectedMetric === 'rs_momentum') return value < 98;
              if (selectedMetric === 'crs') return value < -0.03;
              return false;
            }).length}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-400">Total</div>
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {sortedIndustries.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryStrengthHeatmap;