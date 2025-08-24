import React from 'react';

const defaultSelectIcon = (
  <svg
    className="h-4 w-4 transform"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onClick: () => void;
  className?: string;
  required?: boolean;
  selectIcon?: React.ReactNode;
  helperText?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  placeholder = 'Select',
  onClick,
  className = '',
  required = false,
  selectIcon = defaultSelectIcon,
  helperText,
}) => (
  <div className={`mb-4 ${className}`}>
    <label className="flex flex-row text-sm font-medium text-gray-600 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
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
    <div
      className="w-full px-2 py-2 border rounded-md flex items-center justify-between cursor-pointer transition-colors"
      onClick={onClick}
    >
      <span className={`text-m ${value ? 'text-black' : 'text-gray-500'} px-1`}>
        {value || placeholder}
      </span>
      {selectIcon}
    </div>
  </div>
);
