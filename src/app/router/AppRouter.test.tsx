import { screen } from "@testing-library/react";
import type { User } from "firebase/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchArticleBySlug, fetchArticles } from "entities/article/api/articles-api";
import { fetchEditorsPicks } from "entities/editors-pick/api/editors-pick-api";
import { SessionContext } from "entities/session";
import { makeArticle } from "test/fixtures";
import { renderWithProviders } from "test/render";
import { AppRouter } from "./AppRouter";

vi.mock("entities/article/api/articles-api", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    fetchArticles: vi.fn(),
    fetchArticleBySlug: vi.fn(),
}));
vi.mock("entities/editors-pick/api/editors-pick-api", () => ({
    fetchEditorsPicks: vi.fn(),
    replaceEditorsPicks: vi.fn(),
}));
vi.mock("entities/todo/api/todo-api", () => ({
    onChange: vi.fn(() => () => {}),
}));

const renderAt = (route: string, user: User | null = null) =>
    renderWithProviders(
        <SessionContext.Provider value={{ user, loading: false }}>
            <AppRouter />
        </SessionContext.Provider>,
        { route },
    );

describe("AppRouter", () => {
    beforeEach(() => {
        vi.mocked(fetchArticles).mockResolvedValue({ data: [makeArticle()], hasMore: false });
        vi.mocked(fetchArticleBySlug).mockResolvedValue(makeArticle({ title: "Статья" }));
        vi.mocked(fetchEditorsPicks).mockResolvedValue([]);
    });

    it.each([
        ["/", "Тестовая статья"],
        ["/about", "О проекте"],
        ["/articles/test-article", "Статья"],
        ["/login", "Вход в админ-панель"],
    ])("renders %s", async (route, heading) => {
        renderAt(route);

        expect(await screen.findByRole("heading", { name: heading })).toBeInTheDocument();
    });

    it("sends guests from the admin panel to login", async () => {
        renderAt("/admin/studio");

        expect(
            await screen.findByRole("heading", { name: "Вход в админ-панель" }),
        ).toBeInTheDocument();
    });

    it("loads admin pages lazily for a signed-in user, /admin opens article creation", async () => {
        renderAt("/admin", { email: "admin@news.test" } as User);

        expect(await screen.findByRole("heading", { name: "Создать статью" })).toBeInTheDocument();
        expect(screen.getByText("admin@news.test")).toBeInTheDocument();
    });
});
