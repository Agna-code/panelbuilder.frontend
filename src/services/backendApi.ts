import axios from 'axios';
import { getCognitoIdToken } from '../utils/auth-helpers';

// Create backend API configuration
const BACKEND_CONFIG = {
  API_BASE_URL: process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:3001',
};

// Interface for toast configuration
interface ToastConfig {
  showSuccess: boolean;
  showError: boolean;
}

// Type for endpoint configuration that can specify different behaviors per HTTP method
type EndpointConfig = ToastConfig | {
  [method in 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'default']?: ToastConfig;
};

// Toast configuration for different endpoints
export const TOAST_CONFIG: { [endpoint: string]: EndpointConfig } = {
  // By default, show both success and error toasts
  default: { showSuccess: true, showError: true },
  // Endpoint specific configurations
  '/configurations': { showSuccess: false, showError: true },
};

export const commonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}

// Create axios instance for backend API
export const backendApi = axios.create({
  baseURL: BACKEND_CONFIG.API_BASE_URL,
  headers: commonHeaders,
});

// Add request interceptor to include Cognito ID token
backendApi.interceptors.request.use(async (config) => {
  try {
    // Get the current Cognito ID token
    const idToken = await getCognitoIdToken();
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

// Helper function to get toast config for an endpoint and method
const getToastConfig = (url: string, method: string = 'GET'): ToastConfig => {
  // Remove query parameters and trailing slashes for matching
  const cleanUrl = url.split('?')[0].replace(/\/+$/, '');
  
  // Convert URL with parameters to pattern format
  // e.g., /users/123/subaccounts -> /users/:id/subaccounts
  const urlPattern = cleanUrl.split('/')
    .map((segment, index, array) => {
      // Skip first empty segment
      if (index === 0) return segment;
      // Replace numeric or UUID-like segments with :id
      return /^[0-9a-f-]+$/i.test(segment) ? ':id' : segment;
    })
    .join('/');
  
  // Find the most specific matching configuration
  const matchingConfig = Object.entries(TOAST_CONFIG)
    .find(([endpoint]) => {
      // Check for exact match first
      if (cleanUrl === endpoint) return true;
      // Then check for pattern match
      if (endpoint.includes(':id')) {
        const endpointParts = endpoint.split('/');
        const urlParts = urlPattern.split('/');
        if (endpointParts.length !== urlParts.length) return false;
        return endpointParts.every((part, i) => part === ':id' || part === urlParts[i]);
      }
      return false;
    });
    
  if (!matchingConfig) {
    return TOAST_CONFIG.default as ToastConfig;
  }

  const endpointConfig = matchingConfig[1];

  // If the config is a simple ToastConfig, use it directly
  if ('showSuccess' in endpointConfig) {
    return endpointConfig;
  }

  // If the config has method-specific settings, try to use those
  const methodConfig = endpointConfig[method as keyof typeof endpointConfig];
  if (methodConfig) {
    return methodConfig;
  }

  // Fall back to the endpoint's default config or the global default
  return (endpointConfig.default as ToastConfig) || TOAST_CONFIG.default as ToastConfig;
};

// Add response interceptor to handle responses and show toasts
backendApi.interceptors.response.use(
  (response) => {
    // Get toast configuration for this endpoint and method
    const toastConfig = getToastConfig(response.config.url || '', response.config.method?.toUpperCase());

    // Show success toast if enabled and there's a message
    if (toastConfig.showSuccess && response.data?.Message) {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          message: response.data.Message,
          type: 'success'
        }
      }));
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem('cognito_id_token');
      window.location.href = '/login';
    } else {
      // Get toast configuration for this endpoint and method
      const toastConfig = getToastConfig(error.config?.url || '', error.config?.method?.toUpperCase());
      // Show error toast if enabled
      if (toastConfig.showError) {
        const errorMessage = error.response?.data?.ErrorMessage || 'An error occurred';
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: {
            message: errorMessage,
            type: 'error'
          }
        }));
      }
    }
    return Promise.reject(error);
  }
);

export default backendApi; 