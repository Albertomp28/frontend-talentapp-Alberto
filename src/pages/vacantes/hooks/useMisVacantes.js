/**
 * useMisVacantes Hook
 * Custom hook for managing the MisVacantes page state and logic.
 * 
 * @module pages/vacantes/hooks/useMisVacantes
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { vacancyService } from '../../../services';

/**
 * Custom hook for MisVacantes page
 * @returns {Object} State and handlers for MisVacantes
 */
export const useMisVacantes = () => {
    const navigate = useNavigate();
    const [vacantes, setVacantes] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('todas');
    const [busqueda, setBusqueda] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [vacanteToDelete, setVacanteToDelete] = useState(null);

    // Load vacancies on mount
    useEffect(() => {
        cargarVacantes();
    }, []);

    const cargarVacantes = useCallback(() => {
        const vacantesGuardadas = vacancyService.getAll();
        setVacantes(vacantesGuardadas);
    }, []);

    // Filter vacancies based on search and status filter
    const vacantesFiltradas = useMemo(() => {
        return vacantes.filter(v => {
            const matchEstado = filtroEstado === 'todas' || v.estado === filtroEstado;
            const matchBusqueda = v.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                v.departamento?.toLowerCase().includes(busqueda.toLowerCase());
            return matchEstado && matchBusqueda;
        });
    }, [vacantes, filtroEstado, busqueda]);

    // Group vacancies by department
    const vacantesAgrupadas = useMemo(() => {
        return vacantesFiltradas.reduce((acc, vacante) => {
            const dept = vacante.departamento || 'Sin departamento';
            if (!acc[dept]) {
                acc[dept] = [];
            }
            acc[dept].push(vacante);
            return acc;
        }, {});
    }, [vacantesFiltradas]);

    const departamentos = useMemo(() => {
        return Object.keys(vacantesAgrupadas).sort();
    }, [vacantesAgrupadas]);

    // Statistics
    const stats = useMemo(() => ({
        total: vacantes.length,
        activas: vacantes.filter(v => v.estado === 'activa').length,
        pausadas: vacantes.filter(v => v.estado === 'pausada').length,
    }), [vacantes]);

    // Toggle vacancy status
    const toggleEstadoVacante = useCallback((id) => {
        const result = vacancyService.toggleStatus(id);
        if (result.success) {
            setVacantes(prevVacantes =>
                prevVacantes.map(v =>
                    v.id === id ? { ...v, estado: v.estado === 'activa' ? 'pausada' : 'activa' } : v
                )
            );
        }
    }, []);

    // Confirm delete modal
    const confirmarEliminar = useCallback((vacante) => {
        setVacanteToDelete(vacante);
        setShowDeleteModal(true);
    }, []);

    const cancelarEliminar = useCallback(() => {
        setShowDeleteModal(false);
        setVacanteToDelete(null);
    }, []);

    // Delete vacancy
    const eliminarVacante = useCallback(() => {
        if (!vacanteToDelete) return;

        const result = vacancyService.remove(vacanteToDelete.id);
        if (result.success) {
            setVacantes(prev => prev.filter(v => v.id !== vacanteToDelete.id));
        }

        setShowDeleteModal(false);
        setVacanteToDelete(null);
    }, [vacanteToDelete]);

    // Copy vacancy link
    const copiarEnlace = useCallback((id) => {
        const url = `${window.location.origin}/vacantes/${id}`;
        navigator.clipboard.writeText(url);
    }, []);

    // Navigation helpers
    const verVacante = useCallback((id) => {
        navigate(`/vacantes/${id}`);
    }, [navigate]);

    const editarVacante = useCallback((id) => {
        navigate(`/vacantes/editar/${id}`);
    }, [navigate]);

    return {
        // State
        vacantes,
        filtroEstado,
        busqueda,
        showDeleteModal,
        vacanteToDelete,

        // Computed
        vacantesFiltradas,
        vacantesAgrupadas,
        departamentos,
        stats,

        // Setters
        setFiltroEstado,
        setBusqueda,

        // Actions
        toggleEstadoVacante,
        confirmarEliminar,
        cancelarEliminar,
        eliminarVacante,
        copiarEnlace,
        verVacante,
        editarVacante,
        cargarVacantes,
    };
};

export default useMisVacantes;
