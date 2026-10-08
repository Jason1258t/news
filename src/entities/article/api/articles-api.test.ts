import { getDoc } from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDocSnapshot } from "../../../test/firestore";
import { fetchArticleBySlug } from "./articles-api";

vi.mock("shared/api/firebase", () => ({ db: {} }));
vi.mock("firebase/firestore", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    doc: vi.fn((_db: unknown, collection: string, id: string) => ({ collection, id })),
    getDoc: vi.fn(),
}));

const getDocMock = vi.mocked(getDoc);

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
