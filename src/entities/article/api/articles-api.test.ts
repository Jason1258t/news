import { getDoc, getDocs } from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDocSnapshot, fakeQuerySnapshot } from "../../../test/firestore";
import { fetchArticleBySlug, fetchArticles } from "./articles-api";

vi.mock("firebase/firestore", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    doc: vi.fn((_db: unknown, collection: string, id: string) => ({ collection, id })),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    collection: vi.fn(() => ({})),
    query: vi.fn(() => ({})),
    where: vi.fn(() => ({})),
    orderBy: vi.fn(() => ({})),
    limit: vi.fn(() => ({})),
    startAfter: vi.fn(() => ({})),
}));

const getDocMock = vi.mocked(getDoc);
const getDocsMock = vi.mocked(getDocs);

describe("fetchArticleBySlug", () => {
    beforeEach(() => {
        getDocMock.mockReset();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("maps an existing document", async () => {
        getDocMock.mockResolvedValue(fakeDocSnapshot("slug", { title: "Title" }) as never);
        await expect(fetchArticleBySlug("slug")).resolves.toMatchObject({
            slug: "slug",
            title: "Title",
        });
    });

    it("returns null for a missing article instead of throwing (B5)", async () => {
        getDocMock.mockResolvedValue(fakeDocSnapshot("missing", undefined) as never);
        await expect(fetchArticleBySlug("missing")).resolves.toBeNull();
    });

    it("wraps Firestore failures", async () => {
        getDocMock.mockRejectedValue(new Error("offline"));
        await expect(fetchArticleBySlug("slug")).rejects.toThrow("Failed to fetch article");
    });
});

describe("fetchArticles", () => {
    beforeEach(() => {
        getDocsMock.mockReset();
    });

    const page = (...docs: Array<[string, string[]]>) =>
        fakeQuerySnapshot(
            docs.map(([id, category]) => fakeDocSnapshot(id, { title: id, category })),
        );

    it("returns every document and pages by the last one", async () => {
        getDocsMock.mockResolvedValue(page(["a", ["Наука"]], ["b", ["Спорт"]]) as never);

        const result = await fetchArticles({ category: "Наука", limit: 2 });

        expect(result.data.map((article) => article.slug)).toEqual(["a", "b"]);
        expect(result).toMatchObject({ hasMore: true, nextCursor: "b" });
    });

    it("filters the category on the client when tags are selected too (B15)", async () => {
        getDocsMock.mockResolvedValue(
            page(["a", ["Наука"]], ["b", ["Спорт"]], ["c", ["Спорт"]]) as never,
        );

        const result = await fetchArticles({ category: "Наука", tags: ["игры"], limit: 3 });

        expect(result.data.map((article) => article.slug)).toEqual(["a"]);
        // pagination still follows the raw page, so filtered-out documents are not refetched
        expect(result).toMatchObject({ hasMore: true, nextCursor: "c" });
    });

    it("keeps paging when a filtered page is empty", async () => {
        getDocsMock.mockResolvedValue(page(["x", ["Спорт"]], ["y", ["Спорт"]]) as never);

        const result = await fetchArticles({ category: "Наука", tags: ["игры"], limit: 2 });

        expect(result.data).toEqual([]);
        expect(result).toMatchObject({ hasMore: true, nextCursor: "y" });
    });

    it("reports the end of the feed on a short page", async () => {
        getDocsMock.mockResolvedValue(page(["a", ["Наука"]]) as never);
        await expect(fetchArticles({ limit: 5 })).resolves.toMatchObject({ hasMore: false });
    });
});
