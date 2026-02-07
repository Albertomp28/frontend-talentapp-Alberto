/**
 * Sidebar Component
 * Navigation sidebar for the dashboard layout using Tailwind v4 theme tokens.
 * 
 * @module layouts/components/Sidebar
 */

import { Link, useLocation } from 'react-router-dom';

const MENU_ITEMS = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
            </svg>
        )
    },
    {
        path: '/vacantes/crear',
        label: 'Nueva Vacante',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
        )
    },
    {
        path: '/mis-vacantes',
        label: 'Mis Vacantes',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
        )
    },
    {
        path: '/remanente',
        label: 'Pool de Candidatos',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        )
    }
];

/**
 * Sidebar component
 */
const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="app-sidebar">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-200">
                <div className="w-10 h-10 bg-linear-to-br from-brand-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-brand/20 shadow-lg">
                    T
                </div>
                <div>
                    <span className="text-lg font-bold text-neutral-800">TalentApp</span>
                    <span className="block text-xs text-neutral-500">Portal de Reclutamiento</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
                <p className="px-3 mb-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Menu Principal
                </p>
                <div className="space-y-1">
                    {MENU_ITEMS.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-button text-sm font-medium transition-all duration-200
                ${isActive(item.path)
                                    ? 'bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-brand/25 shadow-md'
                                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'
                                }
              `}
                        >
                            <span className={isActive(item.path) ? 'text-white' : 'text-neutral-300'}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Help Section */}
            <div className="px-4 pb-4">
                <div className="bg-linear-to-br from-brand-50 to-neutral-50 rounded-card p-4 border border-brand-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-premium-sm">
                        <svg className="w-5 h-5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>
                    <h4 className="font-semibold text-neutral-800 text-sm mb-1">¿Necesitas ayuda?</h4>
                    <p className="text-xs text-neutral-500 mb-3">Consulta nuestra guía de uso</p>
                    <button className="w-full py-2 text-xs font-medium text-brand-500 bg-white rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200">
                        Ver documentación
                    </button>
                </div>
            </div>

            {/* Version */}
            <div className="px-6 py-3 border-t border-neutral-200">
                <div className="text-xs text-neutral-300">TalentApp v1.0.0</div>
            </div>
        </aside>
    );
};

export default Sidebar;
