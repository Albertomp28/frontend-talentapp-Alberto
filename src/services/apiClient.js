/**
 * API Client
 * Axios instance with interceptors for authentication.
 *
 * @module services/apiClient
 */

import axios from 'axios';
import { storageService } from './storageService';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - agregar token a cada request
apiClient.interceptors.request.use(
  (config) => {
    const token = storageService.getItem(storageService.KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - manejar errores 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storageService.clearAll();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
