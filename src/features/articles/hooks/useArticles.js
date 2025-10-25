import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchArticles } from "../api/articles-api";

export const useArticles = ({ category, limit = 5, tags = undefined }) => {
    return useInfiniteQuery({
        queryKey: ["articles", category, tags],
        queryFn: ({ pageParam }) =>
            fetchArticles({ category, lastId: pageParam, limit, tags }),
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
