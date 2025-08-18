import axios from 'axios';
import type { Project } from '../types'; // keep this import for your Project type

// Create Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3002', // <-- replace with your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: interceptors for logging or auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

interface ApiResponse<T> {
  success: boolean;
  message: string;
  Data: T;
}

export const projectApi = {
  // GET all projects
  getProjects: async (): Promise<Project[]> => {
    console.log('Calling getProjects API...');
    const response = await api.get<ApiResponse<Project[]>>('/projects');
    return response.data.Data;
  },

  // GET project by ID
  getProject: async (projectId: string): Promise<Project> => {
    console.log('Calling getProject API...');
    const response = await api.get<ApiResponse<Project>>(`/projects/${projectId}`);
    return response.data.Data;
  },

  // CREATE project with CSVs
  createProject: async (formData: FormData): Promise<Project> => {
    const response = await api.post<ApiResponse<Project>>('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.Data;
  },

  // UPDATE project
  updateProject: async (projectId: string, project: Partial<Project>): Promise<Project> => {
    const response = await api.put<ApiResponse<Project>>(`/projects/${projectId}`, project);
    return response.data.Data;
  },

  // DELETE project
  deleteProject: async (projectId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}`);
  },

  // CLONE project
  cloneProject: async (projectId: string, newName: string): Promise<Project> => {
    const response = await api.post<ApiResponse<Project>>(`/projects/${projectId}/clone`, { name: newName });
    return response.data.Data;
  },
};

export { api }; 

