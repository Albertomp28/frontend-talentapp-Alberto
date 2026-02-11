/**
 * MultiCVUploadModal Component
 * Multi-step modal for uploading and analyzing multiple CVs.
 *
 * @module pages/kanban/components/MultiCVUploadModal
 */

import { useRef, useCallback } from 'react';
import Modal from '../../../components/ui/Modal';
import {
    DocumentIcon,
    DocumentUploadIcon,
    UploadIcon,
    CheckIcon,
    ErrorIcon,
    QuestionIcon,
    UserPlusIcon,
    CloseIcon
} from '../../../components/ui/Icons';
import { getScoreColor } from '../../../utils/formatters';
import {
    formatFileSize,
    calculateScoreFromAnalysis,
    extractSkillsFromAnalysis,
    getMatchStats,
    mapRecommendation
} from '../../../utils/cvHelpers';
import { cvService } from '../../../services';

/**
 * Status badge component
 */
const StatusBadge = ({ status, progress }) => {
    const config = {
        pending: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Pendiente' },
        extracting: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Extrayendo...' },
        analyzing: { bg: 'bg-purple-100', text: 'text-purple-600', label: `Analizando ${progress}%` },
        deep_analyzing: { bg: 'bg-indigo-100', text: 'text-indigo-600', label: 'IA avanzada...' },
        completed: { bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'Completado' },
        error: { bg: 'bg-red-100', text: 'text-red-600', label: 'Error' },
    };

    const { bg, text, label } = config[status] || config.pending;

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
            {label}
        </span>
    );
};

/**
 * CV Item row for step 1
 */
