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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vacanteToDelete, setVacanteToDelete] = useState(null);

  // Load vacancies on mount
  useEffect(() => {
    cargarVacantes();
  }, []);

  const cargarVacantes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vacantesData = await vacancyService.getAll();
      setVacantes(vacantesData);
    } catch (err) {
      console.error('Error loading vacancies:', err);
      setError('Error al cargar las vacantes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter vacancies based on search and status filter
  const vacantesFiltradas = useMemo(() => {
    return vacantes.filter((v) => {
      const matchEstado = filtroEstado === 'todas' || v.estado === filtroEstado;
      const matchBusqueda =
        v.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
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
  const stats = useMemo(
    () => ({
      total: vacantes.length,
      draft: vacantes.filter((v) => v.estado === 'draft').length,
      published: vacantes.filter((v) => v.estado === 'published').length,
      closed: vacantes.filter((v) => v.estado === 'closed').length,
    }),
    [vacantes]
  );

  // Publish vacancy
  const publicarVacante = useCallback(async (id) => {
    const result = await vacancyService.publish(id);
    if (result.success) {
      setVacantes((prev) => prev.map((v) => (v.id === id ? { ...v, estado: 'published' } : v)));
    }
    return result;
  }, []);

  // Close vacancy
  const cerrarVacante = useCallback(async (id) => {
    const result = await vacancyService.close(id);
    if (result.success) {
      setVacantes((prev) => prev.map((v) => (v.id === id ? { ...v, estado: 'closed' } : v)));
    }
    return result;
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

  // Delete vacancy (Note: backend doesn't have delete endpoint yet)
  const eliminarVacante = useCallback(() => {
    if (!vacanteToDelete) return;

    // For now, just remove from local state
    // TODO: Add delete endpoint to backend
    setVacantes((prev) => prev.filter((v) => v.id !== vacanteToDelete.id));

    setShowDeleteModal(false);
    setVacanteToDelete(null);
  }, [vacanteToDelete]);

  // Copy vacancy link
  const copiarEnlace = useCallback((id) => {
    const url = `${window.location.origin}/vacantes/${id}`;
    navigator.clipboard.writeText(url);
  }, []);

  // Navigation helpers
  const verVacante = useCallback(
    (id) => {
      navigate(`/vacantes/${id}`);
    },
    [navigate]
  );

  const editarVacante = useCallback(
    (id) => {
      navigate(`/vacantes/editar/${id}`);
    },
    [navigate]
  );

  return {
    // State
    vacantes,
    loading,
    error,
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
    publicarVacante,
    cerrarVacante,
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
