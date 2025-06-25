import React from 'react';
import { SVG_PATHS } from '../data/constants';

const ElementIcon = ({ element, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    'Kim': 'text-gray-400',
    'Mộc': 'text-green-600',
    'Thủy': 'text-blue-600',
    'Hỏa': 'text-red-600',
    'Thổ': 'text-yellow-600'
  };

  const svgPath = SVG_PATHS[element];
  if (!svgPath) return null;

  return (
    <svg 
      className={`${sizeClasses[size]} ${colorClasses[element] || ''} ${className} transition-all duration-300 hover:scale-110`}
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d={svgPath} />
    </svg>
  );
};

export default ElementIcon; 