import { STEPS } from '../constants/vacanteConstants';

/**
 * Progress stepper component for vacancy form
 * Shows current step and navigation progress
 */
const VacanteFormStepper = ({ currentStep }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-center gap-12">
                {STEPS.map((stepInfo, index) => (
                    <div key={stepInfo.number} className="flex items-center">
                        {/* Step indicator */}
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${currentStep > stepInfo.number
                                    ? 'bg-emerald-500 text-white'
                                    : currentStep >= stepInfo.number
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-200 text-slate-500'}`}>
                                {currentStep > stepInfo.number ? '✓' : stepInfo.number}
                            </div>
                            <span className={`text-sm font-medium ${stepInfo.number === 1 ? '' : 'hidden sm:block'} ${currentStep >= stepInfo.number ? 'text-slate-800' : 'text-slate-400'}`}>
                                {stepInfo.label}
                            </span>
                        </div>

                        {/* Connector line (except for last step) */}
                        {index < STEPS.length - 1 && (
                            <div className={`w-16 h-1 rounded-full ml-12 ${currentStep > stepInfo.number ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VacanteFormStepper;
