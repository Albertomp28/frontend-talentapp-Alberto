/**
 * CandidatePoolCard Component
 * Candidate card for the Remanente pool grid.
 *
 * @module components/candidates/CandidatePoolCard
 */

import { Link } from 'react-router-dom';
import { getInitials, formatDateShort, getScoreBgClass, getExperienceLabel } from '../../utils/formatters';
import { BriefcaseIcon, LocationIcon, ClockIcon, ArrowRightIcon } from '../ui/Icons';

/**
 * CandidatePoolCard component
 */
const CandidatePoolCard = ({ candidato }) => {
    const experienceLabel = getExperienceLabel(candidato.experiencia);

    return (
        <div className="bg-white border border-neutral-200 rounded-card p-5 relative transition-all hover:border-neutral-300 hover:shadow-premium-md shadow-premium-sm">
            {/* Score Badge */}
            <div className={`absolute top-4 right-4 ${getScoreBgClass(candidato.score)} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm`}>
                {candidato.score}%
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-brand-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-premium-sm">
                    {getInitials(candidato.nombre)}
                </div>
                <div>
                    <h3 className="text-base font-semibold text-neutral-800">{candidato.nombre}</h3>
                    <span className="text-xs text-neutral-500">{candidato.email}</span>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
                <DetailRow
                    icon={<BriefcaseIcon />}
                    text={`${candidato.experiencia} años de experiencia`}
                    badge={experienceLabel}
                />
                <DetailRow
                    icon={<LocationIcon />}
                    text={candidato.ubicacion}
                />
                <DetailRow
                    icon={<ClockIcon />}
                    text={<>Disponibilidad: <strong className="text-neutral-700">{candidato.disponibilidad}</strong></>}
                />
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {candidato.habilidades.map((skill, index) => (
                    <span key={index} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs font-medium">
                        {skill}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <span className="text-xs text-neutral-300">
                    Evaluado: {formatDateShort(candidato.ultimaEvaluacion)}
                </span>
                <Link
                    to={`/candidatos/${candidato.id}`}
                    className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                    Ver Perfil
                    <ArrowRightIcon />
                </Link>
            </div>
        </div>
    );
};

// Helper Components
const DetailRow = ({ icon, text, badge }) => (
    <div className="flex items-center gap-2 text-sm text-neutral-500">
        <span className="text-neutral-300">{icon}</span>
        <span>{text}</span>
        {badge && (
            <span className="ml-auto px-2 py-0.5 bg-brand-50 text-brand-600 rounded text-xs font-medium">
                {badge}
            </span>
        )}
    </div>
);

export default CandidatePoolCard;
