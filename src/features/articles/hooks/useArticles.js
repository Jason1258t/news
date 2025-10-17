import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchArticles } from "../api/articles-api";

export const useArticles = (category, limit = 5) => {
    return useInfiniteQuery({
        queryKey: ["articles", category],
        queryFn: ({ pageParam }) => fetchArticles(category, pageParam, limit),
        getNextPageParam: (lastPage) => {
            if (lastPage.hasMore) {
                return lastPage.data[lastPage.data.length - 1].slug;
            }
            return undefined; 
        },
        initialPageParam: undefined, 
        staleTime: 10 * 60 * 1000,
    });
};