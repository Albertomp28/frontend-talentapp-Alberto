import { useState } from 'react';
import {
    UBICACIONES,
    MODALIDADES,
    TIPOS_CONTRATO,
    MONEDAS,
    INPUT_CLASSES,
    INPUT_ERROR_CLASSES,
    LABEL_CLASSES
} from '../constants/vacanteConstants';
import { SparklesIcon } from '../../../components/ui/Icons';

/**
 * Step 2: Position details
 * - Location, Modality, Contract type
 * - Salary range (with AI estimation), Experience requirements
 *
 * @param {Object} props
 * @param {Object} props.fieldErrors - Per-field error messages from the hook
 */
const VacanteStep2 = ({
    vacante,
    setVacante,
    estimatingSalary = false,
    salaryReasoning = '',
    salaryEstimateError = '',
    onEstimateSalary,
    onDismissReasoning,
    fieldErrors = {},
}) => {
    const [showReasoning, setShowReasoning] = useState(false);

    const updateField = (field, value) => {
        setVacante({ ...vacante, [field]: value });
    };

    const handleDismissReasoning = () => {
        setShowReasoning(false);
        onDismissReasoning?.();
    };

    return (
        <div className="space-y-6 flex-1">
            <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800">Detalles del puesto</h2>
                <p className="text-slate-500 text-sm">Configura la ubicacion, modalidad y compensacion</p>
            </div>

            {/* Location, Modality, Contract Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className={LABEL_CLASSES}>
                        Ubicacion <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={fieldErrors.ubicacion ? INPUT_ERROR_CLASSES : INPUT_CLASSES}
                        value={vacante.ubicacion}
                        onChange={(e) => updateField('ubicacion', e.target.value)}
                        aria-invalid={!!fieldErrors.ubicacion}
                        aria-describedby={fieldErrors.ubicacion ? 'error-ubicacion' : undefined}
                    >
                        <option value="">Seleccionar...</option>
                        {UBICACIONES.map(ub => (
                            <option key={ub.value} value={ub.value}>{ub.label}</option>
                        ))}
                    </select>
                    {fieldErrors.ubicacion && (
                        <p id="error-ubicacion" className="mt-1 text-sm text-red-500">{fieldErrors.ubicacion}</p>
                    )}
                </div>
                <div>
                    <label className={LABEL_CLASSES}>
                        Modalidad <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={fieldErrors.modalidad ? INPUT_ERROR_CLASSES : INPUT_CLASSES}
                        value={vacante.modalidad}
                        onChange={(e) => updateField('modalidad', e.target.value)}
                        aria-invalid={!!fieldErrors.modalidad}
                        aria-describedby={fieldErrors.modalidad ? 'error-modalidad' : undefined}
                    >
                        <option value="">Seleccionar...</option>
                        {MODALIDADES.map(mod => (
                            <option key={mod.value} value={mod.value}>{mod.label}</option>
                        ))}
                    </select>
                    {fieldErrors.modalidad && (
                        <p id="error-modalidad" className="mt-1 text-sm text-red-500">{fieldErrors.modalidad}</p>
                    )}
                </div>
                <div>
                    <label className={LABEL_CLASSES}>
                        Tipo de contrato <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={fieldErrors.tipoContrato ? INPUT_ERROR_CLASSES : INPUT_CLASSES}
                        value={vacante.tipoContrato}
                        onChange={(e) => updateField('tipoContrato', e.target.value)}
                        aria-invalid={!!fieldErrors.tipoContrato}
                        aria-describedby={fieldErrors.tipoContrato ? 'error-tipoContrato' : undefined}
                    >
                        <option value="">Seleccionar...</option>
                        {TIPOS_CONTRATO.map(tipo => (
                            <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                        ))}
                    </select>
                    {fieldErrors.tipoContrato && (
                        <p id="error-tipoContrato" className="mt-1 text-sm text-red-500">{fieldErrors.tipoContrato}</p>
                    )}
                </div>
            </div>

            {/* Salary Section */}
            <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-800">Compensacion</h3>
                    <button
                        type="button"
                        onClick={onEstimateSalary}
                        disabled={estimatingSalary || !vacante.titulo}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all
                            bg-gradient-to-r from-violet-500 to-blue-500 text-white
                            hover:from-violet-600 hover:to-blue-600 hover:shadow-lg hover:shadow-violet-500/25
                            disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed"
                        title={!vacante.titulo ? 'Completa el titulo del puesto en el paso 1' : 'Estimar salario con IA'}
                    >
                        {estimatingSalary ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Estimando...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-4 h-4" />
                                Generar con IA
                            </>
                        )}
                    </button>
                </div>

                {/* AI estimation error */}
                {salaryEstimateError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                        {salaryEstimateError}
                    </div>
                )}

                {/* AI reasoning panel */}
                {salaryReasoning && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 rounded-xl">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2 min-w-0">
                                <SparklesIcon className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-violet-700 mb-1">Razonamiento de la IA</p>
                                    <p className={`text-sm text-slate-700 leading-relaxed ${!showReasoning ? 'line-clamp-3' : ''}`}>
                                        {salaryReasoning}
                                    </p>
                                    {salaryReasoning.length > 200 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowReasoning(!showReasoning)}
                                            className="text-sm text-violet-600 hover:text-violet-800 font-medium mt-1"
                                        >
                                            {showReasoning ? 'Ver menos' : 'Ver mas'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleDismissReasoning}
                                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                                aria-label="Cerrar razonamiento"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Currency selector */}
                <div className="mb-6">
                    <label className={LABEL_CLASSES}>Moneda</label>
                    <select
                        className={INPUT_CLASSES}
                        value={vacante.moneda}
                        onChange={(e) => updateField('moneda', e.target.value)}
                    >
                        {MONEDAS.map(mon => (
                            <option key={mon.value} value={mon.value}>{mon.label}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={LABEL_CLASSES}>Salario minimo</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                {MONEDAS.find(m => m.value === vacante.moneda)?.symbol || '$'}
                            </span>
                            <input
                                type="number"
                                className={`${INPUT_CLASSES} pl-7 ${estimatingSalary ? 'animate-pulse bg-violet-50' : ''}`}
                                value={vacante.salarioMin}
                                onChange={(e) => updateField('salarioMin', e.target.value)}
                                placeholder="25,000"
                                disabled={estimatingSalary}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={LABEL_CLASSES}>Salario maximo</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                {MONEDAS.find(m => m.value === vacante.moneda)?.symbol || '$'}
                            </span>
                            <input
                                type="number"
                                className={`${INPUT_CLASSES} pl-7 ${estimatingSalary ? 'animate-pulse bg-violet-50' : ''}`}
                                value={vacante.salarioMax}
                                onChange={(e) => updateField('salarioMax', e.target.value)}
                                placeholder="45,000"
                                disabled={estimatingSalary}
                            />
                        </div>
                    </div>
                </div>
                <label className="flex items-center gap-3 mt-4 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={vacante.mostrarSalario}
                        onChange={(e) => updateField('mostrarSalario', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 bg-white text-blue-500 focus:ring-blue-500/20"
                    />
                    <span className="text-sm text-slate-700">Mostrar rango salarial en la publicacion</span>
                </label>
            </div>

        </div>
    );
};

export default VacanteStep2;
