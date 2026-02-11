/**
 * AI Service
 *
 * @module services/aiService
 *
 * Connects to the CV Processor microservice for AI-powered suggestions.
 * The API key is stored securely in the backend.
 */

const CV_PROCESSOR_URL = import.meta.env.VITE_CV_PROCESSOR_URL || 'http://localhost:8000';

/**
 * Get AI-powered suggestions for job requirements or descriptions
 * @param {string} puesto - Job title
 * @param {string} departamento - Department
 * @param {string} tipo - Type: 'requisitos', 'habilidades', 'beneficios', 'descripcion'
 * @returns {Promise<string[]|Object>} Array of suggestions or description object
 */
export const getAISuggestions = async (puesto, departamento, tipo) => {
    if (!puesto || !departamento) {
        console.warn('getAISuggestions: puesto y departamento son requeridos');
        return null;
    }

    try {
        const formData = new FormData();
        formData.append('puesto', puesto);
        formData.append('departamento', departamento);
        formData.append('tipo', tipo);

        const response = await fetch(`${CV_PROCESSOR_URL}/api/v1/suggestions`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error('Error obteniendo sugerencias:', error);
            return null;
        }

        const data = await response.json();

        // Para tipo 'descripcion', devolver objeto con descripcion y responsabilidades
        if (tipo === 'descripcion') {
            return {
                descripcion: data.descripcion || '',
                responsabilidades: data.responsabilidades || '',
            };
        }

        // Para otros tipos, devolver array de sugerencias
        return data.suggestions || [];

    } catch (error) {
        console.error('Error conectando con servicio de IA:', error);
        return null;
    }
};

/**
 * Estimate salary range using AI based on vacancy data
 * @param {Object} vacancyData - Vacancy information for estimation
 * @param {string} vacancyData.titulo - Job title
 * @param {string} vacancyData.descripcion - Job description
 * @param {string} vacancyData.ubicacion - Location
 * @param {string} vacancyData.modalidad - Work modality (Presencial/Remoto/Hibrido)
 * @param {string} vacancyData.tipoContrato - Contract type
 * @param {string[]} vacancyData.requisitosMinimos - Minimum requirements
 * @param {string[]} vacancyData.habilidadesDeseadas - Desired skills
 * @param {string} vacancyData.moneda - Currency code (CRC, USD, etc.)
 * @returns {Promise<{success: boolean, salarioMin?: number, salarioMax?: number, reasoning?: string, error?: string}>}
 */
export const estimateSalary = async (vacancyData) => {
    const { titulo, descripcion, ubicacion, modalidad, tipoContrato, requisitosMinimos, habilidadesDeseadas, moneda } = vacancyData;

    if (!titulo) {
        return { success: false, error: 'El titulo del puesto es requerido para estimar el salario' };
    }

    try {
        // Backend expects English field names
        const payload = {
            title: titulo,
            description: descripcion || '',
            location: ubicacion || '',
            modality: modalidad || '',
            contract_type: tipoContrato || '',
            requirements: requisitosMinimos || [],
            skills: habilidadesDeseadas || [],
            currency: moneda || 'CRC',
        };

        const response = await fetch(`${CV_PROCESSOR_URL}/api/v1/salary/estimate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error estimando salario:', errorData);
            return {
                success: false,
                error: errorData.detail || errorData.message || 'Error al estimar el salario',
            };
        }

        const data = await response.json();

        return {
            success: true,
            salarioMin: data.min_salary ?? data.salary_min ?? data.salarioMin ?? null,
            salarioMax: data.max_salary ?? data.salary_max ?? data.salarioMax ?? null,
            reasoning: data.reasoning || data.razonamiento || '',
        };

    } catch (error) {
        console.error('Error conectando con servicio de IA para salario:', error);
        return {
            success: false,
            error: 'No se pudo conectar con el servicio de IA. Verifica que el CV Processor este activo.',
        };
    }
};

export default {
    getAISuggestions,
    estimateSalary,
};
