// Generate consistent color for each series
export const getSeriesColor = (id, index, total) => {
  const hue = (index * 360) / total;
  return `hsl(${hue}, 70%, 50%)`;
};

// Constants
export const MAX_SERIES = 50;

// RRG quadrant calculation
export function getRRGQuadrant(rsRatio, rsMomentum) {
  // Both axes use 100 as neutral
  if (rsRatio >= 100 && rsMomentum >= 100) return 'Leading';
  if (rsRatio >= 100 && rsMomentum < 100) return 'Weakening';
  if (rsRatio < 100 && rsMomentum < 100) return 'Lagging';
  if (rsRatio < 100 && rsMomentum >= 100) return 'Improving';
  return 'Unknown';
}

// RRG RS-Ratio color helper (same as heatmap logic)
export function getRRGStrengthColor(rsScore) {
  if (rsScore === null || typeof rsScore === 'undefined') return 'bg-gray-400 dark:bg-gray-600';
  if (rsScore >= 110) return 'bg-green-700';
  if (rsScore >= 105) return 'bg-green-600';
  if (rsScore > 100) return 'bg-green-500';
  if (rsScore === 100) return 'bg-yellow-500';
  if (rsScore >= 95) return 'bg-red-400';
  if (rsScore >= 90) return 'bg-red-500';
  return 'bg-red-700';
} 