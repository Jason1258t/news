import { afterEach, describe, expect, it, vi } from "vitest";
import { fakeDocSnapshot } from "../../../test/firestore";
import { mapArticleFromFirestore } from "./mappers";

describe("mapArticleFromFirestore", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("maps a complete document", () => {
        const content = [{ type: "paragraph", html: "<b>hi</b>" }];
        const article = mapArticleFromFirestore(
            fakeDocSnapshot("my-slug", {
                title: "Title",
                description: "Desc",
                category: ["Наука", "Общество"],
                datePublishedISO: "2025-10-02T10:00:00.000Z",
                author: "Author",
                tags: ["a", "b"],
                hero: { url: "https://img", alt: "alt", caption: "cap" },
                og: { url: "https://og", image: "https://og.img" },
                content,
            }),
        );

        expect(article).toEqual({
            slug: "my-slug",
            title: "Title",
            description: "Desc",
            category: "Наука • Общество",
            dateDisplay: "2 октября 2025",
            datePublishedISO: "2025-10-02T10:00:00.000Z",
            author: "Author",
            tags: ["a", "b"],
            hero: { url: "https://img", alt: "alt", caption: "cap" },
            og: { url: "https://og", image: "https://og.img" },
            content,
        });
    });

    it("fills defaults for an empty document", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));

        expect(mapArticleFromFirestore(fakeDocSnapshot("empty", {}))).toEqual({
            slug: "empty",
            title: "",
            description: "",
            category: "",
            dateDisplay: "",
            datePublishedISO: "2025-01-01T00:00:00.000Z",
            author: "",
            tags: [],
            hero: { url: "", alt: "" },
            og: {},
            content: [],
        });
    });

    it("ignores a non-array category", () => {
        const article = mapArticleFromFirestore(fakeDocSnapshot("x", { category: "Наука" }));
        expect(article.category).toBe("");
    });
});
