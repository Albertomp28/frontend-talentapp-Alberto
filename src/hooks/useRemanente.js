/**
 * useRemanente Hook
 * Custom hook for managing the Remanente (Candidate Pool) page state.
 * 
 * @module hooks/useRemanente
 */

import { useState, useEffect, useMemo } from 'react';
import { candidateService } from '../services';

/**
 * Custom hook for Remanente page
 */
export const useRemanente = () => {
    const [filtros, setFiltros] = useState({
        busqueda: '',
        habilidad: '',
        experiencia: '',
    });
    const [candidatos, setCandidatos] = useState([]);

    // Load candidates on mount
    useEffect(() => {
        const pool = candidateService.getFromPool();
        setCandidatos(pool);
    }, []);

    // Filter candidates
    const candidatosFiltrados = useMemo(() => {
        return candidateService.filterCandidates(filtros);
    }, [candidatos, filtros]);

    // Stats
    const stats = useMemo(() => ({
        total: candidatos.length,
        disponibles: candidatos.filter(c => c.disponibilidad === 'Inmediata').length,
    }), [candidatos]);

    // Update a single filter
    const updateFiltro = (key, value) => {
        setFiltros(prev => ({ ...prev, [key]: value }));
    };

    // Clear all filters
    const clearFiltros = () => {
        setFiltros({ busqueda: '', habilidad: '', experiencia: '' });
    };

    // Check if any filter is active
    const hasActiveFilters = filtros.busqueda || filtros.habilidad || filtros.experiencia;

    return {
        filtros,
        candidatosFiltrados,
        stats,
        updateFiltro,
        clearFiltros,
        hasActiveFilters,
    };
};

export default useRemanente;
