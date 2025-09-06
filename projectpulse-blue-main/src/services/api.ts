import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/login', data),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
};

// Projects API
export const projectsAPI = {
  create: (data: {
    name: string;
    description: string;
    priority: string;
    duration?: string;
    tags?: string;
    image_url?: string;
    created_by: number;
  }) => api.post('/projects', data),
  getAll: () => api.get('/projects'),
  getById: (id: number) => api.get(`/projects/${id}`),
  update: (id: number, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
  getProgress: (id: number) => api.get(`/projects/${id}/progress`),
};

// Project Members API
export const projectMembersAPI = {
  add: (projectId: number, data: { user_id: number; role?: string }) =>
    api.post(`/projects/${projectId}/members`, data),
  getAll: (projectId: number) => api.get(`/projects/${projectId}/members`),
  remove: (projectId: number, userId: number) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
};

// Tasks API
export const tasksAPI = {
  create: (projectId: number, data: {
    title: string;
    description: string;
    assignee_id?: number;
    status?: string;
    priority?: string;
    due_date?: string;
    image_url?: string;
  }) => api.post(`/projects/${projectId}/tasks`, data),
  getByProject: (projectId: number) => api.get(`/projects/${projectId}/tasks`),
  getById: (id: number) => api.get(`/tasks/${id}`),
  update: (id: number, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
  getMyTasks: (userId: number) => api.get(`/tasks/my?user_id=${userId}`),
};

// Comments API
export const commentsAPI = {
  add: (projectId: number, data: { user_id: number; message: string }) =>
    api.post(`/projects/${projectId}/comments`, data),
  getAll: (projectId: number) => api.get(`/projects/${projectId}/comments`),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
};

export default api;
