/**
 * Centralized color utilities for RS analysis components
 * Consistent color coding where better values get better colors (purple > green > yellow > orange > red)
 */

/**
 * Standard color scale from best to worst
 * Purple = Excellent/Premium
 * Dark Green = Very Good
 * Green = Good
 * Yellow = Neutral/Average
 * Orange = Below Average
 * Red = Poor
 */

/**
 * Color for RS values (0-100 scale)
 * Higher values are better
 */
export const getColorForRSValue = (value) => {
  // Convert 0.0-1.0 to 0-100 scale for better visualization
  const scaledValue = value * 100;
  
  if (scaledValue >= 80) return 'bg-purple-600 text-white'; // Excellent
  if (scaledValue >= 70) return 'bg-green-700 text-white';  // Very good
  if (scaledValue >= 60) return 'bg-green-500 text-white';  // Good
  if (scaledValue >= 50) return 'bg-green-400 text-black';  // Above average
  if (scaledValue >= 40) return 'bg-yellow-400 text-black'; // Average
  if (scaledValue >= 30) return 'bg-orange-400 text-black'; // Below average
  if (scaledValue >= 20) return 'bg-red-400 text-white';    // Poor
  return 'bg-red-600 text-white'; // Very poor
};

/**
 * Color for CRS values (percentage)
 * Positive values are better
 */
export const getColorForCRS = (value) => {
  if (value >= 0.15) return 'bg-purple-600 text-white'; // Excellent outperformance
  if (value >= 0.08) return 'bg-green-700 text-white';  // Very good
  if (value >= 0.03) return 'bg-green-500 text-white';  // Good
  if (value >= -0.03) return 'bg-yellow-400 text-black'; // Neutral
  if (value >= -0.08) return 'bg-orange-400 text-white'; // Below average
  if (value >= -0.15) return 'bg-red-400 text-white';    // Poor
  return 'bg-red-600 text-white'; // Very poor underperformance
};

/**
 * Color for slope values (Fast/Slow)
 * Positive slopes are better
 */
export const getColorForSlope = (value) => {
  if (value >= 0.08) return 'bg-purple-600 text-white';  // Excellent momentum
  if (value >= 0.04) return 'bg-green-700 text-white';   // Very good
  if (value >= 0.01) return 'bg-green-500 text-white';   // Good
  if (value >= -0.01) return 'bg-yellow-400 text-black'; // Neutral
  if (value >= -0.04) return 'bg-orange-400 text-white'; // Declining
  if (value >= -0.08) return 'bg-red-400 text-white';    // Poor decline
  return 'bg-red-600 text-white'; // Very poor decline
};

/**
 * Color for slope delta (Fast - Slow)
 * Positive delta means acceleration (better)
 */
export const getColorForSlopeDelta = (value) => {
  if (value >= 0.04) return 'bg-purple-600 text-white';  // Excellent acceleration
  if (value >= 0.02) return 'bg-green-700 text-white';   // Very good acceleration
  if (value >= 0.005) return 'bg-green-500 text-white';  // Good acceleration
  if (value >= -0.005) return 'bg-yellow-400 text-black'; // Neutral
  if (value >= -0.02) return 'bg-orange-400 text-white'; // Deceleration
  if (value >= -0.04) return 'bg-red-400 text-white';    // Poor deceleration
  return 'bg-red-600 text-white'; // Very poor deceleration
};

/**
 * Color for turn up periods
 * Lower numbers are better (fresher momentum)
 */
export const getColorForTurnUpPeriods = (periods) => {
  if (!periods) return 'bg-gray-100 text-gray-600';
  if (periods <= 3) return 'bg-purple-600 text-white';   // Extremely fresh - premium timing
  if (periods <= 7) return 'bg-green-700 text-white';    // Very fresh - excellent
  if (periods <= 12) return 'bg-green-500 text-white';   // Fresh - good
  if (periods <= 18) return 'bg-yellow-400 text-black';  // Getting old - average
  if (periods <= 25) return 'bg-orange-400 text-white';  // Old - below average
  return 'bg-red-600 text-white'; // Very old - poor timing
};

/**
 * Color for up ratio (percentage of up days)
 * Higher percentages are better
 */
export const getColorForUpRatio = (ratio) => {
  const percentage = ratio * 100;
  if (percentage >= 80) return 'bg-purple-600 text-white';  // Excellent consistency
  if (percentage >= 70) return 'bg-green-700 text-white';   // Very good
  if (percentage >= 60) return 'bg-green-500 text-white';   // Good
  if (percentage >= 50) return 'bg-yellow-400 text-black';  // Average
  if (percentage >= 40) return 'bg-orange-400 text-white';  // Below average
  if (percentage >= 30) return 'bg-red-400 text-white';     // Poor
  return 'bg-red-600 text-white'; // Very poor
};

/**
 * Color for net decayed (weighted net positive bars)
 * Positive values are better
 */
export const getColorForNetDecayed = (value) => {
  if (value >= 8) return 'bg-purple-600 text-white';   // Excellent health
  if (value >= 5) return 'bg-green-700 text-white';    // Very good
  if (value >= 2) return 'bg-green-500 text-white';    // Good
  if (value >= -2) return 'bg-yellow-400 text-black';  // Neutral
  if (value >= -5) return 'bg-orange-400 text-white';  // Below average
  if (value >= -8) return 'bg-red-400 text-white';     // Poor
  return 'bg-red-600 text-white'; // Very poor
};

/**
 * Generic percentage color (0-100%, higher is better)
 */
export const getColorForPercentage = (value, options = {}) => {
  const { 
    excellent = 80, 
    veryGood = 70, 
    good = 60, 
    average = 50, 
    belowAverage = 40,
    poor = 30 
  } = options;
  
  if (value >= excellent) return 'bg-purple-600 text-white';
  if (value >= veryGood) return 'bg-green-700 text-white';
  if (value >= good) return 'bg-green-500 text-white';
  if (value >= average) return 'bg-yellow-400 text-black';
  if (value >= belowAverage) return 'bg-orange-400 text-white';
  if (value >= poor) return 'bg-red-400 text-white';
  return 'bg-red-600 text-white';
};

/**
 * Generic positive/negative color (0 is neutral, positive is better)
 */
export const getColorForPositiveNegative = (value, options = {}) => {
  const { 
    excellentThreshold = 0.1, 
    goodThreshold = 0.05, 
    neutralThreshold = 0.01 
  } = options;
  
  if (value >= excellentThreshold) return 'bg-purple-600 text-white';
  if (value >= goodThreshold) return 'bg-green-700 text-white';
  if (value >= neutralThreshold) return 'bg-green-500 text-white';
  if (value >= -neutralThreshold) return 'bg-yellow-400 text-black';
  if (value >= -goodThreshold) return 'bg-orange-400 text-white';
  if (value >= -excellentThreshold) return 'bg-red-400 text-white';
  return 'bg-red-600 text-white';
};