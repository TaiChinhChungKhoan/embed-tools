import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, DollarSign, Activity, Globe, Target, Info, HelpCircle, Brain } from 'lucide-react';
import TradingViewWidget from './TradingViewWidget';
import { useDataLoader } from '../utils/dataLoader';

// Default data structure
const defaultData = {
  inflation_mode: { status: "OFF", indicators: {} },
  risk_mode: { status: "OFF", indicators: { vix: 20, treasury_yield: "4.0%", credit_spread: "1.0%" } },
  vix: 20,
  dxy: 100
};

// Alert system for significant changes
const AlertsPanel = ({ alerts }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
    <h4 className="font-semibold text-sm text-yellow-800 mb-2 flex items-center">
      <AlertTriangle className="w-4 h-4 mr-2" />
      Cảnh báo Thị trường
    </h4>
    {alerts.length === 0 ? (
      <p className="text-xs text-yellow-700">Không có cảnh báo nào</p>
    ) : (
      <div className="space-y-1">
        {alerts.map((alert, index) => (
          <div key={index} className="text-xs text-yellow-800">
            • {alert.message}
          </div>
        ))}
      </div>
    )}
  </div>
);

// Add export functionality
const ExportControls = ({ data }) => {
  const exportToPDF = useCallback(() => {
    // Implementation for PDF export
    console.log('Exporting to PDF...');
  }, [data]);
  
  const exportToExcel = useCallback(() => {
    // Implementation for Excel export
    console.log('Exporting to Excel...');
  }, [data]);
  
  return (
    <div className="flex items-center space-x-2 mb-4">
      <button 
        onClick={exportToPDF}
        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
      >
        Xuất PDF
      </button>
      <button 
        onClick={exportToExcel}
        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
      >
        Xuất Excel
      </button>
      <button 
        onClick={() => setAutoRefresh(!autoRefresh)}
        className={`px-3 py-1 text-xs rounded ${
          autoRefresh ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        {autoRefresh ? 'Tắt tự động' : 'Tự động cập nhật'}
      </button>
    </div>
  );
};

// Market Mode Indicator Component
const MarketModeIndicator = ({ title, mode, description, icon: Icon, colorClass }) => {
  return (
    <div className={`p-4 rounded-lg border ${colorClass}`}>
      <div className="flex items-center mb-3">
        {Icon && <Icon className="w-5 h-5 mr-2" />}
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <div className="text-lg font-bold mb-1">{mode}</div>
      <p className="text-xs text-slate-600">{description}</p>
    </div>
  );
};

// Chart Section Component
const ChartSection = ({ title, description, symbol, interval, height, interpretationGuide }) => {
  const [showGuide, setShowGuide] = useState(false);
  
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-700">{title}</h4>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
        >
          <HelpCircle className="w-4 h-4 mr-1" />
          Cách đọc
        </button>
      </div>
      
      {showGuide && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3 text-xs">
          <h5 className="font-semibold text-yellow-800 mb-2">📚 Cách diễn giải biểu đồ:</h5>
          <div className="space-y-1 text-yellow-700">
            {interpretationGuide.map((guide, index) => (
              <div key={index} className="flex items-start">
                <span className="font-medium mr-2">•</span>
                <span><strong>{guide.condition}:</strong> {guide.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ height }}>
        <TradingViewWidget symbol={symbol} interval={interval} />
      </div>
    </div>
  );
};

// Data Metric Component
const DataMetric = ({ label, value, change, colorClass = "text-slate-700" }) => {
  return (
    <div className="p-3 bg-slate-50 rounded-lg border">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`font-bold text-lg ${colorClass}`}>{value}</div>
      {change && (
        <div className={`text-xs flex items-center mt-1 ${
          change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        }`}>
          {change.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {change}
        </div>
      )}
    </div>
  );
};

// Memoized components
const MemoizedMarketModeIndicator = React.memo(MarketModeIndicator);
const MemoizedDataMetric = React.memo(DataMetric);
const MemoizedChartSection = React.memo(ChartSection);

// New component for correlation matrix
const CorrelationMatrix = ({ correlationData }) => {
  const assets = ['Stocks', 'Bonds', 'Gold', 'USD', 'Crypto'];
  
  return (
    <div className="p-4 bg-white rounded-lg border">
      <h4 className="font-semibold text-sm text-slate-700 mb-3">Ma trận Tương quan</h4>
      <div className="grid grid-cols-6 gap-1 text-xs">
        <div></div>
        {assets.map(asset => (
          <div key={asset} className="text-center font-medium p-1">{asset}</div>
        ))}
        {assets.map(rowAsset => (
          <React.Fragment key={rowAsset}>
            <div className="font-medium p-1">{rowAsset}</div>
            {assets.map(colAsset => {
              const correlation = correlationData?.[`${rowAsset.toLowerCase()}_${colAsset.toLowerCase()}`] || 
                                (rowAsset === colAsset ? 1.0 : Math.random() * 2 - 1);
              return (
                <div 
                  key={`${rowAsset}-${colAsset}`}
                  className={`p-1 text-center rounded text-white text-xs font-medium ${
                    correlation > 0.5 ? 'bg-green-500' :
                    correlation > 0 ? 'bg-green-300' :
                    correlation > -0.5 ? 'bg-red-300' : 'bg-red-500'
                  }`}
                >
                  {correlation.toFixed(2)}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Add TLDR section at the top
const TradingSummaryTLDR = ({ data }) => {
  const getTradeRecommendations = () => {
    const inflationOn = data.inflation_mode?.status === "ON";
    const riskOn = data.risk_mode?.status === "ON";
    
    if (inflationOn && riskOn) {
      return {
        primary: { asset: "Vàng (Gold)", action: "MUA", reason: "Trú ẩn an toàn khi lạm phát cao" },
        secondary: { asset: "USD", action: "MUA", reason: "Đồng tiền mạnh trong môi trường bất ổn" },
        avoid: { asset: "Cổ phiếu", action: "TRÁNH/BÁN", reason: "Rủi ro cao khi lạm phát và sợ hãi" }
      };
    } else if (!inflationOn && !riskOn) {
      return {
        primary: { asset: "Cổ phiếu VN", action: "MUA", reason: "Môi trường thuận lợi cho tăng trưởng" },
        secondary: { asset: "Bitcoin", action: "MUA", reason: "Tài sản rủi ro trong giai đoạn tăng trưởng" },
        avoid: { asset: "Vàng", action: "TRÁNH", reason: "Kém hấp dẫn khi thị trường tăng trưởng" }
      };
    } else {
      return {
        primary: { asset: "Cổ phiếu chất lượng", action: "MUA CHỌN LỌC", reason: "Cân bằng rủi ro và cơ hội" },
        secondary: { asset: "Trái phiếu", action: "GIỮ", reason: "Đa dạng hóa danh mục" },
        avoid: { asset: "Tài sản rủi ro cao", action: "TRÁNH", reason: "Môi trường không rõ ràng" }
      };
    }
  };

  const recommendations = getTradeRecommendations();
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <Target className="w-6 h-6 text-green-600 mr-2" />
        <h3 className="text-xl font-bold text-green-800">📊 Tóm tắt Giao dịch (TLDR)</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Primary Recommendation */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
            <span className="font-semibold text-green-800">Khuyến nghị chính</span>
          </div>
          <div className="text-lg font-bold text-green-700">{recommendations.primary.asset}</div>
          <div className={`text-sm font-medium mb-2 ${
            recommendations.primary.action.includes('MUA') ? 'text-green-600' : 'text-red-600'
          }`}>
            {recommendations.primary.action}
          </div>
          <div className="text-xs text-gray-600">{recommendations.primary.reason}</div>
        </div>

        {/* Secondary Recommendation */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center mb-2">
            <Activity className="w-4 h-4 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-800">Lựa chọn phụ</span>
          </div>
          <div className="text-lg font-bold text-blue-700">{recommendations.secondary.asset}</div>
          <div className={`text-sm font-medium mb-2 ${
            recommendations.secondary.action.includes('MUA') ? 'text-green-600' : 'text-blue-600'
          }`}>
            {recommendations.secondary.action}
          </div>
          <div className="text-xs text-gray-600">{recommendations.secondary.reason}</div>
        </div>

        {/* What to Avoid */}
        <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
            <span className="font-semibold text-red-800">Nên tránh</span>
          </div>
          <div className="text-lg font-bold text-red-700">{recommendations.avoid.asset}</div>
          <div className="text-sm font-medium text-red-600 mb-2">{recommendations.avoid.action}</div>
          <div className="text-xs text-gray-600">{recommendations.avoid.reason}</div>
        </div>
      </div>

      {/* Market Context */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2">🎯 Tại sao?</h4>
        <p className="text-sm text-gray-700">
          Hiện tại thị trường đang trong chế độ <strong>{data.market_regime?.current}</strong>. 
          Lạm phát {data.inflation_mode?.status === "ON" ? "đang tăng" : "được kiểm soát"} và 
          tâm lý nhà đầu tư {data.risk_mode?.status === "ON" ? "sợ hãi" : "lạc quan"}. 
          Trong bối cảnh này, chiến lược tốt nhất là {recommendations.primary.action.toLowerCase()} {recommendations.primary.asset.toLowerCase()}.
        </p>
      </div>
    </div>
  );
};

// Enhanced section headers with explanations
const SectionHeader = ({ title, intent, howToUse, children }) => (
  <div className="mb-6">
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
      <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center">
        <Info className="w-5 h-5 mr-2" />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold text-blue-800 mb-1">🎯 Mục đích:</h4>
          <p className="text-blue-700">{intent}</p>
        </div>
        <div>
          <h4 className="font-semibold text-blue-800 mb-1">📖 Cách sử dụng:</h4>
          <p className="text-blue-700">{howToUse}</p>
        </div>
      </div>
    </div>
    {children}
  </div>
);

// Placeholder components for missing imports
const MarketModeIndicators = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <MarketModeIndicator
      title="Chế độ Lạm phát"
      mode={data.inflation_mode}
      description="Thị trường đang lo ngại về lạm phát"
      icon={TrendingUp}
      colorClass="text-red-600"
    />
    <MarketModeIndicator
      title="Chế độ Rủi ro"
      mode={data.risk_mode}
      description="Thị trường đang sợ hãi rủi ro"
      icon={AlertTriangle}
      colorClass="text-orange-600"
    />
  </div>
);

const KeyIndicatorsGrid = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <DataMetric
      label="VIX"
      value={data.risk_mode?.indicators?.vix || 'N/A'}
      change={data.risk_mode?.indicators?.vix_change || '0%'}
      colorClass={data.risk_mode?.indicators?.vix > 30 ? 'text-red-600' : 'text-green-600'}
    />
    <DataMetric
      label="Bond Yield"
      value={data.risk_mode?.indicators?.treasury_yield || 'N/A'}
      change={data.risk_mode?.indicators?.yield_change || '0%'}
      colorClass="text-blue-600"
    />
    <DataMetric
      label="Credit Spread"
      value={data.risk_mode?.indicators?.credit_spread || 'N/A'}
      change={data.risk_mode?.indicators?.spread_change || '0%'}
      colorClass="text-purple-600"
    />
  </div>
);

const MarketChartsGrid = ({ configs }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {configs.map((config, index) => (
      <ChartSection
        key={index}
        title={config.title}
        description={config.description}
        symbol={config.symbol}
        interval="1D"
        height={300}
        interpretationGuide={config.interpretationGuide}
      />
    ))}
  </div>
);


// Enhanced Market Analysis Summary with actionable insights
const MarketAnalysisSummary = ({ data }) => {
  const getActionableInsights = () => {
    const inflationOn = data.inflation_mode?.status === "ON";
    const riskOn = data.risk_mode?.status === "ON";
    
    return {
      currentSituation: inflationOn && riskOn ? "Lạm phát cao + Sợ hãi" :
                       !inflationOn && !riskOn ? "Lạm phát thấp + Lạc quan" :
                       inflationOn ? "Lạm phát cao + Lạc quan" : "Lạm phát thấp + Sợ hãi",
      
      whatItMeans: inflationOn && riskOn ? "Thị trường đang trong giai đoạn khó khăn nhất - vừa lo lạm phát vừa sợ rủi ro" :
                   !inflationOn && !riskOn ? "Thị trường trong giai đoạn lý tưởng - lạm phát kiểm soát và tâm lý tích cực" :
                   "Thị trường trong giai đoạn chuyển tiếp - cần theo dõi chặt chẽ",
      
      nextSteps: [
        inflationOn ? "Theo dõi CPI, Fed meeting" : "Theo dõi GDP, earnings",
        riskOn ? "Chờ VIX giảm xuống dưới 25" : "Tận dụng momentum tăng trưởng",
        "Xem xét tái cân bằng danh mục hàng tuần"
      ]
    };
  };

  const insights = getActionableInsights();

  return (
    <div className="bg-slate-50 rounded-lg border p-6">
      <h4 className="font-semibold text-lg text-slate-800 mb-4 flex items-center">
        <Brain className="w-5 h-5 mr-2" />
        Phân tích tổng hợp & Hành động
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Situation */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold text-blue-800 mb-2">🔍 Tình hình hiện tại</h5>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Chế độ:</strong> {insights.currentSituation}
            </p>
            <p className="text-xs text-gray-600">{insights.whatItMeans}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold text-green-800 mb-2">⚡ Tín hiệu quan trọng</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>VIX Level:</span>
                <span className={data.vix > 30 ? "text-red-600" : "text-green-600"}>
                  {data.vix > 30 ? "Sợ hãi cao" : "Bình thường"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>USD Strength:</span>
                <span className={data.dxy > 105 ? "text-red-600" : "text-green-600"}>
                  {data.dxy > 105 ? "Rất mạnh" : "Ổn định"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold text-purple-800 mb-2">📋 Kế hoạch hành động</h5>
            <div className="space-y-2">
              {insights.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start text-sm">
                  <span className="bg-purple-100 text-purple-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold text-orange-800 mb-2">⚠️ Rủi ro cần lưu ý</h5>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• {data.inflation_mode?.status === "ON" ? "Fed có thể tăng lãi suất bất ngờ" : "Tăng trưởng có thể chậm lại"}</div>
              <div>• {data.risk_mode?.status === "ON" ? "Bán tháo có thể lan rộng" : "Thị trường có thể quá lạc quan"}</div>
              <div>• Biến động địa chính trị bất ngờ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Context-aware risk assessment component
const ContextualRiskAssessment = ({ data }) => {
  const analysis = getContextualInterpretation(data);
  
  return (
    <div className="bg-white rounded-lg border p-4">
      <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
        <AlertTriangle className="w-4 h-4 mr-2" />
        Đánh giá Rủi ro Theo Bối cảnh
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Regime Analysis */}
        <div className="space-y-3">
          <div className={`p-3 rounded-lg ${
            analysis.inflationContext === "HIGH_INFLATION" ? 'bg-red-50' : 'bg-blue-50'
          }`}>
            <h5 className="font-semibold text-sm mb-2">
              {analysis.inflationContext === "HIGH_INFLATION" ? "🔥 Chế độ Lạm phát" : "📈 Chế độ Tăng trưởng"}
            </h5>
            <p className="text-xs text-gray-600 mb-2">{analysis.riskInterpretation.description}</p>
            <p className="text-xs font-medium text-blue-700">{analysis.riskInterpretation.action}</p>
          </div>
        </div>

        {/* Key Thresholds */}
        <div className="space-y-2">
          <h5 className="font-semibold text-sm">🎯 Ngưỡng Quan trọng:</h5>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>VIX Alert:</span>
              <span className="font-medium">&gt; {analysis.thresholds.vix.fearLevel}</span>
            </div>
            <div className="flex justify-between">
              <span>Bond Yield Concern:</span>
              <span className="font-medium">&gt; {analysis.thresholds.bondYield.concern}%</span>
            </div>
            <div className="flex justify-between">
              <span>Credit Spread Watch:</span>
              <span className="font-medium">&gt; {analysis.thresholds.creditSpread.concern}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced chart configurations with contextual interpretation
const getContextualChartConfigs = (inflationMode) => [
  {
    title: "Chỉ số VIX (Fear & Greed)",
    symbol: "VIX",
    description: "Đo lường mức độ sợ hãi/tham lam của thị trường",
    interpretationGuide: inflationMode ? [
      { condition: "VIX > 35", meaning: "Panic về stagflation → Mua vàng, bán mọi thứ khác" },
      { condition: "VIX 25-35", meaning: "Lo lạm phát → Rotate sang commodities" },
      { condition: "VIX < 20", meaning: "Nguy hiểm! Thị trường ignore lạm phát → Hedge ngay" },
      { condition: "VIX spike đột biến", meaning: "Fed có thể action mạnh → Bán growth stocks" }
    ] : [
      { condition: "VIX > 30", meaning: "Growth scare → Mua quality dip" },
      { condition: "VIX 20-30", meaning: "Uncertainty → Chờ clarity" },
      { condition: "VIX < 15", meaning: "Euphoria → Giảm risk, chuẩn bị correction" },
      { condition: "VIX giảm dần", meaning: "Recovery mode → Tăng cyclicals" }
    ]
  },
  {
    title: "Lợi suất Trái phiếu 10Y",
    symbol: "US10Y",
    description: inflationMode ? "Phản ánh kỳ vọng lạm phát và Fed hawkishness" : "Phản ánh kỳ vọng tăng trưởng và Fed policy",
    interpretationGuide: inflationMode ? [
      { condition: "Yield > 5%", meaning: "Fed tăng lãi suất mạnh → Bán cổ phiếu, mua USD" },
      { condition: "Yield 4-5%", meaning: "Fed đang chống lạm phát → Neutral stocks" },
      { condition: "Yield < 3.5%", meaning: "Thị trường không tin Fed → Mua vàng" },
      { condition: "Yield curve invert", meaning: "Recession risk → Defensive positioning" }
    ] : [
      { condition: "Yield > 4.5%", meaning: "Growth optimism → Rotate growth to value" },
      { condition: "Yield 3-4%", meaning: "Balanced growth → Maintain allocation" },
      { condition: "Yield < 2.5%", meaning: "Recession fear → Buy bonds, defensives" },
      { condition: "Yield rising fast", meaning: "Reflation trade → Buy cyclicals" }
    ]
  }
];

// Context-aware interpretation logic
const getContextualInterpretation = (data) => {
  const inflationMode = data.inflation_mode?.status === "ON";
  const riskMode = data.risk_mode?.status === "ON";
  const vix = parseFloat(data.risk_mode?.indicators?.vix) || 20;
  const bondYield = parseFloat(data.risk_mode?.indicators?.treasury_yield?.replace('%', '')) || 4;
  const creditSpread = parseFloat(data.risk_mode?.indicators?.credit_spread?.replace('%', '')) || 1;

  // Different thresholds based on inflation regime
  const thresholds = inflationMode ? {
    vix: { fearLevel: 25, extremeFear: 35 }, // Higher thresholds during inflation
    bondYield: { concern: 4.5, danger: 5.5 }, // Higher yields more concerning
    creditSpread: { concern: 1.5, danger: 2.5 } // Wider spreads more significant
  } : {
    vix: { fearLevel: 20, extremeFear: 30 }, // Lower thresholds in low inflation
    bondYield: { concern: 3.5, danger: 4.5 }, // Lower yields still concerning
    creditSpread: { concern: 1.0, danger: 2.0 } // Tighter spreads matter more
  };

  return {
    inflationContext: inflationMode ? "HIGH_INFLATION" : "LOW_INFLATION",
    riskInterpretation: getRiskInterpretation(vix, bondYield, creditSpread, thresholds, inflationMode),
    thresholds
  };
};

// Helper functions for interpretation
const getBondYieldMeaning = (bondYield, inflationMode) => {
  if (inflationMode) {
    return bondYield > 4.5 ? "Fed hawkish, inflation concern" : "Fed dovish, inflation under control";
  }
  return bondYield > 4.0 ? "Growth optimism" : "Growth concern";
};

const getVixMeaning = (vix, inflationMode) => {
  if (inflationMode) {
    return vix > 25 ? "Inflation panic" : "Inflation complacency";
  }
  return vix > 20 ? "Growth scare" : "Risk on";
};

const getCreditSpreadMeaning = (spread, inflationMode) => {
  if (inflationMode) {
    return spread > 1.5 ? "Credit stress" : "Credit stability";
  }
  return spread > 1.0 ? "Risk aversion" : "Risk seeking";
};

const getRiskInterpretation = (vix, bondYield, creditSpread, thresholds, inflationMode) => {
  if (inflationMode) {
    // In inflation regime, focus on real rates and inflation expectations
    if (vix > thresholds.vix.extremeFear || bondYield > thresholds.bondYield.danger) {
      return {
        level: "EXTREME_RISK_OFF",
        description: "Thị trường cực kỳ sợ hãi về lạm phát và tăng trưởng",
        action: "Mua vàng, USD, tránh mọi tài sản rủi ro",
        reasoning: "Lạm phát cao + sợ hãi = stagflation risk"
      };
    } else if (vix < 20 && bondYield < thresholds.bondYield.concern) {
      return {
        level: "INFLATION_COMPLACENCY",
        description: "Thị trường đang bỏ qua rủi ro lạm phát",
        action: "Chuẩn bị cho volatility tăng, hedge lạm phát",
        reasoning: "VIX thấp trong môi trường lạm phát là dấu hiệu nguy hiểm"
      };
    }
  } else {
    // In low inflation regime, focus on growth and liquidity
    if (vix > thresholds.vix.extremeFear) {
      return {
        level: "GROWTH_SCARE",
        description: "Lo ngại về tăng trưởng kinh tế",
        action: "Mua quality stocks khi VIX peak, tránh cyclicals",
        reasoning: "Không có áp lực lạm phát, focus vào growth recovery"
      };
    } else if (vix < 15 && creditSpread < 0.8) {
      return {
        level: "RISK_ON_EUPHORIA",
        description: "Thị trường quá lạc quan về tăng trưởng",
        action: "Giảm leverage, chuẩn bị cho correction",
        reasoning: "VIX quá thấp + credit spread hẹp = bubble risk"
      };
    }
  }
  
  return {
    level: "BALANCED",
    description: "Thị trường trong trạng thái cân bằng",
    action: "Duy trì allocation cân bằng, theo dõi chặt chẽ",
    reasoning: "Các chỉ số trong vùng trung tính"
  };
};

// Main Market Interconnection Report Component
const MarketInterconnectionReport = () => {
  const [timeframe, setTimeframe] = useState('1D');
  
  // Use centralized data loader
  const { data: analyticsData, loading, error } = useDataLoader('RRG_ANALYSIS', timeframe);
  
  // Memoize processed data
  const processedData = useMemo(() => {
    const marketInterconnection = analyticsData?.insights?.detailed_analysis?.market_interconnection;
    return marketInterconnection || defaultData;
  }, [analyticsData]);
  
  // Memoize chart configurations
  const chartConfigs = useMemo(() => [
    { title: "Chỉ số VIX", symbol: "VIX", description: "Theo dõi mức độ sợ hãi..." },
    { title: "Lợi suất Trái phiếu 10Y", symbol: "US10Y", description: "Theo dõi lợi suất..." },
    // ... other configs
  ], []);
  
  const handleTimeframeChange = useCallback((newTimeframe) => {
    setTimeframe(newTimeframe);
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu phân tích liên thị trường...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <h3 className="text-red-800 font-semibold">Lỗi tải dữ liệu</h3>
        </div>
        <p className="text-red-700 mt-2">Không thể tải dữ liệu phân tích liên thị trường. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* TLDR Section - Most Important */}
      <TradingSummaryTLDR data={processedData} />
      
      {/* Market Mode Indicators with Explanation */}
      <SectionHeader
        title="Chỉ số Chế độ Thị trường"
        intent="Xác định thị trường đang trong giai đoạn nào để điều chỉnh chiến lược đầu tư phù hợp"
        howToUse="Lạm phát BẬT → mua vàng/USD, tránh cổ phiếu. Rủi ro BẬT → giảm leverage, tăng tiền mặt"
      >
        <MarketModeIndicators data={processedData} />
      </SectionHeader>

      {/* Key Indicators with Explanation */}
      <SectionHeader
        title="Chỉ số Kinh tế Chính"
        intent="Theo dõi các chỉ số macro quan trọng ảnh hưởng đến định giá tài sản"
        howToUse="So sánh với ngưỡng lịch sử để đánh giá mức độ extreme và cơ hội đảo chiều"
      >
        <KeyIndicatorsGrid data={processedData} />
      </SectionHeader>

      {/* Charts with Interpretation Guides */}
      <SectionHeader
        title="Biểu đồ Thị trường Toàn cầu"
        intent="Phân tích kỹ thuật các tài sản chính để xác định xu hướng và điểm vào/ra"
        howToUse="Kết hợp với chỉ số chế độ để xác nhận tín hiệu và timing giao dịch"
      >
        <MarketChartsGrid configs={chartConfigs} />
      </SectionHeader>

      {/* Actionable Summary */}
      <MarketAnalysisSummary data={processedData} />
    </div>
  );
};

export default MarketInterconnectionReport; 
