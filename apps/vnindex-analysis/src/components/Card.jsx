import React from 'react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-5 transition-all duration-300 h-full ${className}`}>
    {children}
  </div>
);

export default Card; 