import styles from "./DeleteConfirmationModal.module.css";
import { AlertCircle, Trash2, X } from "lucide-react";

export const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Подтверждение удаления",
    description,
    isLoading = false,
    confirmText = "Удалить",
    cancelText = "Отмена",
}) => {
    if (!isOpen) return null;
    
    return (
        <>
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div className={styles.iconWrapper}>
                                <AlertCircle className={styles.icon} />
                            </div>
                            <h3 className={styles.title}>{title}</h3>
                        </div>
                        <button
                            onClick={onClose}
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
                            onClick={onClose}
                            disabled={isLoading}
                            className={`${styles.button} ${styles.cancelButton}`}
                        >
                            {cancelText}
                        </button>
                        <button
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
                                    <Trash2
                                        style={{
                                            width: "1rem",
                                            height: "1rem",
                                        }}
                                    />
                                    <span>{confirmText}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
