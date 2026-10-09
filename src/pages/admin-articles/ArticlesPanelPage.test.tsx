import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteArticle, fetchArticles } from "entities/article/api/articles-api";
import { makeArticle } from "test/fixtures";
import { renderWithProviders } from "test/render";
import { ArticlesPanelPage } from "./ArticlesPanelPage";

vi.mock("entities/article/api/articles-api", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    fetchArticles: vi.fn(),
    deleteArticle: vi.fn(),
}));
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }));

const fetchMock = vi.mocked(fetchArticles);
const deleteMock = vi.mocked(deleteArticle);

const articles = [
    makeArticle({ slug: "first", title: "Первая" }),
    makeArticle({ slug: "second", title: "Вторая" }),
];

const selectAndDelete = async (title: string) => {
    await userEvent.click(await screen.findByRole("button", { name: new RegExp(title) }));
    await userEvent.click(screen.getByRole("button", { name: "Удалить" }));
    const dialog = screen.getByRole("dialog", { name: "Удалить статью?" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Удалить" }));
};

describe("ArticlesPanelPage", () => {
    beforeEach(() => {
        fetchMock.mockReset();
        deleteMock.mockReset();
        fetchMock.mockResolvedValue({ data: articles, hasMore: false });
    });

    it("shows the selected article", async () => {
        renderWithProviders(<ArticlesPanelPage />);

        await userEvent.click(await screen.findByRole("button", { name: /Вторая/ }));

        expect(screen.getByRole("button", { name: /Вторая/ })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
        expect(screen.getByRole("link", { name: /Вторая/ })).toHaveAttribute(
            "href",
            "/articles/second",
        );
    });

    it("deletes the selected article after confirmation and refreshes the list", async () => {
        deleteMock.mockResolvedValue();
        renderWithProviders(<ArticlesPanelPage />);
        await screen.findByRole("button", { name: /Первая/ });
        fetchMock.mockResolvedValue({ data: [articles[1]!], hasMore: false });

        await selectAndDelete("Первая");

        expect(deleteMock).toHaveBeenCalledWith("first");
        expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("Первая"));
        await waitFor(() =>
            expect(screen.queryByRole("button", { name: /Первая/ })).not.toBeInTheDocument(),
        );
        expect(screen.getByText("Никакая статья пока не выбрана")).toBeInTheDocument();
    });

    it("reports a failed deletion and keeps the article", async () => {
        deleteMock.mockRejectedValue(new Error("Missing or insufficient permissions."));
        renderWithProviders(<ArticlesPanelPage />);

        await selectAndDelete("Первая");

        expect(toast.error).toHaveBeenCalledWith(
            expect.stringContaining("Missing or insufficient permissions."),
        );
        expect(screen.getByRole("button", { name: /Первая/ })).toBeInTheDocument();
    });

    it("loads more articles on demand", async () => {
        fetchMock.mockResolvedValueOnce({ data: articles, hasMore: true, nextCursor: "second" });
        fetchMock.mockResolvedValueOnce({
            data: [makeArticle({ slug: "third", title: "Третья" })],
            hasMore: false,
        });
        renderWithProviders(<ArticlesPanelPage />);

        await userEvent.click(await screen.findByRole("button", { name: "Показать ещё" }));

        expect(await screen.findByRole("button", { name: /Третья/ })).toBeInTheDocument();
        expect(fetchMock).toHaveBeenLastCalledWith(expect.objectContaining({ lastId: "second" }));
        expect(screen.queryByRole("button", { name: "Показать ещё" })).not.toBeInTheDocument();
    });
});
