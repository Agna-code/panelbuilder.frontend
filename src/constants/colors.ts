export const colors = {
  // Primary Colors
  primary: {
    main: '#378258', // green-600
    light: '#68D391', // green-400
    dark: '#276749', // green-800
    mint: '#ECF6F1', //green-10
  },
  
  // Secondary Colors
  secondary: {
    main: '#4A5568', // gray-600
    light: '#718096', // gray-500
    dark: '#2D3748', // gray-700
  },
  
  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC', // gray-50
    tertiary: '#EDF2F7', // gray-100
    overlay: 'rgba(0, 0, 0, 0.5)', // black with opacity
  },
  
  // Text Colors
  text: {
    primary: '#2D3748', // gray-800
    secondary: '#4A5568', // gray-600
    tertiary: '#718096', // gray-500
    white: '#FFFFFF',
  },
  
  // Border Colors
  border: {
    light: '#E2E8F0', // gray-200
    medium: '#CBD5E0', // gray-300
    dark: '#A0AEC0', // gray-400
  },
  
  // Status Colors
  status: { 
    success: {
      main: '#38A169', // green-600
      light: '#68D391', // green-400
      dark: '#276749', // green-800
    },
    error: {
      main: '#E53E3E', // red-600
      light: '#FEB2B2', // red-300
      dark: '#C53030', // red-700
    },
    warning: {
      main: '#ECC94B', // yellow-500
      light: '#F6E05E', // yellow-400
      dark: '#B7791F', // yellow-700
    },
    info: {
      main: '#4299E1', // blue-500
      light: '#63B3ED', // blue-400
      dark: '#2B6CB0', // blue-700
    },
  },
  
  // Button Colors
  button: {
    primary: {
      background: '#44A26E', // green-600
      hover: '#08836C', // green-800
      text: '#080808',
    },
    secondary: {
      background: '#E2E8F0', // gray-200
      hover: '#CBD5E0', // gray-300
      text: '#4A5568', // gray-600
    },
    danger: {
      background: '#F56565', // red-500
      hover: '#C53030', // red-700
      text: '#FFFFFF',
    },
  },
  
  // Toggle Switch Colors
  toggle: {
    active: '#38A169', // green-600
    inactive: '#E2E8F0', // gray-200
    handle: '#FFFFFF',
  },
  
  // Focus Ring Colors
  focus: {
    ring: '#4299E1', // blue-500
    ringOffset: '#FFFFFF',
  },
} as const; 