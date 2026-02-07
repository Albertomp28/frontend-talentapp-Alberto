/**
 * DeleteVacanteModal Component
 * Confirmation modal for deleting a vacancy.
 * 
 * @module pages/vacantes/components/DeleteVacanteModal
 */

import { ConfirmModal } from '../../../components/ui';

/**
 * DeleteVacanteModal component
 */
const DeleteVacanteModal = ({
    show,
    vacante,
    onClose,
    onConfirm,
}) => {
    return (
        <ConfirmModal
            show={show}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Eliminar Vacante"
            message={
                <>
                    ¿Estás seguro de que deseas eliminar la vacante{' '}
                    <strong className="text-slate-800">"{vacante?.titulo}"</strong>?
                </>
            }
            warning="Esta acción no se puede deshacer."
            confirmText="Sí, eliminar"
            cancelText="Cancelar"
            variant="danger"
        />
    );
};

export default DeleteVacanteModal;
