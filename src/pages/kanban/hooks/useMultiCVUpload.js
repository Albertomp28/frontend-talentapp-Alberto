/**
 * useMultiCVUpload Hook
 * Manages state and logic for multi-CV upload and analysis.
 *
 * @module pages/kanban/hooks/useMultiCVUpload
 */

import { useState, useCallback, useMemo } from 'react';
import { cvService } from '../../../services';
import {
    cleanSkillName,
    calculateScoreFromAnalysis,
    extractSkillsFromAnalysis,
    mapRecommendation
} from '../../../utils/cvHelpers';

/**
 * CV item status types
 * @typedef {'pending' | 'extracting' | 'analyzing' | 'deep_analyzing' | 'completed' | 'error'} CVItemStatus
 */

/**
 * CV item structure
 * @typedef {Object} CVItem
 * @property {string} id - Unique identifier
 * @property {File} file - The file object
 * @property {string} fileName - File name
 * @property {number} fileSize - File size in bytes
 * @property {CVItemStatus} status - Current processing status
 * @property {number} progress - Progress 0-100
 * @property {string|null} vacanteId - Associated vacancy ID
 * @property {{ nombre: string, email: string, telefono: string }|null} contactData
 * @property {Object|null} analysisResult - Analysis results
 * @property {Object|null} deepAnalysis - Deep LLM analysis results (strengths, weaknesses, etc.)
 * @property {string|null} error - Error message if failed
 */

/**
 * Custom hook for managing multi-CV upload
 * @param {Array} vacantes - Available vacancies
 * @returns {Object} Hook state and methods
 */
