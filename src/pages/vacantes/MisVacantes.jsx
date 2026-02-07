/**
 * MisVacantes Page
 * Page for viewing and managing user's job vacancies.
 * 
 * Refactored to use:
 * - useMisVacantes hook for state management
 * - Subcomponents for each UI section
 * 
 * @module pages/vacantes/MisVacantes
 */

import { Link } from 'react-router-dom';

// Custom Hook
import { useMisVacantes } from './hooks/useMisVacantes';

// Subcomponents
import VacanteCard from './components/VacanteCard';
import VacantesStats from './components/VacantesStats';
import VacantesFilters from './components/VacantesFilters';
import DeleteVacanteModal from './components/DeleteVacanteModal';

/**
 * MisVacantes Page Component
 */
const MisVacantes = () => {
  const {
    // State
    loading,
    error,
    busqueda,
    filtroEstado,
    showDeleteModal,
    vacanteToDelete,

    // Computed
    vacantesAgrupadas,
    departamentos,
    stats,

    // Setters
    setBusqueda,
    setFiltroEstado,

    // Actions
    publicarVacante,
    cerrarVacante,
    confirmarEliminar,
    cancelarEliminar,
    eliminarVacante,
    copiarEnlace,
    verVacante,
    editarVacante,
  } = useMisVacantes();

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-1">Mis Vacantes</h1>
          <p className="text-neutral-500">Gestiona todas las vacantes que has creado</p>
        </div>
        <Link
          to="/vacantes/crear"
          className="flex items-center gap-2 bg-linear-to-r from-success-500 to-success-600 text-white px-4 py-2.5 rounded-button font-medium transition-all hover:shadow-lg hover:shadow-success-500/30 no-underline"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Nueva Vacante
        </Link>
      </div>

      {/* Stats */}
      <VacantesStats stats={stats} />

      {/* Filters */}
      <VacantesFilters
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroChange={setFiltroEstado}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-500">Cargando vacantes...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Vacancies List */}
      {!loading && departamentos.length === 0 ? (
        <EmptyState />
      ) : (
        !loading && (
          <div className="space-y-8">
            {departamentos.map((departamento) => (
              <DepartmentSection
                key={departamento}
                departamento={departamento}
                vacantes={vacantesAgrupadas[departamento]}
                onView={verVacante}
                onEdit={editarVacante}
                onCopy={copiarEnlace}
                onPublish={publicarVacante}
                onClose={cerrarVacante}
                onDelete={confirmarEliminar}
              />
            ))}
          </div>
        )
      )}

      {/* Delete Modal */}
      <DeleteVacanteModal
        show={showDeleteModal}
        vacante={vacanteToDelete}
        onClose={cancelarEliminar}
        onConfirm={eliminarVacante}
      />
    </div>
  );
};

/**
 * Department Section - group of vacancies by department
 */
const DepartmentSection = ({
  departamento,
  vacantes,
  onView,
  onEdit,
  onCopy,
  onPublish,
  onClose,
  onDelete,
}) => (
  <div>
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-200">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-800">
        <svg className="w-5 h-5 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        {departamento}
      </h2>
      <span className="text-sm text-neutral-500">
        {vacantes.length} vacante{vacantes.length !== 1 ? 's' : ''}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vacantes.map((vacante) => (
        <VacanteCard
          key={vacante.id}
          vacante={vacante}
          onView={onView}
          onEdit={onEdit}
          onCopy={onCopy}
          onPublish={onPublish}
          onClose={onClose}
          onDelete={onDelete}
        />
      ))}
    </div>
  </div>
);

/**
 * Empty State - shown when no vacancies exist
 */
const EmptyState = () => (
  <div className="text-center py-16 bg-white border border-neutral-200 rounded-card shadow-premium-sm">
    <svg className="w-16 h-16 text-neutral-100 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
    <h3 className="text-xl font-semibold text-neutral-800 mb-2">No tienes vacantes</h3>
    <p className="text-neutral-500 mb-6">Crea tu primera vacante para comenzar a reclutar</p>
    <Link
      to="/vacantes/crear"
      className="inline-flex items-center gap-2 bg-linear-to-r from-success-500 to-success-600 text-white px-5 py-2.5 rounded-button font-medium transition-all hover:shadow-lg hover:shadow-success-500/30 no-underline"
    >
      Crear Vacante
    </Link>
  </div>
);

export default MisVacantes;
