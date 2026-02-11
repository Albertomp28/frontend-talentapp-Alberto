import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { INITIAL_VACANTE_STATE } from '../constants/vacanteConstants';
import { vacancyService, estimateSalary } from '../../../services';
import { isValidEmail } from '../../../utils/validators';

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

  // AI salary estimation state
  const [estimatingSalary, setEstimatingSalary] = useState(false);
  const [salaryReasoning, setSalaryReasoning] = useState('');
  const [salaryEstimateError, setSalaryEstimateError] = useState('');

  // Validation state: tracks which steps the user has attempted to advance past
  const [stepAttempted, setStepAttempted] = useState({ 1: false, 2: false, 3: false });

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
          const result = await vacancyService.getById(id);
          if (result.success && result.data) {
            const vacanteData = result.data;
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
              moneda: vacanteData.moneda || 'CRC',
              salarioMin: vacanteData.salarioMin || '',
              salarioMax: vacanteData.salarioMax || '',
              mostrarSalario: vacanteData.mostrarSalario ?? true,
              requisitosMinimos: vacanteData.requisitosMinimos || [],
              habilidadesDeseadas: vacanteData.habilidadesDeseadas || [],
              beneficios: vacanteData.beneficios || [],
              reclutadorNombre: vacanteData.reclutadorNombre || '',
              reclutadorEmail: vacanteData.reclutadorEmail || '',
              reclutadorTelefono: vacanteData.reclutadorTelefono || '',
            });
            setCreatedVacanteId(vacanteData.id);
          } else {
            setError(result.error || 'Error al cargar la vacante');
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

  // Step navigation handlers - blocks advancement when current step is invalid
  const handleNextStep = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (step < 3) {
      // Mark current step as attempted so errors become visible
      setStepAttempted((prev) => ({ ...prev, [step]: true }));
      const currentStepValid = step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : true;
      if (!currentStepValid) return;
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

  // AI salary estimation handler
  const handleEstimateSalary = useCallback(async () => {
    if (!vacante.titulo) {
      setSalaryEstimateError('Completa el titulo del puesto en el paso 1 antes de estimar el salario');
      return;
    }

    setEstimatingSalary(true);
    setSalaryEstimateError('');
    setSalaryReasoning('');

    try {
      const result = await estimateSalary({
        titulo: vacante.titulo,
        descripcion: vacante.descripcion,
        ubicacion: vacante.ubicacion,
        modalidad: vacante.modalidad,
        tipoContrato: vacante.tipoContrato,
        requisitosMinimos: vacante.requisitosMinimos,
        habilidadesDeseadas: vacante.habilidadesDeseadas,
        moneda: vacante.moneda,
      });

      if (result.success) {
        setVacante(prev => ({
          ...prev,
          salarioMin: result.salarioMin ?? prev.salarioMin,
          salarioMax: result.salarioMax ?? prev.salarioMax,
        }));
        setSalaryReasoning(result.reasoning || '');
      } else {
        setSalaryEstimateError(result.error || 'Error al estimar el salario');
      }
    } catch (err) {
      console.error('Error estimating salary:', err);
      setSalaryEstimateError('Error inesperado al estimar el salario');
    } finally {
      setEstimatingSalary(false);
    }
  }, [vacante]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    console.log('handleSubmit called, step:', step);
    console.log('Vacante data:', JSON.stringify(vacante, null, 2));

    if (step !== 3) {
      console.log('Not on step 3, returning');
      return;
    }

    // Mark all steps as attempted so field errors become visible
    setStepAttempted({ 1: true, 2: true, 3: true });

    // Comprehensive client-side validation
    if (!vacante.titulo?.trim()) {
      setError('El titulo de la vacante es obligatorio');
      return;
    }
    if (!vacante.departamentoId) {
      setError('El departamento es obligatorio');
      return;
    }
    if (!vacante.responsabilidades?.trim()) {
      setError('Las responsabilidades son obligatorias');
      return;
    }
    if (!vacante.ubicacion) {
      setError('La ubicacion es obligatoria');
      return;
    }
    if (!vacante.modalidad) {
      setError('La modalidad es obligatoria');
      return;
    }
    if (!vacante.tipoContrato) {
      setError('El tipo de contrato es obligatorio');
      return;
    }
    if (!vacante.requisitosMinimos || vacante.requisitosMinimos.length === 0) {
      setError('Agrega al menos 1 requisito minimo');
      return;
    }
    if (!vacante.reclutadorNombre?.trim()) {
      setError('El nombre del reclutador es obligatorio');
      return;
    }
    if (!vacante.reclutadorEmail?.trim()) {
      setError('El email del reclutador es obligatorio');
      return;
    }
    if (!isValidEmail(vacante.reclutadorEmail)) {
      setError('Ingresa un email valido para el reclutador');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let result;
      console.log('Calling vacancyService...', isEditMode ? 'update' : 'create');
      if (isEditMode) {
        result = await vacancyService.update(id, vacante);
      } else {
        result = await vacancyService.create(vacante);
      }

      console.log('Result from vacancyService:', JSON.stringify(result, null, 2));

      if (result.success && result.vacancy) {
        setCreatedVacanteId(result.vacancy.id);
        setShowSuccessModal(true);
      } else if (result.success && !result.vacancy) {
        // Backend responded OK but no vacancy data returned
        console.warn('Vacancy created but no data returned');
        setShowSuccessModal(true);
      } else {
        console.error('Error from service:', result.error);
        setError(result.error || 'Error al guardar la vacante');
      }
    } catch (err) {
      console.error('Exception saving vacancy:', err);
      setError(err.message || 'Error al guardar la vacante');
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

  // ── Validation ──────────────────────────────────────────────────────
  const isStep1Valid = Boolean(
    vacante.titulo?.trim() && vacante.departamentoId && vacante.responsabilidades?.trim()
  );
  const isStep2Valid = Boolean(vacante.ubicacion && vacante.modalidad && vacante.tipoContrato);
  const isStep3Valid = Boolean(
    vacante.requisitosMinimos?.length > 0 &&
    vacante.reclutadorNombre?.trim() &&
    vacante.reclutadorEmail?.trim() &&
    isValidEmail(vacante.reclutadorEmail)
  );

  /**
   * Per-field error messages. Only populated after the user attempts to advance
   * past the relevant step, so errors don't flash on initial render.
   */
  const fieldErrors = useMemo(() => {
    const errors = {};

    // Step 1 errors (only if user tried to advance past step 1)
    if (stepAttempted[1]) {
      if (!vacante.titulo?.trim()) errors.titulo = 'El titulo del puesto es obligatorio';
      if (!vacante.departamentoId) errors.departamentoId = 'Selecciona un departamento';
      if (!vacante.responsabilidades?.trim()) errors.responsabilidades = 'Las responsabilidades son obligatorias';
    }

    // Step 2 errors
    if (stepAttempted[2]) {
      if (!vacante.ubicacion) errors.ubicacion = 'Selecciona una ubicacion';
      if (!vacante.modalidad) errors.modalidad = 'Selecciona una modalidad';
      if (!vacante.tipoContrato) errors.tipoContrato = 'Selecciona un tipo de contrato';
    }

    // Step 3 errors
    if (stepAttempted[3]) {
      if (!vacante.requisitosMinimos || vacante.requisitosMinimos.length === 0) {
        errors.requisitosMinimos = 'Agrega al menos 1 requisito minimo';
      }
      if (!vacante.reclutadorNombre?.trim()) errors.reclutadorNombre = 'El nombre del reclutador es obligatorio';
      if (!vacante.reclutadorEmail?.trim()) {
        errors.reclutadorEmail = 'El email del reclutador es obligatorio';
      } else if (!isValidEmail(vacante.reclutadorEmail)) {
        errors.reclutadorEmail = 'Ingresa un email valido';
      }
    }

    return errors;
  }, [vacante, stepAttempted]);

  /** Mark step 3 as attempted when submit is clicked (called from handleSubmit) */
  const markStep3Attempted = useCallback(() => {
    setStepAttempted((prev) => ({ ...prev, 3: true }));
  }, []);

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

    // AI Salary Estimation
    estimatingSalary,
    salaryReasoning,
    salaryEstimateError,
    handleEstimateSalary,
    setSalaryReasoning,

    // Submit
    handleSubmit,

    // URL helpers
    getVacanteUrl,
    copyToClipboard,

    // Validation
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    fieldErrors,
    stepAttempted,
    markStep3Attempted,
  };
};

export default useVacanteForm;
