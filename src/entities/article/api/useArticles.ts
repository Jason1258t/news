import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchArticles } from "./articles-api";

interface UseArticlesParams {
    category?: string | null;
    limit?: number;
    tags?: string[];
}

export const useArticles = ({ category, limit = 5, tags = undefined }: UseArticlesParams) => {
    return useInfiniteQuery({
        queryKey: ["articles", category, tags],
        queryFn: ({ pageParam }) => fetchArticles({ category, lastId: pageParam, limit, tags }),
        getNextPageParam: (lastPage) => {
            if (lastPage.hasMore) {
                return lastPage.data[lastPage.data.length - 1]?.slug;
            }
            return undefined;
        },
        initialPageParam: undefined as string | undefined,
        staleTime: 10 * 60 * 1000,
    });
};
