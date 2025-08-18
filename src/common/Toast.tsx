import React, { useEffect, useState } from 'react';
import { colors } from '../constants/colors';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
	message: string;
	type: ToastType;
	onClose: () => void;
}

const getToastStyles = (type: ToastType): React.CSSProperties => {
	switch (type) {
		case 'success':
			return { background: colors.status.success.main };
		case 'error':
			return { background: colors.status.error.main };
		case 'warning':
			return { background: colors.status.warning.main };
		case 'info':
		default:
			return { background: colors.status.info.main };
	}
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const enter = setTimeout(() => setVisible(true), 10);
		const autoHide = setTimeout(() => {
			setVisible(false);
			setTimeout(onClose, 220);
		}, 3000);
		return () => {
			clearTimeout(enter);
			clearTimeout(autoHide);
		};
	}, [onClose]);

	return (
		<div
			role="status"
			aria-live="polite"
			className={"fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] z-[9999]"}
			style={{
				transform: `translateY(${visible ? '0' : '12px'})`,
				opacity: visible ? 1 : 0,
				transition: 'opacity 180ms ease, transform 180ms ease',
				color: colors.text.white,
				...getToastStyles(type),
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
				<span
					style={{
						fontFamily: "'Work Sans', sans-serif",
						fontSize: 14,
						lineHeight: '18px',
						fontWeight: 500,
					}}
				>
					{message}
				</span>
				<button
					onClick={onClose}
					aria-label="Close notification"
					style={{
						marginLeft: 'auto',
						background: 'rgba(255,255,255,0.15)',
						border: 'none',
						cursor: 'pointer',
						color: colors.text.white,
						borderRadius: 6,
						padding: '2px 6px',
					}}
				>
					✕
				</button>
			</div>
		</div>
	);
};

export default Toast;


