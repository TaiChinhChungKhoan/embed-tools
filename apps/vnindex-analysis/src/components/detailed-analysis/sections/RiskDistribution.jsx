import React from 'react';

// A compact, single-row component to display a high-risk/low-risk item
const RiskListItem = ({ item }) => (
  <div className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-100">
    <div className="flex items-center gap-1.5 truncate">
      {item.type === 'industry' && <span title="Industry">🏢</span>}
      <span className="font-medium text-slate-800 truncate" title={item.name}>
        {item.name}
      </span>
    </div>
    <div className="font-semibold shrink-0 ml-2">
      Vol: {(item.volatility * 100).toFixed(2)}%
    </div>
  </div>
);

// A standardized card for any risk or volatility category
const RiskDistributionCard = ({ title, data, color }) => {
  if (!data) return null;

  return (
    <div className={`p-3 rounded-lg border ${color.bg} ${color.border}`}>
      <h4 className={`font-bold text-sm ${color.text}`}>{title} <span className="font-normal">({data.count} - {data.percentage})</span></h4>
      
      {data.items && data.items.length > 0 && (
        <div className="mt-2 space-y-1">
          {data.items.slice(0, 4).map((item, idx) => (
            <RiskListItem key={idx} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

const RiskDistribution = ({ riskDistribution }) => {
  if (!riskDistribution) return null;

  const { risk_level_distribution: riskLevels, volatility_distribution: volatility } = riskDistribution;

  // --- CONFIGURATION ---
  // This makes the rendering logic clean and easy to update
  const riskConfig = [
    { key: 'high_risk', title: 'Rủi ro cao', theme: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' } },
    { key: 'medium_risk', title: 'Rủi ro trung bình', theme: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' } },
    { key: 'low_risk', title: 'Rủi ro thấp', theme: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' } },
  ];

  const volatilityConfig = [
    { key: 'very_high_volatility', title: 'Biến động rất cao', theme: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' } },
    { key: 'high_volatility', title: 'Biến động cao', theme: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' } },
    { key: 'medium_volatility', title: 'Biến động trung bình', theme: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' } },
    { key: 'low_volatility', title: 'Biến động thấp', theme: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' } },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border space-y-6">
      {/* Two-Column Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Level Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-800">Phân bổ mức rủi ro</h3>
          {riskConfig
            .filter(({ key }) => {
              const d = riskLevels?.[key];
              return d && d.count > 0 && Array.isArray(d.items) && d.items.length > 0;
            })
            .map(({ key, title, theme }) => (
              <RiskDistributionCard key={key} title={title} data={riskLevels?.[key]} color={theme} />
            ))}
        </div>

        {/* Volatility Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-800">Phân bổ biến động</h3>
          {volatilityConfig
            .filter(({ key }) => {
              const d = volatility?.[key];
              return d && d.count > 0 && Array.isArray(d.items) && d.items.length > 0;
            })
            .map(({ key, title, theme }) => (
              <RiskDistributionCard key={key} title={title} data={volatility?.[key]} color={theme} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default RiskDistribution; 