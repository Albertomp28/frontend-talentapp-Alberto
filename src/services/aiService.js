/**
 * AI Service
 * Service for connecting to Anthropic Claude API for intelligent suggestions.
 *
 * @module services/aiService
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Get AI-powered suggestions for job requirements
 * @param {string} puesto - Job title
 * @param {string} departamento - Department
 * @param {string} tipo - Type of suggestions: 'requisitos', 'habilidades', 'beneficios'
 * @returns {Promise<string[]>} Array of suggestions
 */
export const getAISuggestions = async (puesto, departamento, tipo) => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    if (!apiKey) {
        console.warn('VITE_ANTHROPIC_API_KEY not configured');
        return null;
    }

    const prompts = {
        requisitos: `Para un puesto de "${puesto}" en el departamento de "${departamento}", genera una lista de 8-10 requisitos mínimos obligatorios que debería tener un candidato.

Incluye requisitos como:
- Nivel educativo (bachillerato, licenciatura, técnico, etc.)
- Años de experiencia
- Edad mínima si aplica
- Certificaciones necesarias
- Idiomas requeridos
- Disponibilidad (horario, viajes, etc.)
- Licencias o permisos especiales

Responde SOLO con un JSON array de strings, sin explicaciones adicionales. Ejemplo: ["Licenciatura en Ingeniería", "3 años de experiencia", "Inglés intermedio"]`,

        habilidades: `Para un puesto de "${puesto}" en el departamento de "${departamento}", genera una lista de 10-12 habilidades técnicas y blandas deseables que debería tener un candidato.

Incluye:
- Tecnologías y herramientas específicas del puesto
- Metodologías de trabajo
- Habilidades blandas relevantes
- Conocimientos técnicos específicos

Responde SOLO con un JSON array de strings, sin explicaciones adicionales. Ejemplo: ["React", "Node.js", "Trabajo en equipo", "SQL"]`,

        beneficios: `Para un puesto de "${puesto}" en el departamento de "${departamento}", genera una lista de 8-10 beneficios laborales atractivos y competitivos que una empresa podría ofrecer.

Incluye beneficios como:
- Seguros y prestaciones de salud
- Flexibilidad laboral
- Bonos y compensaciones
- Desarrollo profesional
- Beneficios adicionales

Responde SOLO con un JSON array de strings, sin explicaciones adicionales. Ejemplo: ["Seguro de gastos médicos mayores", "Home office", "Bono anual"]`
    };

    try {
        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                messages: [
                    {
                        role: 'user',
                        content: prompts[tipo]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Anthropic API error:', errorData);
            throw new Error(errorData.error?.message || 'Error al conectar con la IA');
        }

        const data = await response.json();
        const content = data.content[0]?.text;

        // Parse the JSON array from the response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return null;
    } catch (error) {
        console.error('Error getting AI suggestions:', error);
        throw error;
    }
};

export default {
    getAISuggestions
};
