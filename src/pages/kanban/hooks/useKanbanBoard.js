/**
 * useKanbanBoard Hook
 * Custom hook for managing the KanbanBoard state and logic.
 *
 * @module pages/kanban/hooks/useKanbanBoard
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { candidateService, cvService, vacancyService } from '../../../services';
import { getScoreColor } from '../../../utils/formatters';
import {
    calculateScoreFromAnalysis,
    extractSkillsFromAnalysis,
    mapRecommendation
} from '../../../utils/cvHelpers';
import { useMultiCVUpload } from './useMultiCVUpload';

/**
 * Map backend vacancy to format expected by CV processor
 */
const mapVacancyForCV = (vacancy) => ({
    id: vacancy.id,
    titulo: vacancy.titulo,
    descripcion: vacancy.descripcion || vacancy.responsabilidades || '',
    departamento: vacancy.departamento,
    nivel: 'mid', // Default, backend doesn't have this field yet
    requisitos: [
        ...(vacancy.requisitosMinimos || []),
        ...(vacancy.habilidadesDeseadas || [])
    ],
});

/**
 * Custom hook for KanbanBoard page
 */
export const useKanbanBoard = () => {
    const [candidatos, setCandidatos] = useState([]);
    const [vacantes, setVacantes] = useState([]);
    const [loadingVacantes, setLoadingVacantes] = useState(true);
    const [draggedCard, setDraggedCard] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);
    const [filtroVacante, setFiltroVacante] = useState('todas');
    const [filtroScoreMin, setFiltroScoreMin] = useState(0);
    const [selectedCandidato, setSelectedCandidato] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadStep, setUploadStep] = useState(1);
    const [cvFile, setCvFile] = useState(null);
    const [cvData, setCvData] = useState({ nombre: '', email: '', telefono: '', vacanteId: '' });
    const [analysisResult, setAnalysisResult] = useState(null);
    const [extractingData, setExtractingData] = useState(false);
    const [deepAnalysisLoading, setDeepAnalysisLoading] = useState(false);

    // Load vacancies from backend on mount
    useEffect(() => {
        const loadVacancies = async () => {
            setLoadingVacantes(true);
            try {
                const backendVacancies = await vacancyService.getAll();
                // Only show published vacancies for CV upload
                const publishedVacancies = backendVacancies
                    .filter(v => v.estado === 'published')
                    .map(mapVacancyForCV);
                setVacantes(publishedVacancies);
            } catch (error) {
                console.error('Error loading vacancies:', error);
                setVacantes([]);
            } finally {
                setLoadingVacantes(false);
            }
        };
        loadVacancies();
    }, []);

    // Multi-CV upload state
    const [showMultiUploadModal, setShowMultiUploadModal] = useState(false);
    const multiCVUpload = useMultiCVUpload(vacantes);

    // Filtered candidates
    const candidatosFiltrados = useMemo(() => {
        return candidatos.filter(c => {
            const pasaVacante = filtroVacante === 'todas' || c.vacanteId === parseInt(filtroVacante);
            const pasaScore = c.llmScore >= filtroScoreMin;
            return pasaVacante && pasaScore;
        });
    }, [candidatos, filtroVacante, filtroScoreMin]);

    // Get candidates by column
    const getCandidatosPorColumna = useCallback((columnaId) => {
        return candidatosFiltrados
            .filter(c => c.columna === columnaId)
            .sort((a, b) => b.llmScore - a.llmScore);
    }, [candidatosFiltrados]);

    // Statistics
    const stats = useMemo(() => ({
        total: candidatosFiltrados.length,
        promedioScore: Math.round(
            candidatosFiltrados.reduce((acc, c) => acc + c.llmScore, 0) / (candidatosFiltrados.length || 1)
        ),
        altosMatch: candidatosFiltrados.filter(c => c.llmScore >= 85).length,
    }), [candidatosFiltrados]);

    // Drag and Drop handlers
    const handleDragStart = useCallback((e, candidato) => {
        setDraggedCard(candidato);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedCard(null);
        setDragOverColumn(null);
    }, []);

    const handleDragOver = useCallback((e, columnaId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(columnaId);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOverColumn(null);
    }, []);

    const handleDrop = useCallback((e, columnaId) => {
        e.preventDefault();
        if (draggedCard && draggedCard.columna !== columnaId) {
            setCandidatos(prev =>
                prev.map(c => c.id === draggedCard.id ? { ...c, columna: columnaId } : c)
            );
        }
        setDragOverColumn(null);
    }, [draggedCard]);

    // CV Upload handlers
    const handleFileChange = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCvFile(file);
        setExtractingData(true);

        try {
            // Auto-extract contact info from CV
            const result = await cvService.extractContactFromCV(file);

            if (result.success && result.data) {
                setCvData((prev) => ({
                    ...prev,
                    nombre: result.data.nombre || prev.nombre,
                    email: result.data.email || prev.email,
                    telefono: result.data.telefono || prev.telefono,
                }));
            }
        } catch (error) {
            console.error('Error extracting CV data:', error);
        } finally {
            setExtractingData(false);
        }
    }, []);

    const analizarCV = useCallback(async () => {
        if (!cvData.nombre || !cvData.email || !cvData.vacanteId || !cvFile) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        setUploadStep(2);
        setDeepAnalysisLoading(false);

        try {
            // Find vacancy data by selected id
            const vacante = vacantes.find(v => String(v.id) === String(cvData.vacanteId));
            const vacancyData = {
                id: cvData.vacanteId,
                titulo: vacante?.titulo || '',
                descripcion: vacante?.descripcion || '',
                departamento: vacante?.departamento || '',
                nivel: vacante?.nivel || 'mid',
                requisitos: vacante?.requisitos || [],
            };

            // Call the real CV analysis microservice
            const result = await cvService.analyzeCV(cvFile, vacancyData);

            if (!result.success) {
                throw new Error(result.error || 'Error al analizar el CV');
            }

            const analysis = result.data || {};

            // Extract score using the same helper as multi-upload
            const rawScore = calculateScoreFromAnalysis(analysis);
            const llmScore = rawScore > 0 ? Math.round(rawScore) : 0;

            // Build breakdown from must_have and nice_to_have scores
            const mustHaveScore = analysis.must_have_score || 0;
            const niceToHaveScore = analysis.nice_to_have_score || 0;
            const llmAnalisis = analysis.breakdown || {
                experiencia: Math.round((mustHaveScore > 1 ? mustHaveScore : mustHaveScore * 100) || 0),
                habilidades: Math.round((niceToHaveScore > 1 ? niceToHaveScore : niceToHaveScore * 100) || 0),
                educacion: 0,
                cultura: 0,
            };

            // Extract skills from matches
            const skills = extractSkillsFromAnalysis(analysis);
            const experienciaAnios = analysis.years_experience || 0;

            // Map recommendation from backend format
            const recommendation = mapRecommendation(analysis.recommendation, llmScore);

            // Build basic result and show it immediately (non-blocking)
            const basicResult = {
                llmScore,
                llmAnalisis,
                skills: Array.isArray(skills) ? skills.slice(0, 5) : [],
                experienciaAnios,
                recommendation,
                resumen: analysis.summary
                    || `Candidato con ${experienciaAnios} años de experiencia. Perfil ${llmScore >= 85 ? 'altamente compatible' : llmScore >= 70 ? 'compatible' : 'parcialmente compatible'} con la vacante.`,
                deepAnalysis: null,
            };

            setAnalysisResult(basicResult);
            setUploadStep(3);

            // If the backend says the candidate is worth a deep LLM analysis, trigger it
            if (analysis.should_send_to_llm) {
                setDeepAnalysisLoading(true);

                const candidateId = `temp-${Date.now()}`;
                const deepResult = await cvService.analyzeDeep(cvFile, candidateId, vacancyData);

                if (deepResult.success && deepResult.data?.analysis) {
                    const deep = deepResult.data.analysis;

                    setAnalysisResult((prev) => ({
                        ...prev,
                        deepAnalysis: {
                            strengths: deep.strengths || [],
                            weaknesses: deep.weaknesses || [],
                            overallSummary: deep.overall?.summary || '',
                            mustHaveAnalysis: deep.overall?.must_have_analysis || '',
                            niceToHaveAnalysis: deep.overall?.nice_to_have_analysis || '',
                            mustHaveEvaluation: deep.must_have_evaluation || [],
                            niceToHaveEvaluation: deep.nice_to_have_evaluation || [],
                            recommendation: deep.recommendation || null,
                            deepScore: deep.overall?.score || null,
                        },
                    }));
                } else {
                    console.warn('Deep analysis failed or returned empty, keeping basic results:', deepResult.error);
                }

                setDeepAnalysisLoading(false);
            }
        } catch (error) {
            console.error('Error analyzing CV:', error);
            alert(`Error al analizar el CV: ${error.message}`);
            setUploadStep(1);
            setDeepAnalysisLoading(false);
        }
    }, [cvData, cvFile, vacantes]);

    const agregarCandidato = useCallback(() => {
        const vacanteSeleccionada = vacantes.find(v => String(v.id) === String(cvData.vacanteId));
        const now = new Date();

        const nuevoCandidato = {
            id: Date.now(),
            nombre: cvData.nombre,
            email: cvData.email,
            telefono: cvData.telefono || '+52 55 0000 0000',
            vacanteId: parseInt(cvData.vacanteId),
            vacante: vacanteSeleccionada?.titulo || 'Sin asignar',
            columna: 'candidatos',
            llmScore: analysisResult.llmScore,
            llmAnalisis: analysisResult.llmAnalisis,
            skills: analysisResult.skills,
            habilidades: analysisResult.skills,
            experienciaAnios: analysisResult.experienciaAnios,
            experiencia: analysisResult.experienciaAnios,
            fechaAplicacion: now.toISOString().split('T')[0],
            ultimaEvaluacion: now.toISOString().split('T')[0],
            score: analysisResult.llmScore,
            ubicacion: 'Por definir',
            disponibilidad: 'Inmediata',
            deepAnalysis: analysisResult.deepAnalysis || null,
        };

        setCandidatos(prev => [...prev, nuevoCandidato]);

        // Also save to pool
        candidateService.addToPool(nuevoCandidato);

        cerrarModalUpload();
    }, [cvData, analysisResult, vacantes]);

    const cerrarModalUpload = useCallback(() => {
        setShowUploadModal(false);
        setUploadStep(1);
        setCvFile(null);
        setCvData({ nombre: '', email: '', telefono: '', vacanteId: '' });
        setAnalysisResult(null);
        setDeepAnalysisLoading(false);
    }, []);

    const abrirModalUpload = useCallback(() => {
        setShowUploadModal(true);
    }, []);

    // Multi-CV upload handlers
    const abrirModalMultiUpload = useCallback(() => {
        setShowMultiUploadModal(true);
    }, []);

    const cerrarModalMultiUpload = useCallback(() => {
        setShowMultiUploadModal(false);
        multiCVUpload.clearAll();
    }, [multiCVUpload]);

    const agregarCandidatosMultiple = useCallback((candidates) => {
        setCandidatos(prev => [...prev, ...candidates]);
        // Also save to pool
        candidates.forEach(c => candidateService.addToPool(c));
        cerrarModalMultiUpload();
    }, [cerrarModalMultiUpload]);

    return {
        // State
        candidatos,
        draggedCard,
        dragOverColumn,
        filtroVacante,
        filtroScoreMin,
        selectedCandidato,
        showUploadModal,
        uploadStep,
        cvFile,
        cvData,
        analysisResult,
        extractingData,
        deepAnalysisLoading,

        // Computed
        candidatosFiltrados,
        stats,
        vacantes,
        loadingVacantes,

        // Methods
        getCandidatosPorColumna,
        getScoreColor,

        // Setters
        setFiltroVacante,
        setFiltroScoreMin,
        setSelectedCandidato,
        setCvData,

        // Drag handlers
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragLeave,
        handleDrop,

        // Upload handlers
        handleFileChange,
        analizarCV,
        agregarCandidato,
        cerrarModalUpload,
        abrirModalUpload,

        // Multi-CV upload
        showMultiUploadModal,
        multiCVUpload,
        abrirModalMultiUpload,
        cerrarModalMultiUpload,
        agregarCandidatosMultiple,
    };
};

export default useKanbanBoard;
