import { AlertCircle, Trash2, X } from "lucide-react";
import { useId } from "react";
import { Dialog } from "shared/ui/dialog";
import styles from "./DeleteConfirmationModal.module.css";

export interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    isLoading?: boolean;
    confirmText?: string;
    cancelText?: string;
}

export const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Подтверждение удаления",
    description,
    isLoading = false,
    confirmText = "Удалить",
    cancelText = "Отмена",
}: DeleteConfirmationModalProps) => {
    const titleId = useId();
    // Escape must not close the dialog while the deletion is running.
    const close = () => {
        if (!isLoading) onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog labelledBy={titleId} onClose={close} className={styles.modal}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.iconWrapper}>
                        <AlertCircle className={styles.icon} />
                    </div>
                    <h3 id={titleId} className={styles.title}>
                        {title}
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={close}
                    className={styles.closeButton}
                    aria-label="Закрыть"
                >
                    <X className={styles.icon} />
                </button>
            </div>

            <div className={styles.content}>
                <p className={styles.description}>{description}</p>
            </div>

            <div className={styles.footer}>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className={`${styles.button} ${styles.cancelButton}`}
                >
                    {cancelText}
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`${styles.button} ${styles.confirmButton}`}
                >
                    {isLoading ? (
                        <>
                            <div className={styles.spinner} />
                            <span>Удаление...</span>
                        </>
                    ) : (
                        <>
                            <Trash2 size="1rem" />
                            <span>{confirmText}</span>
                        </>
                    )}
                </button>
            </div>
        </Dialog>
    );
};
