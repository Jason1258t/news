import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createArticle, fetchArticleBySlug, type MutationResult } from "entities/article";
import { getErrorMessage } from "shared/lib/error";

/** Создание статьи с обновлением кеша react-query. */
export const useCreateArticle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const createArticleHandler = async (
        articleData: unknown,
    ): Promise<MutationResult<{ slug: string }>> => {
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
            const errorMessage = getErrorMessage(err) || "Неизвестная ошибка при создании статьи";
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
