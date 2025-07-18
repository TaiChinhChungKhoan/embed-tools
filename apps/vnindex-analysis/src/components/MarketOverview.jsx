import React from 'react';
import {
  MarketHeader,
  MarketPulseBanner,
  SummaryCards,
  SectorPerformance,
  ActionableStrategies,
  MoneyFlowAnalysis,
  StockLists,
  MarketCapRotation
} from './market-overview';

const MarketOverview = ({ marketOverview, getSentimentColor, breadth_detail, industries, analyticsData }) => {
  // Extract investment strategies from analytics data
  const investmentStrategies = analyticsData?.insights?.investment_strategies || {};
  const detailedAnalysis = analyticsData?.insights?.detailed_analysis || {};
  
  if (!marketOverview || !marketOverview.title) return null;

  // Calculate composite market health score
  const getMarketHealthScore = () => {
    const breadthScore = marketOverview.market_health?.key_metrics?.market_breadth?.score || 0;
    const momentumScore = marketOverview.market_regime?.momentum_score || 0;
    const confidence = marketOverview.market_regime?.confidence || 0;
    
    return Math.round((breadthScore + momentumScore) * 50 + confidence * 0.5);
  };

  // Get top and bottom performing sectors
  const getTopBottomSectors = () => {
    if (!industries || !Array.isArray(industries)) return { top: [], bottom: [] };
    
    const sortedIndustries = [...industries].sort((a, b) => {
      const aScore = a.metrics?.current_rs || 0;
      const bScore = b.metrics?.current_rs || 0;
      return bScore - aScore;
    });
    
    return {
      top: sortedIndustries.slice(0, 3),
      bottom: sortedIndustries.slice(-3).reverse()
    };
  };

  const marketHealthScore = getMarketHealthScore();
  const { top: topSectors, bottom: bottomSectors } = getTopBottomSectors();
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
      
      {/* Header & Global Context */}
      <MarketHeader marketOverview={marketOverview} />

      {/* Market Pulse Banner */}
      <MarketPulseBanner 
        marketOverview={marketOverview} 
        marketHealthScore={marketHealthScore} 
      />

      {/* Key Summary Cards */}
      <SummaryCards marketOverview={marketOverview} />

      {/* Sector-Level Snapshot & Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Sector Performance Heatmap - Takes 2 columns */}
        <SectorPerformance
          marketOverview={marketOverview}
          topSectors={topSectors}
          bottomSectors={bottomSectors}
          industries={industries}
          analyticsData={analyticsData}
          getSentimentColor={getSentimentColor}
        />

        {/* Actionable Strategies - Takes 1 column */}
        <ActionableStrategies 
          marketOverview={marketOverview} 
          investmentStrategies={investmentStrategies}
          detailedAnalysis={detailedAnalysis}
        />
      </div>

      {/* Compact Detail Sections */}
      <div className="space-y-2">
        {/* Market Cap Rotation Details */}
        <MarketCapRotation marketOverview={marketOverview} />
        {/* Money Flow Analysis */}
        <MoneyFlowAnalysis 
          marketOverview={marketOverview} 
          analyticsData={analyticsData}
          topSectors={topSectors}
          bottomSectors={bottomSectors}
          industries={industries}
        />

        {/* Full Stock Lists - Only this one is expandable since it's longer */}
        {/* <StockLists 
          topSectors={topSectors}
          bottomSectors={bottomSectors}
          industries={industries}
        /> */}
      </div>
    </div>
  );
};

export default MarketOverview; 