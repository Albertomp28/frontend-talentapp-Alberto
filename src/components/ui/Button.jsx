/**
 * Button Component
 * Reusable button with variants using Tailwind v4 theme tokens.
 * 
 * @module components/ui/Button
 */

const VARIANTS = {
    primary: 'bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-brand hover:shadow-brand/40 hover:-translate-y-0.5',
    secondary: 'bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200 hover:text-neutral-800',
    success: 'bg-linear-to-r from-success-500 to-success-600 text-white hover:shadow-lg hover:shadow-success-500/30',
    danger: 'bg-linear-to-r from-danger-500 to-danger-600 text-white hover:shadow-lg hover:shadow-danger-500/30',
    ghost: 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800',
    link: 'text-brand-600 hover:text-brand-700 hover:underline',
};

const SIZES = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-3.5 text-base',
};

/**
 * Button component
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    type = 'button',
    onClick,
    className = '',
    icon,
    iconPosition = 'left',
}) => {
    const variantClasses = VARIANTS[variant] || VARIANTS.primary;
    const sizeClasses = SIZES[size] || SIZES.md;

    const disabledClasses = disabled
        ? 'opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0 active:scale-100'
        : 'active:scale-95';

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`
        inline-flex items-center justify-center gap-2
        rounded-button font-medium
        transition-all duration-200
        ${variantClasses}
        ${sizeClasses}
        ${disabledClasses}
        ${className}
      `.trim()}
        >
            {icon && iconPosition === 'left' && <span className="w-5 h-5">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="w-5 h-5">{icon}</span>}
        </button>
    );
};

/**
 * Icon Button - circular button with just an icon
 */
export const IconButton = ({
    icon,
    onClick,
    variant = 'ghost',
    size = 'md',
    title,
    className = '',
}) => {
    const sizeMap = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-2.5',
    };

    const variantClasses = {
        ghost: 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600',
        danger: 'text-neutral-400 hover:bg-danger-50 hover:text-danger-500',
        primary: 'text-brand-500 hover:bg-brand-50 hover:text-brand-600',
        success: 'text-success-500 hover:bg-success-50',
    };

    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`
        ${sizeMap[size] || sizeMap.md}
        rounded-lg transition-colors
        ${variantClasses[variant] || variantClasses.ghost}
        ${className}
      `.trim()}
        >
            {icon}
        </button>
    );
};

export default Button;
