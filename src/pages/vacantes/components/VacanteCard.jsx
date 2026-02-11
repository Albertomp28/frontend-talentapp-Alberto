/**
 * VacanteCard Component
 * Individual vacancy card for the MisVacantes grid.
 *
 * @module pages/vacantes/components/VacanteCard
 */

import { StatusBadge } from '../../../components/ui';
import {
    LocationIcon,
    CalendarIcon,
    EyeIcon,
    CopyIcon,
    EditIcon,
    PauseIcon,
    PlayIcon,
    TrashIcon
} from '../../../components/ui/Icons';
import { formatDate, truncateText } from '../../../utils/formatters';

/**
 * VacanteCard component
 */
const VacanteCard = ({
    vacante,
    onView,
    onEdit,
    onCopy,
    onPublish,
    onClose,
    onDelete,
}) => {
    const isDraft = vacante.estado === 'draft';
    const isPublished = vacante.estado === 'published';
    const isClosed = vacante.estado === 'closed';

    return (
        <div
            className={`
                bg-white border rounded-xl p-5 transition-all shadow-sm
                hover:shadow-md hover:border-slate-300
                ${isClosed ? 'border-slate-200 opacity-60' : 'border-slate-200'}
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
                        <LocationIcon className="w-3.5 h-3.5" />
                        {vacante.ubicacion || 'Sin ubicación'}
                    </span>
                    <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
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

            {/* Skills - Show desired skills (blue) */}
            {((vacante.habilidadesDeseadas?.length > 0) || (vacante.habilidades?.length > 0)) && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {(vacante.habilidadesDeseadas || vacante.habilidades || []).slice(0, 4).map((skill, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                        >
                            {skill}
                        </span>
                    ))}
                    {(vacante.habilidadesDeseadas || vacante.habilidades || []).length > 4 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                            +{(vacante.habilidadesDeseadas || vacante.habilidades || []).length - 4}
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
                {!isClosed && (
                    <ActionButton
                        icon={<EditIcon />}
                        title="Editar vacante"
                        onClick={() => onEdit(vacante.id)}
                    />
                )}
                {isDraft && (
                    <ActionButton
                        icon={<PlayIcon />}
                        title="Publicar vacante"
                        onClick={() => onPublish(vacante.id)}
                        className="text-emerald-500 hover:bg-emerald-50"
                    />
                )}
                {isPublished && (
                    <ActionButton
                        icon={<PauseIcon />}
                        title="Cerrar vacante"
                        onClick={() => onClose(vacante.id)}
                        className="text-orange-500 hover:bg-orange-50"
                    />
                )}
                {!isClosed && (
                    <ActionButton
                        icon={<TrashIcon />}
                        title="Eliminar vacante"
                        onClick={() => onDelete(vacante)}
                        variant="danger"
                        className="ml-auto"
                    />
                )}
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

export default VacanteCard;
