/**
 * CV Processing Service
 * Handles CV upload and data extraction using the cv-processor API.
 *
 * @module services/cvService
 */

// Use environment variable or fallback to localhost for development outside Docker
import config from '../config';

const CV_PROCESSOR_URL = config.CV_PROCESSOR_URL;
const CV_PROCESSOR_API_KEY = config.CV_PROCESSOR_API_KEY;

// Validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES_PER_BATCH = 20;
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const DEFAULT_CONCURRENCY = 3;
const MAX_RETRIES = 2;

/**
 * Extract text from a CV file
 * @param {File} file - CV file (PDF, DOC, DOCX)
 * @returns {Promise<{ success: boolean, text?: string, error?: string }>}
 */
const extractText = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const headers = {};
    if (CV_PROCESSOR_API_KEY) {
      headers['X-API-Key'] = CV_PROCESSOR_API_KEY;
    }

    const response = await fetch(`${CV_PROCESSOR_URL}/api/v1/cv/extract-text`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al procesar el archivo');
    }

    const data = await response.json();
    return { success: true, text: data.text || '', metadata: data };
  } catch (error) {
    console.error('Error extracting text from CV:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Extract contact information from CV text using regex patterns
 * @param {string} text - Extracted text from CV
 * @returns {{ nombre: string, email: string, telefono: string }}
 */
const extractContactInfo = (text) => {
  const result = {
    nombre: '',
    email: '',
    telefono: '',
  };

  if (!text) return result;

  // Extract email (most reliable)
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  const emails = text.match(emailRegex);
  if (emails && emails.length > 0) {
    result.email = emails[0].toLowerCase();
  }

  // Extract phone numbers (various formats)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
  const phones = text.match(phoneRegex);
  if (phones && phones.length > 0) {
    // Clean and take the first valid phone
    const cleanPhone = phones[0].replace(/[^\d+]/g, '');
    if (cleanPhone.length >= 8) {
      result.telefono = phones[0].trim();
    }
  }

  // Extract name (first non-empty line that looks like a name)
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  for (const line of lines.slice(0, 10)) {
    // Skip lines that are clearly not names
    if (line.includes('@') || line.includes('http') || line.includes('www')) continue;
    if (/^\d+/.test(line)) continue; // Starts with number
    if (line.length > 50) continue; // Too long for a name
    if (line.toLowerCase().includes('curriculum') || line.toLowerCase().includes('vitae')) continue;
    if (line.toLowerCase().includes('resumen') || line.toLowerCase().includes('resume')) continue;

    // Check if it looks like a name (2-4 words, mostly letters)
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 5) {
      const isName = words.every((word) => /^[A-Za-záéíóúñÁÉÍÓÚÑüÜ]+\.?$/.test(word));
      if (isName) {
        result.nombre = line;
        break;
      }
    }
  }

  return result;
};

/**
 * Process a CV file and extract contact information
 * @param {File} file - CV file
 * @returns {Promise<{ success: boolean, data?: { nombre: string, email: string, telefono: string }, error?: string }>}
 */
const extractContactFromCV = async (file) => {
  const extractResult = await extractText(file);

  if (!extractResult.success) {
    return { success: false, error: extractResult.error };
  }

  const contactInfo = extractContactInfo(extractResult.text);

  return {
    success: true,
    data: contactInfo,
    rawText: extractResult.text,
  };
};

/**
 * Process CV for full analysis with vacancy matching
 * @param {File} file - CV file
 * @param {string} candidateId - Candidate ID
 * @param {Object} vacancyData - Vacancy information
 * @returns {Promise<Object>}
 */
const processCV = async (file, candidateId, vacancyData = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('candidate_id', candidateId);

    const headers = {};
    if (CV_PROCESSOR_API_KEY) {
      headers['X-API-Key'] = CV_PROCESSOR_API_KEY;
    }

    const response = await fetch(`${CV_PROCESSOR_URL}/api/v1/cv/process`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al procesar el CV');
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing CV:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Validate a file for CV upload
 * @param {File} file - File to validate
 * @returns {{ valid: boolean, error?: string }}
 */
const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No se proporcionó archivo' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `Archivo muy grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }

  // Check extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
  if (!hasValidExtension) {
    return { valid: false, error: 'Formato no soportado. Use PDF, DOC o DOCX' };
  }

  return { valid: true };
};

/**
 * Format requirements for CV Processor API
 * Converts various formats to the expected structure
 * @param {Array|Object} requirements - Requirements in various formats
 * @returns {Object} - Formatted requirements object
 */
const formatRequirements = (requirements) => {
  // If already in correct format
  if (requirements && typeof requirements === 'object' && !Array.isArray(requirements)) {
    if (requirements.must_have || requirements.nice_to_have) {
      return requirements;
    }
  }

  // Convert array of strings to proper format
  if (Array.isArray(requirements)) {
    return {
      must_have: requirements.map(req => ({
        description: typeof req === 'string' ? req : (req.description || req.name || String(req))
      })),
      nice_to_have: []
    };
  }

  // Default empty structure
  return {
    must_have: [],
    nice_to_have: []
  };
};

/**
 * Analyze CV against a vacancy using semantic matching
 * @param {File} file - CV file
 * @param {Object} vacancyData - Vacancy information for matching
 * @param {string} candidateId - Candidate ID (optional)
 * @returns {Promise<Object>}
 */
const analyzeCV = async (file, vacancyData = {}, candidateId = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('candidate_id', candidateId || `temp-${Date.now()}`);

    // Build vacancy object with correct structure for CV Processor
    const vacancyPayload = {
      title: vacancyData.titulo || vacancyData.title || 'Vacante',
      description: vacancyData.descripcion || vacancyData.description || '',
      level: vacancyData.nivel || vacancyData.level || 'mid',
      requirements: formatRequirements(vacancyData.requisitos || vacancyData.requirements),
    };

    formData.append('vacancy_json', JSON.stringify(vacancyPayload));

    const headers = {};
    if (CV_PROCESSOR_API_KEY) {
      headers['X-API-Key'] = CV_PROCESSOR_API_KEY;
    }

    const response = await fetch(`${CV_PROCESSOR_URL}/api/v1/match/cv-vacancy`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Handle validation errors (422)
      if (errorData.detail && Array.isArray(errorData.detail)) {
        const messages = errorData.detail.map(d => d.msg || d.message || JSON.stringify(d));
        throw new Error(messages.join(', '));
      }
      throw new Error(errorData.detail || 'Error al analizar CV');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error analyzing CV:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Helper to delay execution
 * @param {number} ms - Milliseconds to wait
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries
 */
const withRetry = async (fn, retries = MAX_RETRIES) => {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries) {
        await delay(1000 * Math.pow(2, i)); // Exponential backoff
      }
    }
  }
  throw lastError;
};

/**
 * Process multiple CVs with limited concurrency
 * @param {Array<{id: string, file: File, vacancyData: Object}>} items - Array of CV items to process
 * @param {Function} onProgress - Callback for progress updates (itemId, { status, progress, data?, error? })
 * @param {Object} options - Processing options
 * @returns {Promise<Array>}
 */
const processMultipleCVs = async (items, onProgress, options = {}) => {
  const { concurrency = DEFAULT_CONCURRENCY } = options;
  const results = [];
  const queue = [...items];
  const inProgress = new Set();

  const processItem = async (item) => {
    const { id, file, vacancyData } = item;

    try {
      // Step 1: Extract text (25%)
      onProgress(id, { status: 'extracting', progress: 10 });

      const extractResult = await withRetry(() => extractText(file));
      if (!extractResult.success) {
        throw new Error(extractResult.error || 'Error extrayendo texto');
      }

      onProgress(id, { status: 'extracting', progress: 25 });

      // Step 2: Extract contact info (40%)
      const contactInfo = extractContactInfo(extractResult.text);
      onProgress(id, { status: 'analyzing', progress: 40 });

      // Step 3: Analyze CV against vacancy (90%)
      const analysisResult = await withRetry(() => analyzeCV(file, vacancyData));

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Error en análisis');
      }

      onProgress(id, { status: 'analyzing', progress: 90 });

      // Complete
      const result = {
        id,
        success: true,
        contactData: contactInfo,
        rawText: extractResult.text,
        analysisResult: analysisResult.data,
      };

      onProgress(id, { status: 'completed', progress: 100, data: result });
      return result;

    } catch (error) {
      const errorResult = { id, success: false, error: error.message };
      onProgress(id, { status: 'error', progress: 0, error: error.message });
      return errorResult;
    }
  };

  const worker = async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;

      inProgress.add(item.id);
      const result = await processItem(item);
      results.push(result);
      inProgress.delete(item.id);
    }
  };

  // Start workers
  const workers = Array(Math.min(concurrency, items.length))
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  return results;
};

