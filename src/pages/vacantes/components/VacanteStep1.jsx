import { DEPARTAMENTOS, INPUT_CLASSES, LABEL_CLASSES } from '../constants/vacanteConstants';

/**
 * Step 1: Basic vacancy information
 * - Title, Department, Description, Responsibilities
 */
const VacanteStep1 = ({ vacante, setVacante }) => {
    const updateField = (field, value) => {
        setVacante({ ...vacante, [field]: value });
    };

    return (
        <div className="space-y-6 flex-1">
            <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800">Información básica</h2>
                <p className="text-slate-500 text-sm">Define el título y descripción de la vacante</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={LABEL_CLASSES}>
                        Título del puesto <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className={INPUT_CLASSES}
                        value={vacante.titulo}
                        onChange={(e) => updateField('titulo', e.target.value)}
                        placeholder="Ej: Desarrollador Frontend Senior"
                    />
                </div>
                <div>
                    <label className={LABEL_CLASSES}>
                        Departamento <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={INPUT_CLASSES}
                        value={vacante.departamento}
                        onChange={(e) => updateField('departamento', e.target.value)}
                    >
                        <option value="">Seleccionar departamento</option>
                        {DEPARTAMENTOS.map(dep => (
                            <option key={dep} value={dep}>{dep}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className={LABEL_CLASSES}>
                    Descripción del puesto <span className="text-red-500">*</span>
                </label>
                <textarea
                    className={`${INPUT_CLASSES} resize-none h-48`}
                    value={vacante.descripcion}
                    onChange={(e) => updateField('descripcion', e.target.value)}
                    placeholder="Describe las funciones principales del puesto, el equipo de trabajo y los objetivos..."
                />
                <span className="text-xs text-slate-400 mt-1 block">{vacante.descripcion.length}/1000 caracteres</span>
            </div>

            <div>
                <label className={LABEL_CLASSES}>Responsabilidades principales</label>
                <textarea
                    className={`${INPUT_CLASSES} resize-none h-32`}
                    value={vacante.responsabilidades}
                    onChange={(e) => updateField('responsabilidades', e.target.value)}
                    placeholder="Lista las responsabilidades principales del puesto..."
                />
            </div>
        </div>
    );
};

export default VacanteStep1;
