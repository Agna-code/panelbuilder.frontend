import React from 'react';
import { colors } from '../constants/colors';

interface CircularProgressProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info';
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 'medium',
  color = 'primary',
  className = ''
}) => {
  // Size mapping
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  // Color mapping
  const colorMap = {
    primary: colors.primary.main,
    secondary: colors.secondary.main,
    success: colors.status.success.main,
    error: colors.status.error.main,
    info: colors.status.info.main
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-b-2 ${sizeMap[size]}`}
        style={{ borderColor: colorMap[color] }}
      />
    </div>
  );
}; 