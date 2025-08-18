import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { Project, DeviceType, PanelType, Panel } from '../types'; // keep this import for your Project type

// Configurable backend base URL
const RAW_API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:3001';
export const BACKEND_CONFIG = {
  API_BASE_URL: RAW_API_BASE_URL.replace(/\/+$/, ''),
};

// Common headers (note: real CORS must be enabled on the server)
export const commonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};

// Create axios instance for backend API
export const backendApi = axios.create({
  baseURL: BACKEND_CONFIG.API_BASE_URL,
  timeout: 10000,
  headers: commonHeaders,
});

// Toast configuration types
interface ToastConfig {
	showSuccess: boolean;
	showError: boolean;
}

type EndpointConfig =
	| ToastConfig
	| {
		[method in 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'default']?: ToastConfig;
	};

// Toast configuration map
export const TOAST_CONFIG: { [endpoint: string]: EndpointConfig } = {
	default: { showSuccess: true, showError: true },
	'/configurations': { showSuccess: false, showError: true },
	'/users/:id': {
		GET: { showSuccess: false, showError: true },
		default: { showSuccess: true, showError: true },
	},
	'/users/change-password': { showSuccess: true, showError: true },
  // Panels
  '/panels': {
    GET: { showSuccess: false, showError: true },
    POST: { showSuccess: true, showError: true },
    default: { showSuccess: true, showError: true },
  },
  '/panels/:id': {
    GET: { showSuccess: false, showError: true },
    PUT: { showSuccess: true, showError: true },
    DELETE: { showSuccess: true, showError: true },
    default: { showSuccess: true, showError: true },
  },
  '/panels/:id/clone': {
    POST: { showSuccess: true, showError: true },
    default: { showSuccess: true, showError: true },
  },
};

// Resolve toast config for a given URL + method
const getToastConfig = (url: string, method: string = 'GET'): ToastConfig => {
	const cleanUrl = url.split('?')[0].replace(/\/+$/, '');
	const urlPattern = cleanUrl
		.split('/')
		.map((segment, index) => {
			if (index === 0) return segment;
			return /^[0-9a-f-]+$/i.test(segment) ? ':id' : segment;
		})
		.join('/');

	const matching = Object.entries(TOAST_CONFIG).find(([endpoint]) => {
		if (cleanUrl === endpoint) return true;
		if (endpoint.includes(':id')) {
			const endpointParts = endpoint.split('/');
			const urlParts = urlPattern.split('/');
			if (endpointParts.length !== urlParts.length) return false;
			return endpointParts.every((part, i) => part === ':id' || part === urlParts[i]);
		}
		return false;
	});

	if (!matching) return TOAST_CONFIG.default as ToastConfig;
	const endpointConfig = matching[1];
	if ('showSuccess' in endpointConfig) return endpointConfig as ToastConfig;
	const methodConfig = (endpointConfig as any)[method];
	if (methodConfig) return methodConfig as ToastConfig;
	return ((endpointConfig as any).default as ToastConfig) || (TOAST_CONFIG.default as ToastConfig);
};

// Attach Authorization header from Amplify session (if available)
backendApi.interceptors.request.use(async (config) => {
  try {
    // Skip auth for public endpoints (e.g., API Gateway login route expecting no bearer token)
    try {
      const base = new URL(config.baseURL || BACKEND_CONFIG.API_BASE_URL);
      const reqUrl = new URL(config.url || '', base);
      const stagePrefix = base.pathname.replace(/\/+$/, ''); // e.g. '/prod' or ''
      let path = reqUrl.pathname;
      if (stagePrefix && path.startsWith(stagePrefix + '/')) {
        path = path.slice(stagePrefix.length); // drop '/prod'
      }
      const NO_AUTH_PATHS = [
        '/login',
        '/auth/login',
        '/users/login',
        '/signup',
        '/auth/signup',
        '/confirm',
        '/auth/confirm',
        '/forgot-password',
        '/auth/forgot-password',
      ];
      if (NO_AUTH_PATHS.includes(path)) {
        return config;
      }
    } catch {
      // ignore URL parse issues and proceed
    }

    const session = await fetchAuthSession();
    const token =
      session.tokens?.idToken?.toString() ||
      session.tokens?.accessToken?.toString();
    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      } as any;
    }
  } catch {
    // no-op if not signed in
  }
  return config;
});

