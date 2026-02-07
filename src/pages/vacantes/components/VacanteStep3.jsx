import {
    HABILIDADES_SUGERIDAS,
    BENEFICIOS_SUGERIDOS,
    INPUT_CLASSES,
    LABEL_CLASSES
} from '../constants/vacanteConstants';

/**
 * Step 3: Skills, Benefits, and Contact Info
 */
const VacanteStep3 = ({
    vacante,
    setVacante,
    nuevaHabilidad,
    setNuevaHabilidad,
    nuevoBeneficio,
    setNuevoBeneficio,
    agregarHabilidad,
    agregarBeneficio
}) => {
    const updateField = (field, value) => {
        setVacante({ ...vacante, [field]: value });
    };

    return (
        <div className="space-y-6 flex-1">
            <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800">Requisitos y contacto</h2>
                <p className="text-slate-500 text-sm">Agrega habilidades, beneficios y datos de contacto</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Skills and Benefits */}
                <div className="space-y-8">
                    {/* Skills Section */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                            Habilidades
                        </h3>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                className={`${INPUT_CLASSES} flex-1`}
                                value={nuevaHabilidad}
                                onChange={(e) => setNuevaHabilidad(e.target.value)}
                                placeholder="Ej: React, SQL, Inglés..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        agregarHabilidad(nuevaHabilidad);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-sm"
                                onClick={() => agregarHabilidad(nuevaHabilidad)}
                            >
                                Agregar
                            </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Sugerencias:</span>
                            {HABILIDADES_SUGERIDAS
                                .filter(s => !vacante.habilidades.includes(s))
                                .slice(0, 5)
                                .map((skill, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="px-2 py-1 text-xs text-blue-600 bg-white border border-blue-100 rounded-md hover:bg-blue-50 transition-colors"
                                        onClick={() => agregarHabilidad(skill)}
                                    >
                                        + {skill}
                                    </button>
                                ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-4 italic">
                            Las habilidades agregadas aparecerán en el panel de resumen.
                        </p>
                    </div>

                    {/* Benefits Section */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            Beneficios
                        </h3>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                className={`${INPUT_CLASSES} flex-1`}
                                value={nuevoBeneficio}
                                onChange={(e) => setNuevoBeneficio(e.target.value)}
                                placeholder="Ej: Seguro médico, Home office..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        agregarBeneficio(nuevoBeneficio);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm hover:bg-emerald-700 transition-colors shadow-sm"
                                onClick={() => agregarBeneficio(nuevoBeneficio)}
                            >
                                Agregar
                            </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Sugerencias:</span>
                            {BENEFICIOS_SUGERIDOS
                                .filter(b => !vacante.beneficios.includes(b))
                                .slice(0, 4)
                                .map((beneficio, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="px-2 py-1 text-xs text-emerald-600 bg-white border border-emerald-100 rounded-md hover:bg-emerald-50 transition-colors"
                                        onClick={() => agregarBeneficio(beneficio)}
                                    >
                                        + {beneficio}
                                    </button>
                                ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-4 italic">
                            Los beneficios agregados aparecerán en el panel de resumen.
                        </p>
                    </div>
                </div>

                {/* Right Column: Contact Info */}
                <div className="space-y-6">
                    <div className="pt-2">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Datos de contacto</h3>
                        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <p className="text-sm text-slate-500 mb-4">Los candidatos enviarán su CV a este contacto:</p>

                            <div className="space-y-4">
                                <div>
                                    <label className={LABEL_CLASSES}>
                                        Nombre del reclutador <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={INPUT_CLASSES}
                                        value={vacante.reclutadorNombre}
                                        onChange={(e) => updateField('reclutadorNombre', e.target.value)}
                                        placeholder="Ej: María González"
                                    />
                                </div>
                                <div>
                                    <label className={LABEL_CLASSES}>
                                        Email para recibir CVs <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={INPUT_CLASSES}
                                        value={vacante.reclutadorEmail}
                                        onChange={(e) => updateField('reclutadorEmail', e.target.value)}
                                        placeholder="reclutamiento@empresa.com"
                                    />
                                </div>
                                <div>
                                    <label className={LABEL_CLASSES}>Teléfono (opcional)</label>
                                    <input
                                        type="tel"
                                        className={INPUT_CLASSES}
                                        value={vacante.reclutadorTelefono}
                                        onChange={(e) => updateField('reclutadorTelefono', e.target.value)}
                                        placeholder="+52 55..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VacanteStep3;
