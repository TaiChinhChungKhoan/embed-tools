import React from 'react';
import {
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    TrendingDown,
    Zap,
    Shield,
    BarChart,
    Activity,
    Info
} from 'lucide-react';
import { getCrsColor, getCrsStatusColor, getDirectionColor, getRsChangeColor, getRiskColor } from '../detailed-analysis/utils/colorUtils';

// Compact metric item for minified display
const CompactMetricItem = ({ icon: Icon, label, value, valueClassName = '', tooltip = '' }) => (
    <div className="flex items-center justify-between py-0.5" title={tooltip}>
        <div className="flex items-center text-xs text-gray-600">
            <Icon className="w-3 h-3 mr-1.5" />
            <span className="truncate">{label}</span>
        </div>
        <span className={`font-mono text-xs font-medium ml-2 ${valueClassName}`}>{value}</span>
    </div>
);

// Compact info card for minified display
const CompactInfoCard = ({ title, tooltip, children, className = '' }) => (
    <div className={`bg-gray-50 rounded-md p-2 ${className}`}>
        <div className="flex items-center justify-between mb-1.5">
            <h4 className="font-semibold text-gray-800 text-xs">{title}</h4>
            {tooltip && (
                <span className="text-gray-400 cursor-pointer" title={tooltip}>
                    <Info size={12} />
                </span>
            )}
        </div>
        <div className="space-y-0.5">{children}</div>
    </div>
);

