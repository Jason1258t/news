import { useState } from 'react';
import { createArticle, updateArticle, fetchArticleBySlug } from '../api/articles-api';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Хук для создания и управления статьями
 */
export const useCreateArticle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();

    /**
     * Создает новую статью
     */
    const createArticleHandler = async (articleData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await createArticle(articleData);
            
            if (result.success) {
                await queryClient.invalidateQueries({ queryKey: ['articles'] });
                
                await queryClient.prefetchQuery({
                    queryKey: ['articles', result.slug],
                    queryFn: () => fetchArticleBySlug(result.slug),
                });
            } else {
                setError(result.error);
            }

            return result;

        } catch (err) {
            const errorMessage = err.message || 'Неизвестная ошибка при создании статьи';
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Обновляет существующую статью
     */
    const updateArticleHandler = async (slug, updates) => {
        setLoading(true);
        setError(null);

        try {
            const result = await updateArticle(slug, updates);
            
            if (result.success) {
                // Инвалидируем кеш конкретной статьи и общего списка
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ['articles', slug] }),
                    queryClient.invalidateQueries({ queryKey: ['articles'] })
                ]);
            } else {
                setError(result.error);
            }

            return result;

        } catch (err) {
            const errorMessage = err.message || 'Неизвестная ошибка при обновлении статьи';
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Очищает ошибку
     */
    const clearError = () => {
        setError(null);
    };

    return {
        createArticle: createArticleHandler,
        updateArticle: updateArticleHandler,
        loading,
        error,
        clearError
    };
};

/**
 * Хук для массовой загрузки статей
 */
export const useBulkCreateArticles = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);

    const bulkCreateArticles = async (articlesArray) => {
        setLoading(true);
        setProgress(0);
        setResults([]);

        const results = [];
        const total = articlesArray.length;

        for (let i = 0; i < articlesArray.length; i++) {
            try {
                const result = await createArticle(articlesArray[i]);
                results.push({
                    slug: articlesArray[i].slug,
                    success: result.success,
                    error: result.error,
                    title: articlesArray[i].title
                });
            } catch (error) {
                results.push({
                    slug: articlesArray[i].slug,
                    success: false,
                    error: error.message,
                    title: articlesArray[i].title
                });
            }

            setProgress(Math.round(((i + 1) / total) * 100));
        }

        setResults(results);
        setLoading(false);

        return results;
    };

    return {
        bulkCreateArticles,
        loading,
        progress,
        results
    };
};