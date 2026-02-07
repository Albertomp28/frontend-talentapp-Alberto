/**
 * CandidateDetailModal Component
 * Modal showing detailed candidate information.
 * 
 * @module pages/kanban/components/CandidateDetailModal
 */

import { Link } from 'react-router-dom';
import Modal from '../../../components/ui/Modal';
import { getInitials, getScoreColor } from '../../../utils/formatters';

/**
 * CandidateDetailModal component
 */
const CandidateDetailModal = ({
    show,
    candidato,
    onClose,
}) => {
    if (!candidato) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="max-w-lg">
            <div className="p-6">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl"
                    onClick={onClose}
                >
                    ×
                </button>

                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {getInitials(candidato.nombre)}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-slate-800">{candidato.nombre}</h2>
                        <p className="text-slate-500">{candidato.vacante}</p>
                    </div>
                    <div
                        className="px-4 py-2 rounded-xl text-white text-center"
                        style={{ backgroundColor: getScoreColor(candidato.llmScore) }}
                    >
                        <span className="text-2xl font-bold block">{candidato.llmScore}%</span>
                        <span className="text-xs">Match IA</span>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-2">
                            Información de Contacto
                        </h3>
                        <p className="text-sm text-slate-500">
                            <strong className="text-slate-700">Email:</strong> {candidato.email}
                        </p>
                        <p className="text-sm text-slate-500">
                            <strong className="text-slate-700">Teléfono:</strong> {candidato.telefono}
                        </p>
                        <p className="text-sm text-slate-500">
                            <strong className="text-slate-700">Experiencia:</strong> {candidato.experienciaAnios} años
                        </p>
                    </div>

                    {/* LLM Analysis */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-2">
                            Análisis del LLM
                        </h3>
                        <div className="space-y-2">
                            {Object.entries(candidato.llmAnalisis).map(([key, value]) => (
                                <div key={key}>
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                        <span className="capitalize">{key}</span>
                                        <span>{value}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${value}%`,
                                                backgroundColor: getScoreColor(value)
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-2">
                            Habilidades
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {candidato.skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
                    <Link
                        to={`/candidatos/${candidato.id}`}
                        className="flex-1 text-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all no-underline"
                    >
                        Ver Perfil Completo
                    </Link>
                    <button
                        className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CandidateDetailModal;