const SymbolInfoPanelMinified = ({ symbol, analyzeData }) => {
  // Use the symbol object directly since it contains all the data we need
  const symbolData = symbol;

  if (!symbolData) {
    return (
      <div className="bg-white border rounded-lg p-3 shadow-sm text-center">
        <h3 className="text-sm font-bold text-gray-800">{symbol?.name || 'Unknown'}</h3>
        <p className="text-gray-500 text-xs">Không có dữ liệu chi tiết cho mã này.</p>
      </div>
    );
  }

  // Try to find full symbol data from analyzeData if we have limited data
  let fullSymbolData = symbolData;
  if (analyzeData?.symbols && symbolData.symbol) {
    const foundSymbol = analyzeData.symbols.find(s => s.symbol === symbolData.symbol);
    if (foundSymbol) {
      fullSymbolData = foundSymbol;
    }
  }

  // Detect data structure type
  const isRRGData = fullSymbolData.quadrant && fullSymbolData.velocity !== undefined;
  const isRSData = fullSymbolData.metrics || fullSymbolData.performance_summary || fullSymbolData.speed_analysis || fullSymbolData.direction_analysis;
  const isInsightsData = fullSymbolData.speed_score !== undefined && fullSymbolData.speed_category;

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log(`SymbolInfoPanelMinified Debug for ${fullSymbolData.symbol || fullSymbolData.name}:`, {
      isRRGData, isRSData, isInsightsData,
      hasSpeedAnalysis: !!fullSymbolData.speed_analysis,
      speedAnalysisKeys: fullSymbolData.speed_analysis ? Object.keys(fullSymbolData.speed_analysis) : []
    });
  }

  // --- Helpers for translation and formatting ---
  const formatPercent = (val) => (typeof val === 'number' ? `${(val * 100).toFixed(1)}%` : 'K/C');
  const formatNumber = (val) => (typeof val === 'number' ? val.toFixed(2) : 'K/C');
  
  // Function to get color for RS value
  const getRsValueColor = (rs) => {
    if (typeof rs === 'number') {
      if (rs >= 70) return 'text-green-600';      // Strong positive
      if (rs >= 50) return 'text-blue-600';       // Positive
      if (rs >= 30) return 'text-yellow-600';     // Neutral
      if (rs >= 0) return 'text-orange-600';      // Weak negative
      return 'text-red-600';                       // Strong negative
    }
    return 'text-gray-600';
  };

  // Extract data based on structure type
  const getData = () => {
    if (isRRGData) {
      // RRG data structure
      return {
        name: fullSymbolData.symbol || fullSymbolData.name,
        symbol: fullSymbolData.symbol,
        rs: fullSymbolData.rs_ratio || fullSymbolData.current_rs || 1.0,
        rs_fast: fullSymbolData.rs_slope_fast || 0,
        rs_slow: fullSymbolData.rs_slope_slow || 0,
        speed: fullSymbolData.velocity || 0,
        direction: fullSymbolData.direction || fullSymbolData.trajectory_strength || 'K/C',
        crs: fullSymbolData.current_crs || 0,
        crs_status: fullSymbolData.crs_status || 'K/C',
        trend_strength: fullSymbolData.trend_strength?.overall_trend_strength || fullSymbolData.trend_strength || 'K/C',
        strength_score: fullSymbolData.strength_score || 0,
        quadrant: fullSymbolData.quadrant || 'K/C'
      };
    } else if (isRSData) {
      // Full RS analysis data structure
      const { metrics = {}, performance_summary = {}, trend_consistency = {} } = fullSymbolData;
      return {
        name: fullSymbolData.name || fullSymbolData.symbol,
        symbol: fullSymbolData.symbol,
        rs: metrics?.current_rs || 1.0,
        rs_fast: metrics?.rs_slope_fast || 0,
        rs_slow: metrics?.rs_slope_slow || 0,
        speed: metrics?.mps_acceleration || 0,
        direction: performance_summary?.rs_trend || 'K/C',
        crs: metrics?.current_crs || 0,
        crs_status: performance_summary?.crs_status || 'K/C',
        trend_strength: performance_summary?.strength_score ? performance_summary.strength_score.toFixed(1) : 'K/C',
        strength_score: performance_summary?.strength_score || 0,
        quadrant: performance_summary?.quadrant || 'K/C'
      };
    } else if (isInsightsData) {
      // Insights data structure (from RRG insights)
      return {
        name: fullSymbolData.name || fullSymbolData.symbol || fullSymbolData.custom_id,
        symbol: fullSymbolData.symbol || fullSymbolData.custom_id,
        rs: fullSymbolData.rs_ratio || fullSymbolData.current_rs || 1.0,
        rs_fast: fullSymbolData.rs_slope_fast || 0,
        rs_slow: fullSymbolData.rs_slope_slow || 0,
        speed: fullSymbolData.speed_score || fullSymbolData.velocity || 0,
        direction: fullSymbolData.speed_category || fullSymbolData.direction || 'K/C',
        crs: fullSymbolData.current_crs || 0,
        crs_status: fullSymbolData.crs_status || 'K/C',
        trend_strength: fullSymbolData.trend_strength?.overall_trend_strength || fullSymbolData.trend_strength || 'K/C',
        strength_score: fullSymbolData.strength_score || 0,
        quadrant: fullSymbolData.rrg_position || fullSymbolData.quadrant || 'K/C'
      };
    } else {
      // Fallback for unknown structure - try to extract what we can
      return {
        name: fullSymbolData.name || fullSymbolData.symbol || fullSymbolData.custom_id || 'Unknown',
        symbol: fullSymbolData.symbol || fullSymbolData.custom_id,
        rs: fullSymbolData.current_rs || fullSymbolData.rs_ratio || 1.0,
        rs_fast: fullSymbolData.rs_slope_fast || 0,
        rs_slow: fullSymbolData.rs_slope_slow || 0,
        speed: fullSymbolData.speed_score || fullSymbolData.velocity || fullSymbolData.weighted_speed || fullSymbolData.speed_analysis?.weighted_speed || fullSymbolData.speed_analysis?.speed_fast || fullSymbolData.speed_analysis?.momentum_acceleration || 0,
        direction: fullSymbolData.speed_category || fullSymbolData.direction || fullSymbolData.trajectory_strength || 'K/C',
        crs: fullSymbolData.current_crs || 0,
        crs_status: fullSymbolData.crs_status || 'K/C',
        trend_strength: fullSymbolData.trend_strength?.overall_trend_strength || fullSymbolData.trend_strength || 'K/C',
        strength_score: fullSymbolData.strength_score || 0,
        quadrant: fullSymbolData.rrg_position || fullSymbolData.quadrant || 'K/C'
      };
    }
  };

  const data = getData();

  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-2 truncate">
        {data.name}
        {data.symbol && <span className="text-sm text-gray-500 ml-2">({data.symbol})</span>}
      </h3>

      {/* Compact grid layout - matching IndustryInfoPanelMinified structure */}
      <div className="space-y-2">
        {/* Performance & Speed Row */}
        <div className="grid grid-cols-2 gap-2">
          <CompactInfoCard
            title="Hiệu suất"
            tooltip="Sức mạnh tương đối (Relative Strength) so với VNINDEX"
          >
            <CompactMetricItem
              icon={TrendingUp}
              label="RS"
              value={data.rs ? `${data.rs.toFixed(1)}%` : 'K/C'}
              valueClassName={getRsValueColor(data.rs)}
            />
            <CompactMetricItem
              icon={data.rs_fast > 0 ? ArrowUpRight : ArrowDownRight}
              label="Fast"
              value={formatPercent(data.rs_fast)}
              valueClassName={getRsChangeColor(data.rs_fast)}
            />
          </CompactInfoCard>

          <CompactInfoCard
            title="Tốc độ & Hướng"
            tooltip="Phân tích tốc độ và hướng của xu hướng"
          >
            <CompactMetricItem
              icon={Zap}
              label="Tốc độ"
              value={formatPercent(data.speed)}
            />
            <CompactMetricItem
              icon={data.direction?.includes('Tăng') || data.direction?.includes('Improving') ? TrendingUp : TrendingDown}
              label="Hướng"
              value={data.direction?.split(' ')[0] || 'K/C'}
              valueClassName={getDirectionColor(data.direction)}
            />
          </CompactInfoCard>
        </div>

        {/* CRS & Additional Details Row */}
        <div className="grid grid-cols-2 gap-2">
          <CompactInfoCard
            title="CRS"
            tooltip="Cumulative Relative Strength analysis"
          >
            <CompactMetricItem
              icon={BarChart}
              label="CRS"
              value={formatPercent(data.crs)}
              valueClassName={getCrsColor(data.crs)}
            />
            <CompactMetricItem
              icon={Activity}
              label="Trạng thái"
              value={data.crs_status}
              valueClassName={getCrsStatusColor(data.crs_status)}
            />
          </CompactInfoCard>

          <CompactInfoCard title="Chi tiết bổ sung">
            <div className="grid grid-cols-3 gap-1 text-center">
              <div>
                <div className="text-xs text-gray-500">Slow</div>
                <div className={`font-mono font-semibold text-xs ${
                  getRsChangeColor(data.rs_slow)
                }`}>
                  {formatPercent(data.rs_slow)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Sức mạnh</div>
                <div className="font-mono font-semibold text-xs text-purple-600">
                  {data.trend_strength}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Điểm</div>
                <div className="font-mono font-semibold text-xs">
                  {formatNumber(data.strength_score)}
                </div>
              </div>
            </div>
          </CompactInfoCard>
        </div>
      </div>
    </div>
  );
};

export default SymbolInfoPanelMinified; 