import React from 'react';
import { Info, TrendingUp, TrendingDown, Zap, Shield, Target, AlertTriangle, BarChart3 } from 'lucide-react';

// --- Child Components ---

const VolatilityAnalysis = ({ regime, description, statistics, distribution }) => {
  if (!regime) return null;
  
  return (
    <div className="bg-slate-50 p-3 rounded border">
      {/* Compact header with regime */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <h3 className="text-sm font-bold text-slate-800">Phân tích biến động sức mạnh tương đối</h3>          
        </div>
        <div className="text-right">
          <div className="font-bold text-sm text-blue-700">{regime}</div>
          <div className="text-xs text-slate-600">{description}</div>
        </div>
      </div>

      {/* Combined statistics and distribution in one row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Statistics */}
        <div className="bg-white p-2 rounded border">
          <div className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Thống kê
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="text-center">
              <div className="text-slate-500">TB</div>
              <div className="font-bold text-slate-800">{statistics?.average_volatility || 'N/A'}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-500">Trung vị</div>
              <div className="font-bold text-slate-800">{statistics?.median_volatility || 'N/A'}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-500">Cao</div>
              <div className="font-bold text-slate-800">{statistics?.high_volatility_percentage || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-white p-2 rounded border">
          <div className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            Phân bổ
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="text-center p-1 bg-green-100 rounded">
              <div className="font-semibold text-green-800">Ổn định</div>
              <div className="font-bold text-green-800">{distribution?.low_volatility?.count || 0}</div>
              <div className="text-green-800">({distribution?.low_volatility?.percentage || 'N/A'})</div>
            </div>
            <div className="text-center p-1 bg-yellow-100 rounded">
              <div className="font-semibold text-yellow-800">TB</div>
              <div className="font-bold text-yellow-800">{distribution?.medium_volatility?.count || 0}</div>
              <div className="text-yellow-800">({distribution?.medium_volatility?.percentage || 'N/A'})</div>
            </div>
            <div className="text-center p-1 bg-red-100 rounded">
              <div className="font-semibold text-red-800">Không ổn</div>
              <div className="font-bold text-red-800">{distribution?.high_volatility?.count || 0}</div>
              <div className="text-red-800">({distribution?.high_volatility?.percentage || 'N/A'})</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TradingImplications = ({ trading_implications, volatility_distribution }) => {
  if (!trading_implications) return null;
  
  return (
    <div className="bg-slate-50 p-3 rounded border">
      <div className="flex items-center gap-1 mb-2">
        <Target className="w-4 h-4 text-green-600" />
        <h3 className="text-sm font-bold text-slate-800">Hàm ý giao dịch</h3>
      </div>
      
      {/* Trading advice in compact format */}
      <div className="bg-white p-2 rounded border">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-blue-600" />
            <span className="font-semibold">Vị thế:</span>
            <span>{trading_implications.position_sizing}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-red-600" />
            <span className="font-semibold">Stop loss:</span>
            <span>{trading_implications.stop_losses}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="font-semibold">Chiến lược:</span>
            <span>{trading_implications.strategy}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-600" />
            <span className="font-semibold">Quản lý rủi ro:</span>
            <span>{trading_implications.risk_management}</span>
          </div>
        </div>
        
        {/* Compact beginner tip */}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-xs text-blue-700">
            💡 <strong>Cho người mới:</strong> Ưu tiên RS ổn định ({volatility_distribution?.low_volatility?.percentage || '58.2%'}), 
            tránh RS thay đổi mạnh, luôn đặt stop loss
          </div>
        </div>
      </div>
    </div>
  );
};

function SummaryCard({ title, value, description, color, textColor, Icon }) {
  return (
    <div className={`p-2 rounded flex gap-2 items-center ${color}`}>
      {Icon && <Icon className={`w-5 h-5 ${textColor}`} />}
      <div className="flex-1">
        <div className={`font-bold text-xs ${textColor}`}>{title}</div>
        {value && <div className="text-sm font-bold text-slate-800">{value}</div>}
        {description && <div className="text-xs text-slate-600">{description}</div>}
      </div>
    </div>
  );
}

const VolatilityRegimeDashboard = ({ volatilityRegime, industryTrendConsistency, breadthDetail, systemicRisks }) => {
  if (!volatilityRegime) return null;
  
  const theme = {
    industry: { color: 'bg-blue-100', textColor: 'text-blue-800', Icon: TrendingUp },
    breadth: { color: 'bg-green-100', textColor: 'text-green-800', Icon: BarChart3 },
    risk: { color: 'bg-red-100', textColor: 'text-red-800', Icon: AlertTriangle },
  };

  return (
    <div className="p-3 bg-white rounded border">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
        {/* --- COLUMN 1: CONTEXT --- */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1">
            <Info className="w-4 h-4 text-blue-600" />
            Bối cảnh thị trường
          </h3>
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
        <div className="space-y-2 mt-3 lg:mt-0">
          <VolatilityAnalysis
            regime={volatilityRegime.regime}
            description={volatilityRegime.regime_description}
            statistics={volatilityRegime.statistics}
            distribution={volatilityRegime.volatility_distribution}
          />
          
          <TradingImplications 
            trading_implications={volatilityRegime.trading_implications}
            volatility_distribution={volatilityRegime.volatility_distribution}
          />
        </div>
      </div>
    </div>
  );
};

export default VolatilityRegimeDashboard; 