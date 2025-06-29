// Event visuals utility for natal-events
// Similar to astro-events but adapted for natal chart events with good/bad meanings

import { getEventColor as getCentralizedEventColor, getEventVisuals as getCentralizedEventVisuals, getEventMeaning as getCentralizedEventMeaning, ASPECT_COLORS } from '@embed-tools/astro-utils';

// Re-export the centralized functions for backward compatibility
export const getEventColor = getCentralizedEventColor;
export const getEventVisuals = getCentralizedEventVisuals;
export const getEventMeaning = getCentralizedEventMeaning;

// Export aspect colors for direct access
export { ASPECT_COLORS };

export const formatEventDate = d => d.toLocaleString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit' 
});

// Get meaning description for tooltips and UI
export const getMeaningDescription = (meaning) => {
  const descriptions = {
    'harmonious': 'Harmonious - Generally positive influence',
    'challenging': 'Challenging - May bring difficulties or tension',
    'powerful': 'Powerful - Strong influence, can be positive or negative',
    'significant': 'Significant - Important turning point',
    'new_beginning': 'New Beginning - Fresh start, new opportunities',
    'culmination': 'Culmination - Peak or completion of a cycle',
    'neutral': 'Neutral - Balanced influence'
  };
  
  return descriptions[meaning] || descriptions.neutral;
};

// Get CSS classes for styling based on meaning
export const getMeaningClasses = (meaning) => {
  const classes = {
    'harmonious': 'border-green-500 bg-green-50',
    'challenging': 'border-red-500 bg-red-50',
    'powerful': 'border-orange-500 bg-orange-50',
    'significant': 'border-purple-500 bg-purple-50',
    'new_beginning': 'border-blue-500 bg-blue-50',
    'culmination': 'border-yellow-500 bg-yellow-50',
    'neutral': 'border-gray-500 bg-gray-50'
  };
  
  return classes[meaning] || classes.neutral;
}; 