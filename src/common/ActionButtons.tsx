import React from 'react';
import { colors } from '../constants/colors';

interface ActionButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const EditButton: React.FC<ActionButtonProps> = ({ onClick, className, disabled, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`p-1 ${disabled ? 'opacity-50 cursor-not-allowed' : `text-${colors.secondary.main} hover:text-${colors.secondary.dark}`} ${className || ''}`}
    title="Edit"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  </button>
);

export const ConfigureButton: React.FC<ActionButtonProps> = ({ onClick, className, disabled, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`p-1 ${disabled ? 'opacity-50 cursor-not-allowed' : `text-${colors.secondary.main} hover:text-${colors.secondary.dark}`} ${className || ''}`}
    title="Configure"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 18h16" />
      <circle cx="16" cy="6" r="1.5" strokeWidth="2" />
      <circle cx="8" cy="12" r="1.5" strokeWidth="2" />
      <circle cx="12" cy="18" r="1.5" strokeWidth="2" />
    </svg>
  </button>
);

export const CloneButton: React.FC<ActionButtonProps> = ({ onClick, className, disabled, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`p-1 ${disabled ? 'opacity-50 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'} ${className || ''}`}
    title="Clone"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  </button>
);

export const DeleteButton: React.FC<ActionButtonProps> = ({ onClick, className, disabled, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`p-1 ${disabled ? 'opacity-50 cursor-not-allowed' : `text-${colors.status.error.main} hover:text-${colors.status.error.dark}`} ${className || ''}`}
    title="Delete"
  >
    <svg className="w-5 h-5" fill="none" stroke={colors.status.error.main} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  </button>
); 