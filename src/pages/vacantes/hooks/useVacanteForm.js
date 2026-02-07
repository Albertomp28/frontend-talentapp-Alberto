import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INITIAL_VACANTE_STATE } from '../constants/vacanteConstants';

/**
 * Custom hook for vacancy form state management
 * Encapsulates all form logic following OOP principles (Single Responsibility)
 * 
 * @returns {Object} Form state, handlers, and validation
 */
export const useVacanteForm = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);

    // Form state
    const [step, setStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdVacanteId, setCreatedVacanteId] = useState(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(isEditMode);
    const [vacante, setVacante] = useState(INITIAL_VACANTE_STATE);
    const [nuevaHabilidad, setNuevaHabilidad] = useState('');
    const [nuevoBeneficio, setNuevoBeneficio] = useState('');

    // Load vacancy data in edit mode
    useEffect(() => {
        if (isEditMode) {
            const vacantesGuardadas = JSON.parse(localStorage.getItem('vacantes') || '[]');
            const vacanteEncontrada = vacantesGuardadas.find(v =>
                v.id === id || v.id === Number(id) || String(v.id) === id
            );

            if (vacanteEncontrada) {
                setVacante({
                    titulo: vacanteEncontrada.titulo || '',
                    departamento: vacanteEncontrada.departamento || '',
                    descripcion: vacanteEncontrada.descripcion || '',
                    responsabilidades: vacanteEncontrada.responsabilidades || '',
                    ubicacion: vacanteEncontrada.ubicacion || '',
                    modalidad: vacanteEncontrada.modalidad || '',
                    tipoContrato: vacanteEncontrada.tipoContrato || '',
                    salarioMin: vacanteEncontrada.salarioMin || '',
                    salarioMax: vacanteEncontrada.salarioMax || '',
                    mostrarSalario: vacanteEncontrada.mostrarSalario ?? true,
                    experienciaMin: vacanteEncontrada.experienciaMin || vacanteEncontrada.experiencia || '',
                    experienciaMax: vacanteEncontrada.experienciaMax || '',
                    habilidades: vacanteEncontrada.habilidades || [],
                    beneficios: vacanteEncontrada.beneficios || [],
                    reclutadorNombre: vacanteEncontrada.reclutadorNombre || '',
                    reclutadorEmail: vacanteEncontrada.reclutadorEmail || '',
                    reclutadorTelefono: vacanteEncontrada.reclutadorTelefono || '',
                });
                setCreatedVacanteId(vacanteEncontrada.id);
            }
            setLoading(false);
        }
    }, [id, isEditMode]);

    // Step navigation handlers
    const handleNextStep = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handlePrevStep = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Skills handlers
    const agregarHabilidad = (skill) => {
        if (skill && !vacante.habilidades.includes(skill)) {
            setVacante({ ...vacante, habilidades: [...vacante.habilidades, skill] });
            setNuevaHabilidad('');
        }
    };

    const eliminarHabilidad = (skill) => {
        setVacante({
            ...vacante,
            habilidades: vacante.habilidades.filter(h => h !== skill)
        });
    };

    // Benefits handlers
    const agregarBeneficio = (beneficio) => {
        if (beneficio && !vacante.beneficios.includes(beneficio)) {
            setVacante({ ...vacante, beneficios: [...vacante.beneficios, beneficio] });
            setNuevoBeneficio('');
        }
    };

    const eliminarBeneficio = (beneficio) => {
        setVacante({
            ...vacante,
            beneficios: vacante.beneficios.filter(b => b !== beneficio)
        });
    };

    // Submit handler
    const handleSubmit = () => {
        if (step !== 3) return;

        const vacantesGuardadas = JSON.parse(localStorage.getItem('vacantes') || '[]');

        if (isEditMode) {
            const vacantesActualizadas = vacantesGuardadas.map(v => {
                if (v.id === id || v.id === Number(id) || String(v.id) === id) {
                    return {
                        ...v,
                        ...vacante,
                        experiencia: vacante.experienciaMin || 0,
                        fechaActualizacion: new Date().toISOString(),
                    };
                }
                return v;
            });
            localStorage.setItem('vacantes', JSON.stringify(vacantesActualizadas));
            setCreatedVacanteId(id);
        } else {
            const vacanteId = String(Date.now());
            setCreatedVacanteId(vacanteId);

            const nuevaVacante = {
                ...vacante,
                id: vacanteId,
                experiencia: vacante.experienciaMin || 0,
                fechaCreacion: new Date().toISOString(),
                estado: 'activa'
            };
            vacantesGuardadas.push(nuevaVacante);
            localStorage.setItem('vacantes', JSON.stringify(vacantesGuardadas));
        }

        setShowSuccessModal(true);
    };

    // URL helpers
    const getVacanteUrl = () => {
        return `${window.location.origin}/vacantes/${createdVacanteId}`;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(getVacanteUrl());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Validation
    const isStep1Valid = vacante.titulo && vacante.departamento && vacante.descripcion;
    const isStep2Valid = vacante.ubicacion && vacante.modalidad && vacante.tipoContrato;
    const isStep3Valid = vacante.reclutadorNombre && vacante.reclutadorEmail;

    return {
        // State
        vacante,
        setVacante,
        step,
        loading,
        isEditMode,
        showSuccessModal,
        setShowSuccessModal,
        createdVacanteId,
        copied,
        nuevaHabilidad,
        setNuevaHabilidad,
        nuevoBeneficio,
        setNuevoBeneficio,

        // Navigation
        handleNextStep,
        handlePrevStep,

        // Skills & Benefits
        agregarHabilidad,
        eliminarHabilidad,
        agregarBeneficio,
        eliminarBeneficio,

        // Submit
        handleSubmit,

        // URL helpers
        getVacanteUrl,
        copyToClipboard,

        // Validation
        isStep1Valid,
        isStep2Valid,
        isStep3Valid,
    };
};

export default useVacanteForm;
