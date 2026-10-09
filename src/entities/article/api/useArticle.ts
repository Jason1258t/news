import {
    useQuery,
    useQueryClient,
    type InfiniteData,
    type QueryClient,
} from "@tanstack/react-query";
import type { Article } from "../model/types";
import { articleKeys } from "./article-keys";
import { fetchArticleBySlug, type ArticlesPage } from "./articles-api";

/** The article from any cached feed page, with the time that page was fetched. */
const findInCachedLists = (queryClient: QueryClient, slug: string) => {
    const lists = queryClient.getQueriesData<InfiniteData<ArticlesPage>>({
        queryKey: articleKeys.lists(),
    });
    for (const [queryKey, data] of lists) {
        const article = data?.pages.flatMap((page) => page.data).find((item) => item.slug === slug);
        if (article) {
            return { article, updatedAt: queryClient.getQueryState(queryKey)?.dataUpdatedAt };
        }
    }
    return undefined;
};

/** Статья по slug. Если она уже есть в загруженной ленте, показывается сразу, без запроса. */
export const useArticle = (slug: string) => {
    const queryClient = useQueryClient();

    return useQuery<Article | null>({
        queryKey: articleKeys.detail(slug),
        queryFn: () => fetchArticleBySlug(slug),
        staleTime: 10 * 60 * 1000,
        initialData: () => findInCachedLists(queryClient, slug)?.article,
        initialDataUpdatedAt: () => findInCachedLists(queryClient, slug)?.updatedAt,
    });
};
