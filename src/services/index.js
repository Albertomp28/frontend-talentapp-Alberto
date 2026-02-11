/**
 * Services Index
 * Central export for all application services.
 * 
 * @module services
 */

export { storageService } from './storageService';
export { authService } from './authService';
export { vacancyService } from './vacancyService';
export { candidateService } from './candidateService';
export { cvService } from './cvService';
export { default as apiClient } from './apiClient';
export { getAISuggestions, estimateSalary } from './aiService';
