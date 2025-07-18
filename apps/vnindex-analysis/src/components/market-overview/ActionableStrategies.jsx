import React from 'react';
import { Target, AlertTriangle, CheckCircle, TrendingUp, Shield, Users, Building } from 'lucide-react';

const ActionableStrategies = ({ marketOverview, investmentStrategies, detailedAnalysis }) => {
  // Check if investment strategies have data
  const hasMacroData = investmentStrategies?.macro_strategy && (
    (investmentStrategies.macro_strategy.overall_positioning && investmentStrategies.macro_strategy.overall_positioning.length > 0) ||
    (investmentStrategies.macro_strategy.market_phase_analysis && investmentStrategies.macro_strategy.market_phase_analysis.length > 0) ||
    (investmentStrategies.macro_strategy.risk_management && investmentStrategies.macro_strategy.risk_management.length > 0)
  );

  const hasSectorData = investmentStrategies?.sector_strategy && (
    (investmentStrategies.sector_strategy.sector_rotation_signals && investmentStrategies.sector_strategy.sector_rotation_signals.length > 0) ||
    (investmentStrategies.sector_strategy.sector_allocation && investmentStrategies.sector_strategy.sector_allocation.length > 0) ||
    (investmentStrategies.sector_strategy.sector_risk_warnings && investmentStrategies.sector_strategy.sector_risk_warnings.length > 0)
  );

  const hasGroupData = investmentStrategies?.group_strategy && (
    (investmentStrategies.group_strategy.group_rotation_signals && investmentStrategies.group_strategy.group_rotation_signals.length > 0) ||
    (investmentStrategies.group_strategy.group_allocation && investmentStrategies.group_strategy.group_allocation.length > 0) ||
    (investmentStrategies.group_strategy.group_risk_warnings && investmentStrategies.group_strategy.group_risk_warnings.length > 0)
  );

  const hasStockData = investmentStrategies?.stock_strategy && (
    (investmentStrategies.stock_strategy.momentum_strategy && investmentStrategies.stock_strategy.momentum_strategy.length > 0) ||
    (investmentStrategies.stock_strategy.accumulation_strategy && investmentStrategies.stock_strategy.accumulation_strategy.length > 0) ||
    (investmentStrategies.stock_strategy.risk_avoidance && investmentStrategies.stock_strategy.risk_avoidance.length > 0) ||
    (investmentStrategies.stock_strategy.position_sizing && investmentStrategies.stock_strategy.position_sizing.length > 0)
  );

  // Extract risk assessment data from detailed analysis
  const riskAssessment = detailedAnalysis?.risk_distribution?.risk_assessment;
  const systemicRisks = detailedAnalysis?.systemic_risks;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2">
      <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
        <Target className="w-3 h-3 mr-1 text-green-600" />
        Chiến lược hành động
      </h3>
      
      <div className="space-y-2">
        {/* Consolidated Strategic Recommendation */}
        {(marketOverview.strategic_recommendation || hasMacroData) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
            <div className="font-medium text-green-800 mb-1 text-xs flex items-center">
              <Shield className="w-2.5 h-2.5 mr-1" />
              Chiến lược tổng thể
            </div>
            <div className="space-y-1 text-xs">
              {marketOverview.strategic_recommendation?.stance && (
                <div className="text-green-700">
                  <strong>Vị thế:</strong> {marketOverview.strategic_recommendation.stance}
                </div>
              )}
              {marketOverview.strategic_recommendation?.confidence && (
                <div className="text-green-600">
                  <strong>Độ tin cậy:</strong> {marketOverview.strategic_recommendation.confidence}%
                </div>
              )}
              {marketOverview.market_regime?.momentum_score && (
                <div className="text-green-600 p-1 bg-green-100 rounded">
                  <strong>Điều kiện:</strong> Khi động lượng &gt; {(marketOverview.market_regime.momentum_score * 100).toFixed(0)}%, 
                  {marketOverview.market_regime.momentum_score > 0.6 ? ' tăng cường mua vào' : ' thận trọng'}
                </div>
              )}
              {hasMacroData && (
                <div className="mt-1">
                  {investmentStrategies.macro_strategy.overall_positioning?.slice(0, 2).map((position, index) => (
                    <div key={index} className="text-green-700">• {position}</div>
                  ))}
                  {investmentStrategies.macro_strategy.risk_management?.slice(0, 1).map((risk, index) => (
                    <div key={index} className="text-green-700">• {risk}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Risk Assessment & Mitigation */}
        {(riskAssessment || systemicRisks) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2">
            <div className="font-medium text-red-800 mb-1 text-xs flex items-center">
              <AlertTriangle className="w-2.5 h-2.5 mr-1" />
              Đánh giá rủi ro & Chiến lược giảm thiểu
            </div>
            <div className="space-y-1 text-xs">
              {/* Risk Environment */}
              {riskAssessment?.environment && (
                <div className="text-red-700 font-medium">
                  {riskAssessment.environment}
                </div>
              )}
              {riskAssessment?.description && (
                <div className="text-red-600">
                  {riskAssessment.description}
                </div>
              )}
              
              {/* Risk Statistics */}
              {riskAssessment && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {riskAssessment.high_risk_percentage && (
                    <span className="bg-red-100 text-red-800 px-1 py-0.5 rounded text-xs">
                      Rủi ro cao: {riskAssessment.high_risk_percentage}
                    </span>
                  )}
                  {riskAssessment.high_volatility_percentage && (
                    <span className="bg-orange-100 text-orange-800 px-1 py-0.5 rounded text-xs">
                      Biến động cao: {riskAssessment.high_volatility_percentage}
                    </span>
                  )}
                  {riskAssessment.low_risk_percentage && (
                    <span className="bg-green-100 text-green-800 px-1 py-0.5 rounded text-xs">
                      Rủi ro thấp: {riskAssessment.low_risk_percentage}
                    </span>
                  )}
                </div>
              )}

              {/* Systemic Risk Summary */}
              {systemicRisks?.overall_systemic_risk && (
                <div className="mt-1 p-1 bg-red-100 rounded">
                  <div className="text-red-700 font-medium">
                    {systemicRisks.overall_systemic_risk.level} - {systemicRisks.overall_systemic_risk.description}
                  </div>
                </div>
              )}

              {/* Key Risk Factors */}
              {systemicRisks?.systemic_risks && systemicRisks.systemic_risks.length > 0 && (
                <div className="mt-1">
                  <div className="text-red-700 font-medium">Yếu tố rủi ro chính:</div>
                  {systemicRisks.systemic_risks.slice(0, 2).map((risk, index) => (
                    <div key={index} className="text-red-600">• {risk.type}: {risk.description}</div>
                  ))}
                </div>
              )}

              {/* Mitigation Strategies */}
              {systemicRisks?.mitigation_strategies && systemicRisks.mitigation_strategies.length > 0 && (
                <div className="mt-1">
                  <div className="text-blue-700 font-medium">Chiến lược giảm thiểu:</div>
                  {systemicRisks.mitigation_strategies.slice(0, 1).map((strategy, index) => (
                    <div key={index} className="text-blue-600">• {strategy.strategy}: {strategy.description}</div>
                  ))}
                </div>
              )}

              {/* Risk Recommendation */}
              {riskAssessment?.recommendation && (
                <div className="text-blue-700 font-medium mt-1 pt-1 border-t border-red-200">
                  {riskAssessment.recommendation}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Consolidated Market Cap Strategy */}
        {(marketOverview.market_health?.market_cap_rotation || hasGroupData) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
            <div className="font-medium text-blue-800 mb-1 text-xs flex items-center">
              <Users className="w-2.5 h-2.5 mr-1" />
              Chiến lược vốn hóa
            </div>
            <div className="space-y-1 text-xs">
              {/* Market Cap Rotation Theme */}
              {marketOverview.market_health?.market_cap_rotation?.rotation_theme && (
                <div className="text-blue-700">
                  <strong>Chủ đề:</strong> {marketOverview.market_health.market_cap_rotation.rotation_theme}
                </div>
              )}
              
              {/* Strategic Rationale */}
              {marketOverview.strategic_recommendation?.rationale && (
                <div className="text-blue-600">
                  <strong>Lý do:</strong> {marketOverview.strategic_recommendation.rationale}
                </div>
              )}
              
              {/* Specific Cap Group Recommendations */}
              {marketOverview.market_health?.market_cap_rotation && (
                <div className="text-blue-600 p-1 bg-blue-100 rounded">
                  <strong>Khuyến nghị:</strong> 
                  {marketOverview.market_health.market_cap_rotation.large_cap?.performance === 'Vượt trội' ? ' Ưu tiên vốn hóa lớn' : ''}
                  {marketOverview.market_health.market_cap_rotation.mid_cap?.performance === 'Vượt trội' ? ' Ưu tiên vốn hóa vừa' : ''}
                  {marketOverview.market_health.market_cap_rotation.small_cap?.performance === 'Vượt trội' ? ' Ưu tiên vốn hóa nhỏ' : ''}
                </div>
              )}
              
              {/* Group Strategy Signals */}
              {hasGroupData && (
                <div className="mt-1">
                  {investmentStrategies.group_strategy.group_rotation_signals?.slice(0, 2).map((signal, index) => (
                    <div key={index} className="text-blue-700">• {signal}</div>
                  ))}
                  {investmentStrategies.group_strategy.group_allocation?.slice(0, 1).map((allocation, index) => (
                    <div key={index} className="text-blue-700">• {allocation}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sector Strategy */}
        {hasSectorData && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2">
            <div className="font-medium text-indigo-800 mb-1 text-xs flex items-center">
              <Building className="w-2.5 h-2.5 mr-1" />
              Chiến lược ngành
            </div>
            <div className="space-y-1 text-xs">
              {investmentStrategies.sector_strategy.sector_rotation_signals?.slice(0, 2).map((signal, index) => (
                <div key={index} className="text-indigo-700">• {signal}</div>
              ))}
              {investmentStrategies.sector_strategy.sector_allocation?.slice(0, 1).map((allocation, index) => (
                <div key={index} className="text-indigo-700">• {allocation}</div>
              ))}
            </div>
          </div>
        )}

        {/* Stock Strategy */}
        {hasStockData && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-2">
            <div className="font-medium text-teal-800 mb-1 text-xs flex items-center">
              <TrendingUp className="w-2.5 h-2.5 mr-1" />
              Chiến lược cổ phiếu
            </div>
            <div className="space-y-1 text-xs">
              {investmentStrategies.stock_strategy.momentum_strategy?.slice(0, 2).map((strategy, index) => (
                <div key={index} className="text-teal-700">• {strategy}</div>
              ))}
              {investmentStrategies.stock_strategy.accumulation_strategy?.slice(0, 1).map((strategy, index) => (
                <div key={index} className="text-teal-700">• {strategy}</div>
              ))}
            </div>
          </div>
        )}

        {/* Market Regime Evidence */}
        {marketOverview.market_regime?.supporting_evidence && marketOverview.market_regime.supporting_evidence.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
            <div className="font-medium text-gray-800 mb-1 flex items-center text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Bằng chứng hỗ trợ
            </div>
            <div className="text-xs text-gray-700">
              <ul className="list-disc list-inside space-y-1">
                {marketOverview.market_regime.supporting_evidence.slice(0, 2).map((evidence, index) => (
                  <li key={index}>{evidence}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionableStrategies; 