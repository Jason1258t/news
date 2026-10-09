import { useMutation, useQueryClient } from "@tanstack/react-query";
import { articleKeys, createArticle, fetchArticleBySlug } from "entities/article";

/** Создание статьи: после успеха лента перезапрашивается, а новая статья сразу попадает в кеш. */
export const useCreateArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (articleData: unknown) => createArticle(articleData),
        onSuccess: async ({ slug }) => {
            await queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
            await queryClient.prefetchQuery({
                queryKey: articleKeys.detail(slug),
                queryFn: () => fetchArticleBySlug(slug),
            });
        },
    });
};
