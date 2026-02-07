/**
 * Card Component
 * Reusable card using Tailwind v4 theme tokens.
 * 
 * @module components/ui/Card
 */

/**
 * Base Card component
 */
const Card = ({
    children,
    className = '',
    padding = 'p-5',
    hover = false,
    onClick,
}) => {
    const hoverClasses = hover
        ? 'hover:border-neutral-300 hover:shadow-premium-md cursor-pointer'
        : '';

    return (
        <div
            className={`
        bg-white border border-neutral-200 rounded-card shadow-premium-sm
        transition-all duration-200
        ${padding}
        ${hoverClasses}
        ${className}
      `.trim()}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

/**
 * Card Header
 */
export const CardHeader = ({ children, className = '' }) => (
    <div className={`mb-4 ${className}`}>
        {children}
    </div>
);

/**
 * Card Body
 */
export const CardBody = ({ children, className = '' }) => (
    <div className={className}>
        {children}
    </div>
);

/**
 * Card Footer
 */
export const CardFooter = ({ children, className = '' }) => (
    <div className={`pt-3 border-t border-neutral-100 ${className}`}>
        {children}
    </div>
);

/**
 * Stat Card - for displaying statistics
 */
export const StatCard = ({
    value,
    label,
    accent, // 'brand', 'success', 'warning', 'danger'
    className = '',
}) => {
    const accentClasses = accent ? `border-l-4 border-l-${accent}-500` : '';
    const valueColor = accent ? `text-${accent}-600` : 'text-neutral-800';

    return (
        <Card
            className={`text-center ${accentClasses} ${className}`}
            padding="p-4"
        >
            <span className={`block text-3xl font-bold ${valueColor}`}>
                {value}
            </span>
            <span className="text-sm text-neutral-500">{label}</span>
        </Card>
    );
};

export default Card;
