import React from 'react';
import { getRiskColor } from '../utils/colorUtils';

// A card to display a single systemic risk factor
const RiskFactorCard = ({ risk }) => {
  const severityColors = {
    HIGH: 'bg-red-100 text-red-800',
    MEDIUM: 'bg-orange-100 text-orange-800',
    LOW: 'bg-green-100 text-green-800',
  };

  return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex justify-between items-start gap-2">
        <h5 className="font-bold text-sm text-slate-800">{risk.type}</h5>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${severityColors[risk.severity] || 'bg-slate-100'}`}>
          {risk.severity}
        </span>
      </div>
      <p className="text-sm text-slate-600 mt-1">{risk.description}</p>
      {risk.implication && (
        <div className="flex items-start gap-2 mt-2 pt-2 border-t border-slate-200">
          <p className="text-xs text-blue-700 font-medium">{risk.implication}</p>
        </div>
      )}
    </div>
  );
};

// A card to display a single mitigation strategy
const MitigationStrategyCard = ({ strategy }) => (
  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
    <div className="flex justify-between items-start gap-2">
      <h5 className="font-bold text-sm text-blue-800">{strategy.strategy}</h5>
      <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
        {strategy.timeframe}
      </span>
    </div>
    <p className="text-sm text-blue-700/80 mt-1">{strategy.description}</p>
  </div>
);

const SystemicRisks = ({ systemicRisks }) => {
  if (!systemicRisks) return null;

  const { 
    overall_systemic_risk: overall, 
    systemic_risks: risks, 
    mitigation_strategies: strategies, 
    risk_count 
  } = systemicRisks;

  return (
    <div className="bg-white p-4 rounded-lg border space-y-6">
      {/* 1. Summary Banner (No Change) */}
      {overall && (
        <div className="p-4 bg-red-100 border border-red-200 rounded-lg text-red-900">
          <div className="flex items-center gap-3">
            {/* Icon placeholder */}
            <div>
              <h3 className="font-bold text-xl">{overall.level}</h3>
              <p className="text-sm font-semibold">
                Tổng quan rủi ro hệ thống ({risk_count || 0} yếu tố)
              </p>
            </div>
          </div>
          <p className="text-sm mt-2">{overall.description}</p>
        </div>
      )}

      {/* --- NEW LAYOUT: Grid for Risks, Section for Strategies --- */}

      {/* 2. Risk Factors in a Compact Grid */}
      <div className="space-y-3">
        <h4 className="font-bold text-base text-slate-800">Các yếu tố rủi ro</h4>
        {risks?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {risks.map((risk, index) => <RiskFactorCard key={index} risk={risk} />)}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Không có yếu tố rủi ro cụ thể nào được xác định.</p>
        )}
      </div>
      
      {/* 3. Mitigation Strategies Below */}
      <div className="space-y-3 pt-4 border-t">
        <h4 className="font-bold text-base text-slate-800">Chiến lược giảm thiểu</h4>
        {strategies?.length > 0 ? (
          <div className="space-y-3">
            {strategies.map((strategy, index) => <MitigationStrategyCard key={index} strategy={strategy} />)}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Không có chiến lược giảm thiểu nào được đề xuất.</p>
        )}
      </div>
    </div>
  );
};

export default SystemicRisks; 