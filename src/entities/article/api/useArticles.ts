import { useInfiniteQuery } from "@tanstack/react-query";
import { articleKeys } from "./article-keys";
import { fetchArticles } from "./articles-api";

interface UseArticlesParams {
    category?: string | null;
    limit?: number;
    tags?: string[];
}

export const useArticles = ({ category = null, limit = 5, tags = [] }: UseArticlesParams = {}) => {
    return useInfiniteQuery({
        queryKey: articleKeys.list({ category, tags, limit }),
        queryFn: ({ pageParam }) => fetchArticles({ category, lastId: pageParam, limit, tags }),
        getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
        initialPageParam: undefined as string | undefined,
        staleTime: 10 * 60 * 1000,
    });
};
