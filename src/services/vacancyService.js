/**
 * Vacancy Service
 * CRUD operations for job vacancies.
 * 
 * @module services/vacancyService
 */

import { storageService } from './storageService';

const STORAGE_KEY = storageService.KEYS.VACANTES;

/**
 * Get all vacancies
 * @returns {Array} List of vacancies
 */
const getAll = () => {
    return storageService.getItem(STORAGE_KEY, []);
};

/**
 * Get vacancy by ID
 * @param {string|number} id - Vacancy ID
 * @returns {Object|null} Vacancy or null if not found
 */
const getById = (id) => {
    const vacantes = getAll();
    return vacantes.find(v => v.id === id || v.id === String(id)) || null;
};

/**
 * Create a new vacancy
 * @param {Object} vacancyData - Vacancy data
 * @returns {{ success: boolean, vacancy?: Object, error?: string }}
 */
const create = (vacancyData) => {
    try {
        const vacantes = getAll();
        const newVacancy = {
            ...vacancyData,
            id: Date.now().toString(),
            fechaCreacion: new Date().toISOString(),
            estado: 'activa',
        };

        vacantes.push(newVacancy);
        storageService.setItem(STORAGE_KEY, vacantes);

        return { success: true, vacancy: newVacancy };
    } catch (error) {
        console.error('Error creating vacancy:', error);
        return { success: false, error: 'Error al crear la vacante' };
    }
};

/**
 * Update an existing vacancy
 * @param {string|number} id - Vacancy ID
 * @param {Object} updates - Fields to update
 * @returns {{ success: boolean, vacancy?: Object, error?: string }}
 */
const update = (id, updates) => {
    try {
        const vacantes = getAll();
        const index = vacantes.findIndex(v => v.id === id || v.id === String(id));

        if (index === -1) {
            return { success: false, error: 'Vacante no encontrada' };
        }

        vacantes[index] = { ...vacantes[index], ...updates };
        storageService.setItem(STORAGE_KEY, vacantes);

        return { success: true, vacancy: vacantes[index] };
    } catch (error) {
        console.error('Error updating vacancy:', error);
        return { success: false, error: 'Error al actualizar la vacante' };
    }
};

/**
 * Delete a vacancy
 * @param {string|number} id - Vacancy ID
 * @returns {{ success: boolean, error?: string }}
 */
const remove = (id) => {
    try {
        const vacantes = getAll();
        const filtered = vacantes.filter(v => v.id !== id && v.id !== String(id));

        if (filtered.length === vacantes.length) {
            return { success: false, error: 'Vacante no encontrada' };
        }

        storageService.setItem(STORAGE_KEY, filtered);
        return { success: true };
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        return { success: false, error: 'Error al eliminar la vacante' };
    }
};

/**
 * Toggle vacancy status (activa/pausada)
 * @param {string|number} id - Vacancy ID
 * @returns {{ success: boolean, vacancy?: Object, error?: string }}
 */
const toggleStatus = (id) => {
    const vacancy = getById(id);
    if (!vacancy) {
        return { success: false, error: 'Vacante no encontrada' };
    }

    const newStatus = vacancy.estado === 'activa' ? 'pausada' : 'activa';
    return update(id, { estado: newStatus });
};

/**
 * Get vacancies grouped by department
 * @param {Array} vacantes - Optional array of vacancies to group
 * @returns {Object} Vacancies grouped by department
 */
const groupByDepartment = (vacantes = null) => {
    const list = vacantes || getAll();
    return list.reduce((acc, vacante) => {
        const dept = vacante.departamento || 'Sin departamento';
        if (!acc[dept]) {
            acc[dept] = [];
        }
        acc[dept].push(vacante);
        return acc;
    }, {});
};

/**
 * Get vacancy statistics
 * @returns {{ total: number, activas: number, pausadas: number, cerradas: number }}
 */
const getStats = () => {
    const vacantes = getAll();
    return {
        total: vacantes.length,
        activas: vacantes.filter(v => v.estado === 'activa').length,
        pausadas: vacantes.filter(v => v.estado === 'pausada').length,
        cerradas: vacantes.filter(v => v.estado === 'cerrada').length,
    };
};

export const vacancyService = {
    getAll,
    getById,
    create,
    update,
    remove,
    toggleStatus,
    groupByDepartment,
    getStats,
};

export default vacancyService;
