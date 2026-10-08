import { SITE_URL } from "shared/config";
import type { Article } from "./types";

export interface ArticlePreview {
    url: string;
    title: string;
    description: string;
    image: string;
}

export const getArticleUrl = (slug: string) => `${SITE_URL}/#/articles/${slug}`;

/**
 * Link preview (Open Graph / Twitter) of an article. It is the same information as the
 * article itself, so it is derived from title, description and hero; `og` in the document
 * is only an optional override kept for older articles.
 */
export const getArticlePreview = (
    article: Pick<Article, "slug" | "title" | "description" | "hero" | "og">,
): ArticlePreview => ({
    url: article.og?.url || getArticleUrl(article.slug),
    title: article.og?.title || article.title,
    description: article.og?.description || article.description,
    image: article.og?.image || article.hero.url,
});
