import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiError, ApiResponse } from '@/types';

/**
 * Main Axios Instance
 */
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Add Access Token Automatically
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handle Common Errors
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(
      error.response?.data ?? {
        message: 'Something went wrong',
      }
    );
  }
);

/**
 * Common Methods - generic-typed for full type-safety on responses
 */
const apiService = {
  get: <T = unknown>(url: string, params: Record<string, unknown> = {}): Promise<ApiResponse<T>> =>
    api.get(url, { params }) as unknown as Promise<ApiResponse<T>>,

  post: <T = unknown>(url: string, payload: unknown = {}): Promise<ApiResponse<T>> =>
    api.post(url, payload) as unknown as Promise<ApiResponse<T>>,

  patch: <T = unknown>(url: string, payload: unknown = {}): Promise<ApiResponse<T>> =>
    api.patch(url, payload) as unknown as Promise<ApiResponse<T>>,

  put: <T = unknown>(url: string, payload: unknown = {}): Promise<ApiResponse<T>> =>
    api.put(url, payload) as unknown as Promise<ApiResponse<T>>,

  delete: <T = unknown>(url: string): Promise<ApiResponse<T>> =>
    api.delete(url) as unknown as Promise<ApiResponse<T>>,
};

export default apiService;
