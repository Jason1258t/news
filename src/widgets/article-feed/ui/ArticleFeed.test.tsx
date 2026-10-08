import { act, screen, waitFor } from "@testing-library/react";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchArticles, type ArticlesPage } from "entities/article/api/articles-api";
import { makeArticle } from "test/fixtures";
import { renderWithProviders } from "test/render";
import { ArticleFeed } from "./ArticleFeed";

vi.mock("entities/article/api/articles-api", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    fetchArticles: vi.fn(),
}));

const fetchMock = vi.mocked(fetchArticles);

const page = (slugs: string[], nextCursor?: string): ArticlesPage => ({
    data: slugs.map((slug) => makeArticle({ slug, title: `Статья ${slug}` })),
    hasMore: nextCursor !== undefined,
    nextCursor,
});

const titles = () => screen.queryAllByRole("heading").map((heading) => heading.textContent);

describe("ArticleFeed", () => {
    beforeEach(() => {
        fetchMock.mockReset();
    });

    it("passes category and tags from the URL to the query", async () => {
        fetchMock.mockResolvedValue(page(["a"]));
        renderWithProviders(<ArticleFeed />, { route: "/?category=Наука&tags=ии,космос" });

        expect(await screen.findByText("Статья a")).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledWith(
            expect.objectContaining({ category: "Наука", tags: ["ии", "космос"] }),
        );
    });

    it("links each card to its article", async () => {
        fetchMock.mockResolvedValue(page(["first"]));
        renderWithProviders(<ArticleFeed />);

        const link = (await screen.findByText("Статья first")).closest("a");
        expect(link).toHaveAttribute("href", "/articles/first");
    });

    it("loads the next page when the last card scrolls into view", async () => {
        fetchMock.mockResolvedValueOnce(page(["a", "b"], "b"));
        fetchMock.mockResolvedValueOnce(page(["c"]));
        renderWithProviders(<ArticleFeed />);
        await screen.findByText("Статья b");

        act(() => mockAllIsIntersecting(true));

        expect(await screen.findByText("Статья c")).toBeInTheDocument();
        expect(fetchMock).toHaveBeenLastCalledWith(expect.objectContaining({ lastId: "b" }));
        expect(titles()).toEqual(["Статья a", "Статья b", "Статья c"]);
        expect(screen.getByText("Больше ничего нет")).toBeInTheDocument();
    });

    it("keeps loading when a page is empty after the client-side category filter (B15)", async () => {
        // Category + tags: Firestore filters by tags, the category is checked on the client,
        // so a whole page can be filtered out while more matching articles follow.
        fetchMock.mockResolvedValueOnce(page([], "x5"));
        fetchMock.mockResolvedValueOnce(page(["match"]));
        renderWithProviders(<ArticleFeed />, { route: "/?category=Спорт&tags=футбол" });

        expect(await screen.findByText("Статья match")).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(screen.queryByText("Статьи не найдены")).not.toBeInTheDocument();
    });

    it("shows the empty state when nothing matches", async () => {
        fetchMock.mockResolvedValue(page([]));
        renderWithProviders(<ArticleFeed />);

        expect(await screen.findByText("Статьи не найдены")).toBeInTheDocument();
    });

    it("shows an error when loading fails", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        fetchMock.mockRejectedValue(new Error("Failed to fetch articles"));
        renderWithProviders(<ArticleFeed />);

        await waitFor(() => expect(screen.getByText(/Failed to fetch articles/)).toBeVisible());
    });
});
