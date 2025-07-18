import {
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';

export const getSentimentColor = (sentiment) => {
  // lets check if sentiment is a string
  if (typeof sentiment === 'string') {
    if (sentiment.toLowerCase().includes('tích cực') || sentiment.toLowerCase().includes('positive') || sentiment.toLowerCase().includes('bull')) return 'text-green-600';
    if (sentiment.toLowerCase().includes('tiêu cực') || sentiment.toLowerCase().includes('negative') || sentiment.toLowerCase().includes('bear')) return 'text-red-600';
    if (sentiment.toLowerCase().includes('trung tính') || sentiment.toLowerCase().includes('neutral')) return 'text-yellow-600';
    
  }
  return 'text-gray-600';
};

export const getRiskColor = (riskLevel) => {
  // lets use string contains to check if the string contains the word "cao" or "trung bình" or "thấp"
  if (typeof riskLevel === 'string') {
    if (riskLevel.toLowerCase().includes('cao')) return 'text-red-600';
    if (riskLevel.toLowerCase().includes('trung bình')) return 'text-yellow-600';
    if (riskLevel.toLowerCase().includes('thấp')) return 'text-green-600';
  }
  return 'text-gray-600';
}; 

export const getCrsColor = (crs) => {
  if (typeof crs === 'number') {
    if (crs > 0) return 'text-green-600';
    if (crs < 0) return 'text-red-600';
  }
  return 'text-gray-600';
};

export const getCrsStatusColor = (crsStatus) => {
  if (typeof crsStatus === 'string') {
    if (crsStatus.toLowerCase().includes('vượt')) return 'text-green-600';
    if (crsStatus.toLowerCase().includes('kém')) return 'text-red-600';
  }
  return 'text-gray-600';
};

export const getRsTrendColor = (rsTrend) => {
  // lets use string contains to check if the string contains the word "tăng" or "giảm"
  if (typeof rsTrend === 'string') {
    if (rsTrend.toLowerCase().includes('tăng')) return 'text-green-600';
    if (rsTrend.toLowerCase().includes('giảm')) return 'text-red-600';
  }
  return 'text-gray-600';
};

export const getRsChangeColor = (rsChange) => {
  if (typeof rsChange === 'number') {
    if (rsChange > 0) return 'text-green-600';
    if (rsChange < 0) return 'text-red-600';
  }
  return 'text-gray-600';
};

export const getStrengthScoreColor = (strengthScore) => {
  if (typeof strengthScore === 'number') {
    if (strengthScore > 0) return 'text-green-600';
    if (strengthScore < 0) return 'text-red-600';
  }
  return 'text-gray-600';
};

export const getRecentVolumeRatioColor = (recentVolumeRatio) => {
  if (typeof recentVolumeRatio === 'number') {
    if (recentVolumeRatio > 1) return 'text-green-600';
    if (recentVolumeRatio < 1) return 'text-red-600';
  }
  return 'text-gray-600';
};

export const getQuadrantColor = (quadrant) => {
  if (typeof quadrant === 'string') {
    if (quadrant.toLowerCase().includes('leading') || quadrant.toLowerCase().includes('dẫn dắt')) return 'text-green-600';
    if (quadrant.toLowerCase().includes('improving') || quadrant.toLowerCase().includes('cải thiện')) return 'text-blue-600';
    if (quadrant.toLowerCase().includes('weakening') || quadrant.toLowerCase().includes('suy yếu')) return 'text-yellow-600';
    if (quadrant.toLowerCase().includes('lagging') || quadrant.toLowerCase().includes('tụt hậu')) return 'text-red-600';
  }
  return 'text-gray-600';
};

export const getDirectionColor = (direction) => {
  if (typeof direction === 'string') {
    if (direction.toLowerCase().includes('tăng')) return 'text-green-600';
    if (direction.toLowerCase().includes('giảm')) return 'text-red-600';
    if (direction.toLowerCase().includes('đứng yên')) return 'text-yellow-600';
  }
  return 'text-gray-600';
};

export const getDirectionIconAndColor = (direction) => {
  if (!direction) return { icon: TrendingDown, color: 'text-gray-600' };
  if (direction === 'Tăng trưởng mạnh' || direction === 'Tăng trưởng')
    return { icon: TrendingUp, color: 'text-green-600' };
  if (direction === 'Đứng yên')
    return { icon: Activity, color: 'text-yellow-600' };
  if (direction === 'Suy giảm' || direction === 'Suy giảm mạnh')
    return { icon: TrendingDown, color: 'text-red-600' };
  return { icon: TrendingDown, color: 'text-gray-600' };
};