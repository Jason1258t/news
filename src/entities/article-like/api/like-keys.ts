export const likeKeys = {
    all: ["likes"] as const,
    article: (slug: string) => [...likeKeys.all, slug] as const,
    detail: (slug: string, uid: string | null) => [...likeKeys.article(slug), uid] as const,
};
