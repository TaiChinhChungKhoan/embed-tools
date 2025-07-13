export const getSentimentColor = (sentiment) => {
  if (sentiment?.includes('tích cực') || sentiment?.includes('positive') || sentiment?.includes('bull')) return 'text-green-600';
  if (sentiment?.includes('tiêu cực') || sentiment?.includes('negative') || sentiment?.includes('bear')) return 'text-red-600';
  if (sentiment?.includes('trung tính') || sentiment?.includes('neutral')) return 'text-yellow-600';
  return 'text-gray-600';
};

export const getRiskColor = (riskLevel) => {
  if (riskLevel === 'High' || riskLevel === 'HIGH' || riskLevel === 'CRITICAL') return 'text-red-600';
  if (riskLevel === 'Medium' || riskLevel === 'MEDIUM') return 'text-yellow-600';
  if (riskLevel === 'Low' || riskLevel === 'LOW') return 'text-green-600';
  return 'text-gray-600';
}; 