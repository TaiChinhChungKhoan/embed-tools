import React from 'react';
import { Button } from '@embed-tools/components';

const InfoButton = ({ onClick, className = '' }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`mx-2 w-5 h-5 p-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 border border-gray-300 ${className}`}
    >
      <span className="text-xs font-bold">?</span>
    </Button>
  );
};

export default InfoButton; 