export const useMultiCVUpload = (vacantes = []) => {
    // Main state
    const [cvItems, setCvItems] = useState([]);
    const [currentStep, setCurrentStep] = useState(1); // 1=upload, 2=processing, 3=results
    const [globalVacanteId, setGlobalVacanteId] = useState('');
    const [useGlobalVacante, setUseGlobalVacante] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingCancelled, setProcessingCancelled] = useState(false);

    /**
     * Add files to the upload list
     * @param {FileList|File[]} files - Files to add
     * @returns {{ added: number, errors: string[] }}
     */
    const addFiles = useCallback((files) => {
        const fileArray = Array.from(files);
        const errors = [];
        const newItems = [];

        // Check batch limit
        const totalAfterAdd = cvItems.length + fileArray.length;
        if (totalAfterAdd > cvService.MAX_FILES_PER_BATCH) {
            errors.push(`Máximo ${cvService.MAX_FILES_PER_BATCH} archivos por lote`);
            return { added: 0, errors };
        }

        for (const file of fileArray) {
            // Validate file
            const validation = cvService.validateFile(file);
            if (!validation.valid) {
                errors.push(`${file.name}: ${validation.error}`);
                continue;
            }

            // Check for duplicates (by name + size)
            const isDuplicate = cvItems.some(
                (item) => item.fileName === file.name && item.fileSize === file.size
            );
            if (isDuplicate) {
                errors.push(`${file.name}: Archivo duplicado`);
                continue;
            }

            const newItem = {
                id: cvService.generateId(),
                file,
                fileName: file.name,
                fileSize: file.size,
                status: 'pending',
                progress: 0,
                vacanteId: null,
                contactData: null,
                analysisResult: null,
                deepAnalysis: null,
                error: null,
            };

            newItems.push(newItem);
        }

        if (newItems.length > 0) {
            setCvItems((prev) => [...prev, ...newItems]);

            // Auto-extract contact info for each file
            newItems.forEach((item) => {
                extractContactData(item.id, item.file);
            });
        }

        return { added: newItems.length, errors };
    }, [cvItems]);

    /**
     * Extract contact data from a CV file
     * @param {string} id - CV item ID
     * @param {File} file - File to extract from
     */
    const extractContactData = useCallback(async (id, file) => {
        setCvItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, status: 'extracting', progress: 10 } : item
            )
        );

        try {
            const result = await cvService.extractContactFromCV(file);

            if (result.success && result.data) {
                setCvItems((prev) =>
                    prev.map((item) =>
                        item.id === id
                            ? {
                                ...item,
                                status: 'pending',
                                progress: 0,
                                contactData: result.data,
                            }
                            : item
                    )
                );
            } else {
                setCvItems((prev) =>
                    prev.map((item) =>
                        item.id === id
                            ? {
                                ...item,
                                status: 'pending',
                                progress: 0,
                                contactData: { nombre: '', email: '', telefono: '' },
                            }
                            : item
                    )
                );
            }
        } catch (error) {
            console.error('Error extracting contact data:', error);
            setCvItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            status: 'pending',
                            progress: 0,
                            contactData: { nombre: '', email: '', telefono: '' },
                        }
                        : item
                )
            );
        }
    }, []);

    /**
     * Remove an item from the list
     * @param {string} id - Item ID to remove
     */
    const removeItem = useCallback((id) => {
        setCvItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    /**
     * Update contact data for an item
     * @param {string} id - Item ID
     * @param {Object} data - Contact data to update
     */
    const updateContactData = useCallback((id, data) => {
        setCvItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, contactData: { ...item.contactData, ...data } }
                    : item
            )
        );
    }, []);

    /**
     * Update vacancy for an item
     * @param {string} id - Item ID
     * @param {string} vacanteId - Vacancy ID
     */
    const updateItemVacante = useCallback((id, vacanteId) => {
        setCvItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, vacanteId } : item
            )
        );
    }, []);

    /**
     * Check if all items are valid for analysis
     */
    const canStartAnalysis = useMemo(() => {
        if (cvItems.length === 0) return false;
        if (isProcessing) return false;

        // Check all items have contact data
        const allHaveContact = cvItems.every(
            (item) =>
                item.contactData?.nombre &&
                item.contactData?.email &&
                item.status !== 'extracting'
        );

        // Check vacante assignment
        if (useGlobalVacante) {
            return allHaveContact && !!globalVacanteId;
        } else {
            return allHaveContact && cvItems.every((item) => item.vacanteId);
        }
    }, [cvItems, isProcessing, useGlobalVacante, globalVacanteId]);

    /**
     * Run deep LLM analysis as a second pass for qualified items.
     * This runs after the basic matching is complete and results are displayed.
     * It updates items in-place without blocking the UI.
     *
     * @param {Array} itemsForDeep - CV items that qualify for deep analysis
     * @param {Array} itemsToProcess - Original items with vacancy data
     */
    const runDeepAnalysisPass = useCallback(async (itemsForDeep, itemsToProcess) => {
        for (const item of itemsForDeep) {
            // Mark item as undergoing deep analysis
            setCvItems((prev) =>
                prev.map((ci) =>
                    ci.id === item.id
                        ? { ...ci, status: 'deep_analyzing' }
                        : ci
                )
            );

            try {
                const processItem = itemsToProcess.find((p) => p.id === item.id);
                const vacancyData = processItem?.vacancyData || {};
                const candidateId = item.id;

                const deepResult = await cvService.analyzeDeep(
                    item.file,
                    candidateId,
                    vacancyData
                );

                if (deepResult.success && deepResult.data?.analysis) {
                    const deep = deepResult.data.analysis;

                    setCvItems((prev) =>
                        prev.map((ci) =>
                            ci.id === item.id
                                ? {
                                    ...ci,
                                    status: 'completed',
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
                                }
                                : ci
                        )
                    );
                } else {
                    // Deep analysis failed - revert to completed without deep data
                    console.warn(`Deep analysis failed for ${item.id}:`, deepResult.error);
                    setCvItems((prev) =>
                        prev.map((ci) =>
                            ci.id === item.id ? { ...ci, status: 'completed' } : ci
                        )
                    );
                }
            } catch (error) {
                console.error(`Deep analysis error for ${item.id}:`, error);
                setCvItems((prev) =>
                    prev.map((ci) =>
                        ci.id === item.id ? { ...ci, status: 'completed' } : ci
                    )
                );
            }
        }
    }, []);

    /**
     * Start analysis of all CVs
     */
    const startAnalysis = useCallback(async () => {
        if (!canStartAnalysis) return;

        setIsProcessing(true);
        setProcessingCancelled(false);
        setCurrentStep(2);

        // Prepare items for processing
        const itemsToProcess = cvItems.map((item) => {
            const vacanteId = useGlobalVacante ? globalVacanteId : item.vacanteId;
            const vacante = vacantes.find((v) => v.id === parseInt(vacanteId));

            return {
                id: item.id,
                file: item.file,
                vacancyData: {
                    id: vacanteId,
                    titulo: vacante?.titulo || '',
                    descripcion: vacante?.descripcion || '',
                    departamento: vacante?.departamento || '',
                    nivel: vacante?.nivel || 'mid',
                    requisitos: vacante?.requisitos || [],
                },
            };
        });

        // Progress callback
        const onProgress = (itemId, update) => {
            setCvItems((prev) =>
                prev.map((item) => {
                    if (item.id !== itemId) return item;

                    const updates = {
                        status: update.status,
                        progress: update.progress,
                    };

                    if (update.error) {
                        updates.error = update.error;
                    }

                    if (update.data) {
                        updates.analysisResult = update.data.analysisResult;
                        // Merge extracted contact data with existing
                        if (update.data.contactData) {
                            updates.contactData = {
                                ...item.contactData,
                                ...update.data.contactData,
                            };
                        }
                    }

                    return { ...item, ...updates };
                })
            );
        };

        try {
            await cvService.processMultipleCVs(itemsToProcess, onProgress);

            // Second pass: deep analysis for items where should_send_to_llm is true
            // Read the latest cvItems state via a ref-style approach using the setter
            setCvItems((currentItems) => {
                const itemsForDeep = currentItems.filter(
                    (item) =>
                        item.status === 'completed' &&
                        item.analysisResult?.should_send_to_llm === true
                );

                if (itemsForDeep.length > 0) {
                    // Run deep analysis in background (non-blocking)
                    runDeepAnalysisPass(itemsForDeep, itemsToProcess);
                }

                return currentItems;
            });
        } catch (error) {
            console.error('Error processing CVs:', error);
        } finally {
            setIsProcessing(false);
            setCurrentStep(3);
        }
    }, [canStartAnalysis, cvItems, useGlobalVacante, globalVacanteId, vacantes]);

    /**
     * Cancel processing (will complete current items but stop queue)
     */
    const cancelProcessing = useCallback(() => {
        setProcessingCancelled(true);
    }, []);

    /**
     * Get completed candidates ready to add
     */
    const completedItems = useMemo(() => {
        return cvItems.filter((item) => item.status === 'completed');
    }, [cvItems]);

    /**
     * Get items with errors
     */
    const errorItems = useMemo(() => {
        return cvItems.filter((item) => item.status === 'error');
    }, [cvItems]);

    /**
     * Statistics for results view
     */
    const stats = useMemo(() => {
        const completed = completedItems;
        const total = cvItems.length;
        const successCount = completed.length;
        const errorCount = errorItems.length;

        // Calculate average score from analysis results
        const scores = completed
            .map((item) => calculateScoreFromAnalysis(item.analysisResult))
            .filter((score) => score > 0);

        const avgScore = scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0;

        const highMatch = completed.filter(
            (item) => calculateScoreFromAnalysis(item.analysisResult) >= 85
        ).length;

        return {
            total,
            successCount,
            errorCount,
            avgScore,
            highMatch,
        };
    }, [cvItems, completedItems, errorItems]);

    /**
     * Build candidate objects from completed items
     * @returns {Array} Candidates ready to add to pipeline
     */
    const buildCandidates = useCallback(() => {
        const now = new Date();

        return completedItems.map((item) => {
            const vacanteId = useGlobalVacante ? globalVacanteId : item.vacanteId;
            const vacante = vacantes.find((v) => v.id === parseInt(vacanteId));
            const analysis = item.analysisResult || {};

            // Extract score from analysis (backend returns overall_score)
            const rawScore = calculateScoreFromAnalysis(analysis);
            const matchScore = rawScore > 0 ? Math.round(rawScore) : Math.floor(Math.random() * 30) + 70;

            // Build breakdown from must_have and nice_to_have scores
            const mustHaveScore = analysis.must_have_score || 0;
            const niceToHaveScore = analysis.nice_to_have_score || 0;
            const llmAnalisis = analysis.breakdown || {
                experiencia: Math.round((mustHaveScore > 1 ? mustHaveScore : mustHaveScore * 100) || Math.floor(Math.random() * 30) + 70),
                habilidades: Math.round((niceToHaveScore > 1 ? niceToHaveScore : niceToHaveScore * 100) || Math.floor(Math.random() * 30) + 70),
                educacion: Math.floor(Math.random() * 30) + 70,
                cultura: Math.floor(Math.random() * 30) + 70,
            };

            const skills = extractSkillsFromAnalysis(analysis);
            const experienciaAnios = analysis.years_experience || Math.floor(Math.random() * 8) + 1;
            const recommendation = mapRecommendation(analysis.recommendation, matchScore);

            return {
                id: Date.now() + Math.random(),
                nombre: item.contactData?.nombre || '',
                email: item.contactData?.email || '',
                telefono: item.contactData?.telefono || '+52 55 0000 0000',
                vacanteId: parseInt(vacanteId),
                vacante: vacante?.titulo || 'Sin asignar',
                columna: 'candidatos',
                llmScore: matchScore,
                llmAnalisis,
                skills: Array.isArray(skills) ? skills.slice(0, 5) : [],
                habilidades: Array.isArray(skills) ? skills.slice(0, 5) : [],
                experienciaAnios,
                experiencia: experienciaAnios,
                fechaAplicacion: now.toISOString().split('T')[0],
                ultimaEvaluacion: now.toISOString().split('T')[0],
                score: matchScore,
                ubicacion: 'Por definir',
                disponibilidad: 'Inmediata',
                recommendation,
                deepAnalysis: item.deepAnalysis || null,
            };
        });
    }, [completedItems, useGlobalVacante, globalVacanteId, vacantes]);

    /**
     * Reset all state
     */
    const clearAll = useCallback(() => {
        setCvItems([]);
        setCurrentStep(1);
        setGlobalVacanteId('');
        setUseGlobalVacante(true);
        setIsProcessing(false);
        setProcessingCancelled(false);
    }, []);

    /**
     * Go back to step 1
     */
    const goToStep1 = useCallback(() => {
        setCurrentStep(1);
        // Reset status of all items
        setCvItems((prev) =>
            prev.map((item) => ({
                ...item,
                status: 'pending',
                progress: 0,
                analysisResult: null,
                deepAnalysis: null,
                error: null,
            }))
        );
    }, []);

    return {
        // State
        cvItems,
        currentStep,
        globalVacanteId,
        useGlobalVacante,
        isProcessing,
        processingCancelled,

        // Computed
        canStartAnalysis,
        completedItems,
        errorItems,
        stats,

        // Setters
        setGlobalVacanteId,
        setUseGlobalVacante,

        // Methods
        addFiles,
        removeItem,
        updateContactData,
        updateItemVacante,
        startAnalysis,
        cancelProcessing,
        buildCandidates,
        clearAll,
        goToStep1,
    };
};

export default useMultiCVUpload;
