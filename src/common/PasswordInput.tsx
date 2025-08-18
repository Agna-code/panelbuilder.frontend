import React, { useState } from 'react';
import { colors } from '../constants/colors';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  style?: React.CSSProperties;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  required = false,
  error,
  style,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePasswordVisibility();
    }
  };

  const inputStyles: React.CSSProperties = {
    fontFamily: "'Work Sans', sans-serif",
    fontSize: '16px',
    lineHeight: '19px',
    color: colors.text.secondary,
    padding: '16px 48px 16px 16px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border.dark,
    borderRadius: '4px',
    width: '100%',
    height: '56px',
    boxSizing: 'border-box',
    backgroundColor: colors.background.primary,
    outline: 'none',
    transition: 'border-color 0.15s ease-in-out, border-width 0.15s ease-in-out',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    WebkitFontSmoothing: 'subpixel-antialiased',
    ...style,
  };

  const focusedInputStyles: React.CSSProperties = {
    ...inputStyles,
    borderWidth: '2px',
    borderColor: colors.primary.main,
  };

  const errorInputStyles: React.CSSProperties = {
    ...inputStyles,
    borderWidth: '2px',
    borderColor: colors.status.error.main,
  };

  const labelStyles: React.CSSProperties = {
    fontFamily: "'Work Sans', sans-serif",
    fontSize: '13.33px',
    lineHeight: '24px',
    color: colors.text.primary,
    fontWeight: '400',
    position: 'absolute',
    top: '-12px',
    left: '12px',
    background: colors.background.primary,
    padding: '0 4px',
    zIndex: 1,
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    ...style,
  };

  const getInputStyles = () => {
    if (error) return errorInputStyles;
    if (isFocused || (!!value && value.trim() !== '')) return focusedInputStyles;
    return inputStyles;
  };

  return (
    <div style={containerStyles} className={className}>
      <label style={labelStyles}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={getInputStyles()}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            minWidth: '24px',
            minHeight: '24px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Toggle password visibility"
          aria-pressed={showPassword}
          tabIndex={0}
        >
          {showPassword ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: colors.text.secondary }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: colors.text.secondary }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <div
          style={{
            color: colors.status.error.main,
            fontSize: '12px',
            fontFamily: "'Work Sans', sans-serif",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}; 