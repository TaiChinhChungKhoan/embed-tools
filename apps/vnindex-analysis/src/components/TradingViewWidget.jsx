import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ symbol = "NASDAQ:AAPL", interval = "D", height = "400px" }) {
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
          "allow_symbol_change": true,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": true,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "hide_volume": false,
          "hotlist": false,
          "interval": "${interval}",
          "locale": "en",
          "save_image": true,
          "style": "1",
          "symbol": "${symbol}",
          "theme": "light",
          "timezone": "Etc/UTC",
          "backgroundColor": "#ffffff",
          "gridColor": "rgba(46, 46, 46, 0.06)",
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
    [symbol, interval]
  );

  return (
    <div 
      id={uniqueId}
      className="tradingview-widget-container" 
      ref={container} 
      style={{ height, width: "100%", position: "relative", zIndex: 1 }}
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

export default memo(TradingViewWidget); 