/**
 * VacantesFilters Component
 * Filter controls for the MisVacantes page.
 * 
 * @module pages/vacantes/components/VacantesFilters
 */

import { SearchInput } from '../../../components/ui';

/**
 * VacantesFilters component
 */
const VacantesFilters = ({
    busqueda,
    onBusquedaChange,
    filtroEstado,
    onFiltroChange,
}) => {
    const filterButtons = [
        { value: 'todas', label: 'Todas', activeColor: 'bg-blue-500 text-white border-blue-500' },
        { value: 'activa', label: 'Activas', activeColor: 'bg-emerald-500 text-white border-emerald-500' },
        { value: 'pausada', label: 'Pausadas', activeColor: 'bg-amber-500 text-white border-amber-500' },
    ];

    return (
        <div className="flex gap-4 mb-6 flex-wrap">
            <SearchInput
                value={busqueda}
                onChange={onBusquedaChange}
                placeholder="Buscar por título o departamento..."
                className="flex-1 min-w-[250px]"
            />
            <div className="flex gap-2">
                {filterButtons.map(({ value, label, activeColor }) => (
                    <button
                        key={value}
                        className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all border
              ${filtroEstado === value
                                ? activeColor
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                            }
            `}
                        onClick={() => onFiltroChange(value)}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VacantesFilters;
