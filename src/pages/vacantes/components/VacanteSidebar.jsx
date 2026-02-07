/**
 * Vacancy Summary Sidebar
 * Displays real-time preview of vacancy data
 */
const VacanteSidebar = ({ vacante, eliminarHabilidad, eliminarBeneficio }) => {
    return (
        <div className="lg:col-span-4">
            <div className="sticky top-4 space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                        <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <h3 className="font-bold text-slate-800 text-lg">Resumen de Vacante</h3>
                    </div>

                    {/* Basic Info Preview */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detalles Generales</h4>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            {vacante.titulo ? (
                                <p className="font-bold text-slate-800 text-lg leading-tight mb-2">{vacante.titulo}</p>
                            ) : (
                                <p className="text-slate-400 italic mb-2">Título de la vacante...</p>
                            )}

                            <div className="text-sm text-slate-600 space-y-1">
                                <p><span className="font-medium text-slate-500">Depto:</span> {vacante.departamento || 'No especificado'}</p>
                                <p><span className="font-medium text-slate-500">Ubicación:</span> {vacante.ubicacion || 'No especificada'}</p>
                                <p><span className="font-medium text-slate-500">Modalidad:</span> {vacante.modalidad || 'No especificada'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Skills List Preview */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex justify-between items-center">
                            Habilidades Agregadas
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">{vacante.habilidades.length}</span>
                        </h4>
                        {vacante.habilidades.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {vacante.habilidades.map((skill, index) => (
                                    <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                                        {skill}
                                        <button
                                            onClick={() => eliminarHabilidad(skill)}
                                            className="text-blue-400 hover:text-red-500 transition-colors"
                                            title="Eliminar habilidad"
                                        >
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-sm text-slate-400">Aún no hay habilidades</p>
                            </div>
                        )}
                    </div>

                    {/* Benefits List Preview */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex justify-between items-center">
                            Beneficios Agregados
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px]">{vacante.beneficios.length}</span>
                        </h4>
                        {vacante.beneficios.length > 0 ? (
                            <ul className="space-y-2">
                                {vacante.beneficios.map((beneficio, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50">
                                        <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        <span className="flex-1">{beneficio}</span>
                                        <button
                                            onClick={() => eliminarBeneficio(beneficio)}
                                            className="text-emerald-400 hover:text-red-500 transition-colors"
                                            title="Eliminar beneficio"
                                        >
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-sm text-slate-400">Aún no hay beneficios</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VacanteSidebar;
