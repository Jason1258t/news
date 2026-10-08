import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchArticleBySlug } from "entities/article";
import { makeArticle } from "../../test/fixtures";
import { renderWithProviders } from "../../test/render";
import { ArticlePage } from "./ArticlePage";

vi.mock("entities/article/api/articles-api", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    fetchArticleBySlug: vi.fn(),
}));

const fetchMock = vi.mocked(fetchArticleBySlug);

const renderPage = () =>
    renderWithProviders(<ArticlePage />, {
        route: "/articles/test-article",
        path: "/articles/:slug",
    });

describe("ArticlePage", () => {
    beforeEach(() => {
        fetchMock.mockReset();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("renders the article for the slug from the URL", async () => {
        fetchMock.mockResolvedValue(makeArticle({ title: "Заголовок" }));
        renderPage();

        expect(
            await screen.findByRole("heading", { level: 1, name: "Заголовок" }),
        ).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledWith("test-article");
    });

    it("shows not found for a missing article instead of an error (B5)", async () => {
        fetchMock.mockResolvedValue(null);
        renderPage();

        expect(
            await screen.findByRole("heading", { name: "Статья не найдена" }),
        ).toBeInTheDocument();
        expect(screen.queryByText("Упс! Что-то пошло не так")).not.toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("retries loading when the user clicks retry (B10)", async () => {
        fetchMock.mockRejectedValueOnce(new Error("Failed to fetch article"));
        fetchMock.mockResolvedValueOnce(makeArticle({ title: "После повтора" }));
        renderPage();

        await userEvent.click(await screen.findByRole("button", { name: "Попробовать снова" }));

        expect(
            await screen.findByRole("heading", { level: 1, name: "После повтора" }),
        ).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});
