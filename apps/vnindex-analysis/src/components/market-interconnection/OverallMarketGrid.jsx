import React from 'react';
import { Maximize2 } from 'lucide-react';
import TradingViewWidget from '../TradingViewWidget';
import LazyChart from '../LazyChart';

// Overall Market Grid - S&P 500 and Sector Rotation
const OverallMarketGrid = ({ data, onChartClick }) => {
  const marketCharts = [
    { 
      title: "S&P 500", 
      type: "tradingview",
      symbol: "AMEX:SPY", 
      description: "Chỉ số chứng khoán Mỹ chính - Phản ánh tổng thể thị trường",
      interpretationGuide: [
        { condition: "SPY xu hướng tăng", meaning: "Bull market → Kinh tế tăng trưởng, risk-on" },
        { condition: "SPY xu hướng giảm", meaning: "Bear market → Suy thoái lo ngại, risk-off" },
        { condition: "SPY trên MA200", meaning: "Thị trường tăng dài hạn → Tiếp tục nắm giữ" },
        { condition: "SPY dưới MA200", meaning: "Thị trường giảm dài hạn → Thận trọng" },
        { condition: "SPY biến động cao", meaning: "VIX cao → Cơ hội mua khi oversold" }
      ]
    },
    { 
      title: "Bitcoin (BTC/USDT)", 
      type: "tradingview",
      symbol: "BINANCE:BTCUSDT", 
      description: "Bitcoin - Tài sản rủi ro và chỉ báo thanh khoản toàn cầu",
      interpretationGuide: [
        { condition: "BTC > $70,000", meaning: "Risk-on cực độ → Thanh khoản dồi dào, cảnh giác bubble" },
        { condition: "BTC $50,000-70,000", meaning: "Vùng tăng trưởng → Tâm lý risk-on, theo dõi breakout" },
        { condition: "BTC $30,000-50,000", meaning: "Vùng tích lũy → Thị trường cân bằng, chờ catalyst" },
        { condition: "BTC < $30,000", meaning: "Bear market → Risk-off, thanh khoản thắt chặt" },
        { condition: "BTC correlation với tech stocks", meaning: "Tương quan cao = cùng chịu ảnh hưởng lãi suất Fed" }
      ]
    },
    { 
      title: "USD/VND", 
      type: "tradingview",
      symbol: "FX_IDC:USDVND", 
      chartStyle: "line",
      description: "Tỷ giá USD/VND - Ảnh hưởng đến lạm phát và dòng vốn",
      interpretationGuide: [
        { condition: "USD/VND > 25,000", meaning: "VND yếu → Lạm phát nhập khẩu, bán hàng xuất khẩu" },
        { condition: "USD/VND 24,000-25,000", meaning: "Vùng ổn định → Chính sách tiền tệ cân bằng" },
        { condition: "USD/VND < 24,000", meaning: "VND mạnh → Tốt cho nhập khẩu, du lịch outbound" },
        { condition: "USD/VND tăng nhanh", meaning: "Áp lực lạm phát → Tránh cổ phiếu margin cao" },
        { condition: "DXY vs USD/VND correlation", meaning: "Correlation cao = chịu ảnh hưởng Fed policy" }
      ]
    },
    { 
      title: "Luân chuyển Sector", 
      type: "sector-rotation",
      symbols: {
        main: "AMEX:XLK",
        compare: [
          { symbol: "AMEX:XLU", name: "Utilities" },
          { symbol: "AMEX:XLP", name: "Consumer Staples" },
          { symbol: "AMEX:XLY", name: "Consumer Discretionary" },
          { symbol: "AMEX:XLF", name: "Financials" }
        ]
      },
      description: "So sánh hiệu suất các sector chính - Phát hiện xu hướng luân chuyển",
      interpretationGuide: [
        { condition: "Tech (XLK) dẫn đầu", meaning: "Risk-on → Tăng trưởng mạnh, đầu tư công nghệ" },
        { condition: "Utilities (XLU) mạnh", meaning: "Risk-off → Tìm kiếm cổ tức ổn định" },
        { condition: "Financials (XLF) tăng", meaning: "Lãi suất tăng → Tốt cho ngân hàng" },
        { condition: "Consumer Disc (XLY) vs Staples (XLP)", meaning: "XLY > XLP = tiêu dùng mạnh, ngược lại = suy yếu" },
        { condition: "Rotation từ Growth sang Value", meaning: "Chu kỳ kinh tế muộn → Chuyển sang value stocks" }
      ]
    }
  ];

  // Custom sector rotation widget component
  const SectorRotationWidget = ({ symbols, width = "650px", height = "400px" }) => {
    const containerId = `sector-rotation-${Math.random().toString(36).substr(2, 9)}`;
    
    React.useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "allow_symbol_change": true,
        "calendar": false,
        "details": false,
        "hide_side_toolbar": true,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "hotlist": false,
        "interval": "D",
        "locale": "en",
        "save_image": true,
        "style": "2",
        "symbol": symbols.main,
        "theme": "light",
        "timezone": "Etc/UTC",
        "backgroundColor": "#ffffff",
        "gridColor": "rgba(46, 46, 46, 0.06)",
        "watchlist": [],
        "withdateranges": false,
        "compareSymbols": symbols.compare.map(comp => ({
          "symbol": comp.symbol,
          "position": "SameScale"
        })),
        "studies": [],
        "autosize": true,
        "container_id": containerId
      });

      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
        container.appendChild(script);
      }

      return () => {
        if (container) {
          container.innerHTML = '';
        }
      };
    }, [symbols, containerId]);

    return (
      <div 
        id={containerId}
        style={{ width, height }}
        className="tradingview-widget-container"
      >
        <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
        <div className="tradingview-widget-copyright">
          <a href={`https://www.tradingview.com/symbols/${symbols.main.replace(':', '-')}/?exchange=${symbols.main.split(':')[0]}`} rel="noopener nofollow" target="_blank">
            <span className="blue-text">{symbols.main} với sector comparison by TradingView</span>
          </a>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-semibold text-sm text-slate-700">Tổng quan thị trường và Sector</h5>
        <span className="text-xs text-gray-500">Click biểu đồ để phóng to</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {marketCharts.map((chart, index) => (
          <div key={index} className="bg-slate-50 rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow"
               onClick={() => onChartClick(chart)}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-700">{chart.title}</div>
              <Maximize2 className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500 mb-3">{chart.description}</div>
            <LazyChart>
              {chart.type === 'sector-rotation' ? (
                <SectorRotationWidget 
                  symbols={chart.symbols}
                  width="650px"
                  height="350px"
                />
              ) : (
                <TradingViewWidget 
                  symbol={chart.symbol}
                  width="650px"
                  height="350px"
                  hideVolume={false}
                  chartStyle={chart.chartStyle}
                />
              )}
            </LazyChart>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverallMarketGrid;