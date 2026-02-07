/**
 * Formatters Utility
 * Common formatting functions for dates, text, and scores.
 * 
 * @module utils/formatters
 */

/**
 * Format date to localized string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = { day: 'numeric', month: 'short', year: 'numeric' }) => {
    if (!date) return '';
    try {
        return new Date(date).toLocaleDateString('es-MX', options);
    } catch {
        return '';
    }
};

/**
 * Format date to short format (day and month only)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDateShort = (date) => {
    return formatDate(date, { day: 'numeric', month: 'short' });
};

/**
 * Get initials from a full name
 * @param {string} name - Full name
 * @param {number} maxLength - Maximum number of initials
 * @returns {string} Initials
 */
export const getInitials = (name, maxLength = 2) => {
    if (!name) return '';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, maxLength);
};

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
};

/**
 * Get color based on score value
 * @param {number} score - Score value (0-100)
 * @returns {string} Tailwind color class or hex color
 */
export const getScoreColor = (score) => {
    if (score >= 85) return '#10b981'; // emerald-500
    if (score >= 70) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
};

/**
 * Get Tailwind background color class based on score
 * @param {number} score - Score value (0-100)
 * @returns {string} Tailwind class
 */
export const getScoreBgClass = (score) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-red-500';
};

/**
 * Get label based on score value
 * @param {number} score - Score value (0-100)
 * @returns {string} Score label
 */
export const getScoreLabel = (score) => {
    if (score >= 85) return 'Alto';
    if (score >= 70) return 'Medio';
    return 'Bajo';
};

/**
 * Get experience level label
 * @param {number} years - Years of experience
 * @returns {string}
 */
export const getExperienceLabel = (years) => {
    if (years <= 2) return 'Junior';
    if (years <= 5) return 'Mid-Level';
    return 'Senior';
};

/**
 * Format number as percentage
 * @param {number} value - Number to format
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value) => {
    return `${Math.round(value || 0)}%`;
};

/**
 * Pluralize a word based on count
 * @param {number} count - Item count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, adds 's' by default)
 * @returns {string}
 */
export const pluralize = (count, singular, plural = null) => {
    const pluralForm = plural || `${singular}s`;
    return count === 1 ? singular : pluralForm;
};
