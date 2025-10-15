import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "../api/articles-api";

export const useArticles = (category) => {
    return useQuery({
        queryKey: ["articles", category],
        queryFn: () => fetchArticles(category),
        staleTime: 10 * 60 * 1000,
    });
};

export const usePrefetchArticles = (queryClient) => {
    return () => {
        queryClient.prefetchQuery({
            queryKey: ["articles"],
            queryFn: fetchArticles,
        });
    };
};
