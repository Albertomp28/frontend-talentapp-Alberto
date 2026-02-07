/**
 * Vacancy Service
 * CRUD operations for job vacancies connecting to backend API.
 *
 * @module services/vacancyService
 */

import apiClient from './apiClient';

/**
 * Get all vacancies from API
 * @returns {Promise<Array>} List of vacancies
 */
const getAll = async () => {
  try {
    const response = await apiClient.get('/vacancies');
    const vacancies = response.data.data || response.data || [];
    return vacancies.map(mapBackendToFrontend);
  } catch (error) {
    console.error('Error fetching vacancies:', error);
    return [];
  }
};

/**
 * Get vacancy by ID
 * @param {string} id - Vacancy ID
 * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
 */
const getById = async (id) => {
  try {
    const response = await apiClient.get(`/vacancies/${id}`);
    const vacancy = response.data.data || response.data;
    return { success: true, data: mapBackendToFrontend(vacancy) };
  } catch (error) {
    console.error('Error fetching vacancy:', error);
    const message = error.response?.data?.message || 'Error al cargar la vacante';
    return { success: false, error: message };
  }
};

/**
 * Create a new vacancy
 * @param {Object} vacancyData - Vacancy data from frontend form
 * @returns {Promise<{ success: boolean, vacancy?: Object, error?: string }>}
 */
const create = async (vacancyData) => {
  try {
    const payload = mapFrontendToBackend(vacancyData);
    const response = await apiClient.post('/vacancies', payload);
    const vacancy = response.data.data || response.data;
    return { success: true, vacancy: mapBackendToFrontend(vacancy) };
  } catch (error) {
    console.error('Error creating vacancy:', error);
    const message = error.response?.data?.message || 'Error al crear la vacante';
    return { success: false, error: Array.isArray(message) ? message.join(', ') : message };
  }
};

/**
 * Update an existing vacancy
 * @param {string} id - Vacancy ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<{ success: boolean, vacancy?: Object, error?: string }>}
 */
const update = async (id, updates) => {
  try {
    const payload = mapFrontendToBackend(updates);
    const response = await apiClient.patch(`/vacancies/${id}`, payload);
    const vacancy = response.data.data || response.data;
    return { success: true, vacancy: mapBackendToFrontend(vacancy) };
  } catch (error) {
    console.error('Error updating vacancy:', error);
    const message = error.response?.data?.message || 'Error al actualizar la vacante';
    return { success: false, error: Array.isArray(message) ? message.join(', ') : message };
  }
};

/**
 * Publish a vacancy (draft -> published)
 * @param {string} id - Vacancy ID
 * @returns {Promise<{ success: boolean, vacancy?: Object, error?: string }>}
 */
const publish = async (id) => {
  try {
    const response = await apiClient.patch(`/vacancies/${id}/publish`);
    const vacancy = response.data.data || response.data;
    return { success: true, vacancy: mapBackendToFrontend(vacancy) };
  } catch (error) {
    console.error('Error publishing vacancy:', error);
    const message = error.response?.data?.message || 'Error al publicar la vacante';
    return { success: false, error: message };
  }
};

/**
 * Close a vacancy (published -> closed)
 * @param {string} id - Vacancy ID
 * @returns {Promise<{ success: boolean, vacancy?: Object, error?: string }>}
 */
const close = async (id) => {
  try {
    const response = await apiClient.patch(`/vacancies/${id}/close`);
    const vacancy = response.data.data || response.data;
    return { success: true, vacancy: mapBackendToFrontend(vacancy) };
  } catch (error) {
    console.error('Error closing vacancy:', error);
    const message = error.response?.data?.message || 'Error al cerrar la vacante';
    return { success: false, error: message };
  }
};

/**
 * Get all departments from API
 * @returns {Promise<Array>} List of departments
 */
