import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { INITIAL_VACANTE_STATE } from '../constants/vacanteConstants';
import { vacancyService } from '../../../services';

/**
 * Custom hook for vacancy form state management
 * Connects to backend API for CRUD operations
 *
 * @returns {Object} Form state, handlers, and validation
 */
export const useVacanteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form state
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdVacanteId, setCreatedVacanteId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [vacante, setVacante] = useState(INITIAL_VACANTE_STATE);
  const [departments, setDepartments] = useState([]);
  const [nuevoRequisitoMinimo, setNuevoRequisitoMinimo] = useState('');
  const [nuevaHabilidadDeseada, setNuevaHabilidadDeseada] = useState('');
  const [nuevoBeneficio, setNuevoBeneficio] = useState('');

  // Load departments on mount
  useEffect(() => {
    const loadDepartments = async () => {
      const depts = await vacancyService.getDepartments();
      setDepartments(depts);
    };
    loadDepartments();
  }, []);

  // Load vacancy data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadVacancy = async () => {
        setLoading(true);
        try {
          const vacanteData = await vacancyService.getById(id);
          if (vacanteData) {
            setVacante({
              titulo: vacanteData.titulo || '',
              departamentoId: vacanteData.departamentoId || '',
              departamento: vacanteData.departamento || '',
              descripcion: vacanteData.descripcion || '',
              responsabilidades: vacanteData.responsabilidades || '',
              ubicacion: vacanteData.ubicacion || '',
              direccionDetalle: vacanteData.direccionDetalle || '',
              modalidad: vacanteData.modalidad || '',
              tipoContrato: vacanteData.tipoContrato || '',
              salarioMin: vacanteData.salarioMin || '',
              salarioMax: vacanteData.salarioMax || '',
              mostrarSalario: vacanteData.mostrarSalario ?? true,
              requisitosMinimos: vacanteData.requisitosMinimos || [],
              habilidadesDeseadas: vacanteData.habilidadesDeseadas || [],
              beneficios: vacanteData.beneficios || [],
            });
            setCreatedVacanteId(vacanteData.id);
          }
        } catch (err) {
          console.error('Error loading vacancy:', err);
          setError('Error al cargar la vacante');
        } finally {
          setLoading(false);
        }
      };
      loadVacancy();
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

  // Minimum requirements handlers
  const agregarRequisitoMinimo = (requisito) => {
    if (requisito && !vacante.requisitosMinimos.includes(requisito)) {
      setVacante({ ...vacante, requisitosMinimos: [...vacante.requisitosMinimos, requisito] });
      setNuevoRequisitoMinimo('');
    }
  };

  const eliminarRequisitoMinimo = (requisito) => {
    setVacante({
      ...vacante,
      requisitosMinimos: vacante.requisitosMinimos.filter((r) => r !== requisito),
    });
  };

  // Desired skills handlers
  const agregarHabilidadDeseada = (skill) => {
    if (skill && !vacante.habilidadesDeseadas.includes(skill)) {
      setVacante({ ...vacante, habilidadesDeseadas: [...vacante.habilidadesDeseadas, skill] });
      setNuevaHabilidadDeseada('');
    }
  };

  const eliminarHabilidadDeseada = (skill) => {
    setVacante({
      ...vacante,
      habilidadesDeseadas: vacante.habilidadesDeseadas.filter((h) => h !== skill),
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
      beneficios: vacante.beneficios.filter((b) => b !== beneficio),
    });
  };

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (step !== 3) return;

    setSaving(true);
    setError(null);

    try {
      let result;
      if (isEditMode) {
        result = await vacancyService.update(id, vacante);
      } else {
        result = await vacancyService.create(vacante);
      }

      if (result.success) {
        setCreatedVacanteId(result.vacancy.id);
        setShowSuccessModal(true);
      } else {
        setError(result.error || 'Error al guardar la vacante');
      }
    } catch (err) {
      console.error('Error saving vacancy:', err);
      setError('Error al guardar la vacante');
    } finally {
      setSaving(false);
    }
  }, [step, isEditMode, id, vacante]);

  // URL helpers
  const getVacanteUrl = () => {
    return `${window.location.origin}/vacantes/${createdVacanteId}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getVacanteUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Navigate to vacancies list
  const goToVacantes = () => {
    navigate('/mis-vacantes');
  };

  // Validation
  const isStep1Valid = vacante.titulo && vacante.departamentoId && vacante.responsabilidades;
  const isStep2Valid = vacante.ubicacion && vacante.modalidad && vacante.tipoContrato;
  const isStep3Valid = true; // Review step, just needs previous validations

  return {
    // State
    vacante,
    setVacante,
    step,
    loading,
    saving,
    error,
    isEditMode,
    showSuccessModal,
    setShowSuccessModal,
    createdVacanteId,
    copied,
    departments,
    nuevoRequisitoMinimo,
    setNuevoRequisitoMinimo,
    nuevaHabilidadDeseada,
    setNuevaHabilidadDeseada,
    nuevoBeneficio,
    setNuevoBeneficio,

    // Navigation
    handleNextStep,
    handlePrevStep,
    goToVacantes,

    // Requirements, Skills & Benefits
    agregarRequisitoMinimo,
    eliminarRequisitoMinimo,
    agregarHabilidadDeseada,
    eliminarHabilidadDeseada,
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
