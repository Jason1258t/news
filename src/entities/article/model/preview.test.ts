import { describe, expect, it } from "vitest";
import { SITE_URL } from "shared/config";
import { getArticlePreview, getArticleUrl } from "./preview";

const article = {
    slug: "my-slug",
    title: "Title",
    description: "Description",
    hero: { url: "https://img/hero.jpg", alt: "alt" },
    og: {},
};

describe("getArticleUrl", () => {
    it("builds a hash-router link on the site", () => {
        expect(getArticleUrl("my-slug")).toBe(`${SITE_URL}/#/articles/my-slug`);
    });
});

describe("getArticlePreview", () => {
    it("derives the preview from the article", () => {
        expect(getArticlePreview(article)).toEqual({
            url: `${SITE_URL}/#/articles/my-slug`,
            title: "Title",
            description: "Description",
            image: "https://img/hero.jpg",
        });
    });

    it("lets stored og fields of older articles override", () => {
        const og = {
            url: "https://old/url",
            title: "OG",
            description: "OG desc",
            image: "https://og",
        };
        expect(getArticlePreview({ ...article, og })).toEqual({
            url: "https://old/url",
            title: "OG",
            description: "OG desc",
            image: "https://og",
        });
    });

    it("falls back field by field", () => {
        expect(getArticlePreview({ ...article, og: { title: "OG" } })).toMatchObject({
            title: "OG",
            description: "Description",
        });
    });
});
