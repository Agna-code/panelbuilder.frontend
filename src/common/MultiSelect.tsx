import React, { useState, useRef, useEffect } from 'react';
import { colors } from '../constants/colors';

export const MultiSelect = <T extends Record<string, any>>({
  label,
  field,
  values,
  onChange,
  placeholder,
  options = [],
  minSelections,
  maxSelections,
  disabled = false,
}: {
  label: string;
  field: keyof T;
  values: string[];
  onChange: (field: keyof T, values: string[]) => void;
  placeholder: string;
  options: { value: string; label: string; disabled?: boolean }[];
  minSelections?: number;
  maxSelections?: number;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string, isOptionDisabled?: boolean) => {
    if (disabled || isOptionDisabled) return;

    const isSelected = values.includes(optionValue);
    let newValues: string[];

    if (isSelected) {
      newValues = values.filter(v => v !== optionValue);
    } else {
      if (maxSelections && values.length >= maxSelections) return;
      newValues = [...values, optionValue];
    }

    onChange(field, newValues);
  };

  const handleRemoveValue = (valueToRemove: string) => {
    const option = options.find(opt => opt.value === valueToRemove);
    if (option?.disabled) return;
    onChange(field, values.filter(v => v !== valueToRemove));
  };

  const isOptionSelected = (value: string) => values.includes(value);
  const selectionCount = values.length;
  const isMinNotMet = minSelections && selectionCount < minSelections;
  const isMaxReached = maxSelections && selectionCount >= maxSelections;

  const selectedLabels = values
    .map(value => options.find(opt => opt.value === value)?.label)
    .filter(Boolean)
    .join(', ');

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
        {(minSelections || maxSelections) && (
          <span className="text-xs text-gray-500 ml-2">
            {`(${selectionCount}${minSelections ? ` min: ${minSelections}` : ''}${maxSelections ? ` max: ${maxSelections}` : ''})`}
          </span>
        )}
      </label>
      <div className="relative" ref={dropdownRef}>
        <div
          className={`w-full px-3 py-2 border rounded-md cursor-pointer ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          } ${isMinNotMet ? 'border-yellow-500' : ''}`}
          style={{ borderColor: isMinNotMet ? undefined : colors.border.light }}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex justify-between items-center">
            <div className="truncate">
              {values.length > 0 ? selectedLabels : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
            <div className="pointer-events-none flex items-center px-2">
              <svg
                className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
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

        {isOpen && (
          <div 
            className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50"
            style={{ 
              borderColor: colors.border.light,
              maxHeight: '150px',
              overflowY: 'auto'
            }}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-2 cursor-pointer ${
                  option.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' :
                  isOptionSelected(option.value) ? 'hover:bg-opacity-75' : 'hover:bg-opacity-10'
                } ${isMaxReached && !isOptionSelected(option.value) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => toggleOption(option.value, option.disabled)}
                style={{
                  backgroundColor: option.disabled ? undefined : 
                    isOptionSelected(option.value) ? `${colors.primary.light}40` : 'transparent'
                }}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isOptionSelected(option.value)}
                    disabled={option.disabled}
                    className="mr-2"
                    style={{
                      accentColor: colors.primary.main
                    }}
                    readOnly
                  />
                  <span className={option.disabled ? 'text-gray-400' : ''}>
                    {option.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 mt-1">
        {isMaxReached && <span className="text-yellow-600">Maximum selections reached</span>}
        {isMinNotMet && <span className="text-yellow-600">Please select at least {minSelections} options</span>}
      </div>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {values.map((value) => {
            const option = options.find(opt => opt.value === value);
            return option && (
              <span
                key={value}
                className={`inline-flex items-center px-2 py-1 rounded-md text-sm ${
                  option.disabled ? 'bg-gray-100 text-gray-500' : ''
                }`}
                style={{
                  backgroundColor: option.disabled ? undefined : `${colors.primary.light}40`,
                  color: option.disabled ? undefined : colors.primary.main
                }}
              >
                {option.label}
                {!option.disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(value)}
                    className="ml-1 hover:opacity-75"
                    style={{ color: colors.primary.dark }}
                  >
                    ×
                  </button>
                )}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}; 