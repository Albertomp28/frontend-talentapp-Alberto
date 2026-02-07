/**
 * Validators Utility
 * Form validation helper functions.
 * 
 * @module utils/validators
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Check if value is not empty
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isNotEmpty = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
};

/**
 * Check if value meets minimum length
 * @param {string} value - Value to check
 * @param {number} minLength - Minimum length required
 * @returns {boolean}
 */
export const hasMinLength = (value, minLength) => {
    if (!value) return false;
    return String(value).trim().length >= minLength;
};

/**
 * Check if value is a valid phone number (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\d\s\-\+\(\)]{8,20}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate vacancy step 1 (basic info)
 * @param {Object} vacante - Vacancy data
 * @returns {boolean}
 */
export const isVacanteStep1Valid = (vacante) => {
    return isNotEmpty(vacante?.titulo) && isNotEmpty(vacante?.departamento);
};

/**
 * Validate vacancy step 2 (description and requirements)
 * @param {Object} vacante - Vacancy data
 * @returns {boolean}
 */
export const isVacanteStep2Valid = (vacante) => {
    return isNotEmpty(vacante?.descripcion) && hasMinLength(vacante?.descripcion, 20);
};

/**
 * Validate vacancy step 3 (skills and benefits)
 * @param {Object} vacante - Vacancy data
 * @returns {boolean}
 */
export const isVacanteStep3Valid = (vacante) => {
    const hasSkills = vacante?.habilidades?.length > 0;
    return hasSkills;
};

/**
 * Validate all vacancy steps
 * @param {Object} vacante - Vacancy data
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export const validateVacante = (vacante) => {
    const errors = [];

    if (!isVacanteStep1Valid(vacante)) {
        errors.push('Título y departamento son requeridos');
    }
    if (!isVacanteStep2Valid(vacante)) {
        errors.push('La descripción debe tener al menos 20 caracteres');
    }
    if (!isVacanteStep3Valid(vacante)) {
        errors.push('Debe agregar al menos una habilidad requerida');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate login credentials
 * @param {{ email: string, password: string }} credentials
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export const validateLoginCredentials = (credentials) => {
    const errors = [];

    if (!isValidEmail(credentials?.email)) {
        errors.push('Email inválido');
    }
    if (!hasMinLength(credentials?.password, 1)) {
        errors.push('Contraseña requerida');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
