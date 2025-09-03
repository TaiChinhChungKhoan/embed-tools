import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ 
  symbol = "NASDAQ:AAPL", 
  interval = "D", 
  height = "400px",
  width = "100%",
  theme = "light",
  hideVolume = false,
  hideSideToolbar = true,
  hideTopToolbar = false,
  allowSymbolChange = true,
  chartStyle = "1"
}) {
  const container = useRef();
  const uniqueId = `tradingview-${symbol}-${interval}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(
    () => {
      // Clean up any existing widgets in this container
      if (container.current) {
        container.current.innerHTML = '';
      }

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "allow_symbol_change": ${allowSymbolChange},
          "calendar": false,
          "details": false,
          "hide_side_toolbar": ${hideSideToolbar},
          "hide_top_toolbar": ${hideTopToolbar},
          "hide_legend": false,
          "hide_volume": ${hideVolume},
          "hotlist": false,
          "interval": "${interval}",
          "locale": "en",
          "save_image": true,
          "style": "${chartStyle === 'line' ? '2' : '1'}",
          "symbol": "${symbol}",
          "theme": "${theme}",
          "timezone": "Etc/UTC",
          "backgroundColor": "${theme === 'dark' ? '#0F0F0F' : '#ffffff'}",
          "gridColor": "${theme === 'dark' ? 'rgba(242, 242, 242, 0.06)' : 'rgba(46, 46, 46, 0.06)'}",
          "watchlist": [],
          "withdateranges": false,
          "compareSymbols": [],
          "studies": [],
          "autosize": true
        }`;
      
      if (container.current) {
        container.current.appendChild(script);
      }

      // Cleanup function
      return () => {
        if (container.current) {
          container.current.innerHTML = '';
        }
      };
    },
    [symbol, interval, theme, hideVolume, hideSideToolbar, hideTopToolbar, allowSymbolChange, chartStyle]
  );

  return (
    <div 
      id={uniqueId}
      className="tradingview-widget-container" 
      ref={container} 
      style={{ height, width, position: "relative", zIndex: 1 }}
    >
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

// Common TradingView symbol combinations that Investing.com doesn't support
export const TRADINGVIEW_SYMBOLS = {
  HYG_VGIT: "AMEX:HYG/NASDAQ:VGIT", // High Yield vs Government Bond ratio - Risk On/Off
  SPY_TLT: "AMEX:SPY/NASDAQ:TLT",   // Stocks vs Bonds ratio
  GLD_TLT: "AMEX:GLD/NASDAQ:TLT",   // Gold vs Bonds ratio
  XLF_XLU: "AMEX:XLF/AMEX:XLU",     // Financials vs Utilities ratio
  QQQ_IWM: "NASDAQ:QQQ/AMEX:IWM",   // Large cap vs Small cap ratio
  XLY_XLP: "AMEX:XLY/AMEX:XLP",     // Consumer Discretionary vs Staples
  
  // Commodities available on TradingView but not Investing.com
  IRON_ORE: "DCE:IRONORE",          // Iron Ore Futures (Dalian Commodity Exchange)
  IRON_ORE_62: "TVC:IRONORE62",     // Iron Ore 62% Fe CFR China
  IRON_ORE_65: "TVC:IRONORE65",     // Iron Ore 65% Fe CFR China
  IRON_ORE_TSI: "CAPITALCOM:TSI",   // Iron Ore (TSI) - Capital.com
  BRENT_OIL: "TVC:BRENT",           // Brent Oil
  WTI_OIL: "TVC:WTI",               // WTI Oil
  NATURAL_GAS: "TVC:NATURALGAS",    // Natural Gas
  COPPER: "TVC:COPPER",             // Copper
  GOLD: "TVC:GOLD",                 // Gold
  SILVER: "TVC:SILVER",             // Silver
  CORN: "TVC:CORN",                 // Corn
  WHEAT: "TVC:WHEAT",               // Wheat
  COTTON: "TVC:COTTON",             // Cotton
};

export default memo(TradingViewWidget); 