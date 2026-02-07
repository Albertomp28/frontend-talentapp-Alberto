/**
 * Authentication Service
 * Handles user authentication operations with the backend API.
 *
 * @module services/authService
 */

import { storageService } from './storageService';
import apiClient from './apiClient';

/**
 * Authenticate user with credentials
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ success: boolean, user?: object, error?: string }>}
 */
const login = async (credentials) => {
  try {
    const { email, password } = credentials;

    if (!email || !password) {
      return { success: false, error: 'Email y contraseña son requeridos' };
    }

    const response = await apiClient.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;

    // Guardar tokens y usuario en localStorage
    storageService.setItem(storageService.KEYS.AUTH_TOKEN, accessToken);
    storageService.setItem(storageService.KEYS.REFRESH_TOKEN, refreshToken);
    storageService.setItem(storageService.KEYS.USER, user);

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    const message =
      error.response?.data?.message || 'Error al iniciar sesión';
    return { success: false, error: message };
  }
};

/**
 * Log out user and clear auth data
 * @returns {Promise<void>}
 */
const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    storageService.clearAll();
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

/**
 * Get current auth token
 * @returns {string|null}
 */
const getToken = () => {
  return storageService.getItem(storageService.KEYS.AUTH_TOKEN, null);
};

/**
 * Get current user info from localStorage or API
 * @returns {Promise<object|null>}
 */
const getCurrentUser = async () => {
  if (!isAuthenticated()) return null;

  // Intentar obtener del localStorage primero
  const storedUser = storageService.getItem(storageService.KEYS.USER);
  if (storedUser) return storedUser;

  // Si no está en localStorage, obtener del API
  try {
    const response = await apiClient.get('/auth/me');
    const user = response.data;
    storageService.setItem(storageService.KEYS.USER, user);
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

/**
 * Get current user synchronously (from localStorage only)
 * @returns {object|null}
 */
const getCurrentUserSync = () => {
  if (!isAuthenticated()) return null;
  return storageService.getItem(storageService.KEYS.USER);
};

export const authService = {
  login,
  logout,
  isAuthenticated,
  getToken,
  getCurrentUser,
  getCurrentUserSync,
};

export default authService;
