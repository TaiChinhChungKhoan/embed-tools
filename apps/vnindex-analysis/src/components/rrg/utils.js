// Generate consistent color for each series
export const getSeriesColor = (id, index, total) => {
  const hue = (index * 360) / total;
  return `hsl(${hue}, 70%, 50%)`;
};

// Constants
export const MAX_SERIES = 50; 