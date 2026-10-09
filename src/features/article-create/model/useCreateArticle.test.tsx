import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { articleKeys, createArticle, fetchArticleBySlug } from "entities/article";
import { makeArticle } from "test/fixtures";
import { createTestQueryClient, createWrapper } from "test/render";
import { useCreateArticle } from "./useCreateArticle";

vi.mock("entities/article/api/articles-api", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    createArticle: vi.fn(),
    fetchArticleBySlug: vi.fn(),
}));

describe("useCreateArticle", () => {
    beforeEach(() => {
        vi.mocked(createArticle).mockReset();
        vi.mocked(fetchArticleBySlug).mockReset();
    });

    it("refreshes feeds and caches the new article", async () => {
        vi.mocked(createArticle).mockResolvedValue({ slug: "new" });
        vi.mocked(fetchArticleBySlug).mockResolvedValue(makeArticle({ slug: "new" }));
        const queryClient = createTestQueryClient();
        const listKey = articleKeys.list({ category: null, tags: [], limit: 5 });
        queryClient.setQueryData(listKey, { pages: [], pageParams: [] });

        const { result } = renderHook(() => useCreateArticle(), {
            wrapper: createWrapper({ queryClient }),
        });
        const created = await act(() => result.current.mutateAsync({ slug: "new" }));

        expect(created).toEqual({ slug: "new" });
        expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
        expect(queryClient.getQueryData(articleKeys.detail("new"))).toMatchObject({ slug: "new" });
    });
});
