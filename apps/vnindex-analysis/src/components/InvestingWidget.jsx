import React from 'react';

// Investing.com widget component for financial charts
const InvestingWidget = ({ 
  pairId, 
  height = 400, 
  width = '100%', 
  interval = 86400, // Default to daily (86400 seconds)
  plotStyle = 'candles',
  showVolume = true,
  mini = false
}) => {
  // Investing.com parameters
  const domainId = 52; // Vietnam domain
  const langId = 52; // Vietnamese language
  const timezoneId = 21; // Vietnam timezone
  
  // Adjust dimensions for mini mode
  const actualHeight = mini ? 100 : height;
  const actualWidth = mini ? '100%' : width;
  
  // Build the iframe URL
  const iframeSrc = `https://ssltvc.investing.com/?pair_ID=${pairId}&height=${actualHeight}&width=${actualWidth === '100%' ? 1200 : actualWidth}&interval=${interval}&plotStyle=${mini ? 'line' : plotStyle}&domain_ID=${domainId}&lang_ID=${langId}&timezone_ID=${timezoneId}${!showVolume ? '&hideVolume=1' : ''}`;
  
  return (
    <div style={{ width: actualWidth, height: actualHeight, position: 'relative' }}>
      <iframe
        src={iframeSrc}
        width={actualWidth}
        height={actualHeight}
        style={{ 
          border: 'none',
          width: '100%',
          height: '100%'
        }}
        title={`Investing.com Chart ${pairId}`}
        loading="lazy"
      />
    </div>
  );
};

// Common Investing.com pair IDs for key indicators
export const INVESTING_PAIRS = {
  // US Market Indices
  VIX: 44336,           // CBOE Volatility Index (VIX)
  SP500: 166,           // S&P 500
  NASDAQ: 20,           // NASDAQ
  DJI: 169,             // Dow Jones
  
  // Bonds & Yields
  US10Y: 23705,         // US 10 Year Bond Yield
  US2Y: 23701,          // US 2 Year Bond Yield
  US30Y: 23706,         // US 30 Year Bond Yield
  
  // Currencies
  DXY: 8827,            // US Dollar Index
  EURUSD: 1,            // EUR/USD
  USDJPY: 3,            // USD/JPY
  GBPUSD: 2,            // GBP/USD
  USDVND: 1065142,      // USD/VND
  
  // Commodities
  GOLD: 8830,           // Gold Futures
  SILVER: 8836,         // Silver Futures
  CRUDE_OIL: 8849,      // WTI Crude Oil
  BRENT: 8833,          // Brent Oil
  COPPER: 8831,         // Copper Futures
  IRON_ORE: 8831,       // Iron Ore (TIOc1 - Iron Ore Futures) - TODO: Find correct pair ID for TIOc1
  CORN: 8918,           // Corn Futures
  WHEAT: 8917,          // Wheat Futures
  COFFEE: 8832,         // Coffee C Futures
  COTTON: 8851,         // Cotton Futures
  COCOA: 8894,          // Cocoa Futures
  CATTLE: 8914,         // Live Cattle Futures
  NATURAL_GAS: 8862,    // Natural Gas
  
  // Crypto
  BITCOIN: 1057391,     // Bitcoin
  ETHEREUM: 1061443,    // Ethereum
  
  // Vietnam Indices
  VNINDEX: 941434,      // VN-Index
  VN30: 1057711,        // VN30
  HNX: 941612,          // HNX Index
  
  // Economic Indicators
  US_CPI: 733,          // US CPI YoY
  US_CORE_CPI: 736,     // US Core CPI YoY
  US_PPI: 734,          // US PPI YoY
  US_PCE: 924,          // US PCE YoY
  US_GDP: 375,          // US GDP QoQ
  US_UNEMPLOYMENT: 300, // US Unemployment Rate
  US_FED_RATE: 168,     // US Fed Interest Rate
  
  // Vietnam Economic Indicators
  VN_CPI: 1102,         // Vietnam CPI YoY
  VN_GDP: 468,          // Vietnam GDP YoY
  VN_INTEREST: 406,     // Vietnam Interest Rate
};

// Helper function to get pair ID from symbol
export const getPairIdFromSymbol = (symbol) => {
  // Map common symbol names to pair IDs
  const symbolMap = {
    'VIX': INVESTING_PAIRS.VIX,
    'CBOE:VIX': INVESTING_PAIRS.VIX,
    'US10Y': INVESTING_PAIRS.US10Y,
    'TVC:US10Y': INVESTING_PAIRS.US10Y,
    'DXY': INVESTING_PAIRS.DXY,
    'TVC:DXY': INVESTING_PAIRS.DXY,
    'GOLD': INVESTING_PAIRS.GOLD,
    'TVC:GOLD': INVESTING_PAIRS.GOLD,
    'CL': INVESTING_PAIRS.CRUDE_OIL,
    'NYMEX:CL1!': INVESTING_PAIRS.CRUDE_OIL,
    'HG': INVESTING_PAIRS.COPPER,
    'COMEX:HG1!': INVESTING_PAIRS.COPPER,
    'ZC': INVESTING_PAIRS.CORN,
    'CBOT:ZC1!': INVESTING_PAIRS.CORN,
    'KC': INVESTING_PAIRS.COFFEE,
    'ICEUS:KC1!': INVESTING_PAIRS.COFFEE,
    'CT': INVESTING_PAIRS.COTTON,
    'NYMEX:CT1!': INVESTING_PAIRS.COTTON,
    'CC': INVESTING_PAIRS.COCOA,
    'ICEUS:CC1!': INVESTING_PAIRS.COCOA,
    'LE': INVESTING_PAIRS.CATTLE,
    'CME:LE1!': INVESTING_PAIRS.CATTLE,
    'VNINDEX': INVESTING_PAIRS.VNINDEX,
    'VN30': INVESTING_PAIRS.VN30,
  };
  
  return symbolMap[symbol] || null;
};

export default InvestingWidget;