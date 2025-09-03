import React, { useState } from 'react';
import { HelpCircle, Maximize2 } from 'lucide-react';
import InvestingWidget, { INVESTING_PAIRS } from '../InvestingWidget';
import FREDWidget, { FRED_GRAPHS } from '../FREDWidget';
import TradingViewWidget from '../TradingViewWidget';
import LazyChart from '../LazyChart';

// Chart Section Component with individual chart scrolling and modal support
const ChartSection = ({ title, description, type, pairId, graphId, symbol, interval, height, interpretationGuide, onChartClick }) => {
  const [showGuide, setShowGuide] = useState(false);
  
  const handleChartClick = () => {
    onChartClick({
      title,
      description,
      type,
      pairId,
      graphId,
      symbol,
      interpretationGuide
    });
  };
  
  return (
    <div className="bg-slate-50 rounded-lg border p-4 h-full cursor-pointer hover:shadow-md transition-shadow" onClick={handleChartClick}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-700">{title}</h4>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowGuide(!showGuide);
            }}
            className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
          >
            <HelpCircle className="w-4 h-4 mr-1" />
            Cách đọc
          </button>
          <Maximize2 className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      {showGuide && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3 text-xs" onClick={(e) => e.stopPropagation()}>
          <h5 className="font-semibold text-yellow-800 mb-2">📚 Cách diễn giải biểu đồ:</h5>
          <div className="space-y-1 text-yellow-700">
            {interpretationGuide.map((guide, index) => (
              <div key={index} className="flex items-start">
                <span className="font-medium mr-2">•</span>
                <span><strong>{guide.condition}:</strong> {guide.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <LazyChart>
        {type === 'fred' ? (
          <FREDWidget graphId={graphId} width={650} height={400} />
        ) : type === 'tradingview' ? (
          <TradingViewWidget symbol={symbol} height="400px" width="650px" hideVolume={false} />
        ) : (
          <InvestingWidget pairId={pairId} height={400} width={500} showVolume={true} />
        )}
      </LazyChart>
    </div>
  );
};

// Market Charts Grid - 2 per row with individual chart scrolling
const MarketChartsGrid = ({ configs, onChartClick }) => (
  <div className="bg-white rounded-lg border p-4">
    <div className="flex items-center justify-between mb-4">
      <h5 className="font-semibold text-sm text-slate-700">Biểu đồ phân tích chi tiết</h5>
      <span className="text-xs text-gray-500">Click biểu đồ để phóng to</span>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {configs.map((config, index) => (
        <ChartSection
          key={index}
          title={config.title}
          description={config.description}
          type={config.type}
          pairId={config.pairId}
          graphId={config.graphId}
          symbol={config.symbol}
          interval="1D"
          height={350}
          interpretationGuide={config.interpretationGuide}
          onChartClick={onChartClick}
        />
      ))}
    </div>
  </div>
);

export default MarketChartsGrid;