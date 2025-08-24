import React from 'react';
import { colors } from '../constants/colors';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
  disabled = false,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  // Calculate the percentage of the track that should be filled
  const fillPercentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-600">{label}</label>
        <span className="text-sm">{value}{unit}</span>
      </div>
      <div className="relative">
        <style>
          {`
          .custom-slider {
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            outline: none;
            transition: all 0.2s;
          }
          
          .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: white;
            border: 2px solid ${colors.button.primary.background};
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }
          
          .custom-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: white;
            border: 2px solid ${colors.button.primary.background};
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }
          
          .custom-slider:hover::-webkit-slider-thumb {
            transform: scale(1.1);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          }
          
          .custom-slider:hover::-moz-range-thumb {
            transform: scale(1.1);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          }
          
          .custom-slider:active::-webkit-slider-thumb {
            transform: scale(1.2);
            background: ${colors.button.primary.background};
            border-color: ${colors.button.primary.background};
          }
          
          .custom-slider:active::-moz-range-thumb {
            transform: scale(1.2);
            background: ${colors.button.primary.background};
            border-color: ${colors.button.primary.background};
          }
          
          .custom-slider:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .custom-slider:disabled::-webkit-slider-thumb {
            cursor: not-allowed;
            background: #e5e7eb;
            border-color: #d1d5db;
            box-shadow: none;
          }
          
          .custom-slider:disabled::-moz-range-thumb {
            cursor: not-allowed;
            background: #e5e7eb;
            border-color: #d1d5db;
            box-shadow: none;
          }
          `}
        </style>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-slider"
          style={{
            backgroundImage: `linear-gradient(to right, ${colors.button.primary.background} 0%, ${colors.button.primary.background} ${fillPercentage}%, #e5e7eb ${fillPercentage}%, #e5e7eb 100%)`,
          }}
        />
      </div>
    </div>
  );
}; 