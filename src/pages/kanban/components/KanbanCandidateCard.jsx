/**
 * KanbanCandidateCard Component
 * Draggable candidate card for the Kanban board.
 * 
 * @module pages/kanban/components/KanbanCandidateCard
 */

import { Link } from 'react-router-dom';
import { getInitials, getScoreColor } from '../../../utils/formatters';

/**
 * KanbanCandidateCard component
 */
const KanbanCandidateCard = ({
    candidato,
    onDragStart,
    onDragEnd,
    onClick,
}) => {
    return (
        <div
            className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 cursor-grab 
                 hover:border-neutral-300 hover:shadow-premium-sm transition-all relative"
            draggable
            onDragStart={(e) => onDragStart(e, candidato)}
            onDragEnd={onDragEnd}
            onClick={onClick}
        >
            {/* Score Badge */}
            <div
                className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: getScoreColor(candidato.llmScore) }}
            >
                {candidato.llmScore}%
            </div>

            {/* Candidate Info */}
            <div className="flex items-center gap-2 mb-2 pr-12">
                <div className="w-9 h-9 bg-linear-to-br from-brand-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-premium-sm">
                    {getInitials(candidato.nombre)}
                </div>
                <div className="overflow-hidden">
                    <h4 className="text-sm font-medium text-neutral-800 truncate">
                        {candidato.nombre}
                    </h4>
                    <p className="text-xs text-neutral-500 truncate">
                        {candidato.vacante}
                    </p>
                </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-2">
                {candidato.skills.slice(0, 3).map((skill, idx) => (
                    <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded text-[10px] font-medium"
                    >
                        {skill}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">
                    {candidato.experienciaAnios} años exp.
                </span>
                <Link
                    to={`/candidatos/${candidato.id}`}
                    className="text-brand-600 hover:text-brand-700 font-medium hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    Ver perfil
                </Link>
            </div>
        </div>
    );
};

export default KanbanCandidateCard;
