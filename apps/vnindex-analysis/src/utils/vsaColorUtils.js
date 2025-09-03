/**
 * Centralized color utilities for VSA analysis components
 * Consistent color coding where better values get better colors (purple > green > yellow > orange > red)
 */

/**
 * Color for VSA score values
 * Higher absolute values indicate stronger signals
 * Positive values are bullish, negative values are bearish
 */
export const getColorForVSAScore = (value) => {
  if (value === null || value === undefined) {
    return 'bg-gray-100 text-gray-600';
  }

  // Negative values - all red
  if (value < 0) {
    return 'bg-red-500 text-white';
  }
  
  // Positive values - green gradient based on magnitude
  if (value >= 8) {
    return 'bg-purple-600 text-white';    // Excellent
  }
  
  if (value >= 5) {
    return 'bg-green-700 text-white';     // Very good
  }
  
  if (value >= 3) {
    return 'bg-green-500 text-white';     // Good
  }
  
  if (value >= 1) {
    return 'bg-green-400 text-black';     // Moderate
  }
  
  // Near zero (0 to 1)
  return 'bg-yellow-400 text-black';      // Neutral/weak
};

/**
 * Color for VSA pattern types
 */
export const getColorForVSAPattern = (pattern) => {
  if (!pattern) return 'bg-gray-100 text-gray-600';
  
  switch (pattern.toLowerCase()) {
    case 'sideways consolidation':
      return 'bg-blue-100 text-blue-800';
    case 'mixed signals':
      return 'bg-yellow-100 text-yellow-800';
    case 'uptrend':
      return 'bg-green-100 text-green-800';
    case 'downtrend':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Color for VSA recommendations
 */
export const getColorForVSARecommendation = (recommendation) => {
  if (!recommendation) return 'bg-gray-100 text-gray-600';
  
  switch (recommendation.toLowerCase()) {
    case 'buy signal':
      return 'bg-green-600 text-white';
    case 'sell signal':
      return 'bg-red-600 text-white';
    case 'no clear signal':
      return 'bg-yellow-500 text-black';
    default:
      return 'bg-gray-500 text-white';
  }
};

/**
 * Color for at-zone indicator
 */
export const getColorForAtZone = (atZone) => {
  return atZone 
    ? 'bg-yellow-500 text-black'
    : 'bg-gray-300 text-gray-600';
};