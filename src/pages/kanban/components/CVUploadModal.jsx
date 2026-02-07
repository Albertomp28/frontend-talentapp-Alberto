/**
 * CVUploadModal Component
 * Multi-step modal for uploading and analyzing CV.
 * 
 * @module pages/kanban/components/CVUploadModal
 */

import Modal from '../../../components/ui/Modal';
import { getScoreColor } from '../../../utils/formatters';

/**
 * CVUploadModal component
 */
const CVUploadModal = ({
    show,
    uploadStep,
    cvFile,
    cvData,
    analysisResult,
    vacantes,
    onFileChange,
    onDataChange,
    onAnalyze,
    onAddCandidate,
    onClose,
}) => {
    const inputClasses = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all";

    return (
        <Modal show={show} onClose={onClose} maxWidth="max-w-lg">
            {/* Close Button */}
            <button
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl"
                onClick={onClose}
            >
                ×
            </button>

            {/* Step 1: Upload Form */}
            {uploadStep === 1 && (
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">Cargar CV para Análisis</h2>
                        <p className="text-sm text-slate-500">Sube un CV y nuestra IA lo analizará</p>
                    </div>

                    {/* File Upload */}
                    <div className="mb-4">
                        <input
                            type="file"
                            id="cv-file"
                            accept=".pdf,.doc,.docx"
                            onChange={onFileChange}
                            hidden
                        />
                        <label
                            htmlFor="cv-file"
                            className={`
                block p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all
                ${cvFile
                                    ? 'border-emerald-400 bg-emerald-50'
                                    : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                                }
              `}
                        >
                            {cvFile ? (
                                <>
                                    <svg className="w-10 h-10 mx-auto mb-2 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                    <span className="text-slate-700 font-medium">{cvFile.name}</span>
                                    <span className="block text-xs text-slate-500">{(cvFile.size / 1024).toFixed(1)} KB</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-10 h-10 mx-auto mb-2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <span className="text-slate-500">Arrastra tu archivo aquí o haz clic</span>
                                    <span className="block text-xs text-slate-400">PDF, DOC o DOCX (máx. 5MB)</span>
                                </>
                            )}
                        </label>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm text-slate-700 mb-1">Nombre *</label>
                                <input
                                    type="text"
                                    value={cvData.nombre}
                                    onChange={(e) => onDataChange({ ...cvData, nombre: e.target.value })}
                                    placeholder="Juan Pérez"
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={cvData.email}
                                    onChange={(e) => onDataChange({ ...cvData, email: e.target.value })}
                                    placeholder="juan@email.com"
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    value={cvData.telefono}
                                    onChange={(e) => onDataChange({ ...cvData, telefono: e.target.value })}
                                    placeholder="+52 55 1234 5678"
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-700 mb-1">Vacante *</label>
                                <select
                                    value={cvData.vacanteId}
                                    onChange={(e) => onDataChange({ ...cvData, vacanteId: e.target.value })}
                                    className={inputClasses}
                                >
                                    <option value="">Seleccionar</option>
                                    {vacantes.map(v => (
                                        <option key={v.id} value={v.id}>{v.titulo}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:hover:shadow-none"
                            onClick={onAnalyze}
                            disabled={!cvFile || !cvData.nombre || !cvData.email || !cvData.vacanteId}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                            Analizar con IA
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Analyzing */}
            {uploadStep === 2 && (
                <div className="p-8 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Analizando CV con IA...</h2>
                    <p className="text-slate-500 mb-6">Extrayendo habilidades, experiencia y compatibilidad</p>
                    <div className="space-y-3 text-left max-w-xs mx-auto">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            Extrayendo información del CV
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span className="w-2 h-2 bg-slate-200 rounded-full" />
                            Evaluando habilidades técnicas
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span className="w-2 h-2 bg-slate-200 rounded-full" />
                            Calculando compatibilidad
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Results */}
            {uploadStep === 3 && analysisResult && (
                <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-white"
                            style={{ backgroundColor: getScoreColor(analysisResult.llmScore) }}
                        >
                            <span className="text-2xl font-bold">{analysisResult.llmScore}%</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Análisis Completado</h2>
                            <p className="text-slate-700">{cvData.nombre}</p>
                            <p className="text-sm text-slate-500 mt-1">{analysisResult.resumen}</p>
                        </div>
                    </div>

                    {/* Analysis Breakdown */}
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-slate-800 mb-3">Desglose del Análisis</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(analysisResult.llmAnalisis).map(([key, value]) => (
                                <div key={key} className="bg-slate-50 rounded-lg p-3">
                                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                                        <span className="capitalize">{key}</span>
                                        <span className="font-semibold text-slate-700">{value}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{ width: `${value}%`, backgroundColor: getScoreColor(value) }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-slate-800 mb-2">Habilidades Detectadas</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysisResult.skills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        {analysisResult.experienciaAnios} años de experiencia detectados
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                            onClick={onAddCandidate}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <line x1="20" y1="8" x2="20" y2="14" />
                                <line x1="23" y1="11" x2="17" y2="11" />
                            </svg>
                            Agregar a Aplicados
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CVUploadModal;
