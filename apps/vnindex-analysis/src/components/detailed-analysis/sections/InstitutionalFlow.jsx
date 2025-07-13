import React from 'react';

const InstitutionalFlow = ({ institutionalFlow }) => {
  if (!institutionalFlow) return null;

  return (
    <div className="bg-white p-3 rounded border">
      <h4 className="font-medium text-blue-800 mb-2">Dòng tiền tổ chức</h4>
      
      {/* Overall Sentiment */}
      {institutionalFlow.overall_sentiment && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <div className="text-sm font-medium text-gray-700 mb-1">Tổng quan</div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Mua:</span> {institutionalFlow.overall_sentiment.buying_percentage || 'N/A'} | 
            <span className="font-medium"> Bán:</span> {institutionalFlow.overall_sentiment.selling_percentage || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {institutionalFlow.overall_sentiment.interpretation || 'N/A'}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Institutional Buying */}
        {institutionalFlow.institutional_buying && (
          <div className="p-2 bg-green-50 rounded">
            <div className="font-medium text-sm text-green-700 mb-2">Tổ chức mua vào ({institutionalFlow.institutional_buying.count || 0})</div>
            <div className={`text-xs mb-2 ${institutionalFlow.institutional_buying.sentiment === 'Tích cực' ? 'text-green-600' : 'text-red-600'}`}>
              {institutionalFlow.institutional_buying.sentiment || 'N/A'}
            </div>
            {institutionalFlow.institutional_buying.top_targets && institutionalFlow.institutional_buying.top_targets.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-600">Mục tiêu hàng đầu:</div>
                {institutionalFlow.institutional_buying.top_targets.slice(0, 5).map((target, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    <span className="font-medium">{target.symbol}</span> - {target.direction} 
                    <span className="text-green-600"> ({(target.speed * 100).toFixed(2)}%)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Institutional Selling */}
        {institutionalFlow.institutional_selling && (
          <div className="p-2 bg-red-50 rounded">
            <div className="font-medium text-sm text-red-700 mb-2">Tổ chức bán ra ({institutionalFlow.institutional_selling.count || 0})</div>
            {institutionalFlow.institutional_selling.top_exits && institutionalFlow.institutional_selling.top_exits.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-600">Thoát hàng đầu:</div>
                {institutionalFlow.institutional_selling.top_exits.slice(0, 5).map((exit, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    <span className="font-medium">{exit.symbol}</span> - {exit.direction}
                    <span className="text-red-600"> ({(exit.speed * 100).toFixed(2)}%)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mixed Signals */}
        {institutionalFlow.mixed_signals && (
          <div className="p-2 bg-yellow-50 rounded">
            <div className="font-medium text-sm text-yellow-700 mb-2">Tín hiệu hỗn hợp ({institutionalFlow.mixed_signals.count || 0})</div>
            {institutionalFlow.mixed_signals.watch_list && institutionalFlow.mixed_signals.watch_list.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-600">Danh sách theo dõi:</div>
                {institutionalFlow.mixed_signals.watch_list.slice(0, 5).map((item, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    <span className="font-medium">{item.symbol}</span> - {item.direction}
                    <span className="text-yellow-600"> ({(item.speed * 100).toFixed(2)}%)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionalFlow; 