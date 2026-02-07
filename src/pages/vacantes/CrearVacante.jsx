import { useNavigate } from 'react-router-dom';

// Custom Hook
import { useVacanteForm } from './hooks/useVacanteForm';

// Components
import VacanteFormStepper from './components/VacanteFormStepper';
import VacanteStep1 from './components/VacanteStep1';
import VacanteStep2 from './components/VacanteStep2';
import VacanteStep3 from './components/VacanteStep3';
import VacanteSidebar from './components/VacanteSidebar';
import VacanteSuccessModal from './components/VacanteSuccessModal';

/**
 * Create/Edit Vacancy Page
 * 
 * Main orchestrator component that composes all subcomponents.
 * State and logic are encapsulated in the useVacanteForm hook.
 * 
 * Architecture follows:
 * - Single Responsibility: Each component handles one concern
 * - Open/Closed: Components are props-based and extensible
 * - Dependency Inversion: Main component depends on abstractions (hooks/components)
 */
const CrearVacante = () => {
  const navigate = useNavigate();

  // All form state and handlers from custom hook
  const {
    vacante,
    setVacante,
    step,
    loading,
    isEditMode,
    showSuccessModal,
    createdVacanteId,
    copied,
    nuevoRequisitoMinimo,
    setNuevoRequisitoMinimo,
    nuevaHabilidadDeseada,
    setNuevaHabilidadDeseada,
    nuevoBeneficio,
    setNuevoBeneficio,
    handleNextStep,
    handlePrevStep,
    agregarRequisitoMinimo,
    eliminarRequisitoMinimo,
    agregarHabilidadDeseada,
    eliminarHabilidadDeseada,
    agregarBeneficio,
    eliminarBeneficio,
    handleSubmit,
    getVacanteUrl,
    copyToClipboard,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
  } = useVacanteForm();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500">Cargando vacante...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col pt-6 pl-12 pr-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <button
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          onClick={() => navigate(-1)}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Editar Vacante' : 'Crear Nueva Vacante'}</h1>
          <p className="text-slate-500 text-sm">{isEditMode ? 'Modifica la información de la vacante' : 'Completa la información para publicar una nueva posición'}</p>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Form (8 cols) */}
        <div className="lg:col-span-8">
          {/* Progress Stepper */}
          <VacanteFormStepper currentStep={step} />

          {/* Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm min-h-[700px] flex flex-col">
            {/* Step Content */}
            {step === 1 && (
              <VacanteStep1 vacante={vacante} setVacante={setVacante} />
            )}

            {step === 2 && (
              <VacanteStep2 vacante={vacante} setVacante={setVacante} />
            )}

            {step === 3 && (
              <VacanteStep3
                vacante={vacante}
                setVacante={setVacante}
                nuevoRequisitoMinimo={nuevoRequisitoMinimo}
                setNuevoRequisitoMinimo={setNuevoRequisitoMinimo}
                nuevaHabilidadDeseada={nuevaHabilidadDeseada}
                setNuevaHabilidadDeseada={setNuevaHabilidadDeseada}
                nuevoBeneficio={nuevoBeneficio}
                setNuevoBeneficio={setNuevoBeneficio}
                agregarRequisitoMinimo={agregarRequisitoMinimo}
                agregarHabilidadDeseada={agregarHabilidadDeseada}
                agregarBeneficio={agregarBeneficio}
              />
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-auto pt-8 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                  onClick={handlePrevStep}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Anterior
                </button>
              ) : (
                <div></div>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed"
                  onClick={handleNextStep}
                  disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                >
                  Continuar
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:bg-emerald-700 transition-all disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={!isStep3Valid}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {isEditMode ? 'Guardar Cambios' : 'Publicar Vacante'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Vacancy Summary (4 cols) */}
        <VacanteSidebar
          vacante={vacante}
          eliminarRequisitoMinimo={eliminarRequisitoMinimo}
          eliminarHabilidadDeseada={eliminarHabilidadDeseada}
          eliminarBeneficio={eliminarBeneficio}
        />
      </div>

      {/* Success Modal */}
      <VacanteSuccessModal
        show={showSuccessModal}
        isEditMode={isEditMode}
        vacante={vacante}
        vacanteUrl={getVacanteUrl()}
        createdVacanteId={createdVacanteId}
        copied={copied}
        copyToClipboard={copyToClipboard}
      />
    </div>
  );
};

export default CrearVacante;
