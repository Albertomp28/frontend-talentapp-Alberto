/**
 * Storage Service
 * Abstraction layer for localStorage operations with error handling and type safety.
 * 
 * @module services/storageService
 */

const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    VACANTES: 'vacantes',
    POOL_CANDIDATOS: 'poolCandidatos',
};

/**
 * Get and parse an item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed value or default
 */
const getItem = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        console.error(`Error reading from localStorage key "${key}":`, error);
        return defaultValue;
    }
};

/**
 * Serialize and store an item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
const setItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
        return false;
    }
};

/**
 * Remove an item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
const removeItem = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
        return false;
    }
};

/**
 * Clear all app-related items from localStorage
 * @returns {boolean} Success status
 */
const clearAll = () => {
    try {
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
};

export const storageService = {
    KEYS: STORAGE_KEYS,
    getItem,
    setItem,
    removeItem,
    clearAll,
};

export default storageService;
