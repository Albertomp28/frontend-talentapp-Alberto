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
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {isEditMode ? '¡Vacante actualizada!' : '¡Vacante creada!'}
                </h2>
                <p className="text-slate-500 mb-6">
                  Tu vacante <strong className="text-slate-800">{vacante.titulo}</strong> ha sido{' '}
                  {isEditMode ? 'actualizada' : 'creada'} exitosamente.
                  {!isEditMode && (
                    <span className="block mt-2 text-sm">
                      La vacante está en estado <strong className="text-amber-600">borrador</strong>.
                      Puedes publicarla desde "Mis Vacantes".
                    </span>
                  )}
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                        onClick={() => navigate('/vacantes/crear')}
                    >
                        Crear otra
                    </button>
                    <button
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                        onClick={() => navigate('/mis-vacantes')}
                    >
                        Ir a Mis Vacantes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VacanteSuccessModal;
