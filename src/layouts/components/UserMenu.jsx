/**
 * UserMenu Component
 * User dropdown menu using design system tokens.
 * 
 * @module layouts/components/UserMenu
 */

import { authService } from '../../services';

/**
 * UserMenu component
 */
const UserMenu = ({ isOpen, onToggle, onClose }) => {
    const storedUser = authService.getCurrentUserSync();
    const user = storedUser ? {
        name: `${storedUser.firstName} ${storedUser.lastName}`,
        email: storedUser.email,
        role: storedUser.role?.name || 'Usuario',
        initials: `${storedUser.firstName?.[0] || ''}${storedUser.lastName?.[0] || ''}`.toUpperCase()
    } : {
        name: 'Admin',
        email: 'admin@talentapp.com',
        role: 'Usuario',
        initials: 'AD'
    };

    const handleLogout = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Limpiar storage y redirigir inmediatamente
        localStorage.clear();
        window.location.replace('/login');
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                className="flex items-center gap-3 px-2 py-1.5 rounded-button hover:bg-neutral-100 transition-colors"
                onClick={onToggle}
            >
                <div className="w-9 h-9 bg-linear-to-br from-brand-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-semibold shadow-premium-sm">
                    {user.initials}
                </div>
                <div className="hidden sm:block text-left">
                    <span className="block text-sm font-semibold text-neutral-800">{user.name}</span>
                    <span className="block text-xs text-neutral-500">{user.role}</span>
                </div>
                <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-card shadow-premium-lg overflow-hidden z-[200] animate-fadeIn">
                    {/* User Info Header */}
                    <div className="p-4 bg-linear-to-br from-neutral-50 to-neutral-100 border-b border-neutral-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-linear-to-br from-brand-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-brand/20 shadow-md">
                                {user.initials}
                            </div>
                            <div>
                                <div className="font-semibold text-neutral-800">{user.name}</div>
                                <div className="text-xs text-neutral-500 truncate max-w-[140px]">{user.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                        <MenuLink
                            icon={<UserIcon />}
                            label="Mi Perfil"
                        />
                        <MenuLink
                            icon={<SettingsIcon />}
                            label="Configuración"
                        />
                    </div>

                    {/* Logout */}
                    <div className="border-t border-neutral-200 p-2">
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = '/login';
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 text-danger-500 rounded-button text-sm hover:bg-danger-50 transition-colors w-full"
                        >
                            <LogoutIcon />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const MenuLink = ({ icon, label }) => (
    <a
        href="#"
        className="flex items-center gap-3 px-3 py-2.5 text-neutral-600 rounded-button text-sm hover:bg-neutral-100 transition-colors"
    >
        <span className="text-neutral-400">{icon}</span>
        {label}
    </a>
);

// Icons
const UserIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export default UserMenu;
