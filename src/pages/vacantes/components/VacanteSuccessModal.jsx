import { useNavigate } from 'react-router-dom';

/**
 * Success modal displayed after vacancy creation/update
 */
const VacanteSuccessModal = ({
    show,
    isEditMode,
    vacante,
    vacanteUrl,
    createdVacanteId,
    copied,
    copyToClipboard
}) => {
    const navigate = useNavigate();

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-lg text-center shadow-2xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{isEditMode ? '¡Vacante actualizada!' : '¡Vacante publicada!'}</h2>
                <p className="text-slate-500 mb-6">Tu vacante <strong className="text-slate-800">{vacante.titulo}</strong> ha sido {isEditMode ? 'actualizada' : 'creada'} exitosamente.</p>

                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-medium text-slate-800 mb-3">Comparte este link con los candidatos</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={vacanteUrl}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm"
                        />
                        <button
                            onClick={copyToClipboard}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            {copied ? (
                                <>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Copiado
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                    Copiar
                                </>
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                        Los candidatos podrán ver la vacante y enviar su CV a <strong className="text-slate-500">{vacante.reclutadorEmail}</strong>
                    </p>
                </div>

                <div className="flex gap-3 justify-center">
                    <button
                        className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                        onClick={() => navigate(`/vacantes/${createdVacanteId}`)}
                    >
                        Ver vacante
                    </button>
                    <button
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                        onClick={() => navigate('/dashboard')}
                    >
                        Ir al Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VacanteSuccessModal;
