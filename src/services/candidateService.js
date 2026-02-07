/**
 * Candidate Service
 * Operations for managing candidates and the candidate pool.
 * 
 * @module services/candidateService
 */

import { storageService } from './storageService';

const STORAGE_KEY = storageService.KEYS.POOL_CANDIDATOS;

/**
 * Example candidates for initial pool
 */
const EXAMPLE_CANDIDATES = [
    {
        id: 1,
        nombre: 'Ana Martínez',
        email: 'ana.martinez@email.com',
        habilidades: ['Python', 'Django', 'PostgreSQL'],
        experiencia: 3,
        ubicacion: 'Ciudad de México',
        disponibilidad: 'Inmediata',
        ultimaEvaluacion: '2026-01-15',
        score: 88
    },
    {
        id: 2,
        nombre: 'Roberto Sánchez',
        email: 'roberto.sanchez@email.com',
        habilidades: ['Java', 'Spring', 'Microservices'],
        experiencia: 6,
        ubicacion: 'Guadalajara',
        disponibilidad: '2 semanas',
        ultimaEvaluacion: '2026-01-10',
        score: 92
    },
    {
        id: 3,
        nombre: 'Laura Torres',
        email: 'laura.torres@email.com',
        habilidades: ['React', 'Vue', 'TypeScript'],
        experiencia: 4,
        ubicacion: 'Monterrey',
        disponibilidad: 'Inmediata',
        ultimaEvaluacion: '2026-01-20',
        score: 85
    },
    {
        id: 4,
        nombre: 'Diego Ramírez',
        email: 'diego.ramirez@email.com',
        habilidades: ['DevOps', 'AWS', 'Kubernetes'],
        experiencia: 5,
        ubicacion: 'Remoto',
        disponibilidad: '1 mes',
        ultimaEvaluacion: '2026-01-18',
        score: 90
    },
    {
        id: 5,
        nombre: 'Carmen Vega',
        email: 'carmen.vega@email.com',
        habilidades: ['Node.js', 'MongoDB', 'GraphQL'],
        experiencia: 4,
        ubicacion: 'Ciudad de México',
        disponibilidad: 'Inmediata',
        ultimaEvaluacion: '2026-01-22',
        score: 87
    },
    {
        id: 6,
        nombre: 'Fernando Luna',
        email: 'fernando.luna@email.com',
        habilidades: ['Flutter', 'Dart', 'Firebase'],
        experiencia: 3,
        ubicacion: 'Querétaro',
        disponibilidad: '2 semanas',
        ultimaEvaluacion: '2026-01-19',
        score: 82
    },
];

/**
 * Get all candidates from pool (includes examples + saved)
 * @returns {Array} List of candidates
 */
const getFromPool = () => {
    const savedCandidates = storageService.getItem(STORAGE_KEY, []);
    const exampleEmails = EXAMPLE_CANDIDATES.map(c => c.email);
    const newFromPool = savedCandidates.filter(c => !exampleEmails.includes(c.email));
    return [...EXAMPLE_CANDIDATES, ...newFromPool];
};

/**
 * Add candidate to pool
 * @param {Object} candidate - Candidate data
 * @returns {{ success: boolean, candidate?: Object, error?: string }}
 */
const addToPool = (candidate) => {
    try {
        const savedCandidates = storageService.getItem(STORAGE_KEY, []);
        const newCandidate = {
            ...candidate,
            id: candidate.id || Date.now(),
            fechaAgregado: new Date().toISOString(),
        };

        savedCandidates.push(newCandidate);
        storageService.setItem(STORAGE_KEY, savedCandidates);

        return { success: true, candidate: newCandidate };
    } catch (error) {
        console.error('Error adding candidate to pool:', error);
        return { success: false, error: 'Error al agregar candidato' };
    }
};

/**
 * Get candidate by ID
 * @param {string|number} id - Candidate ID
 * @returns {Object|null}
 */
const getById = (id) => {
    const candidates = getFromPool();
    return candidates.find(c => c.id === id || c.id === Number(id)) || null;
};

/**
 * Filter candidates by criteria
 * @param {Object} filters - Filter criteria
 * @param {string} filters.busqueda - Search term
 * @param {string} filters.habilidad - Skill to filter by
 * @param {string} filters.experiencia - Experience level (junior, mid, senior)
 * @returns {Array} Filtered candidates
 */
const filterCandidates = (filters = {}) => {
    const candidates = getFromPool();
    const { busqueda = '', habilidad = '', experiencia = '' } = filters;

    return candidates.filter(c => {
        const matchBusqueda = !busqueda ||
            c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            c.email.toLowerCase().includes(busqueda.toLowerCase());

        const matchHabilidad = !habilidad ||
            c.habilidades.some(h => h.toLowerCase().includes(habilidad.toLowerCase()));

        const matchExperiencia = !experiencia ||
            (experiencia === 'junior' && c.experiencia <= 2) ||
            (experiencia === 'mid' && c.experiencia > 2 && c.experiencia <= 5) ||
            (experiencia === 'senior' && c.experiencia > 5);

        return matchBusqueda && matchHabilidad && matchExperiencia;
    });
};

/**
 * Get pool statistics
 * @returns {{ total: number, disponibles: number, promedioScore: number }}
 */
const getStats = () => {
    const candidates = getFromPool();
    const disponibles = candidates.filter(c => c.disponibilidad === 'Inmediata').length;
    const promedioScore = candidates.length > 0
        ? Math.round(candidates.reduce((acc, c) => acc + (c.score || 0), 0) / candidates.length)
        : 0;

    return {
        total: candidates.length,
        disponibles,
        promedioScore,
    };
};

/**
 * Get experience level label
 * @param {number} years - Years of experience
 * @returns {string}
 */
const getExperienceLabel = (years) => {
    if (years <= 2) return 'Junior';
    if (years <= 5) return 'Mid-Level';
    return 'Senior';
};

export const candidateService = {
    getFromPool,
    addToPool,
    getById,
    filterCandidates,
    getStats,
    getExperienceLabel,
    EXAMPLE_CANDIDATES,
};

export default candidateService;
