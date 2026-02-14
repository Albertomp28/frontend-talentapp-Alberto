/**
 * Application Configuration
 * Centralizes configuration values to avoid environment variable issues.
 */

const config = {
    // API URL for the main backend
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',

    // CV Processor Service
    CV_PROCESSOR_URL: import.meta.env.VITE_CV_PROCESSOR_URL || 'http://localhost:8000',

    // API Key for CV Processor
    // Hardcoded as a fallback since Docker env injection is proving unreliable in Windows
    CV_PROCESSOR_API_KEY: import.meta.env.VITE_CV_PROCESSOR_API_KEY || 'Cv0L-lhxhL4zu0BW8XXbBJboR4-KfS8eBjyYNJPjSj4KUcFCwgGKYA',
};

export default config;
