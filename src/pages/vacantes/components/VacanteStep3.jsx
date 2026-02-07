import { useState } from 'react';
import {
    INPUT_CLASSES,
    LABEL_CLASSES
} from '../constants/vacanteConstants';
import { getAISuggestions } from '../../../services';

/**
 * Step 3: Skills, Benefits, and Contact Info
 */
const VacanteStep3 = ({
    vacante,
    setVacante,
    nuevoRequisitoMinimo,
    setNuevoRequisitoMinimo,
    nuevaHabilidadDeseada,
    setNuevaHabilidadDeseada,
    nuevoBeneficio,
    setNuevoBeneficio,
    agregarRequisitoMinimo,
    agregarHabilidadDeseada,
    agregarBeneficio
}) => {
    const [showRequisitosDropdown, setShowRequisitosDropdown] = useState(false);
    const [showHabilidadesDropdown, setShowHabilidadesDropdown] = useState(false);
    const [showBeneficiosDropdown, setShowBeneficiosDropdown] = useState(false);

    // AI suggestions states
    const [aiRequisitos, setAiRequisitos] = useState([]);
    const [aiHabilidades, setAiHabilidades] = useState([]);
    const [aiBeneficios, setAiBeneficios] = useState([]);
    const [loadingRequisitos, setLoadingRequisitos] = useState(false);
    const [loadingHabilidades, setLoadingHabilidades] = useState(false);
    const [loadingBeneficios, setLoadingBeneficios] = useState(false);
    const [aiError, setAiError] = useState(null);

    const updateField = (field, value) => {
        setVacante({ ...vacante, [field]: value });
    };

    // Function to get AI suggestions
    const fetchAISuggestions = async (tipo) => {
        if (!vacante.titulo || !vacante.departamento) {
            setAiError('Completa el título y departamento primero');
            return;
        }

        setAiError(null);

        try {
            if (tipo === 'requisitos') {
                setLoadingRequisitos(true);
                const suggestions = await getAISuggestions(vacante.titulo, vacante.departamento, 'requisitos');
                if (suggestions) setAiRequisitos(suggestions);
            } else if (tipo === 'habilidades') {
                setLoadingHabilidades(true);
                const suggestions = await getAISuggestions(vacante.titulo, vacante.departamento, 'habilidades');
                if (suggestions) setAiHabilidades(suggestions);
            } else if (tipo === 'beneficios') {
                setLoadingBeneficios(true);
                const suggestions = await getAISuggestions(vacante.titulo, vacante.departamento, 'beneficios');
                if (suggestions) setAiBeneficios(suggestions);
            }
        } catch (error) {
            setAiError('Error al obtener sugerencias de IA');
            console.error(error);
        } finally {
            setLoadingRequisitos(false);
            setLoadingHabilidades(false);
            setLoadingBeneficios(false);
        }
    };

    // Handle dropdown toggle with AI fetch
    const handleRequisitosDropdown = () => {
        const newState = !showRequisitosDropdown;
        setShowRequisitosDropdown(newState);
        if (newState && aiRequisitos.length === 0) {
            fetchAISuggestions('requisitos');
        }
    };

    const handleHabilidadesDropdown = () => {
        const newState = !showHabilidadesDropdown;
        setShowHabilidadesDropdown(newState);
        if (newState && aiHabilidades.length === 0) {
            fetchAISuggestions('habilidades');
        }
    };

    const handleBeneficiosDropdown = () => {
        const newState = !showBeneficiosDropdown;
        setShowBeneficiosDropdown(newState);
        if (newState && aiBeneficios.length === 0) {
            fetchAISuggestions('beneficios');
        }
    };

    return (
        <div className="space-y-6 flex-1">
            <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800">Requisitos y contacto</h2>
                <p className="text-slate-500 text-sm">Agrega habilidades, beneficios y datos de contacto</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Skills and Benefits */}
                <div className="space-y-6">
                    {/* Minimum Requirements Section */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 11l3 3L22 4"></path>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                            Requisitos Mínimos
                            <span className="text-xs font-normal text-slate-500">(Obligatorios)</span>
                        </h3>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                className={`${INPUT_CLASSES} flex-1`}
                                value={nuevoRequisitoMinimo}
                                onChange={(e) => setNuevoRequisitoMinimo(e.target.value)}
                                placeholder="Ej: Bachiller en Ingeniería, Mayor de 21 años..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        agregarRequisitoMinimo(nuevoRequisitoMinimo);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600 transition-colors shadow-sm"
                                onClick={() => agregarRequisitoMinimo(nuevoRequisitoMinimo)}
                            >
                                Agregar
                            </button>
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                                onClick={handleRequisitosDropdown}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                Sugerencias
                                <svg className={`w-4 h-4 transition-transform ${showRequisitosDropdown ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            {showRequisitosDropdown && (
                                <div className="absolute z-10 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-semibold text-slate-700">Requisitos sugeridos</span>
                                        <button
                                            type="button"
                                            onClick={() => setShowRequisitosDropdown(false)}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* AI Suggestions Section */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path>
                                            <circle cx="7.5" cy="14.5" r="1.5"></circle>
                                            <circle cx="16.5" cy="14.5" r="1.5"></circle>
                                        </svg>
                                        <span className="text-xs font-semibold text-purple-600">Sugerencias IA</span>
                                        <span className="text-[10px] text-slate-400">basadas en "{vacante.titulo || 'puesto'}"</span>
                                    </div>
                                    {loadingRequisitos ? (
                                        <div className="flex items-center justify-center py-6">
                                            <div className="w-5 h-5 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                                            <span className="ml-2 text-xs text-slate-500">Generando sugerencias...</span>
                                        </div>
                                    ) : aiError && aiRequisitos.length === 0 ? (
                                        <p className="text-xs text-red-500 py-2">{aiError}</p>
                                    ) : aiRequisitos.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                            {aiRequisitos
                                                .filter(r => !vacante.requisitosMinimos.includes(r))
                                                .map((requisito, index) => (
                                                    <button
                                                        key={`ai-${index}`}
                                                        type="button"
                                                        className="px-3 py-1.5 text-xs text-orange-600 bg-orange-50 border border-orange-100 rounded-lg hover:bg-orange-100 transition-colors"
                                                        onClick={() => agregarRequisitoMinimo(requisito)}
                                                    >
                                                        + {requisito}
                                                    </button>
                                                ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 py-4 text-center">Completa el título y departamento para obtener sugerencias personalizadas</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 mt-4 italic">
                            Requisitos indispensables para aplicar al puesto.
                        </p>
                    </div>

                    {/* Desired Skills Section */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                            Habilidades Deseadas
                            <span className="text-xs font-normal text-slate-500">(Nice to have)</span>
                        </h3>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                className={`${INPUT_CLASSES} flex-1`}
                                value={nuevaHabilidadDeseada}
                                onChange={(e) => setNuevaHabilidadDeseada(e.target.value)}
                                placeholder="Ej: React, SQL, Docker, AWS..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        agregarHabilidadDeseada(nuevaHabilidadDeseada);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-sm"
                                onClick={() => agregarHabilidadDeseada(nuevaHabilidadDeseada)}
                            >
                                Agregar
                            </button>
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                                onClick={handleHabilidadesDropdown}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                Sugerencias
                                <svg className={`w-4 h-4 transition-transform ${showHabilidadesDropdown ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            {showHabilidadesDropdown && (
                                <div className="absolute z-10 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-semibold text-slate-700">Habilidades sugeridas</span>
                                        <button
                                            type="button"
                                            onClick={() => setShowHabilidadesDropdown(false)}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* AI Suggestions Section */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path>
                                            <circle cx="7.5" cy="14.5" r="1.5"></circle>
                                            <circle cx="16.5" cy="14.5" r="1.5"></circle>
                                        </svg>
                                        <span className="text-xs font-semibold text-purple-600">Sugerencias IA</span>
                                        <span className="text-[10px] text-slate-400">basadas en "{vacante.titulo || 'puesto'}"</span>
                                    </div>
                                    {loadingHabilidades ? (
                                        <div className="flex items-center justify-center py-6">
                                            <div className="w-5 h-5 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                                            <span className="ml-2 text-xs text-slate-500">Generando sugerencias...</span>
                                        </div>
                                    ) : aiError && aiHabilidades.length === 0 ? (
                                        <p className="text-xs text-red-500 py-2">{aiError}</p>
                                    ) : aiHabilidades.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                            {aiHabilidades
                                                .filter(h => !vacante.habilidadesDeseadas.includes(h))
                                                .map((habilidad, index) => (
                                                    <button
                                                        key={`ai-${index}`}
                                                        type="button"
                                                        className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                                                        onClick={() => agregarHabilidadDeseada(habilidad)}
                                                    >
                                                        + {habilidad}
                                                    </button>
                                                ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 py-4 text-center">Completa el título y departamento para obtener sugerencias personalizadas</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 mt-4 italic">
                            Habilidades técnicas que suman pero no son obligatorias.
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
                        <div className="relative">
                            <button
                                type="button"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
                                onClick={handleBeneficiosDropdown}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                Sugerencias
                                <svg className={`w-4 h-4 transition-transform ${showBeneficiosDropdown ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            {showBeneficiosDropdown && (
                                <div className="absolute z-10 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-semibold text-slate-700">Beneficios sugeridos</span>
                                        <button
                                            type="button"
                                            onClick={() => setShowBeneficiosDropdown(false)}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* AI Suggestions Section */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path>
                                            <circle cx="7.5" cy="14.5" r="1.5"></circle>
                                            <circle cx="16.5" cy="14.5" r="1.5"></circle>
                                        </svg>
                                        <span className="text-xs font-semibold text-purple-600">Sugerencias IA</span>
                                        <span className="text-[10px] text-slate-400">basadas en "{vacante.titulo || 'puesto'}"</span>
                                    </div>
                                    {loadingBeneficios ? (
                                        <div className="flex items-center justify-center py-6">
                                            <div className="w-5 h-5 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                                            <span className="ml-2 text-xs text-slate-500">Generando sugerencias...</span>
                                        </div>
                                    ) : aiError && aiBeneficios.length === 0 ? (
                                        <p className="text-xs text-red-500 py-2">{aiError}</p>
                                    ) : aiBeneficios.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                            {aiBeneficios
                                                .filter(b => !vacante.beneficios.includes(b))
                                                .map((beneficio, index) => (
                                                    <button
                                                        key={`ai-${index}`}
                                                        type="button"
                                                        className="px-3 py-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors"
                                                        onClick={() => agregarBeneficio(beneficio)}
                                                    >
                                                        + {beneficio}
                                                    </button>
                                                ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 py-4 text-center">Completa el título y departamento para obtener sugerencias personalizadas</p>
                                    )}
                                </div>
                            )}
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
