import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchArticles } from "entities/article/api/articles-api";
import { makeArticle } from "../../../test/fixtures";
import { renderWithProviders } from "../../../test/render";
import { ArticlesList } from "./ArticlesList";

vi.mock("entities/article/api/articles-api", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    fetchArticles: vi.fn(),
}));

const fetchMock = vi.mocked(fetchArticles);

describe("ArticlesList (editors pick editor)", () => {
    beforeEach(() => {
        fetchMock.mockReset();
    });

    it("shows a spinner while loading (B9)", () => {
        fetchMock.mockReturnValue(new Promise(() => {}));
        renderWithProviders(<ArticlesList onArticleSelected={() => {}} />);
        expect(screen.getByRole("status", { name: "Загрузка" })).toBeInTheDocument();
    });

    it("shows the error (B9)", async () => {
        fetchMock.mockRejectedValue(new Error("Failed to fetch articles"));
        renderWithProviders(<ArticlesList onArticleSelected={() => {}} />);
        expect(await screen.findByText("Failed to fetch articles")).toBeInTheDocument();
    });

    it("lists articles by title even without og and reports the clicked one", async () => {
        const article = makeArticle({ slug: "no-og", title: "Без og", og: {} });
        fetchMock.mockResolvedValue({ data: [article], hasMore: false });
        const onArticleSelected = vi.fn();
        renderWithProviders(<ArticlesList onArticleSelected={onArticleSelected} />);

        await userEvent.click(await screen.findByRole("heading", { name: "Без og" }));

        expect(onArticleSelected).toHaveBeenCalledWith(article);
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
});
