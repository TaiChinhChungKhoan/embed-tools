import React from 'react';

// Helper 1: Card for each Volatility Distribution level (Low, Med, High)
function VolatilityDistributionCard({ title, data, colorClasses }) {
  if (!data) return null;
  const { count = 0, percentage = 'N/A', top_symbols } = data;
  const topSymbol = top_symbols?.[0];
  return (
    <div className={`flex-1 rounded-lg p-3 text-center ${colorClasses.bg} ${colorClasses.text}`}>
      <div className="font-bold">{title}</div>
      <div className="text-lg font-black">
        {count} <span className="text-sm font-semibold">({percentage})</span>
      </div>
      {topSymbol && (
        <div className="text-xs text-gray-600 mt-1">
          {topSymbol.symbol}: {(topSymbol.volatility * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
}

// Helper 2: Item for each Trading Implication
function TradingImplicationItem({ label, value, colorClasses }) {
  if (!value) return null;
  return (
    <div className={`flex-1 rounded-lg p-2 text-center ${colorClasses.bg}`}>
      <div className={`block text-xs font-bold mb-1 ${colorClasses.text}`}>{label}</div>
      <div className="text-sm font-medium text-gray-800">{value}</div>
    </div>
  );
}

// Helper: Compact summary card
function SummaryCard({ title, value, description, color = 'bg-gray-50', textColor = 'text-gray-800', children }) {
  return (
    <div className={`rounded-lg p-3 flex-1 flex flex-col justify-center ${color}`}>
      <div className={`font-bold ${textColor} text-sm mb-1`}>{title}</div>
      {value && <div className="text-base font-bold mb-1">{value}</div>}
      {description && <div className="text-xs text-gray-700">{description}</div>}
      {children}
    </div>
  );
}

const VolatilityRegime = ({ volatilityRegime, industryTrendConsistency, breadthDetail, systemicRisks }) => {
  if (!volatilityRegime) return null;
  const {
    regime,
    regime_description,
    statistics,
    volatility_distribution,
    trading_implications,
  } = volatilityRegime;
  const colors = {
    low: { bg: 'bg-green-50', text: 'text-green-800' },
    medium: { bg: 'bg-yellow-50', text: 'text-yellow-800' },
    high: { bg: 'bg-red-50', text: 'text-red-800' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-800' },
  };
  return (
    <div className="bg-white p-4 rounded-xl border space-y-4 text-sm">
      {/* --- Section 1: Top Summary Cards (2-row grid) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {industryTrendConsistency && (
          <SummaryCard
            title="Xu hướng ngành"
            value={industryTrendConsistency.consistency_summary?.overall_trend}
            description={industryTrendConsistency.key_insights?.[0]}
            color={colors.blue.bg}
            textColor={colors.blue.text}
          />
        )}
        {breadthDetail && (
          <SummaryCard
            title="Breadth thị trường"
            value={breadthDetail.breadth_summary}
            description={`Breadth: ${breadthDetail.industry_breadth_thrust?.value || ''} (${breadthDetail.industry_breadth_thrust?.interpretation || ''}), Momentum: ${breadthDetail.momentum_breadth?.value || ''} (${breadthDetail.momentum_breadth?.interpretation || ''})`}
            color={colors.low.bg}
            textColor={colors.low.text}
          />
        )}
        {systemicRisks && (
          <div className="md:col-span-2">
            <SummaryCard
              title="Rủi ro hệ thống"
              value={systemicRisks.overall_systemic_risk?.level}
              description={systemicRisks.overall_systemic_risk?.description}
              color={colors.high.bg}
              textColor={colors.high.text}
            />
          </div>
        )}
      </div>

      {/* --- Section 2: Main Content Grid (Regime & Distribution) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Regime Info & Stats */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold text-base text-blue-800 mb-2">Trạng thái biến động</h4>
          <div className="mb-4">
            <div className="font-bold text-lg text-blue-700">{regime || 'N/A'}</div>
            <p className="text-gray-600">{regime_description || 'N/A'}</p>
          </div>
          {statistics && (
            <div>
              <div className="font-bold text-base text-blue-800 mb-2">Thống kê chính</div>
              <div className="flex justify-between items-center text-gray-700">
                <span>Trung bình: <span className="font-bold">{statistics.average_volatility || 'N/A'}</span></span>
                <span>Trung vị: <span className="font-bold">{statistics.median_volatility || 'N/A'}</span></span>
                <span>Tỷ lệ cao: <span className="font-bold">{statistics.high_volatility_percentage || 'N/A'}</span></span>
              </div>
            </div>
          )}
        </div>
        {/* Right Column: Volatility Distribution */}
        {volatility_distribution && (
          <div className="space-y-2">
             <h4 className="font-bold text-base text-gray-700 mb-2">Phân bổ biến động</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <VolatilityDistributionCard title="Thấp" data={volatility_distribution.low_volatility} colorClasses={colors.low} />
              <VolatilityDistributionCard title="Trung bình" data={volatility_distribution.medium_volatility} colorClasses={colors.medium} />
              <VolatilityDistributionCard title="Cao" data={volatility_distribution.high_volatility} colorClasses={colors.high} />
            </div>
          </div>
        )}
      </div>

      {/* --- Section 3: Trading Implications --- */}
      {trading_implications && (
        <div>
          <h4 className="font-bold text-base text-gray-700 mb-2">Hàm ý giao dịch</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <TradingImplicationItem label="Vị thế" value={trading_implications.position_sizing} colorClasses={colors.blue} />
            <TradingImplicationItem label="Stop loss" value={trading_implications.stop_losses} colorClasses={colors.high} />
            <TradingImplicationItem label="Chiến lược" value={trading_implications.strategy} colorClasses={colors.low} />
            <TradingImplicationItem label="Quản lý rủi ro" value={trading_implications.risk_management} colorClasses={colors.medium} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VolatilityRegime; 