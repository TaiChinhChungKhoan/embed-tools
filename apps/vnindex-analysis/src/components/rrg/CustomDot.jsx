import React, { useState } from 'react';

// Custom dot component for trail points
const CustomDot = (props) => {
  const { cx, cy, payload, color, onHover } = props;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isHovered ? 4 : 3}
      fill={color}
      fillOpacity={isHovered ? 0.8 : 0.4}
      stroke={color}
      strokeWidth={isHovered ? 1 : 0}
      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        onHover(payload, cx, cy);
      }}
      onMouseMove={(e) => {
        e.stopPropagation();
      }}
    />
  );
};

export default CustomDot; 