import { useState } from 'react';
import { INPUT_CLASSES, INPUT_ERROR_CLASSES, LABEL_CLASSES } from '../constants/vacanteConstants';
import { getAISuggestions } from '../../../services';

/**
 * Step 1: Basic vacancy information
 * - Title, Department, Description, Responsibilities
 *
 * @param {Object} props
 * @param {Object} props.fieldErrors - Per-field error messages from the hook
 */
const VacanteStep1 = ({ vacante, setVacante, departments = [], fieldErrors = {} }) => {
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  const updateField = (field, value) => {
    setVacante({ ...vacante, [field]: value });
  };

  const handleDepartmentChange = (e) => {
    const selectedId = e.target.value;
    const selectedDept = departments.find((d) => d.id === selectedId);
    setVacante({
      ...vacante,
      departamentoId: selectedId,
      departamento: selectedDept?.name || '',
    });
  };

  // Generar descripción y responsabilidades con IA
  const generateWithAI = async () => {
    if (!vacante.titulo || !vacante.departamento) {
      setAiError('Completa el título y departamento primero');
      return;
    }

    setGeneratingAI(true);
    setAiError(null);

    try {
      const result = await getAISuggestions(vacante.titulo, vacante.departamento, 'descripcion');

      if (result && result.descripcion) {
        setVacante({
          ...vacante,
          descripcion: result.descripcion,
          responsabilidades: result.responsabilidades || '',
        });
      } else {
        setAiError('No se pudo generar la descripción');
      }
    } catch (error) {
      console.error('Error generando descripción:', error);
      setAiError('Error al conectar con el servicio de IA');
    } finally {
      setGeneratingAI(false);
    }
  };

  const canGenerateAI = vacante.titulo && vacante.departamento;

  return (
    <div className="space-y-6 flex-1">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">Información básica</h2>
        <p className="text-slate-500 text-sm">Define el título y descripción de la vacante</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={LABEL_CLASSES}>
            Titulo del puesto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={fieldErrors.titulo ? INPUT_ERROR_CLASSES : INPUT_CLASSES}
            value={vacante.titulo}
            onChange={(e) => updateField('titulo', e.target.value)}
            placeholder="Ej: Desarrollador Frontend Senior"
            aria-invalid={!!fieldErrors.titulo}
            aria-describedby={fieldErrors.titulo ? 'error-titulo' : undefined}
          />
          {fieldErrors.titulo && (
            <p id="error-titulo" className="mt-1 text-sm text-red-500">{fieldErrors.titulo}</p>
          )}
        </div>
        <div>
          <label className={LABEL_CLASSES}>
            Departamento <span className="text-red-500">*</span>
          </label>
          <select
            className={fieldErrors.departamentoId ? INPUT_ERROR_CLASSES : INPUT_CLASSES}
            value={vacante.departamentoId}
            onChange={handleDepartmentChange}
            aria-invalid={!!fieldErrors.departamentoId}
            aria-describedby={fieldErrors.departamentoId ? 'error-departamento' : undefined}
          >
            <option value="">Seleccionar departamento</option>
            {departments.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
          {fieldErrors.departamentoId && (
            <p id="error-departamento" className="mt-1 text-sm text-red-500">{fieldErrors.departamentoId}</p>
          )}
        </div>
      </div>

            {/* Botón Generar con IA */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={generateWithAI}
                        disabled={!canGenerateAI || generatingAI}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            canGenerateAI && !generatingAI
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {generatingAI ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Generando...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path>
                                    <circle cx="7.5" cy="14.5" r="1.5"></circle>
                                    <circle cx="16.5" cy="14.5" r="1.5"></circle>
                                </svg>
                                Generar con IA
                            </>
                        )}
                    </button>
                    {!canGenerateAI && (
                        <span className="text-xs text-slate-400">Completa título y departamento primero</span>
                    )}
                </div>
                {aiError && (
                    <span className="text-xs text-red-500">{aiError}</span>
                )}
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
                <label className={LABEL_CLASSES}>
                    Responsabilidades principales <span className="text-red-500">*</span>
                </label>
                <textarea
                    className={`${fieldErrors.responsabilidades ? INPUT_ERROR_CLASSES : INPUT_CLASSES} resize-none h-32`}
                    value={vacante.responsabilidades}
                    onChange={(e) => updateField('responsabilidades', e.target.value)}
                    placeholder="Lista las responsabilidades principales del puesto..."
                    aria-invalid={!!fieldErrors.responsabilidades}
                    aria-describedby={fieldErrors.responsabilidades ? 'error-responsabilidades' : undefined}
                />
                {fieldErrors.responsabilidades && (
                    <p id="error-responsabilidades" className="mt-1 text-sm text-red-500">{fieldErrors.responsabilidades}</p>
                )}
            </div>
        </div>
    );
};

export default VacanteStep1;
