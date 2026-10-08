import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { articleKeys, deleteArticle } from "entities/article";
import { makeArticle } from "../../../test/fixtures";
import { createTestQueryClient, createWrapper } from "../../../test/render";
import { useDeleteArticle } from "./useDeleteArticle";

vi.mock("entities/article/api/articles-api", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    deleteArticle: vi.fn(),
}));

const deleteMock = vi.mocked(deleteArticle);

describe("useDeleteArticle", () => {
    beforeEach(() => {
        deleteMock.mockReset();
    });

    it("drops the article from the cache and refreshes feeds (B11)", async () => {
        deleteMock.mockResolvedValue();
        const queryClient = createTestQueryClient();
        const listKey = articleKeys.list({ category: null, tags: [], limit: 20 });
        queryClient.setQueryData(listKey, { pages: [], pageParams: [] });
        queryClient.setQueryData(articleKeys.detail("gone"), makeArticle({ slug: "gone" }));

        const { result } = renderHook(() => useDeleteArticle(), {
            wrapper: createWrapper({ queryClient }),
        });
        await act(() => result.current.mutateAsync("gone"));

        expect(deleteMock).toHaveBeenCalledWith("gone");
        expect(queryClient.getQueryData(articleKeys.detail("gone"))).toBeUndefined();
        expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
    });

    it("surfaces API errors to the caller", async () => {
        deleteMock.mockRejectedValue(new Error("Статья не найдена"));
        const { result } = renderHook(() => useDeleteArticle(), { wrapper: createWrapper() });

        await expect(act(() => result.current.mutateAsync("x"))).rejects.toThrow(
            "Статья не найдена",
        );
    });
});
