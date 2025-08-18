import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Toast, ToastType } from '../common/Toast';

interface ToastContextType {
	showToast: (message: string, type: ToastType) => void;
	setToast: (toast: { message: string; type: ToastType }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

	const showToast = useCallback((message: string, type: ToastType) => {
		setToast({ message, type });
	}, []);

	const hideToast = useCallback(() => {
		setToast(null);
	}, []);

	useEffect(() => {
		const handleToastEvent = (event: Event) => {
			const detail = (event as CustomEvent<{ message: string; type: ToastType }>).detail;
			if (detail?.message && detail?.type) {
				showToast(detail.message, detail.type);
			}
		};

		window.addEventListener('show-toast', handleToastEvent as EventListener);
		return () => window.removeEventListener('show-toast', handleToastEvent as EventListener);
	}, [showToast]);

	return (
		<ToastContext.Provider value={{ showToast, setToast }}>
			{children}
			{toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
};


