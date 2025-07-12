import React from 'react';

// A component for the zoom controls
const ZoomControls = ({ onZoomIn, onZoomOut, onReset, zoomLevel }) => {
  const buttonClass = "w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
      <button onClick={onZoomIn} className={buttonClass} disabled={zoomLevel >= 10}>+</button>
      <button onClick={onZoomOut} className={buttonClass} disabled={zoomLevel <= 1}>-</button>
      <button onClick={onReset} className={buttonClass} disabled={zoomLevel === 1}>⟲</button>
    </div>
  );
};

export default ZoomControls; 