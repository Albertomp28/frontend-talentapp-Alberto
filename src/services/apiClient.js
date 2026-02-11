/**
 * API Client
 * Axios instance with interceptors for authentication.
 *
 * @module services/apiClient
 */

import axios from 'axios';
import { storageService } from './storageService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
console.log('API Client initialized with baseURL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - agregar token a cada request
apiClient.interceptors.request.use(
  (config) => {
    const token = storageService.getItem(storageService.KEYS.AUTH_TOKEN);
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Token present:', !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - manejar errores 401
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - redirecting to login');
      storageService.clearAll();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
