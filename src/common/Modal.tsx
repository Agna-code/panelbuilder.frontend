import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className = '', closeOnOutsideClick = true }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9998] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={closeOnOutsideClick ? onClose : undefined}
        />

        <div className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );

  // Render modal in a portal to ensure it appears above all other content
  return createPortal(modalContent, document.body);
}; 