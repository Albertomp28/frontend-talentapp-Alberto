/**
 * Avatar Component
 * User avatar using Tailwind v4 theme tokens.
 * 
 * @module components/ui/Avatar
 */

import { getInitials } from '../../utils/formatters';

const SIZES = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg',
};

const GRADIENTS = [
    'from-brand-500 to-indigo-600',
    'from-success-500 to-teal-600',
    'from-purple-500 to-pink-600',
    'from-orange-500 to-danger-600',
    'from-cyan-500 to-brand-600',
];

/**
 * Get consistent gradient based on name
 */
const getGradient = (name) => {
    if (!name) return GRADIENTS[0];
    const index = name.charCodeAt(0) % GRADIENTS.length;
    return GRADIENTS[index];
};

/**
 * Avatar component
 */
const Avatar = ({
    name,
    src,
    size = 'md',
    className = '',
}) => {
    const sizeClasses = SIZES[size] || SIZES.md;
    const gradient = getGradient(name);

    if (src) {
        return (
            <img
                src={src}
                alt={name || 'Avatar'}
                className={`
          ${sizeClasses}
          rounded-full object-cover shadow-sm
          ${className}
        `.trim()}
            />
        );
    }

    return (
        <div
            className={`
        ${sizeClasses}
        bg-linear-to-br ${gradient}
        rounded-full flex items-center justify-center
        text-white font-semibold
        shadow-premium-sm
        ${className}
      `.trim()}
        >
            {getInitials(name)}
        </div>
    );
};

export default Avatar;
