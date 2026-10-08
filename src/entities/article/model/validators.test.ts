import { describe, expect, it } from "vitest";
import { validateArticleData } from "./validators";

const valid = {
    slug: "slug",
    title: "Title",
    description: "Description",
    content: [],
};

describe("validateArticleData", () => {
    it("accepts a valid article", () => {
        expect(() => validateArticleData(valid)).not.toThrow();
    });

    it.each(["slug", "title", "description"])("requires %s", (field) => {
        expect(() => validateArticleData({ ...valid, [field]: "" })).toThrow(`'${field}'`);
    });

    it.each([undefined, "[]", {}])("requires content to be an array (got %j)", (content) => {
        expect(() => validateArticleData({ ...valid, content })).toThrow("'content'");
    });

    it("reports the first missing field", () => {
        expect(() => validateArticleData({})).toThrow("'slug'");
    });
});
