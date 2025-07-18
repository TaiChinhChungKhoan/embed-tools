import React from 'react';
import { Gauge, TrendingUp, TrendingDown, Zap } from 'lucide-react';

const MoneyFlowAnalysis = ({ marketOverview, analyticsData, topSectors, bottomSectors, industries }) => {
  // Extract money flow data from sector rotation and market cap flow
  const sectorRotation = analyticsData?.insights?.detailed_analysis?.sector_rotation;
  const marketCapFlow = analyticsData?.insights?.detailed_analysis?.market_cap_flow;
  
  // Get top inflow and outflow sectors
  const topInflowSectors = sectorRotation?.detailed_flow?.inflow_sectors?.slice(0, 2) || [];
  const topOutflowSectors = sectorRotation?.detailed_flow?.outflow_sectors?.slice(0, 2) || [];
  
  // Get emerging leaders
  const emergingLeaders = sectorRotation?.sector_leadership?.emerging_leaders?.sectors?.slice(0, 2) || [];
  
  // Get individual stock flows by market cap
  const topLargeCap = sectorRotation?.market_cap_flow?.top_large_cap?.slice(0, 2) || [];
  const topMidCap = sectorRotation?.market_cap_flow?.top_mid_cap?.slice(0, 2) || [];
  const topSmallCap = sectorRotation?.market_cap_flow?.top_small_cap?.slice(0, 2) || [];
  
  // Get high momentum sectors (current_rs > 0.1)
  const highMomentumSectors = industries?.filter(sector => sector.metrics?.current_rs > 0.1).slice(0, 3) || [];
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
        <Gauge className="w-3 h-3 mr-1 text-orange-600" />
        Biến động & Dòng tiền
      </h3>
      
      {/* Main metrics in expanded grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
        {/* Price Strength */}
        <div className="bg-purple-50 p-2 rounded text-xs">
          <div className="font-medium text-purple-700 mb-1">Sức mạnh giá</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Mạnh:</span>
              <span className="font-medium">{marketOverview.market_health?.key_metrics?.momentum_distribution?.momentum_categories?.strong || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>TB:</span>
              <span className="font-medium">{marketOverview.market_health?.key_metrics?.momentum_distribution?.momentum_categories?.moderate || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Yếu:</span>
              <span className="font-medium">{marketOverview.market_health?.key_metrics?.momentum_distribution?.momentum_categories?.weak || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        {/* Industry Money Flow */}
        <div className="bg-green-50 p-2 rounded text-xs">
          <div className="font-medium text-green-700 mb-1 flex items-center">
            <TrendingUp className="w-2.5 h-2.5 mr-1" />
            Dòng tiền ngành
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Vào:</span>
              <span className="font-medium text-green-600">{sectorRotation?.money_flow_summary?.inflow_count || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Ra:</span>
              <span className="font-medium text-red-600">{sectorRotation?.money_flow_summary?.outflow_count || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Tốc độ:</span>
              <span className="font-medium">{sectorRotation?.money_flow_summary?.flow_velocity ? `${(sectorRotation.money_flow_summary.flow_velocity * 100).toFixed(0)}%` : 'N/A'}</span>
            </div>
          </div>
        </div>
        
        {/* Group Money Flow */}
        <div className="bg-blue-50 p-2 rounded text-xs">
          <div className="font-medium text-blue-700 mb-1">Dòng tiền nhóm</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Vượt trội:</span>
              <span className="font-medium text-green-600">{marketCapFlow?.outperforming_count || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Kém:</span>
              <span className="font-medium text-red-600">{marketCapFlow?.underperforming_count || 'N/A'}</span>
            </div>
            <div className="text-xs text-blue-600 truncate">
              {marketCapFlow?.flow_theme?.split(' ').slice(0, 2).join(' ') || 'N/A'}
            </div>
          </div>
        </div>
        
        {/* Top Gainers */}
        {topSectors?.length > 0 && (
          <div className="bg-green-50 p-2 rounded text-xs">
            <div className="font-medium text-green-700 mb-1">Top Gainers</div>
            <div className="space-y-1">
              {topSectors.slice(0, 3).map((sector, index) => (
                <div key={sector.custom_id || sector.id} className="flex justify-between">
                  <span className="truncate">{sector.name}:</span>
                  <span className="font-medium text-green-600">
                    {sector.metrics?.current_rs ? `${(sector.metrics.current_rs * 100).toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Top Losers */}
        {bottomSectors?.length > 0 && (
          <div className="bg-red-50 p-2 rounded text-xs">
            <div className="font-medium text-red-700 mb-1">Top Losers</div>
            <div className="space-y-1">
              {bottomSectors.slice(0, 3).map((sector, index) => (
                <div key={sector.custom_id || sector.id} className="flex justify-between">
                  <span className="truncate">{sector.name}:</span>
                  <span className="font-medium text-red-600">
                    {sector.metrics?.current_rs ? `${(sector.metrics.current_rs * 100).toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* High Momentum */}
        {highMomentumSectors.length > 0 && (
          <div className="bg-blue-50 p-2 rounded text-xs">
            <div className="font-medium text-blue-700 mb-1">High Momentum</div>
            <div className="space-y-1">
              {highMomentumSectors.map((sector, index) => (
                <div key={sector.custom_id || sector.id} className="flex justify-between">
                  <span className="truncate">{sector.name}:</span>
                  <span className="font-medium text-blue-600">
                    {sector.metrics?.current_rs ? `${(sector.metrics.current_rs * 100).toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional flow data in second row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        {/* Emerging Leaders */}
        {emergingLeaders.length > 0 && (
          <div className="bg-yellow-50 p-2 rounded text-xs">
            <div className="font-medium text-yellow-700 mb-1 flex items-center">
              <Zap className="w-2.5 h-2.5 mr-1" />
              Nổi lên ({sectorRotation?.sector_leadership?.emerging_leaders?.count || 0})
            </div>
            <div className="space-y-1">
              {emergingLeaders.map((sector, index) => (
                <div key={index} className="flex justify-between">
                  <span className="truncate">{sector.name}:</span>
                  <span className="font-medium text-yellow-600">{(sector.velocity * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Top sectors flow */}
        {(topInflowSectors.length > 0 || topOutflowSectors.length > 0) && (
          <div className="grid grid-cols-2 gap-2">
            {topInflowSectors.length > 0 && (
              <div className="bg-green-50 p-2 rounded text-xs">
                <div className="font-medium text-green-700 mb-1 flex items-center">
                  <TrendingUp className="w-2.5 h-2.5 mr-1" />
                  Top đổ vào
                </div>
                <div className="space-y-1">
                  {topInflowSectors.map((sector, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="truncate">{sector.name}:</span>
                      <span className="font-medium text-green-600">{(sector.velocity * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {topOutflowSectors.length > 0 && (
              <div className="bg-red-50 p-2 rounded text-xs">
                <div className="font-medium text-red-700 mb-1 flex items-center">
                  <TrendingDown className="w-2.5 h-2.5 mr-1" />
                  Top rút ra
                </div>
                <div className="space-y-1">
                  {topOutflowSectors.map((sector, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="truncate">{sector.name}:</span>
                      <span className="font-medium text-red-600">{(sector.velocity * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top stocks by market cap in a separate row */}
      {(topLargeCap.length > 0 || topMidCap.length > 0 || topSmallCap.length > 0) && (
        <div className="grid grid-cols-3 gap-2">
          {topLargeCap.length > 0 && (
            <div className="bg-blue-50 p-2 rounded text-xs">
              <div className="font-medium text-blue-700 mb-1">VN30</div>
              <div className="space-y-1">
                {topLargeCap.map((stock, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{stock.symbol}:</span>
                    <span className="font-medium text-blue-600">{(stock.velocity * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {topMidCap.length > 0 && (
            <div className="bg-green-50 p-2 rounded text-xs">
              <div className="font-medium text-green-700 mb-1">VNMID</div>
              <div className="space-y-1">
                {topMidCap.map((stock, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{stock.symbol}:</span>
                    <span className="font-medium text-green-600">{(stock.velocity * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {topSmallCap.length > 0 && (
            <div className="bg-orange-50 p-2 rounded text-xs">
              <div className="font-medium text-orange-700 mb-1">VNSML</div>
              <div className="space-y-1">
                {topSmallCap.map((stock, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{stock.symbol}:</span>
                    <span className="font-medium text-orange-600">{(stock.velocity * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoneyFlowAnalysis; 