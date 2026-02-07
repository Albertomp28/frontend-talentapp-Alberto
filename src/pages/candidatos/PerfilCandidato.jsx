import { useParams, Link } from 'react-router-dom';

const PerfilCandidato = () => {
  const { id } = useParams();

  const candidato = {
    id,
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+52 55 1234 5678',
    experiencia: '5 años',
    habilidades: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    educacion: 'Ing. en Sistemas Computacionales',
    resumen: 'Desarrollador con amplia experiencia en aplicaciones web. Especializado en React y Node.js con conocimientos sólidos en bases de datos y arquitectura de software.',
  };

  const aplicaciones = [
    { vacante: 'Desarrollador Frontend', fecha: '2024-01-10', estado: 'En proceso' },
    { vacante: 'Tech Lead', fecha: '2023-11-15', estado: 'Rechazado' },
  ];

  const getEstadoClasses = (estado) => {
    switch (estado.toLowerCase()) {
      case 'en proceso':
        return 'bg-blue-50 text-blue-600';
      case 'contratado':
        return 'bg-emerald-50 text-emerald-600';
      case 'rechazado':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver
      </Link>

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {candidato.nombre.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">{candidato.nombre}</h1>
            <div className="space-y-1 text-slate-500">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {candidato.email}
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {candidato.telefono}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Resumen */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Resumen
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">{candidato.resumen}</p>
        </div>

        {/* Experiencia y Educación */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              Experiencia
            </h2>
            <p className="text-slate-700">{candidato.experiencia}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Educación
            </h2>
            <p className="text-slate-700">{candidato.educacion}</p>
          </div>
        </div>
      </div>

      {/* Habilidades */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          Habilidades
        </h2>
        <div className="flex flex-wrap gap-2">
          {candidato.habilidades.map((skill, index) => (
            <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Historial de Aplicaciones */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Historial de Aplicaciones
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Vacante</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Fecha</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Estado</th>
              </tr>
            </thead>
            <tbody>
              {aplicaciones.map((app, index) => (
                <tr key={index} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 text-slate-700">{app.vacante}</td>
                  <td className="py-3 px-4 text-slate-500">{app.fecha}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoClasses(app.estado)}`}>
                      {app.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerfilCandidato;
