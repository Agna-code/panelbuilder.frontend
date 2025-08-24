import React from 'react';
import { colors } from '../constants/colors';

// Dropdown component for consistent select inputs
export const Dropdown = <T extends Record<string, any>>({
  label,
  field,
  value,
  onChange,
  placeholder,
  options = [],
  onOptionChange,
  disabled = false,
  outerClassName = 'mb-4',
  helperText,
}: {
  label: string;
  field: keyof T;
  value: string;
  onChange: (field: keyof T, value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  onOptionChange?: (field: keyof T, value: string) => void;
  disabled?: boolean;
  outerClassName?: string;
  helperText?: string;
}) => (
  <div className={outerClassName}>
    <label className="flex flex-row text-sm font-medium text-gray-600 mb-1">
      {label}
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
    <div className="relative">
      <select
        value={value}
        onChange={(e) => {
          onChange(field, e.target.value);
          if (onOptionChange) {
            onOptionChange(field, e.target.value);
          }
        }}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md appearance-none pr-8 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        style={{ borderColor: colors.border.light }}
      >
        <option disabled value="">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
); 