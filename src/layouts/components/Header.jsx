/**
 * Header Component
 * Top header using Tailwind v4 theme tokens.
 * 
 * @module layouts/components/Header
 */

import { useState } from 'react';
import UserMenu from './UserMenu';

/**
 * Header component
 */
const Header = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <>
            <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-premium-sm">
                {/* Search */}
                <div className="flex-1 max-w-md">
                    <div className="flex items-center gap-3 bg-neutral-100 rounded-button px-4 py-2.5 transition-all duration-200 focus-within:bg-white focus-within:shadow-premium-md focus-within:ring-4 focus-within:ring-brand-500/10">
                        <svg className="w-5 h-5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar candidatos, vacantes..."
                            className="flex-1 bg-transparent border-none text-neutral-800 text-sm outline-none placeholder:text-neutral-400"
                        />
                        <kbd className="hidden sm:inline-flex px-2 py-1 text-[10px] text-neutral-400 bg-white rounded border border-neutral-200">
                            ⌘K
                        </kbd>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white" />
                    </button>

                    {/* Messages */}
                    <button className="relative p-2.5 rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </button>

                    {/* Divider */}
                    <div className="w-px h-8 bg-neutral-200" />

                    {/* User Menu */}
                    <UserMenu
                        isOpen={showUserMenu}
                        onToggle={() => setShowUserMenu(!showUserMenu)}
                        onClose={() => setShowUserMenu(false)}
                    />
                </div>
            </header>

            {/* Click outside backdrop */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </>
    );
};

export default Header;
