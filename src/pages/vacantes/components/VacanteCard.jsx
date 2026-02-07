/**
 * VacanteCard Component
 * Individual vacancy card for the MisVacantes grid.
 * 
 * @module pages/vacantes/components/VacanteCard
 */

import { StatusBadge } from '../../../components/ui';
import { formatDate, truncateText } from '../../../utils/formatters';

/**
 * VacanteCard component
 */
const VacanteCard = ({
    vacante,
    onView,
    onEdit,
    onCopy,
    onToggleStatus,
    onDelete,
}) => {
    const isActive = vacante.estado === 'activa';

    return (
        <div
            className={`
        bg-white border rounded-xl p-5 transition-all shadow-sm 
        hover:shadow-md hover:border-slate-300
        ${isActive ? 'border-slate-200' : 'border-slate-200 opacity-75'}
      `}
        >
            {/* Header */}
            <div className="mb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-semibold text-slate-800 leading-tight">
                        {vacante.titulo}
                    </h3>
                    <StatusBadge status={vacante.estado} />
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {vacante.ubicacion || 'Sin ubicación'}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDate(vacante.fechaCreacion)}
                    </span>
                </div>
            </div>

            {/* Description */}
            {vacante.descripcion && (
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                    {truncateText(vacante.descripcion, 120)}
                </p>
            )}

            {/* Skills */}
            {vacante.habilidades?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {vacante.habilidades.slice(0, 4).map((skill, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                        >
                            {skill}
                        </span>
                    ))}
                    {vacante.habilidades.length > 4 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                            +{vacante.habilidades.length - 4}
                        </span>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-slate-100">
                <ActionButton
                    icon={<EyeIcon />}
                    title="Ver vacante"
                    onClick={() => onView(vacante.id)}
                />
                <ActionButton
                    icon={<CopyIcon />}
                    title="Copiar enlace"
                    onClick={() => onCopy(vacante.id)}
                />
                <ActionButton
                    icon={<EditIcon />}
                    title="Editar vacante"
                    onClick={() => onEdit(vacante.id)}
                />
                <ActionButton
                    icon={isActive ? <PauseIcon /> : <PlayIcon />}
                    title={isActive ? 'Pausar vacante' : 'Activar vacante'}
                    onClick={() => onToggleStatus(vacante.id)}
                    className={isActive ? '' : 'text-emerald-500 hover:bg-emerald-50'}
                />
                <ActionButton
                    icon={<TrashIcon />}
                    title="Eliminar vacante"
                    onClick={() => onDelete(vacante)}
                    variant="danger"
                    className="ml-auto"
                />
            </div>
        </div>
    );
};

// Action Button Component
const ActionButton = ({ icon, title, onClick, variant, className = '' }) => {
    const baseClasses = "p-2 rounded-lg transition-colors";
    const variantClasses = variant === 'danger'
        ? "text-slate-400 hover:bg-red-50 hover:text-red-500"
        : "text-slate-400 hover:bg-slate-100 hover:text-blue-600";

    return (
        <button
            className={`${baseClasses} ${variantClasses} ${className}`}
            onClick={onClick}
            title={title}
        >
            {icon}
        </button>
    );
};

// Icon Components
const EyeIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const CopyIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const EditIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const PauseIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
    </svg>
);

const PlayIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const TrashIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

export default VacanteCard;
