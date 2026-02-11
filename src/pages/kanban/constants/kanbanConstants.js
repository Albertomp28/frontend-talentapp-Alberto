/**
 * Kanban Constants
 * Configuration for the Kanban board.
 *
 * @module pages/kanban/constants/kanbanConstants
 */

// Re-export PIPELINE_COLUMNS from centralized constants
export { PIPELINE_COLUMNS } from '../../../constants/pipelineConstants';

export const MOCK_VACANTES = [
    {
        id: 1,
        titulo: 'Frontend Developer',
        departamento: 'Tecnología',
        descripcion: 'Desarrollador frontend con experiencia en React y TypeScript',
        nivel: 'mid',
        requisitos: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Git']
    },
    {
        id: 2,
        titulo: 'UX Designer',
        departamento: 'Diseño',
        descripcion: 'Diseñador UX/UI con experiencia en Figma y prototipado',
        nivel: 'mid',
        requisitos: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'UI Design']
    },
    {
        id: 3,
        titulo: 'Project Manager',
        departamento: 'Operaciones',
        descripcion: 'Project Manager con experiencia en metodologías ágiles',
        nivel: 'senior',
        requisitos: ['Scrum', 'Jira', 'Agile', 'Liderazgo', 'Comunicación', 'Gestión de equipos']
    },
    {
        id: 4,
        titulo: 'Backend Developer',
        departamento: 'Tecnología',
        descripcion: 'Desarrollador backend con experiencia en Node.js o Python',
        nivel: 'mid',
        requisitos: ['Node.js', 'Python', 'PostgreSQL', 'REST API', 'Docker', 'Git']
    },
];

export const MOCK_CANDIDATOS = [
    { id: 1, nombre: 'María García', email: 'maria.garcia@email.com', telefono: '+52 55 1234 5678', vacanteId: 1, vacante: 'Frontend Developer', columna: 'candidatos', llmScore: 92, llmAnalisis: { experiencia: 95, habilidades: 90, educacion: 88, cultura: 94 }, skills: ['React', 'TypeScript', 'Node.js'], experienciaAnios: 5, fechaAplicacion: '2026-01-25' },
    { id: 2, nombre: 'Carlos López', email: 'carlos.lopez@email.com', telefono: '+52 55 2345 6789', vacanteId: 2, vacante: 'UX Designer', columna: 'candidatos', llmScore: 78, llmAnalisis: { experiencia: 75, habilidades: 82, educacion: 80, cultura: 76 }, skills: ['Figma', 'Adobe XD', 'Sketch'], experienciaAnios: 3, fechaAplicacion: '2026-01-24' },
    { id: 3, nombre: 'Ana Martínez', email: 'ana.martinez@email.com', telefono: '+52 55 3456 7890', vacanteId: 1, vacante: 'Frontend Developer', columna: 'revision', llmScore: 88, llmAnalisis: { experiencia: 85, habilidades: 92, educacion: 90, cultura: 85 }, skills: ['Vue.js', 'JavaScript', 'CSS'], experienciaAnios: 4, fechaAplicacion: '2026-01-23' },
    { id: 4, nombre: 'Pedro Sánchez', email: 'pedro.sanchez@email.com', telefono: '+52 55 4567 8901', vacanteId: 3, vacante: 'Project Manager', columna: 'entrevista', llmScore: 85, llmAnalisis: { experiencia: 90, habilidades: 82, educacion: 85, cultura: 83 }, skills: ['Scrum', 'Jira', 'Liderazgo'], experienciaAnios: 7, fechaAplicacion: '2026-01-22' },
    { id: 5, nombre: 'Laura Rodríguez', email: 'laura.rodriguez@email.com', telefono: '+52 55 5678 9012', vacanteId: 1, vacante: 'Frontend Developer', columna: 'entrevista', llmScore: 95, llmAnalisis: { experiencia: 98, habilidades: 95, educacion: 92, cultura: 96 }, skills: ['React', 'Next.js', 'GraphQL'], experienciaAnios: 6, fechaAplicacion: '2026-01-21' },
    { id: 6, nombre: 'Miguel Torres', email: 'miguel.torres@email.com', telefono: '+52 55 6789 0123', vacanteId: 2, vacante: 'UX Designer', columna: 'contratado', llmScore: 91, llmAnalisis: { experiencia: 92, habilidades: 94, educacion: 88, cultura: 90 }, skills: ['UI Design', 'User Research', 'Prototyping'], experienciaAnios: 5, fechaAplicacion: '2026-01-20' },
    { id: 7, nombre: 'Sofía Hernández', email: 'sofia.hernandez@email.com', telefono: '+52 55 7890 1234', vacanteId: 4, vacante: 'Backend Developer', columna: 'contratado', llmScore: 94, llmAnalisis: { experiencia: 95, habilidades: 96, educacion: 90, cultura: 94 }, skills: ['Python', 'Django', 'PostgreSQL'], experienciaAnios: 5, fechaAplicacion: '2026-01-15' },
    { id: 8, nombre: 'David Ruiz', email: 'david.ruiz@email.com', telefono: '+52 55 8901 2345', vacanteId: 1, vacante: 'Frontend Developer', columna: 'rechazado', llmScore: 45, llmAnalisis: { experiencia: 40, habilidades: 50, educacion: 48, cultura: 42 }, skills: ['HTML', 'CSS', 'jQuery'], experienciaAnios: 1, fechaAplicacion: '2026-01-18' },
];

export const SKILLS_POOL = [
    ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    ['Python', 'Django', 'PostgreSQL', 'AWS'],
    ['Java', 'Spring Boot', 'Microservices', 'Docker'],
    ['Vue.js', 'JavaScript', 'CSS', 'Webpack'],
    ['Figma', 'Adobe XD', 'UI/UX', 'Prototyping'],
    ['Scrum', 'Jira', 'Liderazgo', 'Gestión'],
];
