import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article } from "../model/types";
import { fetchArticleBySlug } from "./articles-api";

/**
 * Хук для получения конкретной статьи.
 * Сначала проверяет кеш, потом загружает из API.
 */
export const useArticle = (slug: string) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ["articles", slug],
        queryFn: () => fetchArticleBySlug(slug),
        staleTime: 10 * 60 * 1000,

        // TODO(stage 1): the feed is cached under ["articles", category, tags] as infinite
        // pages, so this lookup never finds anything (bug B6 in docs/refactoring-plan.md).
        initialData: () => {
            const cachedArticles = queryClient.getQueryData<Article[]>(["articles"]);
            if (cachedArticles) {
                return cachedArticles.find((article) => article.slug === slug);
            }
            return undefined;
        },

        initialDataUpdatedAt: () => {
            const cachedArticles = queryClient.getQueryData<Article[]>(["articles"]);
            return cachedArticles ? queryClient.getQueryState(["articles"])?.dataUpdatedAt : 0;
        },
    });
};
