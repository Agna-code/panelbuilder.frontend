import React from 'react';
import { colors } from '../constants/colors';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, disabled = false }) => (
  <div className="flex items-center justify-between py-2">
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div
        style={{
          backgroundColor: checked ? colors.toggle.active : colors.toggle.inactive,
          transition: 'background-color 0.4s',
        }}
        className="relative w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-4"
      >
        <div
          style={{
            backgroundColor: colors.toggle.handle,
            borderColor: colors.border.medium,
            transform: checked ? 'translateX(20px)' : 'translateX(2px)',
            transition: 'transform 0.4s',
          }}
          className="absolute top-[2px] left-[2px] w-5 h-5 border rounded-full"
        />
      </div>
    </label>
  </div>
);
