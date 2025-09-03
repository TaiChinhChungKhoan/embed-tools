import React from 'react';
import { X, Maximize2 } from 'lucide-react';
import InvestingWidget from './InvestingWidget';
import FREDWidget from './FREDWidget';
import TradingViewWidget from './TradingViewWidget';
import PMIChart from './PMIChart';

const ChartModal = ({ isOpen, onClose, chart }) => {
  if (!isOpen || !chart) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl max-h-[90vh] w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{chart.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{chart.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chart Content */}
        <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="flex justify-center mb-4">
            {chart.type === 'fred' ? (
              <FREDWidget 
                graphId={chart.graphId}
                width={800}
                height={600}
                title={chart.title}
                description={chart.description}
              />
            ) : chart.type === 'pmi' ? (
              <div style={{ width: '100%', height: '600px' }}>
                <PMIChart 
                  type={chart.pmiType}
                  width="100%"
                  height={600}
                  title={chart.title}
                />
              </div>
            ) : chart.type === 'tradingview' ? (
              <div style={{ width: '800px', height: '600px' }}>
                <TradingViewWidget 
                  symbol={chart.symbol}
                  width="800px"
                  height="600px"
                  hideVolume={false}
                  allowSymbolChange={false}
                />
              </div>
            ) : chart.type === 'sector-rotation' ? (
              <div style={{ width: '800px', height: '600px' }}>
                <div>Sector Rotation Chart - {chart.title}</div>
                <TradingViewWidget 
                  symbol={chart.symbols?.main || "AMEX:XLK"}
                  width="800px"
                  height="550px"
                  hideVolume={false}
                  allowSymbolChange={true}
                />
              </div>
            ) : (
              <div style={{ width: '800px', height: '600px' }}>
                <InvestingWidget 
                  pairId={chart.pairId}
                  width={800}
                  height={600}
                  showVolume={true}
                />
              </div>
            )}
          </div>

          {/* Interpretation Guide */}
          {chart.interpretationGuide && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-3">📚 Cách diễn giải biểu đồ:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {chart.interpretationGuide.map((guide, index) => (
                  <div key={index} className="flex items-start text-sm">
                    <span className="font-medium mr-2 text-yellow-700">•</span>
                    <div>
                      <strong className="text-yellow-800">{guide.condition}:</strong>
                      <span className="text-yellow-700 ml-1">{guide.meaning}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartModal;