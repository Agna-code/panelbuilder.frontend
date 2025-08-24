import React from 'react';

interface NumericInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  label?: string;
  tooltip?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  unit?: {
    value: string;
    position?: 'suffix' | 'inline';
    format?: (value: string | undefined) => string;
  };
}

export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  label,
  tooltip,
  min = 0,
  max,
  step = 1,
  className = '',
  inputClassName = '',
  disabled = false,
  placeholder = '',
  unit,
}) => {
  const handleIncrement = () => {
    const currentValue = parseInt(value || '0');
    if (max === undefined || currentValue < max) {
      onChange((currentValue + step).toString());
    }
  };

  const handleDecrement = () => {
    const currentValue = parseInt(value || '0');
    if (currentValue > min) {
      onChange((currentValue - step).toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    if (numericValue === '') {
      onChange('');
      return;
    }

    const parsedValue = parseInt(numericValue);
    if (max !== undefined && parsedValue > max) {
      onChange(max.toString());
    } else if (parsedValue < min) {
      onChange(min.toString());
    } else {
      onChange(parsedValue.toString());
    }
  };

  const displayValue = unit?.format ? unit.format(value) : value;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1">
          {label}
          {tooltip && (
            <span
              className="ml-1 text-xs text-blue-600"
              title={tooltip}
            >
              ⓘ
            </span>
          )}
        </label>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="h-[38px] w-[38px] flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleDecrement}
          disabled={disabled || parseInt(value || '0') <= min}
        >
          -
        </button>
        <div className="relative w-[80px]">
          <input
            type="text"
            value={unit?.position === 'inline' ? displayValue : value}
            onChange={handleInputChange}
            className={`w-full h-[38px] border rounded-md text-center ${inputClassName} ${
              disabled ? 'bg-gray-100' : ''
            }`}
            disabled={disabled}
            placeholder={placeholder}
          />
          {unit?.position === 'inline' && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
              {unit.value}
            </span>
          )}
        </div>
        <button
          type="button"
          className="h-[38px] w-[38px] flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && parseInt(value || '0') >= max)}
        >
          +
        </button>
        {unit?.position !== 'inline' && unit?.value && (
          <span className="text-sm text-gray-500">{unit.value}</span>
        )}
      </div>
    </div>
  );
}; 