interface ApiResponse<T> {
  success: boolean;
  message: string;
  Data: T;
}

// Response interceptor (toast + auth handling)
backendApi.interceptors.response.use(
  (response) => {
    const toastConfig = getToastConfig(response.config.url || '', (response.config.method || 'GET').toUpperCase());
    const message = (response.data as any)?.Message || (response.data as any)?.message;
    if (toastConfig.showSuccess && message) {
      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: { message, type: 'success' },
        })
      );
    }
    return response;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      try {
        // Clear any cached session-driven tokens if you store them locally
        localStorage.removeItem('cognito_id_token');
      } catch {}
      window.location.href = '/login';
    } else {
      const toastConfig = getToastConfig(error?.config?.url || '', (error?.config?.method || 'GET').toUpperCase());
      if (toastConfig.showError) {
        const errorMessage = error?.response?.data?.ErrorMessage || error?.response?.data?.message || 'An error occurred';
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: { message: errorMessage, type: 'error' },
          })
        );
      }
    }
    return Promise.reject(error);
  }
);

export const projectApi = {
  // GET all projects
  getProjects: async (): Promise<Project[]> => {
    console.log('Calling getProjects API...');
    const response = await backendApi.get<ApiResponse<Project[]>>('/projects');
    return response.data.Data;
  },

  // GET project by ID
  getProject: async (projectId: string): Promise<Project> => {
    console.log('Calling getProject API...');
    const response = await backendApi.get<ApiResponse<Project>>(`/projects/${projectId}`);
    return response.data.Data;
  },

  // CREATE project with CSVs
  createProject: async (formData: FormData): Promise<Project> => {
    const response = await backendApi.post<ApiResponse<Project>>('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.Data;
  },

  // UPDATE project
  updateProject: async (projectId: string, project: Partial<Project>): Promise<Project> => {
    const response = await backendApi.put<ApiResponse<Project>>(`/projects/${projectId}`, project);
    return response.data.Data;
  },

  // DELETE project
  deleteProject: async (projectId: string): Promise<void> => {
    await backendApi.delete(`/projects/${projectId}`);
  },

  // CLONE project
  cloneProject: async (projectId: string, newName: string): Promise<Project> => {
    const response = await backendApi.post<ApiResponse<Project>>(`/projects/${projectId}/clone`, { name: newName });
    return response.data.Data;
  },
};

// Backwards-compat for any imports still expecting `api`
export const api = backendApi;

// Configurations API
export const configurationApi = {
  getDeviceTypes: async (): Promise<DeviceType[]> => {
    const response = await backendApi.get<ApiResponse<DeviceType[]>>('/configurations/device-types');
    return response.data.Data;
  },
  getPanelTypes: async (): Promise<PanelType[]> => {
    const response = await backendApi.get<ApiResponse<PanelType[]>>('/configurations/panel-types');
    return response.data.Data;
  },
};

// Panels API
export type CreateOrUpdatePanelInput = Partial<Panel> & { project_id?: string; panel_type_id?: string };

export const panelApi = {
  getPanel: async (panelId: string): Promise<Panel> => {
    const response = await backendApi.get<ApiResponse<Panel>>(`/panels/${panelId}`);
    return response.data.Data;
  },
  createPanel: async (input: CreateOrUpdatePanelInput): Promise<Panel> => {
    const response = await backendApi.post<ApiResponse<Panel>>('/panels', input);
    return response.data.Data;
  },
  updatePanel: async (panelId: string, input: CreateOrUpdatePanelInput): Promise<Panel> => {
    const response = await backendApi.put<ApiResponse<Panel>>(`/panels/${panelId}`, input);
    return response.data.Data;
  },
  deletePanel: async (panelId: string): Promise<void> => {
    await backendApi.delete(`/panels/${panelId}`);
  },
  clonePanel: async (panelId: string, name: string): Promise<Panel> => {
    const response = await backendApi.post<ApiResponse<Panel>>(`/panels/${panelId}/clone`, { name });
    return response.data.Data;
  },
};

