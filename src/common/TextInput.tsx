import React from 'react';
import { colors } from '../constants/colors';

// Input component for consistent text inputs
export const TextInput = <T extends Record<string, any>>({
  label,
  field,
  value,
  onChange,
  placeholder = '',
  isEditable = true,
  required = false,
  outerClassName = 'mb-4',
  helperText,
  ...props
}: {
  label: string;
  field: keyof T;
  value: string;
  onChange: (field: keyof T, value: string) => void;
  placeholder?: string;
  isEditable?: boolean;
  outerClassName?: string;
  helperText?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => (
  <div className={outerClassName}>
    <label className="flex flex-row text-sm font-medium text-gray-600 mb-1">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
      {helperText && (
        <span
          className="text-gray-400 cursor-help ml-1"
          title={helperText}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      disabled={!isEditable}
      className={`w-full px-3 py-2 border rounded-md ${
        !isEditable ? 'bg-gray-100 cursor-not-allowed' : ''
      } ${props.className || ''}`}
      style={{ borderColor: colors.border.light, ...props.style }}
      {...props}
      required={required}
    />
  </div>
); 