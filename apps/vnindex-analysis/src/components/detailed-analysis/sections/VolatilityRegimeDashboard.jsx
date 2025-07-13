import React from 'react';
// import { TrendingUp, BarChart, ShieldAlert, Wallet, StopCircle, Zap, Wrench } from 'lucide-react';

// --- Child Components ---

const DistributionCard = ({ data, title, color }) => {
  if (!data) return null;
  const { count = 0, percentage = 'N/A', top_symbols } = data;
  const topSymbol = top_symbols?.[0];
  return (
    <div className={`p-2 rounded text-center border ${color.bg} ${color.border}`}>
      <div className={`font-semibold text-xs ${color.text}`}>{title}</div>
      <div className={`font-bold text-lg ${color.text}`}>{count}</div>
      <div className={`text-xs font-medium ${color.text} opacity-80`}>({percentage})</div>
      {topSymbol && <div className="text-[10px] text-slate-500 mt-1">e.g. {topSymbol.symbol}</div>}
    </div>
  );
};

const VolatilityAnalysis = ({ regime, description, statistics, distribution }) => {
  if (!regime) return null;
  const colors = {
    low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    high: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  };
  return (
    <div className="bg-slate-50 p-4 rounded-lg border">
      <h3 className="text-base font-bold text-slate-800 mb-2">Phân tích biến động</h3>
      {/* Regime and Description */}
      <div className="mb-4">
        <div className="font-bold text-xl text-blue-700">{regime}</div>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      {/* Key Statistics */}
      {statistics && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-1">Thống kê chính</h4>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="bg-white p-1 rounded border"><span className="text-slate-500">Trung bình:</span> <b className="text-slate-800">{statistics.average_volatility}</b></div>
            <div className="bg-white p-1 rounded border"><span className="text-slate-500">Trung vị:</span> <b className="text-slate-800">{statistics.median_volatility}</b></div>
            <div className="bg-white p-1 rounded border"><span className="text-slate-500">Tỷ lệ cao:</span> <b className="text-slate-800">{statistics.high_volatility_percentage}</b></div>
          </div>
        </div>
      )}
      {/* Volatility Distribution (Now horizontal) */}
      {distribution && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Phân bổ</h4>
          <div className="grid grid-cols-3 gap-3">
            <DistributionCard data={distribution.low_volatility} title="Thấp" color={colors.low} />
            <DistributionCard data={distribution.medium_volatility} title="Trung bình" color={colors.medium} />
            <DistributionCard data={distribution.high_volatility} title="Cao" color={colors.high} />
          </div>
        </div>
      )}
    </div>
  );
};

const TradingImplicationItem = ({ label, value, colorClasses, Icon }) => {
  if (!value) return null;
  return (
    <div className={`flex-1 p-3 rounded-lg text-center ${colorClasses.bg}`}>
      {/* {Icon && <Icon className={`w-5 h-5 mx-auto mb-1 ${colorClasses.text}`} />} */}
      <div className={`text-xs font-bold ${colorClasses.text}`}>{label}</div>
      <div className="text-sm font-medium text-slate-800">{value}</div>
    </div>
  );
};

function SummaryCard({ title, value, description, color, textColor, Icon }) {
  return (
    <div className={`p-4 rounded-lg flex gap-4 items-center ${color}`}>
      {/* {Icon && <Icon className={`w-8 h-8 ${textColor}`} />} */}
      <div className="flex-1">
        <div className={`font-bold ${textColor}`}>{title}</div>
        {value && <div className="text-xl font-bold text-slate-800">{value}</div>}
        {description && <div className="text-xs text-slate-600">{description}</div>}
      </div>
    </div>
  );
}

const VolatilityRegimeDashboard = ({ volatilityRegime, industryTrendConsistency, breadthDetail, systemicRisks }) => {
  if (!volatilityRegime) return null;
  const { trading_implications } = volatilityRegime;
  const theme = {
    industry: { color: 'bg-blue-100', textColor: 'text-blue-800', Icon: null },
    breadth: { color: 'bg-green-100', textColor: 'text-green-800', Icon: null },
    risk: { color: 'bg-red-100', textColor: 'text-red-800', Icon: null },
    implications: {
      position: { bg: 'bg-blue-100', text: 'text-blue-800', Icon: null },
      stop: { bg: 'bg-red-100', text: 'text-red-800', Icon: null },
      strategy: { bg: 'bg-green-100', text: 'text-green-800', Icon: null },
      management: { bg: 'bg-yellow-100', text: 'text-yellow-800', Icon: null },
    }
  };
  return (
    <div className="p-4 md:p-6 bg-slate-100 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
        {/* --- COLUMN 1: CONTEXT --- */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800">Bối cảnh thị trường</h3>
          {industryTrendConsistency && (
            <SummaryCard
              title="Xu hướng ngành"
              value={industryTrendConsistency.consistency_summary?.overall_trend}
              description={industryTrendConsistency.key_insights?.[0]}
              {...theme.industry}
            />
          )}
          {breadthDetail && (
            <SummaryCard
              title="Breadth thị trường"
              value={breadthDetail.breadth_summary}
              description={`Breadth: ${breadthDetail.industry_breadth_thrust?.value || ''}, Momentum: ${breadthDetail.momentum_breadth?.value || ''}`}
              {...theme.breadth}
            />
          )}
          {systemicRisks && (
            <SummaryCard
              title="Rủi ro hệ thống"
              value={systemicRisks.overall_systemic_risk?.level}
              description={systemicRisks.overall_systemic_risk?.description}
              {...theme.risk}
            />
          )}
        </div>
        {/* --- COLUMN 2: ANALYSIS & ACTION --- */}
        <div className="space-y-4 mt-6 lg:mt-0">
          <VolatilityAnalysis
            regime={volatilityRegime.regime}
            description={volatilityRegime.regime_description}
            statistics={volatilityRegime.statistics}
            distribution={volatilityRegime.volatility_distribution}
          />
          {trading_implications && (
            <div className="bg-slate-50 p-4 rounded-lg border">
              <h3 className="text-base font-bold text-slate-800 mb-3">Hàm ý giao dịch</h3>
              <div className="flex flex-row gap-3">
                <TradingImplicationItem label="Vị thế" value={trading_implications.position_sizing} colorClasses={theme.implications.position} Icon={theme.implications.position.Icon}/>
                <TradingImplicationItem label="Stop loss" value={trading_implications.stop_losses} colorClasses={theme.implications.stop} Icon={theme.implications.stop.Icon}/>
                <TradingImplicationItem label="Chiến lược" value={trading_implications.strategy} colorClasses={theme.implications.strategy} Icon={theme.implications.strategy.Icon}/>
                <TradingImplicationItem label="Quản lý rủi ro" value={trading_implications.risk_management} colorClasses={theme.implications.management} Icon={theme.implications.management.Icon}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolatilityRegimeDashboard; 