import React from 'react';

// A more compact row with an icon for type
const DistributionListItem = ({ item }) => (
  <div className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-100">
    
    {/* Left Side: Icon and Name */}
    <div className="flex items-center gap-1.5 flex-1 truncate">
      {item.type === 'industry' && <span title="Industry" className="text-slate-400">🏢</span>}
      {item.type === 'symbol' && <span title="Symbol" className="text-slate-400">🏷️</span>}
      <span className="font-medium text-slate-800 truncate" title={item.name}>
        {item.name}
      </span>
    </div>

    {/* Right Side: Stats */}
    <div className="flex items-center gap-4 font-semibold shrink-0 ml-4">
      <span className="w-12 text-right">{(item.speed * 100).toFixed(2)}%</span>
      <span className="w-12 text-right">{(item.acceleration * 100).toFixed(2)}%</span>
    </div>
    
  </div>
);

// Card for each category, now with a conditional list header
const DistributionCard = ({ title, count, percentage, items, color }) => (
  <div className={`p-3 rounded-lg border ${color.bg} ${color.border}`}>
    <h4 className={`font-bold text-sm ${color.text}`}>{title} <span className="font-normal">({count} - {percentage})</span></h4>
    
    {items && items.length > 0 && (
      <div className="mt-2">
        {/* List Header */}
        <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1.5 mb-1">
          <span>TÊN</span>
          <div className="flex gap-4">
            <span className="w-12 text-right">TỐC ĐỘ</span>
            <span className="w-12 text-right">GIA TỐC</span>
          </div>
        </div>
        {/* List Body */}
        <div className="space-y-1">
          {items.slice(0, 4).map((item, idx) => (
            <DistributionListItem key={idx} item={item} />
          ))}
        </div>
      </div>
    )}
  </div>
);

const SpeedDistribution = ({ speedDistribution }) => {
  if (!speedDistribution) return null;

  // Destructure for easier access
  const { market_momentum_health: health, speed_distribution: speed, acceleration_distribution: accel } = speedDistribution;

  // --- CONFIGURATION ---
  // This separates logic from presentation, making the code cleaner.
  const speedConfig = [
    { key: 'very_high_speed', title: 'Tốc độ rất cao', theme: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' } },
    { key: 'high_speed', title: 'Tốc độ cao', theme: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' } },
    { key: 'medium_speed', title: 'Tốc độ trung bình', theme: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' } },
    { key: 'low_speed', title: 'Tốc độ thấp', theme: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' } },
  ];

  const accelConfig = [
    { key: 'strong_acceleration', title: 'Gia tốc mạnh', theme: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' } },
    { key: 'weak_acceleration', title: 'Gia tốc yếu', theme: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' } },
    { key: 'weak_deceleration', title: 'Giảm tốc yếu', theme: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' } },
    { key: 'strong_deceleration', title: 'Giảm tốc mạnh', theme: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' } },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border space-y-6">
      {/* 1. Redesigned Summary Block */}
      {health && (
        <div>
          <h3 className="font-bold text-base text-slate-800">Sức khỏe động lượng thị trường</h3>
          <div className="mt-2 p-3 border rounded-lg bg-slate-50">
            <p className="font-bold text-lg text-green-600">{health.status}</p>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">{health.description}</p>
            
            {/* Stat Pills for key numbers */}
            <div className="flex flex-wrap gap-3 mt-3 text-sm">
              <div className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded">Tốc độ cao: <b>{health.high_speed_percentage}</b></div>
              <div className="bg-sky-100 text-sky-800 font-medium px-2 py-1 rounded">Tăng tốc: <b>{health.accelerating_percentage}</b></div>
              <div className="bg-red-100 text-red-800 font-medium px-2 py-1 rounded">Giảm tốc: <b>{health.decelerating_percentage}</b></div>
            </div>
            
            <p className="text-sm text-blue-700 font-semibold mt-3 pt-3 border-t border-slate-200">{health.recommendation}</p>
          </div>
        </div>
      )}

      {/* 2. Cleaner Two-Column Rendering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Speed Distribution Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-800">Phân bổ tốc độ</h3>
          {speedConfig.map(({ key, title, theme }) => {
            const data = speed?.[key];
            if (!data || data.count <= 0 || !Array.isArray(data.items) || data.items.length === 0) return null;
            return <DistributionCard key={key} title={title} count={data.count} percentage={data.percentage} items={data.items} color={theme} />;
          })}
        </div>

        {/* Acceleration Distribution Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-800">Phân bổ gia tốc</h3>
          {accelConfig.map(({ key, title, theme }) => {
            const data = accel?.[key];
            if (!data || data.count <= 0 || !Array.isArray(data.items) || data.items.length === 0) return null;
            return <DistributionCard key={key} title={title} count={data.count} percentage={data.percentage} items={data.items} color={theme} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SpeedDistribution; 