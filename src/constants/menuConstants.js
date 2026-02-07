/**
 * Menu Constants
 * Navigation menu items for the dashboard.
 * 
 * @module constants/menuConstants
 */

export const MAIN_MENU_ITEMS = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        iconPath: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
        iconType: 'grid',
    },
    {
        path: '/vacantes/crear',
        label: 'Nueva Vacante',
        iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M12 8v8M8 12h8',
        iconType: 'plus-circle',
    },
    {
        path: '/mis-vacantes',
        label: 'Mis Vacantes',
        iconPath: 'M2 7h20v14H2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16',
        iconType: 'briefcase',
    },
    {
        path: '/remanente',
        label: 'Pool de Candidatos',
        iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
        iconType: 'users',
    },

];

export const USER_MENU_ITEMS = [
    {
        path: '#',
        label: 'Mi Perfil',
        iconPath: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 100-8 4 4 0 000 8z',
    },
    {
        path: '#',
        label: 'Configuración',
        iconPath: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z',
    },
];

export const FILTER_OPTIONS = {
    experiencia: [
        { value: '', label: 'Cualquier experiencia' },
        { value: 'junior', label: 'Junior (0-2 años)' },
        { value: 'mid', label: 'Mid-Level (3-5 años)' },
        { value: 'senior', label: 'Senior (6+ años)' },
    ],
    habilidades: [
        { value: '', label: 'Todas las habilidades' },
        { value: 'react', label: 'React' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'node', label: 'Node.js' },
        { value: 'devops', label: 'DevOps' },
        { value: 'aws', label: 'AWS' },
    ],
};