const CVItemRow = ({
    item,
    vacantes,
    useGlobalVacante,
    onUpdateContact,
    onUpdateVacante,
    onRemove,
}) => {
    const isExtracting = item.status === 'extracting';

    return (
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <DocumentIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{item.fileName}</p>
                        <p className="text-xs text-slate-400">{formatFileSize(item.fileSize)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <StatusBadge status={item.status} progress={item.progress} />
                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                    >
                        <CloseIcon />
                    </button>
                </div>
            </div>

            {isExtracting ? (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                    Extrayendo datos...
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-2">
                    <input
                        type="text"
                        value={item.contactData?.nombre || ''}
                        onChange={(e) => onUpdateContact(item.id, { nombre: e.target.value })}
                        placeholder="Nombre *"
                        className="px-2 py-1.5 text-sm bg-white border border-slate-200 rounded-md outline-none focus:border-blue-500"
                    />
                    <input
                        type="email"
                        value={item.contactData?.email || ''}
                        onChange={(e) => onUpdateContact(item.id, { email: e.target.value })}
                        placeholder="Email *"
                        className="px-2 py-1.5 text-sm bg-white border border-slate-200 rounded-md outline-none focus:border-blue-500"
                    />
                    {!useGlobalVacante ? (
                        <select
                            value={item.vacanteId || ''}
                            onChange={(e) => onUpdateVacante(item.id, e.target.value)}
                            className="px-2 py-1.5 text-sm bg-white border border-slate-200 rounded-md outline-none focus:border-blue-500"
                        >
                            <option value="">Vacante *</option>
                            {vacantes.map((v) => (
                                <option key={v.id} value={v.id}>{v.titulo}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="tel"
                            value={item.contactData?.telefono || ''}
                            onChange={(e) => onUpdateContact(item.id, { telefono: e.target.value })}
                            placeholder="Teléfono"
                            className="px-2 py-1.5 text-sm bg-white border border-slate-200 rounded-md outline-none focus:border-blue-500"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * CV Item row for step 2 (processing)
 */
const CVItemProcessing = ({ item }) => {
    const statusColors = {
        pending: 'bg-slate-200',
        extracting: 'bg-blue-500',
        analyzing: 'bg-purple-500',
        deep_analyzing: 'bg-indigo-500',
        completed: 'bg-emerald-500',
        error: 'bg-red-500',
    };

    return (
        <div className="flex items-center gap-3 py-2">
            <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 truncate">{item.contactData?.nombre || item.fileName}</p>
                <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${statusColors[item.status]}`}
                        style={{ width: `${item.progress}%` }}
                    />
                </div>
            </div>
            <StatusBadge status={item.status} progress={item.progress} />
        </div>
    );
};

/**
 * CV Item row for step 3 (results)
 */
const CVItemResult = ({ item }) => {
    const analysisResult = item.analysisResult || {};
    const score = calculateScoreFromAnalysis(analysisResult);
    const skills = extractSkillsFromAnalysis(analysisResult);
    const matchStats = getMatchStats(analysisResult);

    // Determine recommendation level (map backend RECOMMEND/MAYBE/REJECT to frontend values)
    const recommendation = mapRecommendation(analysisResult.recommendation, score);
    const recommendationConfig = {
        'STRONG_MATCH': { bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Excelente', labelColor: 'text-emerald-600' },
        'REVIEW': { bg: 'bg-blue-50', border: 'border-blue-200', label: 'Revisar', labelColor: 'text-blue-600' },
        'CONSIDER': { bg: 'bg-amber-50', border: 'border-amber-200', label: 'Considerar', labelColor: 'text-amber-600' },
        'REJECT': { bg: 'bg-slate-50', border: 'border-slate-200', label: 'Bajo match', labelColor: 'text-slate-500' },
    };
    const recConfig = recommendationConfig[recommendation] || recommendationConfig['REJECT'];

    if (item.status === 'error') {
        return (
            <div className="flex items-center gap-3 py-2 px-3 bg-red-50 rounded-lg border border-red-200">
                <ErrorIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-red-700 truncate">{item.contactData?.nombre || item.fileName}</p>
                    <p className="text-xs text-red-500">
                        {typeof item.error === 'string'
                            ? item.error
                            : (item.error?.message || JSON.stringify(item.error) || 'Error desconocido')}
                    </p>
                </div>
            </div>
        );
    }

    const hasDeepAnalysis = !!item.deepAnalysis;
    const isDeepAnalyzing = item.status === 'deep_analyzing';

    return (
        <div className={`py-2.5 px-3 rounded-lg border ${recConfig.bg} ${recConfig.border}`}>
            <div className="flex items-center gap-3">
                <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: getScoreColor(score) }}
                >
                    {score}%
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-700 truncate">{item.contactData?.nombre || 'Sin nombre'}</p>
                        <span className={`text-xs font-medium ${recConfig.labelColor}`}>{recConfig.label}</span>
                        {isDeepAnalyzing && (
                            <span className="flex items-center gap-1 text-xs text-indigo-600">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                                IA avanzada...
                            </span>
                        )}
                        {hasDeepAnalysis && (
                            <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded text-xs font-medium">
                                IA Profundo
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        {/* Match ratio indicator */}
                        {matchStats.total > 0 && (
                            <span className="text-xs text-slate-500">
                                {matchStats.matched}/{matchStats.total} requisitos
                            </span>
                        )}
                        {/* Skills badges */}
                        <div className="flex flex-wrap gap-1">
                            {skills.slice(0, 4).map((skill, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-600 rounded text-xs">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Deep analysis summary (collapsed view) */}
            {hasDeepAnalysis && item.deepAnalysis.strengths?.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200/60">
                    <div className="flex flex-wrap gap-1">
                        {item.deepAnalysis.strengths.slice(0, 2).map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-xs">
                                {s.length > 40 ? s.substring(0, 37) + '...' : s}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * MultiCVUploadModal component
 */
const MultiCVUploadModal = ({
    show,
    onClose,
    vacantes = [],
    onAddCandidates,
    // From useMultiCVUpload hook
    cvItems,
    currentStep,
    globalVacanteId,
    useGlobalVacante,
    isProcessing,
    canStartAnalysis,
    completedItems,
    stats,
    setGlobalVacanteId,
    setUseGlobalVacante,
    addFiles,
    removeItem,
    updateContactData,
    updateItemVacante,
    startAnalysis,
    buildCandidates,
    clearAll,
    goToStep1,
}) => {
    const fileInputRef = useRef(null);

    const handleFileSelect = useCallback((e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const result = addFiles(files);
            if (result.errors.length > 0) {
                alert(result.errors.join('\n'));
            }
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [addFiles]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const result = addFiles(files);
            if (result.errors.length > 0) {
                alert(result.errors.join('\n'));
            }
        }
    }, [addFiles]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleAddCandidates = useCallback(() => {
        const candidates = buildCandidates();
        if (onAddCandidates && candidates.length > 0) {
            onAddCandidates(candidates);
        }
        onClose();
    }, [buildCandidates, onAddCandidates, onClose]);

    const handleClose = useCallback(() => {
        if (isProcessing) {
            if (!confirm('Hay un análisis en progreso. ¿Seguro que deseas cerrar?')) {
                return;
            }
        }
        clearAll();
        onClose();
    }, [isProcessing, clearAll, onClose]);

    // Calculate progress for step 2
    const overallProgress = cvItems.length > 0
        ? Math.round(cvItems.reduce((sum, item) => sum + item.progress, 0) / cvItems.length)
        : 0;

    return (
        <Modal show={show} onClose={handleClose} maxWidth="max-w-2xl">
            {/* Close Button */}
            <button
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl z-10"
                onClick={handleClose}
            >
                &times;
            </button>

            {/* Step 1: Upload */}
            {currentStep === 1 && (
                <div className="p-6">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center">
                            <DocumentUploadIcon className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">Análisis Masivo de CVs</h2>
                        <p className="text-sm text-slate-500">
                            Sube hasta {cvService.MAX_FILES_PER_BATCH} CVs y analízalos con IA
                        </p>
                    </div>

                    {/* Drop Zone */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors cursor-pointer mb-4"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <UploadIcon className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                        <p className="text-slate-500">Arrastra archivos aquí o haz clic para seleccionar</p>
                        <p className="text-xs text-slate-400 mt-1">PDF, DOC o DOCX (máx. 5MB cada uno)</p>
                    </div>

                    {/* Vacancy Selection */}
                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-slate-700">Asignación de Vacante</label>
                            <button
                                onClick={() => setUseGlobalVacante(!useGlobalVacante)}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                {useGlobalVacante ? 'Asignar individual' : 'Usar global'}
                            </button>
                        </div>
                        {useGlobalVacante ? (
                            <select
                                value={globalVacanteId}
                                onChange={(e) => setGlobalVacanteId(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                            >
                                <option value="">Seleccionar vacante para todos</option>
                                {vacantes.map((v) => (
                                    <option key={v.id} value={v.id}>{v.titulo}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-xs text-slate-500">Selecciona la vacante para cada CV en la lista</p>
                        )}
                    </div>

                    {/* CV Items List */}
                    {cvItems.length > 0 && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-slate-700">
                                    Archivos ({cvItems.length}/{cvService.MAX_FILES_PER_BATCH})
                                </h3>
                                <button
                                    onClick={() => cvItems.forEach((item) => removeItem(item.id))}
                                    className="text-xs text-red-500 hover:underline"
                                >
                                    Eliminar todos
                                </button>
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {cvItems.map((item) => (
                                    <CVItemRow
                                        key={item.id}
                                        item={item}
                                        vacantes={vacantes}
                                        useGlobalVacante={useGlobalVacante}
                                        onUpdateContact={updateContactData}
                                        onUpdateVacante={updateItemVacante}
                                        onRemove={removeItem}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={startAnalysis}
                            disabled={!canStartAnalysis}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                        >
                            <QuestionIcon className="w-5 h-5" />
                            Analizar {cvItems.length || 0} CV{cvItems.length !== 1 ? 's' : ''}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Processing */}
            {currentStep === 2 && (
                <div className="p-8">
                    {/* Progress Circle */}
                    <div className="text-center mb-6">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 45}`}
                                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - overallProgress / 100)}`}
                                    className="transition-all duration-300"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-slate-800">{overallProgress}%</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">Analizando CVs...</h2>
                        <p className="text-sm text-slate-500">
                            {completedItems.length} de {cvItems.length} completados
                        </p>
                    </div>

                    {/* Items Progress */}
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                        {cvItems.map((item) => (
                            <CVItemProcessing key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Processing info */}
                    <div className="mt-6 text-center text-xs text-slate-400">
                        Extrayendo información y evaluando compatibilidad con IA
                    </div>
                </div>
            )}

            {/* Step 3: Results */}
            {currentStep === 3 && (
                <div className="p-6">
                    {/* Header with Stats */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CheckIcon className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">Análisis Completado</h2>
                        <p className="text-sm text-slate-500">
                            {stats.successCount} de {stats.total} CVs analizados exitosamente
                        </p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-slate-800">{stats.successCount}</p>
                            <p className="text-xs text-slate-500">Completados</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-slate-800">{stats.avgScore}%</p>
                            <p className="text-xs text-slate-500">Score Promedio</p>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-emerald-600">{stats.highMatch}</p>
                            <p className="text-xs text-emerald-600">Alto Match (85%+)</p>
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Resultados</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {cvItems.map((item) => (
                                <CVItemResult key={item.id} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={goToStep1}
                            className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                        >
                            Volver
                        </button>
                        <button
                            onClick={handleAddCandidates}
                            disabled={completedItems.length === 0}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <UserPlusIcon className="w-5 h-5" />
                            Agregar {completedItems.length} Candidato{completedItems.length !== 1 ? 's' : ''} al Pipeline
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default MultiCVUploadModal;
