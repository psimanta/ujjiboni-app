import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { storage } from '../utils/local-storage';
import type { IResponseError } from '../interfaces/response.interface';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { skipAuth?: boolean }) => {
    const token = storage.get('token');
    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  response => response,
  async (error: AxiosError<IResponseError>) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      // storage.remove('token');
      // window.location.href = '/login';
    }
    return Promise.reject({ ...error.response?.data, status: error.response?.status });
  }
);
