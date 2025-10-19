import { useState } from "react";

export const useDeleteConfirmation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState({});

    const openModal = (modalConfig) => {
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
            onClose: closeModal,
            onConfirm: handleConfirm,
            ...config,
        },
    };
};
