/**
 * Remanente Page
 * Candidate Pool - previously evaluated candidates available for new vacancies.
 * 
 * Refactored to use:
 * - useRemanente hook for state management
 * - CandidatePoolCard for individual cards
 * 
 * @module pages/Remanente
 */

import { SearchInput } from '../components/ui';
import { useRemanente } from '../hooks/useRemanente';
import CandidatePoolCard from '../components/candidates/CandidatePoolCard';
import { FILTER_OPTIONS } from '../constants/menuConstants';

/**
 * Remanente Page Component
 */
const Remanente = () => {
  const {
    filtros,
    candidatosFiltrados,
    stats,
    updateFiltro,
    clearFiltros,
    hasActiveFilters,
  } = useRemanente();

  const selectClasses = "px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Pool de Candidatos</h1>
          <p className="text-slate-500">Candidatos previamente evaluados disponibles para nuevas vacantes</p>
        </div>
        <div className="flex gap-4">
          <StatCard value={stats.total} label="Total" />
          <StatCard value={stats.disponibles} label="Disponibles" accent />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <SearchInput
          value={filtros.busqueda}
          onChange={(value) => updateFiltro('busqueda', value)}
          placeholder="Buscar por nombre o email..."
          className="flex-1 min-w-[250px]"
        />
        <select
          value={filtros.habilidad}
          onChange={(e) => updateFiltro('habilidad', e.target.value)}
          className={selectClasses}
        >
          {FILTER_OPTIONS.habilidades.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={filtros.experiencia}
          onChange={(e) => updateFiltro('experiencia', e.target.value)}
          className={selectClasses}
        >
          {FILTER_OPTIONS.experiencia.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            onClick={clearFiltros}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4">
        <span className="text-sm text-slate-500">
          {candidatosFiltrados.length} candidato{candidatosFiltrados.length !== 1 ? 's' : ''} encontrado{candidatosFiltrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Candidates Grid */}
      {candidatosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidatosFiltrados.map((candidato) => (
            <CandidatePoolCard key={candidato.id} candidato={candidato} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

/**
 * Stat Card component
 */
const StatCard = ({ value, label, accent }) => (
  <div className={`
    bg-white border rounded-xl px-4 py-3 text-center shadow-sm
    ${accent ? 'border-l-4 border-l-emerald-500' : 'border-slate-200'}
  `}>
    <span className={`block text-2xl font-bold ${accent ? 'text-emerald-600' : 'text-slate-800'}`}>
      {value}
    </span>
    <span className="text-xs text-slate-500">{label}</span>
  </div>
);

/**
 * Empty State component
 */
const EmptyState = () => (
  <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
    <svg className="w-16 h-16 text-slate-200 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">No se encontraron candidatos</h3>
    <p className="text-slate-500">Intenta ajustar los filtros de búsqueda</p>
  </div>
);

export default Remanente;
