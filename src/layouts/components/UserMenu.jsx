/**
 * UserMenu Component
 * User dropdown menu using design system tokens.
 *
 * @module layouts/components/UserMenu
 */

import { authService } from '../../services';
import { UserIcon, SettingsIcon, LogoutIcon } from '../../components/ui/Icons';

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

    const handleLogout = () => {
        authService.logout();
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
                            onClick={handleLogout}
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

export default UserMenu;
