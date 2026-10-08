import type { Article } from "entities/article";

/** Display-model article with sensible defaults; override what the test cares about. */
export const makeArticle = (overrides: Partial<Article> = {}): Article => ({
    slug: "test-article",
    title: "Тестовая статья",
    description: "Описание",
    category: "Наука",
    dateDisplay: "1 января 2026",
    datePublishedISO: "2026-01-01T00:00:00.000Z",
    author: "Автор",
    tags: ["тег"],
    hero: { url: "https://img.example/hero.jpg", alt: "Обложка" },
    og: {},
    content: [{ type: "paragraph", html: "Текст статьи" }],
    ...overrides,
});
