import React, { useState } from 'react';
import { colors } from '../constants/colors';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  style,
  className = '',
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyles: React.CSSProperties = {
    fontFamily: "'Work Sans', sans-serif",
    fontSize: '16px',
    lineHeight: '19px',
    color: colors.text.secondary,
    padding: '16px',
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
    if (isFocused || value) return focusedInputStyles;
    return inputStyles;
  };

  return (
    <div style={containerStyles} className={className}>
      <label style={labelStyles}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={getInputStyles()}
      />

      {error && (
        <div
          style={{
            color: colors.status.error.main,
            fontSize: '12px',
            fontFamily: "'Work Sans', sans-serif",
            marginTop: '4px',
            position: 'absolute',
            top: '100%',
            left: '0',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}; 