/**
 * Pipeline Constants
 * Kanban board column definitions.
 * 
 * @module constants/pipelineConstants
 */

export const PIPELINE_COLUMNS = [
    {
        id: 'candidatos',
        titulo: 'Candidatos',
        descripcion: 'Candidatos que han aplicado',
        color: '#64748b'
    },
    {
        id: 'revision',
        titulo: 'En Revisión',
        descripcion: 'CV siendo analizado por IA',
        color: '#f97316'
    },
    {
        id: 'entrevista',
        titulo: 'Entrevista',
        descripcion: 'Programados para entrevista',
        color: '#3b82f6'
    },
    {
        id: 'contratado',
        titulo: 'Contratado',
        descripcion: 'Proceso completado',
        color: '#10b981'
    },
    {
        id: 'rechazado',
        titulo: 'Rechazado',
        descripcion: 'No continúa en el proceso',
        color: '#ef4444'
    },
];

export const VACANCY_STATUSES = {
    ACTIVA: 'activa',
    PAUSADA: 'pausada',
    CERRADA: 'cerrada',
};

export const STATUS_COLORS = {
    activa: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-500',
    },
    pausada: {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-500',
    },
    cerrada: {
        bg: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-500',
    },
};

export const STATUS_LABELS = {
    activa: 'Activa',
    pausada: 'Pausada',
    cerrada: 'Cerrada',
};
