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
    console.log('Creating vacancy with payload:', JSON.stringify(payload, null, 2));

    // Validate required fields before sending to backend
    if (!payload.title || !payload.title.trim()) {
      return { success: false, error: 'El titulo de la vacante es obligatorio' };
    }
    if (!payload.departmentId) {
      return { success: false, error: 'El departamento es obligatorio' };
    }

    const response = await apiClient.post('/vacancies', payload);
    console.log('Create vacancy response:', JSON.stringify(response.data, null, 2));

    const vacancy = response.data.data || response.data;
    const mapped = mapBackendToFrontend(vacancy);

    if (!mapped || !mapped.id) {
      console.error('Unexpected response structure:', response.data);
      return { success: false, error: 'Respuesta inesperada del servidor' };
    }

    return { success: true, vacancy: mapped };
  } catch (error) {
    console.error('Error creating vacancy:', error);
    console.error('Error response data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Error status:', error.response?.status);

    // Build specific error message
    let message = 'Error al crear la vacante';
    if (error.response?.status === 401) {
      message = 'Sesion expirada. Por favor inicia sesion nuevamente.';
    } else if (error.response?.status === 400) {
      const backendMsg = error.response?.data?.message;
      if (Array.isArray(backendMsg)) {
        message = backendMsg.join(', ');
      } else if (backendMsg) {
        message = backendMsg;
      } else {
        message = 'Datos de vacante invalidos. Verifica los campos obligatorios.';
      }
    } else if (error.response?.status === 500) {
      message = 'Error interno del servidor. Intenta nuevamente.';
    } else if (error.response?.data?.message) {
      message = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(', ')
        : error.response.data.message;
    } else if (!error.response) {
      // Network error or CORS issue
      if (error.message?.includes('Network Error')) {
        message = 'Error de red. Verifica que el backend este corriendo en localhost:3000 y tenga CORS habilitado.';
      } else {
        message = `Error de conexion: ${error.message || 'No se pudo conectar con el servidor'}. Revisa la consola del navegador (F12) para mas detalles.`;
      }
      console.error('Connection error details:', error.message, error.code);
    }

    return { success: false, error: message };
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
    console.log('Updating vacancy with payload:', JSON.stringify(payload, null, 2));
    const response = await apiClient.patch(`/vacancies/${id}`, payload);
    console.log('Update vacancy response:', JSON.stringify(response.data, null, 2));

    const vacancy = response.data.data || response.data;
    const mapped = mapBackendToFrontend(vacancy);

    if (!mapped || !mapped.id) {
      console.error('Unexpected update response structure:', response.data);
      return { success: false, error: 'Respuesta inesperada del servidor' };
    }

    return { success: true, vacancy: mapped };
  } catch (error) {
    console.error('Error updating vacancy:', error);
    console.error('Error response data:', JSON.stringify(error.response?.data, null, 2));
    const backendMsg = error.response?.data?.message;
    let message;
    if (Array.isArray(backendMsg)) {
      message = backendMsg.join(', ');
    } else if (backendMsg) {
      message = backendMsg;
    } else if (!error.response) {
      message = 'No se pudo conectar con el servidor. Verifica tu conexion.';
    } else {
      message = 'Error al actualizar la vacante';
    }
    return { success: false, error: message };
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
  // Always include required fields (title and departmentId)
  const payload = {
    title: data.titulo || '',
    departmentId: data.departamentoId || '',
  };

  // Build description object matching backend schema
  // Combinar descripcion y responsabilidades en el campo responsibilities
  const allResponsibilities = [];
  const MAX_RESPONSIBILITY_LENGTH = 500;

  // Helper to truncate text to max length
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  // Helper to split long text into chunks
  const splitIntoChunks = (text, maxLength) => {
    if (!text || text.length <= maxLength) return [text];
    const chunks = [];
    let remaining = text;
    while (remaining.length > 0) {
      if (remaining.length <= maxLength) {
        chunks.push(remaining);
        break;
      }
      // Find a good break point (sentence or word)
      let breakPoint = remaining.lastIndexOf('. ', maxLength);
      if (breakPoint === -1 || breakPoint < maxLength / 2) {
        breakPoint = remaining.lastIndexOf(' ', maxLength);
      }
      if (breakPoint === -1 || breakPoint < maxLength / 2) {
        breakPoint = maxLength;
      }
      chunks.push(remaining.substring(0, breakPoint + 1).trim());
      remaining = remaining.substring(breakPoint + 1).trim();
    }
    return chunks;
  };

  // Agregar descripcion general - dividir si es muy larga
  if (data.descripcion && data.descripcion.trim()) {
    const descChunks = splitIntoChunks(data.descripcion.trim(), MAX_RESPONSIBILITY_LENGTH);
    descChunks.forEach((chunk) => {
      if (chunk) allResponsibilities.push({ description: chunk });
    });
  }

  // Agregar responsabilidades individuales (puede ser array o string)
  if (data.responsabilidades) {
    let respArray;
    if (Array.isArray(data.responsabilidades)) {
      // Ya es un array
      respArray = data.responsabilidades;
    } else if (typeof data.responsabilidades === 'string') {
      // Es un string, separar por saltos de línea
      respArray = data.responsabilidades.split('\n');
    } else {
      respArray = [];
    }
    const respList = respArray
      .filter((r) => r && r.trim())
      .map((r) => ({ description: truncateText(r.trim().replace(/^-\s*/, ''), MAX_RESPONSIBILITY_LENGTH) }));
    allResponsibilities.push(...respList);
  }

  // Backend requires at least 1 element in must_have (truncate to 500 chars)
  const MAX_REQUIREMENT_LENGTH = 500;
  const mustHave = (data.requisitosMinimos || []).map((r) => ({
    requirement: truncateText(r, MAX_REQUIREMENT_LENGTH),
  }));
  if (mustHave.length === 0) {
    mustHave.push({ requirement: 'Según perfil del puesto' });
  }

  // Backend requires at least 1 element in responsibilities
  if (allResponsibilities.length === 0) {
    allResponsibilities.push({ description: data.titulo || 'Responsabilidades del puesto' });
  }

  // Nice to have skills (truncate to 500 chars)
  const niceToHave = (data.habilidadesDeseadas || []).map((r) => ({
    requirement: truncateText(r, MAX_REQUIREMENT_LENGTH),
  }));

  payload.description = {
    schema_version: '1.0',
    must_have: mustHave,
    nice_to_have: niceToHave,
    responsibilities: allResponsibilities,
    location: {
      province: data.ubicacion || 'San José',
      address_detail: data.direccionDetalle || '',
    },
    modality: mapModalityToBackend(data.modalidad),
    contract_type: mapContractToBackend(data.tipoContrato),
  };

  // Optional compensation - backend only accepts CRC currency
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

  // Separar la primera responsabilidad como descripción y el resto como responsabilidades
  const responsibilities = desc.responsibilities || [];
  const descripcion = responsibilities.length > 0 ? responsibilities[0]?.description || '' : '';
  const responsabilidades = responsibilities.slice(1).map((r) => r.description).join('\n');

  return {
    id: vacancy.id,
    titulo: vacancy.title,
    departamento: vacancy.department?.name || '',
    departamentoId: vacancy.department?.id || '',
    descripcion: descripcion,
    responsabilidades: responsabilidades,
    ubicacion: desc.location?.province || '',
    direccionDetalle: desc.location?.address_detail || '',
    modalidad: mapModalityToFrontend(desc.modality),
    tipoContrato: mapContractToFrontend(desc.contract_type),
    moneda: desc.compensation?.currency || 'CRC',
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
