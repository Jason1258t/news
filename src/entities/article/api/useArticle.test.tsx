import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeArticle } from "test/fixtures";
import { createTestQueryClient, createWrapper } from "test/render";
import { articleKeys } from "./article-keys";
import { fetchArticleBySlug, type ArticlesPage } from "./articles-api";
import { useArticle } from "./useArticle";

vi.mock("./articles-api", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    fetchArticleBySlug: vi.fn(),
}));

const fetchMock = vi.mocked(fetchArticleBySlug);

describe("useArticle", () => {
    beforeEach(() => {
        fetchMock.mockReset();
    });

    it("loads the article by slug", async () => {
        fetchMock.mockResolvedValue(makeArticle({ slug: "a" }));
        const { result } = renderHook(() => useArticle("a"), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.data?.slug).toBe("a"));
        expect(fetchMock).toHaveBeenCalledWith("a");
    });

    it("shows an article from a cached feed page without a request (B6)", () => {
        const queryClient = createTestQueryClient();
        const page: ArticlesPage = { data: [makeArticle({ slug: "cached" })], hasMore: false };
        queryClient.setQueryData(articleKeys.list({ category: null, tags: [], limit: 5 }), {
            pages: [page],
            pageParams: [undefined],
        });

        const { result } = renderHook(() => useArticle("cached"), {
            wrapper: createWrapper({ queryClient }),
        });

        expect(result.current.data?.slug).toBe("cached");
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
