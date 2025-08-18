import React from 'react';
import { colors } from '../constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'custom';

interface LoadingButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
  wrapperStyle?: React.CSSProperties;
  wrapperClassName?: string;
  customButtonStyle?: React.CSSProperties;
  fullWidth?: boolean;
  height?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  isLoading = false,
  loadingText,
  variant = 'primary',
  children,
  wrapperStyle,
  wrapperClassName = '',
  customButtonStyle,
  fullWidth = false,
  height = 'auto'
}) => {
  const baseClasses = 'px-4 py-2 rounded-md transition-all duration-200 ease-in-out focus:outline-none flex items-center justify-center';
  
  // Variant-specific styling
  const getVariantStyles = (variant: ButtonVariant) => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.button.primary.background,
          color: colors.button.primary.text,
          border: 'none',
          fontFamily: "'Work Sans', sans-serif",
          fontWeight: '500',
          fontSize: '16px',
          lineHeight: '19px',
          '&:hover': {
            backgroundColor: colors.button.primary.hover,
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }
        };
      case 'secondary':
        return {
          backgroundColor: colors.button.secondary.background,
          color: colors.button.secondary.text,
          border: 'none',
          fontFamily: "'Work Sans', sans-serif",
          fontWeight: '500',
          fontSize: '16px',
          lineHeight: '19px',
          '&:hover': {
            backgroundColor: colors.button.secondary.hover,
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }
        };
      case 'success':
        return {
          backgroundColor: colors.status.success.main,
          color: colors.text.white,
          border: 'none',
          fontFamily: "'Work Sans', sans-serif",
          fontWeight: '500',
          fontSize: '16px',
          lineHeight: '19px',
          '&:hover': {
            backgroundColor: colors.status.success.dark,
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }
        };
      case 'danger':
        return {
          backgroundColor: colors.status.error.main,
          color: colors.text.white,
          border: 'none',
          fontFamily: "'Work Sans', sans-serif",
          fontWeight: '500',
          fontSize: '16px',
          lineHeight: '19px',
          '&:hover': {
            backgroundColor: colors.status.error.dark,
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }
        };
      default:
        return {};
    }
  };
  
  // Determine button styling based on state and variant
  const buttonClasses = disabled || isLoading
    ? `${baseClasses} opacity-70 cursor-not-allowed ${className}`
    : `${baseClasses} hover:opacity-95 ${className}`;

  const variantStyles = variant !== 'custom' ? getVariantStyles(variant) : {};

  // Border color for spinner based on text color
  const spinnerColor = variant === 'secondary' ? colors.button.secondary.text : colors.text.white;

  // Combined button styles
  const finalButtonStyle = {
    ...variantStyles,
    ...customButtonStyle,
    width: fullWidth ? '100%' : 'auto',
    height: height !== 'auto' ? height : 'auto',
  };

  // Wrapper styling for positioned buttons
  const wrapperStyles = {
    ...wrapperStyle,
  };

  const ButtonElement = (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      style={finalButtonStyle}
    >
      {isLoading ? (
        <>
          <div 
            className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 mr-2"
            style={{ borderColor: spinnerColor }}
          ></div>
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </button>
  );

  // If wrapper styles are provided, wrap the button
  if (wrapperStyle || wrapperClassName) {
    return (
      <div style={wrapperStyles} className={wrapperClassName}>
        {ButtonElement}
      </div>
    );
  }

  return ButtonElement;
}; 