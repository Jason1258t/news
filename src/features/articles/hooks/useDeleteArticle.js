import { useState } from 'react';
import { deleteArticle } from '../api/articles-api';

/**
 * Хук для удаления статей
 * @returns {Object} Объект с состоянием и функцией удаления
 */
export const useDeleteArticle = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Удаляет статью по slug
     * @param {string} slug - Slug статьи для удаления
     * @returns {Promise<boolean>} Успешно ли удалено
     */
    const removeArticle = async (slug) => {
        if (!slug) {
            setError('Slug статьи обязателен');
            return false;
        }

        setIsDeleting(true);
        setError(null);

        try {
            const result = await deleteArticle(slug);
            
            if (!result.success) {
                setError(result.error);
                return false;
            }

            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        deleteArticle: removeArticle,
        isDeleting,
        error,
        resetError: () => setError(null)
    };
};