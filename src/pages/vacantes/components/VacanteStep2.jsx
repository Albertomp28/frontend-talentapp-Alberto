import {
    UBICACIONES,
    MODALIDADES,
    TIPOS_CONTRATO,
    INPUT_CLASSES,
    LABEL_CLASSES
} from '../constants/vacanteConstants';

/**
 * Step 2: Position details
 * - Location, Modality, Contract type
 * - Salary range, Experience requirements
 */
const VacanteStep2 = ({ vacante, setVacante }) => {
    const updateField = (field, value) => {
        setVacante({ ...vacante, [field]: value });
    };

    return (
        <div className="space-y-6 flex-1">
            <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800">Detalles del puesto</h2>
                <p className="text-slate-500 text-sm">Configura la ubicación, modalidad y compensación</p>
            </div>

            {/* Location, Modality, Contract Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className={LABEL_CLASSES}>
                        Ubicación <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={INPUT_CLASSES}
                        value={vacante.ubicacion}
                        onChange={(e) => updateField('ubicacion', e.target.value)}
                    >
                        <option value="">Seleccionar...</option>
                        {UBICACIONES.map(ub => (
                            <option key={ub.value} value={ub.value}>{ub.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={LABEL_CLASSES}>
                        Modalidad <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={INPUT_CLASSES}
                        value={vacante.modalidad}
                        onChange={(e) => updateField('modalidad', e.target.value)}
                    >
                        <option value="">Seleccionar...</option>
                        {MODALIDADES.map(mod => (
                            <option key={mod.value} value={mod.value}>{mod.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={LABEL_CLASSES}>
                        Tipo de contrato <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={INPUT_CLASSES}
                        value={vacante.tipoContrato}
                        onChange={(e) => updateField('tipoContrato', e.target.value)}
                    >
                        <option value="">Seleccionar...</option>
                        {TIPOS_CONTRATO.map(tipo => (
                            <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Salary Section */}
            <div className="pt-6 border-t border-slate-200">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Compensación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={LABEL_CLASSES}>Salario mínimo (MXN)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                            <input
                                type="number"
                                className={`${INPUT_CLASSES} pl-7`}
                                value={vacante.salarioMin}
                                onChange={(e) => updateField('salarioMin', e.target.value)}
                                placeholder="25,000"
                            />
                        </div>
                    </div>
                    <div>
                        <label className={LABEL_CLASSES}>Salario máximo (MXN)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                            <input
                                type="number"
                                className={`${INPUT_CLASSES} pl-7`}
                                value={vacante.salarioMax}
                                onChange={(e) => updateField('salarioMax', e.target.value)}
                                placeholder="45,000"
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
                    <span className="text-sm text-slate-700">Mostrar rango salarial en la publicación</span>
                </label>
            </div>

            {/* Experience Section */}
            <div className="pt-6 border-t border-slate-200">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Experiencia requerida</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={LABEL_CLASSES}>Mínima (años)</label>
                        <input
                            type="number"
                            className={INPUT_CLASSES}
                            value={vacante.experienciaMin}
                            onChange={(e) => updateField('experienciaMin', e.target.value)}
                            placeholder="2"
                            min="0"
                            max="20"
                        />
                    </div>
                    <div>
                        <label className={LABEL_CLASSES}>Máxima (años)</label>
                        <input
                            type="number"
                            className={INPUT_CLASSES}
                            value={vacante.experienciaMax}
                            onChange={(e) => updateField('experienciaMax', e.target.value)}
                            placeholder="5"
                            min="0"
                            max="20"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VacanteStep2;
