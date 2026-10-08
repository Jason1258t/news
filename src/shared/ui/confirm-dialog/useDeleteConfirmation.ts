import { useState } from "react";

export interface DeleteConfirmationConfig {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => unknown;
}

export const useDeleteConfirmation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState<DeleteConfirmationConfig>({});

    const openModal = (modalConfig: DeleteConfirmationConfig) => {
        setConfig(modalConfig);
        setIsOpen(true);
    };

    const closeModal = () => {
        if (!isLoading) {
            setIsOpen(false);
            setConfig({});
        }
    };

    const handleConfirm = async () => {
        if (!config.onConfirm) return;

        setIsLoading(true);

        try {
            await config.onConfirm();
            closeModal();
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isOpen,
        isLoading,
        openModal,
        closeModal,
        handleConfirm,
        modalProps: {
            isOpen,
            isLoading,
            ...config,
            onClose: closeModal,
            onConfirm: handleConfirm,
        },
    };
};
