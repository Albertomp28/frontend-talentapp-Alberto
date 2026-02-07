/**
 * useKanbanBoard Hook
 * Custom hook for managing the KanbanBoard state and logic.
 * 
 * @module pages/kanban/hooks/useKanbanBoard
 */

import { useState, useMemo, useCallback } from 'react';
import { MOCK_CANDIDATOS, MOCK_VACANTES, SKILLS_POOL } from '../constants/kanbanConstants';
import { candidateService } from '../../../services';
import { getScoreColor } from '../../../utils/formatters';

/**
 * Custom hook for KanbanBoard page
 */
export const useKanbanBoard = () => {
    const [candidatos, setCandidatos] = useState(MOCK_CANDIDATOS);
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
    const handleFileChange = useCallback((e) => {
        if (e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    }, []);

    const analizarCV = useCallback(() => {
        if (!cvData.nombre || !cvData.email || !cvData.vacanteId || !cvFile) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        setUploadStep(2);

        // Simulate AI analysis
        setTimeout(() => {
            const experiencia = Math.floor(Math.random() * 30) + 70;
            const habilidades = Math.floor(Math.random() * 30) + 70;
            const educacion = Math.floor(Math.random() * 30) + 70;
            const cultura = Math.floor(Math.random() * 30) + 70;
            const llmScore = Math.round((experiencia + habilidades + educacion + cultura) / 4);
            const randomSkills = SKILLS_POOL[Math.floor(Math.random() * SKILLS_POOL.length)];
            const experienciaAnios = Math.floor(Math.random() * 8) + 1;

            setAnalysisResult({
                llmScore,
                llmAnalisis: { experiencia, habilidades, educacion, cultura },
                skills: randomSkills.slice(0, 3),
                experienciaAnios,
                resumen: `Candidato con ${experienciaAnios} años de experiencia. Perfil ${llmScore >= 85 ? 'altamente compatible' : llmScore >= 70 ? 'compatible' : 'parcialmente compatible'} con la vacante.`,
            });
            setUploadStep(3);
        }, 2500);
    }, [cvData, cvFile]);

    const agregarCandidato = useCallback(() => {
        const vacanteSeleccionada = MOCK_VACANTES.find(v => v.id === parseInt(cvData.vacanteId));
        const now = new Date();

        const nuevoCandidato = {
            id: Date.now(),
            nombre: cvData.nombre,
            email: cvData.email,
            telefono: cvData.telefono || '+52 55 0000 0000',
            vacanteId: parseInt(cvData.vacanteId),
            vacante: vacanteSeleccionada?.titulo || 'Sin asignar',
            columna: 'aplicado',
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
        };

        setCandidatos(prev => [...prev, nuevoCandidato]);

        // Also save to pool
        candidateService.addToPool(nuevoCandidato);

        cerrarModalUpload();
    }, [cvData, analysisResult]);

    const cerrarModalUpload = useCallback(() => {
        setShowUploadModal(false);
        setUploadStep(1);
        setCvFile(null);
        setCvData({ nombre: '', email: '', telefono: '', vacanteId: '' });
        setAnalysisResult(null);
    }, []);

    const abrirModalUpload = useCallback(() => {
        setShowUploadModal(true);
    }, []);

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

        // Computed
        candidatosFiltrados,
        stats,
        vacantes: MOCK_VACANTES,

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
    };
};

export default useKanbanBoard;
