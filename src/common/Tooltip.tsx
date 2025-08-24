import React, { useState } from 'react';
import { colors } from '../constants/colors';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 px-2 py-1 text-xs text-${colors.text.white} bg-${colors.secondary.dark} rounded shadow-lg whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2`}>
          {content}
          <div className={`absolute w-2 h-2 bg-${colors.secondary.dark} transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2`}></div>
        </div>
      )}
    </div>
  );
}; 