/**
 * Generate a unique ID
 * @returns {string}
 */
const generateId = () => {
  return `cv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Perform deep LLM analysis on a CV against a vacancy.
 * This is called only when the initial matching returns should_send_to_llm === true.
 *
 * The endpoint re-processes the file server-side, so we must send the
 * original file again (not just text).
 *
 * @param {File} file - The original CV file (PDF, DOC, DOCX)
 * @param {string} candidateId - Candidate identifier
 * @param {Object} vacancyData - Vacancy information (titulo, descripcion, requisitos, etc.)
 * @param {string} [model='haiku'] - LLM model to use ('haiku' or 'sonnet')
 * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
 */
const analyzeDeep = async (file, candidateId, vacancyData = {}, model = 'haiku') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('candidate_id', candidateId || `temp-${Date.now()}`);

    // Build vacancy payload matching the backend expectations
    const vacancyPayload = {
      title: vacancyData.titulo || vacancyData.title || 'Vacante',
      description: vacancyData.descripcion || vacancyData.description || '',
      level: vacancyData.nivel || vacancyData.level || 'mid',
      requirements: formatRequirements(vacancyData.requisitos || vacancyData.requirements),
    };

    formData.append('vacancy_json', JSON.stringify(vacancyPayload));
    formData.append('model', model);

    const headers = {};
    if (CV_PROCESSOR_API_KEY) {
      headers['X-API-Key'] = CV_PROCESSOR_API_KEY;
    }

    const response = await fetch(`${CV_PROCESSOR_URL}/api/v1/analyze/deep`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error en análisis profundo');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error in deep analysis:', error);
    return { success: false, error: error.message };
  }
};

export const cvService = {
  // Existing methods
  extractText,
  extractContactInfo,
  extractContactFromCV,
  processCV,
  // New methods
  validateFile,
  analyzeCV,
  analyzeDeep,
  processMultipleCVs,
  generateId,
  // Constants
  MAX_FILE_SIZE,
  MAX_FILES_PER_BATCH,
  ALLOWED_EXTENSIONS,
};

export default cvService;
