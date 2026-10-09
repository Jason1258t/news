import { describe, expect, it } from "vitest";
import { parseArticleInput, stripNulls } from "./validators";

const valid = {
    slug: "my-article",
    title: "Title",
    description: "Description",
    category: ["Наука"],
    author: "Автор",
    tags: [],
    hero: { url: "https://img", alt: "alt" },
    content: [{ type: "paragraph", html: "text" }],
};

const errorOf = (data: unknown) => {
    try {
        parseArticleInput(data);
    } catch (error) {
        return (error as Error).message;
    }
    throw new Error("expected parseArticleInput to throw");
};

describe("parseArticleInput", () => {
    it("accepts a valid article", () => {
        expect(parseArticleInput(valid)).toEqual(valid);
    });

    it("drops unknown fields", () => {
        expect(parseArticleInput({ ...valid, dateDisplay: "x" })).not.toHaveProperty("dateDisplay");
    });

    it("treats null as an absent optional field", () => {
        const content = [{ type: "blockquote", html: "q", footer: null }];
        expect(parseArticleInput({ ...valid, og: null, content }).content).toEqual([
            { type: "blockquote", html: "q" },
        ]);
    });

    it.each(["slug", "title", "description", "hero", "content"])("requires %s", (field) => {
        const { [field as keyof typeof valid]: _omitted, ...rest } = valid;
        expect(errorOf(rest)).toContain(`${field}:`);
    });

    it("rejects categories outside the list", () => {
        expect(errorOf({ ...valid, category: ["Политика"] })).toContain("category[0]:");
    });

    it("rejects a slug that is not a kebab-case latin id", () => {
        expect(errorOf({ ...valid, slug: "Моя статья" })).toContain("slug:");
    });

    it("points to the broken content block in Russian", () => {
        const message = errorOf({ ...valid, content: [valid.content[0], { type: "video" }] });
        expect(message).toContain("content[1].type:");
        expect(message).toMatch(/Неверн/);
    });

    it("caps the number of reported problems", () => {
        const message = errorOf({});
        expect(message.split("\n").length).toBeLessThanOrEqual(7);
        expect(message).toContain("…и ещё");
    });
});

describe("stripNulls", () => {
    it("removes null object fields recursively and keeps other values", () => {
        expect(
            stripNulls({ a: null, b: { c: null, d: 0 }, e: [{ f: null }, 1], g: false }),
        ).toEqual({
            b: { d: 0 },
            e: [{}, 1],
            g: false,
        });
    });
});
