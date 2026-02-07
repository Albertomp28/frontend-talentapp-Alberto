/**
 * Badge Component
 * Reusable badge using Tailwind v4 theme tokens.
 * 
 * @module components/ui/Badge
 */

const VARIANTS = {
    default: 'bg-neutral-100 text-neutral-500',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
    info: 'bg-brand-50 text-brand-600',
    primary: 'bg-brand-500 text-white',
};

const SIZES = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
};

/**
 * Badge component for displaying status or category labels
 */
const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    rounded = 'full',
    className = '',
}) => {
    const variantClasses = VARIANTS[variant] || VARIANTS.default;
    const sizeClasses = SIZES[size] || SIZES.md;
    const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded';

    return (
        <span
            className={`
        inline-flex items-center font-semibold
        ${variantClasses} 
        ${sizeClasses} 
        ${roundedClass}
        ${className}
      `.trim()}
        >
            {children}
        </span>
    );
};

/**
 * Score Badge - specialized for displaying percentage scores
 */
export const ScoreBadge = ({ score, size = 'md', className = '' }) => {
    const getVariant = (s) => {
        if (s >= 85) return 'success';
        if (s >= 70) return 'warning';
        return 'danger';
    };

    return (
        <Badge
            variant={getVariant(score)}
            size={size}
            className={className}
        >
            {score}%
        </Badge>
    );
};

/**
 * Status Badge - for vacancy/item statuses
 */
export const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    // Backend statuses
    draft: { variant: 'default', label: 'draft' },
    published: { variant: 'success', label: 'published' },
    closed: { variant: 'danger', label: 'closed' },
    // Legacy statuses
    activa: { variant: 'success', label: 'Activa' },
    pausada: { variant: 'warning', label: 'Pausada' },
    cerrada: { variant: 'danger', label: 'Cerrada' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

export default Badge;
