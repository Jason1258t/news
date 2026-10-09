export interface ArticleListParams {
    category: string | null;
    tags: string[];
    limit: number;
}

/** react-query keys: invalidate `lists()` after writes, `detail(slug)` is a single article. */
export const articleKeys = {
    all: ["articles"] as const,
    lists: () => [...articleKeys.all, "list"] as const,
    list: (params: ArticleListParams) => [...articleKeys.lists(), params] as const,
    details: () => [...articleKeys.all, "detail"] as const,
    detail: (slug: string) => [...articleKeys.details(), slug] as const,
};
