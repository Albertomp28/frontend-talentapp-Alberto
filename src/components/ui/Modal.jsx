/**
 * Modal Component
 * Reusable modal using Tailwind v4 theme tokens.
 * 
 * @module components/ui/Modal
 */

/**
 * Base Modal component
 */
const Modal = ({
    show,
    onClose,
    children,
    maxWidth = 'max-w-md',
    className = '',
}) => {
    if (!show) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-neutral-800/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
            onClick={handleBackdropClick}
        >
            <div
                className={`
          bg-white border border-neutral-200 rounded-card shadow-premium-lg
          w-full ${maxWidth} max-h-[90vh] overflow-y-auto
          animate-fadeIn
          ${className}
        `.trim()}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

/**
 * Modal Header
 */
export const ModalHeader = ({
    children,
    onClose,
    icon,
    iconBg = 'bg-brand-50',
    iconColor = 'text-brand-600',
    className = '',
}) => (
    <div className={`p-6 text-center ${className}`}>
        {icon && (
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${iconBg} flex items-center justify-center shadow-sm`}>
                <span className={iconColor}>{icon}</span>
            </div>
        )}
        {children}
    </div>
);

/**
 * Modal Body
 */
export const ModalBody = ({ children, className = '' }) => (
    <div className={`px-6 pb-6 ${className}`}>
        {children}
    </div>
);

/**
 * Modal Footer
 */
export const ModalFooter = ({ children, className = '' }) => (
    <div className={`flex gap-3 justify-center px-6 pb-6 ${className}`}>
        {children}
    </div>
);

/**
 * Confirm Modal - specialized for confirmation dialogs
 */
export const ConfirmModal = ({
    show,
    onClose,
    onConfirm,
    title,
    message,
    warning,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
}) => {
    const variantConfig = {
        danger: {
            iconBg: 'bg-danger-50',
            iconColor: 'text-danger-500',
            confirmClass: 'bg-linear-to-r from-danger-500 to-danger-600 hover:shadow-danger-500/30',
        },
        warning: {
            iconBg: 'bg-warning-50',
            iconColor: 'text-warning-500',
            confirmClass: 'bg-linear-to-r from-warning-500 to-warning-600 hover:shadow-warning-500/30',
        },
        success: {
            iconBg: 'bg-success-50',
            iconColor: 'text-success-500',
            confirmClass: 'bg-linear-to-r from-success-500 to-success-600 hover:shadow-success-500/30',
        },
    };

    const config = variantConfig[variant] || variantConfig.danger;

    return (
        <Modal show={show} onClose={onClose}>
            <ModalHeader
                iconBg={config.iconBg}
                iconColor={config.iconColor}
                icon={
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                }
            >
                <h3 className="text-xl font-bold text-neutral-800 mb-2">{title}</h3>
                {message && <div className="text-neutral-500 text-sm mb-2">{message}</div>}
                {warning && <p className="text-xs font-medium text-danger-500">{warning}</p>}
            </ModalHeader>
            <ModalFooter>
                <button
                    className="px-5 py-2.5 rounded-button font-medium bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800 transition-colors"
                    onClick={onClose}
                >
                    {cancelText}
                </button>
                <button
                    className={`px-5 py-2.5 rounded-button font-medium text-white hover:shadow-lg transition-all active:scale-95 ${config.confirmClass}`}
                    onClick={onConfirm}
                >
                    {confirmText}
                </button>
            </ModalFooter>
        </Modal>
    );
};

export default Modal;
