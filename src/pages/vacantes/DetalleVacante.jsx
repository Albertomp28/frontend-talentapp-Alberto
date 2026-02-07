/**
 * DetalleVacante Page
 * Page for viewing vacancy details.
 *
 * @module pages/vacantes/DetalleVacante
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vacancyService } from '../../services';

const DetalleVacante = () => {
  const { id } = useParams();
  const [vacante, setVacante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVacante = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await vacancyService.getById(id);
        if (result.success) {
          setVacante(result.data);
        } else {
          setError(result.error || 'Error al cargar la vacante');
        }
      } catch (err) {
        console.error('Error fetching vacancy:', err);
        setError('Error al cargar la vacante');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVacante();
    }
  }, [id]);

  const formatSalario = (min, max) => {
    const formatNumber = (num) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(num);
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const handleEnviarCV = () => {
    if (!vacante) return;
    const subject = encodeURIComponent(`Aplicación para: ${vacante.titulo}`);
    const body = encodeURIComponent(`Hola ${vacante.reclutadorNombre},\n\nMe gustaría aplicar para la posición de ${vacante.titulo}.\n\nAdjunto mi CV para su consideración.\n\nSaludos cordiales.`);
    window.location.href = `mailto:${vacante.reclutadorEmail}?subject=${subject}&body=${body}`;
  };

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

  if (error || !vacante) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Vacante no encontrada</h2>
        <p className="text-slate-500 mb-6">{error || 'La vacante que buscas no existe o ya no está disponible.'}</p>
        <Link to="/mis-vacantes" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all no-underline">Volver a Mis Vacantes</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/mis-vacantes" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors no-underline">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Volver
        </Link>
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">{vacante.titulo}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {vacante.departamento}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                {vacante.modalidad}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {vacante.ubicacion}
              </span>
            </div>
          </div>
          <button onClick={handleEnviarCV} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Enviar mi CV
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Descripción del puesto
            </h2>
            <p className="text-slate-600 whitespace-pre-line">{vacante.descripcion || 'Sin descripción disponible.'}</p>
          </div>

          {/* Minimum Requirements */}
          {vacante.requisitosMinimos && vacante.requisitosMinimos.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                Requisitos Mínimos
                <span className="text-xs font-normal text-slate-500">(Obligatorios)</span>
              </h2>
              <div className="space-y-2">
                {vacante.requisitosMinimos.map((requisito, index) => (
                  <div key={index} className="flex items-center gap-2 text-slate-600">
                    <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    {requisito}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desired Skills */}
          {((vacante.habilidadesDeseadas && vacante.habilidadesDeseadas.length > 0) || (vacante.habilidades && vacante.habilidades.length > 0)) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                Habilidades Deseadas
                <span className="text-xs font-normal text-slate-500">(Nice to have)</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {(vacante.habilidadesDeseadas || vacante.habilidades).map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {vacante.beneficios && vacante.beneficios.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Beneficios
              </h2>
              <div className="space-y-2">
                {vacante.beneficios.map((beneficio, index) => (
                  <div key={index} className="flex items-center gap-2 text-slate-600">
                    <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    {beneficio}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Detalles de la vacante</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  Experiencia
                </span>
                <span className="text-slate-700 font-medium">{vacante.experiencia || vacante.experienciaMin || 0} años</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Salario
                </span>
                <span className="text-emerald-600 font-medium">{vacante.salarioMin && vacante.salarioMax ? formatSalario(vacante.salarioMin, vacante.salarioMax) : 'A convenir'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Contrato
                </span>
                <span className="text-slate-700 font-medium">{vacante.tipoContrato || 'Indefinido'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Publicada
                </span>
                <span className="text-slate-700 font-medium">{new Date(vacante.fechaCreacion).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Reclutador</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                {vacante.reclutadorNombre?.split(' ').map(n => n[0]).join('').toUpperCase() || 'R'}
              </div>
              <div>
                <span className="block text-slate-700 font-medium">{vacante.reclutadorNombre || 'Reclutador'}</span>
                <span className="block text-sm text-slate-500">{vacante.reclutadorEmail}</span>
                {vacante.reclutadorTelefono && <span className="block text-sm text-slate-500">{vacante.reclutadorTelefono}</span>}
              </div>
            </div>
            <button onClick={handleEnviarCV} className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-200 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Enviar CV por correo
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Compartir vacante</h3>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Enlace copiado'); }} className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-200 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copiar enlace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleVacante;
