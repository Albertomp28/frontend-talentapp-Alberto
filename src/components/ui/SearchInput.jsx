/**
 * SearchInput Component
 * Standard search input using Tailwind v4 theme tokens.
 * 
 * @module components/ui/SearchInput
 */

/**
 * SearchInput component
 */
const SearchInput = ({
    value,
    onChange,
    placeholder = 'Buscar...',
    className = '',
}) => {
    return (
        <div className={`
      flex items-center gap-2.5 
      bg-white border border-neutral-200 rounded-button 
      px-3 py-2 shadow-premium-sm
      focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10
      transition-all duration-200
      ${className}
    `.trim()}>
            <svg
                className="w-[18px] h-[18px] text-neutral-400 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="
          flex-1 bg-transparent border-none 
          text-neutral-800 text-sm outline-none 
          placeholder:text-neutral-300
        "
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchInput;
