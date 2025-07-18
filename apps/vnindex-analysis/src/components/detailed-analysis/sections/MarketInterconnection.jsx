import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, DollarSign, Activity } from 'lucide-react';
import TradingViewWidget from '../../TradingViewWidget';

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
const ChartSection = ({ title, description, symbol, interval = "D", height = "300px" }) => {
  return (
    <div className="p-4 bg-white rounded-lg border">
      <h4 className="font-semibold text-sm text-slate-700 mb-2">{title}</h4>
      <p className="text-xs text-slate-600 mb-3">{description}</p>
      <div style={{ height }}>
        <TradingViewWidget symbol={symbol} interval={interval} height={height} />
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

// Main Market Interconnection Component
const MarketInterconnection = ({ marketInterconnection }) => {
  // Default data structure if none provided
  const data = marketInterconnection || {
    inflation_mode: {
      status: "ON",
      description: "Lạm phát đang tăng cao, Fed có thể tăng lãi suất",
      indicators: {
        cpi: "3.2%",
        cpi_change: "+0.3%",
        core_cpi: "4.1%",
        core_cpi_change: "+0.2%",
        pce: "2.8%",
        pce_change: "+0.1%"
      }
    },
    risk_mode: {
      status: "OFF",
      description: "Thị trường đang trong trạng thái risk-on, VIX thấp",
      indicators: {
        vix: "12.5",
        vix_change: "-2.1",
        treasury_yield: "4.2%",
        treasury_yield_change: "+0.1%",
        credit_spread: "1.2%",
        credit_spread_change: "-0.1%"
      }
    },
    market_regime: {
      current: "Expansion",
      description: "Thị trường đang trong giai đoạn mở rộng",
      strength: "Mạnh",
      duration: "8 tháng",
      confidence: "75%"
    },
    global_macro: {
      us_economy: "Tăng trưởng ổn định",
      fed_policy: "Duy trì lãi suất cao",
      global_growth: "Chậm lại nhưng ổn định",
      geopolitical: "Tương đối ổn định"
    },
    asset_correlation: {
      stocks_bonds: "Tương quan âm",
      stocks_gold: "Tương quan thấp",
      stocks_dollar: "Tương quan âm",
      bonds_gold: "Tương quan dương"
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="font-bold text-lg text-blue-900 mb-2">Phân tích Liên thị trường</h3>
        <p className="text-sm text-blue-700">
          Phân tích top-down từ macro đến micro, xác định chế độ thị trường và xu hướng chính
        </p>
      </div>

      {/* Market Mode Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MarketModeIndicator
          title="Chế độ Lạm phát"
          mode={data.inflation_mode?.status || "ON"}
          description={data.inflation_mode?.description || "Theo dõi áp lực lạm phát"}
          icon={DollarSign}
          colorClass={data.inflation_mode?.status === "ON" ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}
        />
        <MarketModeIndicator
          title="Chế độ Rủi ro"
          mode={data.risk_mode?.status || "OFF"}
          description={data.risk_mode?.description || "Theo dõi tâm lý thị trường"}
          icon={Shield}
          colorClass={data.risk_mode?.status === "ON" ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}
        />
      </div>

      {/* Market Regime Summary */}
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-sm text-yellow-800 mb-2 flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          Chế độ Thị trường hiện tại
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-yellow-600">Chế độ</div>
            <div className="font-bold text-yellow-800">{data.market_regime?.current || "Expansion"}</div>
          </div>
          <div>
            <div className="text-xs text-yellow-600">Sức mạnh</div>
            <div className="font-bold text-yellow-800">{data.market_regime?.strength || "Mạnh"}</div>
          </div>
          <div>
            <div className="text-xs text-yellow-600">Thời gian</div>
            <div className="font-bold text-yellow-800">{data.market_regime?.duration || "8 tháng"}</div>
          </div>
        </div>
        <p className="text-xs text-yellow-700 mt-2">{data.market_regime?.description}</p>
      </div>

      {/* Key Indicators */}
      <div>
        <h4 className="font-semibold text-sm text-slate-700 mb-3">Chỉ số chính</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <DataMetric
            label="CPI YoY"
            value={data.inflation_mode?.indicators?.cpi || "3.2%"}
            change={data.inflation_mode?.indicators?.cpi_change || "+0.3%"}
            colorClass="text-red-600"
          />
          <DataMetric
            label="Core CPI"
            value={data.inflation_mode?.indicators?.core_cpi || "4.1%"}
            change={data.inflation_mode?.indicators?.core_cpi_change || "+0.2%"}
            colorClass="text-red-600"
          />
          <DataMetric
            label="VIX"
            value={data.risk_mode?.indicators?.vix || "12.5"}
            change={data.risk_mode?.indicators?.vix_change || "-2.1"}
            colorClass="text-green-600"
          />
          <DataMetric
            label="Treasury 10Y"
            value={data.risk_mode?.indicators?.treasury_yield || "4.2%"}
            change={data.risk_mode?.indicators?.treasury_yield_change || "+0.1%"}
            colorClass="text-blue-600"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          <DataMetric
            label="PCE"
            value={data.inflation_mode?.indicators?.pce || "2.8%"}
            change={data.inflation_mode?.indicators?.pce_change || "+0.1%"}
            colorClass="text-red-600"
          />
          <DataMetric
            label="Credit Spread"
            value={data.risk_mode?.indicators?.credit_spread || "1.2%"}
            change={data.risk_mode?.indicators?.credit_spread_change || "-0.1%"}
            colorClass="text-green-600"
          />
          <DataMetric
            label="Confidence"
            value={data.market_regime?.confidence || "75%"}
            colorClass="text-blue-600"
          />
        </div>
      </div>

      {/* Global Macro Analysis */}
      {data.global_macro && (
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-sm text-indigo-800 mb-3 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Phân tích Macro Toàn cầu
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-indigo-600 mb-1">Kinh tế Mỹ</div>
              <div className="font-semibold text-indigo-800">{data.global_macro.us_economy}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-indigo-600 mb-1">Chính sách Fed</div>
              <div className="font-semibold text-indigo-800">{data.global_macro.fed_policy}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-indigo-600 mb-1">Tăng trưởng Toàn cầu</div>
              <div className="font-semibold text-indigo-800">{data.global_macro.global_growth}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-indigo-600 mb-1">Địa chính trị</div>
              <div className="font-semibold text-indigo-800">{data.global_macro.geopolitical}</div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Correlation Analysis */}
      {data.asset_correlation && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-sm text-purple-800 mb-3">Tương quan Tài sản</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-purple-600 mb-1">Cổ phiếu - Trái phiếu</div>
              <div className="font-semibold text-purple-800">{data.asset_correlation.stocks_bonds}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-purple-600 mb-1">Cổ phiếu - Vàng</div>
              <div className="font-semibold text-purple-800">{data.asset_correlation.stocks_gold}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-purple-600 mb-1">Cổ phiếu - USD</div>
              <div className="font-semibold text-purple-800">{data.asset_correlation.stocks_dollar}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-purple-600 mb-1">Trái phiếu - Vàng</div>
              <div className="font-semibold text-purple-800">{data.asset_correlation.bonds_gold}</div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VIX Chart */}
        <ChartSection
          title="Chỉ số VIX (Fear & Greed)"
          description="Theo dõi mức độ sợ hãi và tham lam của thị trường. VIX cao = thị trường sợ hãi, VIX thấp = thị trường tham lam"
          symbol="VIX"
          interval="D"
          height="300px"
        />

        {/* Treasury Yield Chart */}
        <ChartSection
          title="Lợi suất Trái phiếu 10Y"
          description="Theo dõi lợi suất trái phiếu chính phủ Mỹ 10 năm. Tăng = áp lực lạm phát, Giảm = tìm nơi trú ẩn"
          symbol="US10Y"
          interval="D"
          height="300px"
        />

        {/* Gold Chart */}
        <ChartSection
          title="Vàng (XAUUSD)"
          description="Theo dõi giá vàng - tài sản trú ẩn khi thị trường bất ổn"
          symbol="XAUUSD"
          interval="D"
          height="300px"
        />

        {/* Dollar Index Chart */}
        <ChartSection
          title="Chỉ số USD (DXY)"
          description="Theo dõi sức mạnh của đồng USD. Mạnh = áp lực lạm phát, Yếu = thị trường risk-on"
          symbol="USDOLLAR"
          interval="D"
          height="300px"
        />

        {/* S&P 500 Chart */}
        <ChartSection
          title="S&P 500 (SPX)"
          description="Theo dõi chỉ số chính của thị trường Mỹ - thước đo tâm lý risk-on/risk-off"
          symbol="SPX"
          interval="D"
          height="300px"
        />

        {/* Bitcoin Chart */}
        <ChartSection
          title="Bitcoin (BTCUSD)"
          description="Theo dõi Bitcoin - tài sản risk-on và hedge chống lạm phát"
          symbol="BTCUSD"
          interval="D"
          height="300px"
        />
      </div>

      {/* Market Analysis Summary */}
      <div className="p-4 bg-slate-50 rounded-lg border">
        <h4 className="font-semibold text-sm text-slate-700 mb-3">Phân tích tổng hợp</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <strong>Chế độ Lạm phát:</strong> {data.inflation_mode?.status === "ON" ? 
                "Đang bật - Fed có thể duy trì lãi suất cao, áp lực lên tài sản rủi ro" : 
                "Đang tắt - Lạm phát được kiểm soát, thuận lợi cho tài sản rủi ro"}
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <strong>Chế độ Rủi ro:</strong> {data.risk_mode?.status === "ON" ? 
                "Đang bật - Thị trường sợ hãi, tìm nơi trú ẩn an toàn" : 
                "Đang tắt - Thị trường tham lam, ưa thích tài sản rủi ro"}
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <strong>Chế độ Thị trường:</strong> {data.market_regime?.current} - {data.market_regime?.description}
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <strong>Khuyến nghị:</strong> {data.inflation_mode?.status === "ON" && data.risk_mode?.status === "ON" ? 
                "Thận trọng - Cân nhắc giảm vị thế rủi ro, tăng tỷ lệ tiền mặt và vàng" :
                data.inflation_mode?.status === "OFF" && data.risk_mode?.status === "OFF" ?
                "Tích cực - Môi trường thuận lợi cho tài sản rủi ro, tăng vị thế cổ phiếu" :
                "Cân bằng - Theo dõi chặt chẽ các chỉ số macro, duy trì đa dạng hóa"}
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <strong>Rủi ro chính:</strong> {data.inflation_mode?.status === "ON" ? 
                "Lạm phát dai dẳng, Fed hawkish kéo dài" : 
                "Tăng trưởng chậm lại, rủi ro suy thoái"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInterconnection; 