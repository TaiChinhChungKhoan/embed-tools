import React from 'react';

const MarketOverview = ({ marketOverview, getSentimentColor }) => {
  if (!marketOverview || !marketOverview.title) return null;
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">{marketOverview.title || 'Tổng quan thị trường (Macro)'}</h3>
      <p className="text-blue-800 mb-4">{marketOverview.summary || 'Phân tích tổng quan thị trường'}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded border">
          <div className="font-medium text-gray-700 mb-2">Ngành vượt trội</div>
          <div className="text-lg font-semibold text-green-600">{marketOverview.key_metrics?.outperforming_industries || 'N/A'}</div>
          <div className={`text-sm ${getSentimentColor(marketOverview.key_metrics?.industry_sentiment)}`}>
            {marketOverview.key_metrics?.industry_sentiment || 'N/A'}
          </div>
        </div>
        <div className="bg-white p-3 rounded border">
          <div className="font-medium text-gray-700 mb-2">Cổ phiếu vượt trội</div>
          <div className="text-lg font-semibold text-green-600">{marketOverview.key_metrics?.outperforming_symbols || 'N/A'}</div>
          <div className={`text-sm ${getSentimentColor(marketOverview.key_metrics?.symbol_sentiment)}`}>
            {marketOverview.key_metrics?.symbol_sentiment || 'N/A'}
          </div>
        </div>
        {marketOverview.market_phase && (
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700 mb-2">Giai đoạn thị trường</div>
            <div className="text-lg font-semibold text-blue-600">{marketOverview.market_phase?.current_phase || 'N/A'}</div>
            <div className="text-sm text-gray-600">
              {marketOverview.market_phase?.trend_strength || 'N/A'} - {marketOverview.market_phase?.volatility_level || 'N/A'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketOverview; 