const getDepartments = async () => {
  try {
    const response = await apiClient.get('/departments');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};

/**
 * Get vacancy statistics
 * @returns {Promise<{ total: number, draft: number, published: number, closed: number }>}
 */
const getStats = async () => {
  try {
    const vacancies = await getAll();
    return {
      total: vacancies.length,
      draft: vacancies.filter((v) => v.estado === 'draft').length,
      published: vacancies.filter((v) => v.estado === 'published').length,
      closed: vacancies.filter((v) => v.estado === 'closed').length,
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return { total: 0, draft: 0, published: 0, closed: 0 };
  }
};

// ============================================================================
// Mappers: Convert between frontend and backend data structures
// ============================================================================

/**
 * Map frontend form data to backend API format
 */
const mapFrontendToBackend = (data) => {
  const payload = {};

  if (data.titulo) {
    payload.title = data.titulo;
  }

  if (data.departamentoId) {
    payload.departmentId = data.departamentoId;
  }

  // Build description object matching backend schema
  payload.description = {
    schema_version: '1.0',
    must_have: (data.requisitosMinimos || []).map((r) => ({ requirement: r })),
    nice_to_have: (data.habilidadesDeseadas || []).map((r) => ({ requirement: r })),
    responsibilities: (data.responsabilidades || '')
      .split('\n')
      .filter((r) => r.trim())
      .map((r) => ({ description: r.trim() })),
    location: {
      province: data.ubicacion || 'San José',
      address_detail: data.direccionDetalle || '',
    },
    modality: mapModalityToBackend(data.modalidad),
    contract_type: mapContractToBackend(data.tipoContrato),
  };

  // Optional compensation
  if (data.salarioMin || data.salarioMax) {
    payload.description.compensation = {
      min_salary: Number(data.salarioMin) || 0,
      max_salary: Number(data.salarioMax) || 0,
      currency: 'CRC',
    };
  }

  // Optional benefits
  if (data.beneficios && data.beneficios.length > 0) {
    payload.description.benefits = data.beneficios.map((b) => ({ benefit: b }));
  }

  return payload;
};

/**
 * Map backend API data to frontend format
 */
const mapBackendToFrontend = (vacancy) => {
  if (!vacancy) return null;

  const desc = vacancy.description || {};

  return {
    id: vacancy.id,
    titulo: vacancy.title,
    departamento: vacancy.department?.name || '',
    departamentoId: vacancy.department?.id || '',
    descripcion: desc.responsibilities?.map((r) => r.description).join('\n') || '',
    responsabilidades: desc.responsibilities?.map((r) => r.description).join('\n') || '',
    ubicacion: desc.location?.province || '',
    direccionDetalle: desc.location?.address_detail || '',
    modalidad: mapModalityToFrontend(desc.modality),
    tipoContrato: mapContractToFrontend(desc.contract_type),
    salarioMin: desc.compensation?.min_salary || '',
    salarioMax: desc.compensation?.max_salary || '',
    mostrarSalario: !!desc.compensation,
    requisitosMinimos: desc.must_have?.map((r) => r.requirement) || [],
    habilidadesDeseadas: desc.nice_to_have?.map((r) => r.requirement) || [],
    beneficios: desc.benefits?.map((b) => b.benefit) || [],
    estado: vacancy.status,
    fechaCreacion: vacancy.createdAt,
    fechaActualizacion: vacancy.updatedAt,
    createdBy: vacancy.createdBy,
  };
};

const mapModalityToBackend = (modality) => {
  const map = {
    Presencial: 'presencial',
    Remoto: 'remoto',
    Híbrido: 'hibrido',
    presencial: 'presencial',
    remoto: 'remoto',
    hibrido: 'hibrido',
  };
  return map[modality] || 'presencial';
};

const mapModalityToFrontend = (modality) => {
  const map = {
    presencial: 'Presencial',
    remoto: 'Remoto',
    hibrido: 'Híbrido',
  };
  return map[modality] || modality || '';
};

const mapContractToBackend = (contract) => {
  const map = {
    'Tiempo indefinido': 'tiempo_indefinido',
    Temporal: 'temporal',
    'Por proyecto': 'por_proyecto',
    Prácticas: 'practicas',
    tiempo_indefinido: 'tiempo_indefinido',
    temporal: 'temporal',
    por_proyecto: 'por_proyecto',
    practicas: 'practicas',
  };
  return map[contract] || 'tiempo_indefinido';
};

const mapContractToFrontend = (contract) => {
  const map = {
    tiempo_indefinido: 'Tiempo indefinido',
    temporal: 'Temporal',
    por_proyecto: 'Por proyecto',
    practicas: 'Prácticas',
  };
  return map[contract] || contract || '';
};

export const vacancyService = {
  getAll,
  getById,
  create,
  update,
  publish,
  close,
  getDepartments,
  getStats,
};

export default vacancyService;
