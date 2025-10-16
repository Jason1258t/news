import { useState } from "react";
import { createArticle, fetchArticleBySlug } from "../api/articles-api";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Хук для создания и управления статьями
 */
export const useCreateArticle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();

    const createArticleHandler = async (articleData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await createArticle(articleData);

            if (result.success) {
                await queryClient.invalidateQueries({ queryKey: ["articles"] });

                await queryClient.prefetchQuery({
                    queryKey: ["articles", result.slug],
                    queryFn: () => fetchArticleBySlug(result.slug),
                });
            } else {
                setError(result.error);
            }

            return result;
        } catch (err) {
            const errorMessage =
                err.message || "Неизвестная ошибка при создании статьи";
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        createArticle: createArticleHandler,
        loading,
        error,
        clearError,
    };
};
