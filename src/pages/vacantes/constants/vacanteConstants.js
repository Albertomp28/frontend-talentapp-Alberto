/**
 * Vacante Form Constants
 * Centralized configuration for the vacancy creation form
 */

// Location options (Costa Rica provinces - matching backend validation)
export const UBICACIONES = [
  { value: 'San José', label: 'San José' },
  { value: 'Alajuela', label: 'Alajuela' },
  { value: 'Cartago', label: 'Cartago' },
  { value: 'Heredia', label: 'Heredia' },
  { value: 'Guanacaste', label: 'Guanacaste' },
  { value: 'Puntarenas', label: 'Puntarenas' },
  { value: 'Limón', label: 'Limón' },
];

// Work modality options
export const MODALIDADES = [
  { value: 'Presencial', label: 'Presencial' },
  { value: 'Remoto', label: 'Remoto' },
  { value: 'Híbrido', label: 'Híbrido' },
];

// Contract type options
export const TIPOS_CONTRATO = [
  { value: 'Tiempo indefinido', label: 'Tiempo indefinido' },
  { value: 'Temporal', label: 'Temporal' },
  { value: 'Por proyecto', label: 'Por proyecto' },
  { value: 'Prácticas', label: 'Prácticas' },
];

// Suggested skills
export const HABILIDADES_SUGERIDAS = [
  'React',
  'Node.js',
  'Python',
  'Java',
  'TypeScript',
  'AWS',
  'Docker',
  'SQL',
  'Git',
  'Agile',
  'Scrum',
  'Figma',
];

// Suggested minimum requirements
export const REQUISITOS_SUGERIDOS = [
  'Bachillerato en Ingeniería',
  'Técnico en Ingeniería',
  'Licenciatura',
  'Mayor de 18 años',
  'Mayor de 21 años',
  'Licencia de conducir',
  'Disponibilidad para viajar',
  'Inglés intermedio',
  'Inglés avanzado',
];

// Suggested benefits
export const BENEFICIOS_SUGERIDOS = [
  'Seguro de gastos médicos',
  'Home office',
  'Horario flexible',
  'Bonos de productividad',
  'Capacitación',
  'Gimnasio',
  'Vales de despensa',
  'Días extra de vacaciones',
];

// Initial state for vacancy form
export const INITIAL_VACANTE_STATE = {
  titulo: '',
  departamentoId: '',
  departamento: '',
  descripcion: '',
  responsabilidades: '',
  ubicacion: '',
  direccionDetalle: '',
  modalidad: '',
  tipoContrato: '',
  salarioMin: '',
  salarioMax: '',
  mostrarSalario: true,
  requisitosMinimos: [],
  habilidadesDeseadas: [],
  beneficios: [],
};

// Shared Tailwind CSS classes
export const INPUT_CLASSES =
  'w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 text-base outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 hover:border-slate-300';

export const LABEL_CLASSES = 'block mb-2 text-sm font-bold text-slate-700';

// Step configuration
export const STEPS = [
  { number: 1, label: 'Información básica' },
  { number: 2, label: 'Detalles' },
  { number: 3, label: 'Revisión' },
];
