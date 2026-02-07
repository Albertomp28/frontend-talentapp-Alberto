/**
 * CandidatePoolCard Component
 * Candidate card for the Remanente pool grid.
 * 
 * @module components/candidates/CandidatePoolCard
 */

import { Link } from 'react-router-dom';
import { getInitials, formatDateShort, getScoreBgClass } from '../../utils/formatters';
import { candidateService } from '../../services';

/**
 * CandidatePoolCard component
 */
const CandidatePoolCard = ({ candidato }) => {
    const experienceLabel = candidateService.getExperienceLabel(candidato.experiencia);

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
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
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

// Icons
const BriefcaseIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const LocationIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export default CandidatePoolCard;
