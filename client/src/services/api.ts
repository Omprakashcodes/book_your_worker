import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getStoredToken, removeStoredToken, removeStoredUser } from '../utils/storage';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeStoredToken();
      removeStoredUser();
      // Optional: can trigger auth state update if needed
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown, defaultMessage = 'An unexpected error occurred'): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (Array.isArray(error.response?.data?.errors) && error.response.data.errors.length > 0) {
      return error.response.data.errors[0].msg || 'Please check the entered details';
    }
    if (error.response?.data?.error) {
      return typeof error.response.data.error === 'string'
        ? error.response.data.error
        : defaultMessage;
    }
    if (error.code === 'ERR_NETWORK') {
      return `Cannot reach server at ${API_BASE_URL}. Please ensure your backend is running.`;
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'The backend is waking up. Please try again in a few seconds.';
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

export default api;
