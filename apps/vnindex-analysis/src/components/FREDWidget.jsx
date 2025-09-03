import React, { useEffect } from 'react';

// FRED (Federal Reserve Economic Data) widget component for economic charts
const FREDWidget = ({ 
  graphId,
  width = '100%', 
  height = 475,
  title,
  description,
  hideAttribution = false,
  hideControls = false
}) => {
  // Build the iframe URL with optional parameters to hide elements
  let iframeSrc = `https://fred.stlouisfed.org/graph/graph-landing.php?g=${graphId}&width=800&height=${height}`;
  
  // Add parameters to hide attribution and controls if requested
  if (hideAttribution) {
    iframeSrc += '&hide_attribution=1';
  }
  if (hideControls) {
    iframeSrc += '&hide_controls=1';
  }
  
  // Load FRED embed script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://fred.stlouisfed.org/assets/research/fred-graph-react/build/embed.min.js';
    script.type = 'text/javascript';
    script.async = true;
    
    // Check if script already exists
    if (!document.querySelector(`script[src="${script.src}"]`)) {
      document.head.appendChild(script);
    }
    
    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript && !document.querySelector('.fred-widget-container')) {
        existingScript.remove();
      }
    };
  }, []);
  
  return (
    <div className="fred-widget-container">
      {title && (
        <div className="mb-2">
          <div className="text-sm font-medium text-slate-700">{title}</div>
          {description && <div className="text-xs text-gray-500">{description}</div>}
        </div>
      )}
      <div className="embed-container">
        <iframe
          src={iframeSrc}
          scrolling="no"
          frameBorder="0"
          style={{ overflow: 'hidden' }}
          allowtransparency="true"
          loading="lazy"
          title={title || `FRED Graph ${graphId}`}
        />
      </div>
      
      <style jsx="true">{`
        .fred-widget-container {
          width: 100%;
        }
        
        .embed-container {
          position: relative;
          padding-bottom: 59.4%; /* 475/800 = 0.594 for 800px width */
          height: 0;
          overflow: hidden;
          width: 100%;
        }
        
        .embed-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        /* Hide FRED attribution elements via CSS if needed */
        .embed-container iframe {
          /* This will hide elements that might still show up */
          filter: contrast(1.1) brightness(1.05);
        }
        
        /* Additional CSS to hide FRED elements (if iframe allows) */
        .fred-widget-container :global(.fred-graph-footer),
        .fred-widget-container :global(.fred-graph-attribution),
        .fred-widget-container :global(.fred-graph-controls),
        .fred-widget-container :global([class*="attribution"]),
        .fred-widget-container :global([class*="footer"]),
        .fred-widget-container :global([class*="controls"]) {
          display: none !important;
        }
        
        /* Responsive breakpoints */
        @media (max-width: 1024px) {
          .embed-container {
            padding-bottom: 58%; /* Slightly taller on tablets */
          }
        }
        
        @media (max-width: 768px) {
          .embed-container {
            padding-bottom: 65%; /* Taller on mobile */
          }
        }
        
        @media (max-width: 480px) {
          .embed-container {
            padding-bottom: 75%; /* Even taller on small screens */
          }
        }
      `}</style>
    </div>
  );
};

// Common FRED graph IDs for economic indicators
export const FRED_GRAPHS = {
  // Inflation Indicators
  CPI: '1LG9J',           // Consumer Price Index for All Urban Consumers
  PCE: '1LG9z',           // Personal Consumption Expenditures
  CORE_CPI: '1LGAb',      // Core CPI (less food and energy)
  CORE_PCE: '1LGAp',      // Core PCE (less food and energy)
  PPI: '1LGAx',           // Producer Price Index
  
  // Interest Rates
  FED_RATE: '1LGB3',      // Federal Funds Effective Rate
  US10Y: '1LGB9',         // 10-Year Treasury Constant Maturity Rate
  US2Y: '1LGBF',          // 2-Year Treasury Constant Maturity Rate
  US30Y: '1LGBL',         // 30-Year Treasury Constant Maturity Rate
  
  // Economic Growth
  GDP: '1LGBR',           // Gross Domestic Product
  GDP_GROWTH: '1LGBX',    // Real GDP Growth Rate
  UNEMPLOYMENT: '1LGC3',   // Unemployment Rate
  
  // Money Supply
  M2: '1LGC9',            // M2 Money Supply
  M1: '1LGCF',            // M1 Money Supply
  
  // Consumer Sentiment
  CONSUMER_SENTIMENT: '1LGCL', // University of Michigan Consumer Sentiment
  RETAIL_SALES: '1LGCR',       // Retail Sales
  
  // Housing
  HOUSING_STARTS: '1LGCX',     // Housing Starts
  HOME_PRICES: '1LGD3',        // Case-Shiller Home Price Index
  
  // Manufacturing
  ISM_MANUFACTURING: '1LGD9',  // ISM Manufacturing Index
  INDUSTRIAL_PRODUCTION: '1LGDF', // Industrial Production Index
  
  // Combined Charts
  INFLATION_COMPARISON: '1LGDl', // CPI vs PCE comparison
  YIELD_CURVE: '1LGDr',         // Yield Curve (2Y, 10Y, 30Y)
  RECESSION_INDICATORS: '1LGDx', // Multiple recession indicators
};

// Helper function to get graph ID from indicator name
export const getGraphIdFromIndicator = (indicator) => {
  const indicatorMap = {
    'CPI': FRED_GRAPHS.CPI,
    'PCE': FRED_GRAPHS.PCE,
    'CORE_CPI': FRED_GRAPHS.CORE_CPI,
    'CORE_PCE': FRED_GRAPHS.CORE_PCE,
    'PPI': FRED_GRAPHS.PPI,
    'FED_RATE': FRED_GRAPHS.FED_RATE,
    'US10Y': FRED_GRAPHS.US10Y,
    'US2Y': FRED_GRAPHS.US2Y,
    'GDP': FRED_GRAPHS.GDP,
    'UNEMPLOYMENT': FRED_GRAPHS.UNEMPLOYMENT,
    'M2': FRED_GRAPHS.M2,
  };
  
  return indicatorMap[indicator] || null;
};

export default FREDWidget;