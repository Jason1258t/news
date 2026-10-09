import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createArticle, fetchArticleBySlug } from "entities/article/api/articles-api";
import { makeArticle } from "test/fixtures";
import { renderWithProviders } from "test/render";
import { useCreateArticleStore } from "./create-article-store";
import { CreateArticlePage } from "./CreateArticlePage";

vi.mock("entities/article/api/articles-api", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    createArticle: vi.fn(),
    fetchArticleBySlug: vi.fn(),
}));
vi.mock("react-hot-toast", () => {
    const toast = Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() });
    return { default: toast };
});

const createMock = vi.mocked(createArticle);

const renderPage = () =>
    renderWithProviders(
        <Routes>
            <Route path="/admin/create-article" element={<CreateArticlePage />} />
            <Route path="/articles/:slug" element={<p>article page</p>} />
        </Routes>,
        { route: "/admin/create-article" },
    );

const jsonInput = () => screen.getByLabelText("JSON данные статьи");
const submitButton = () => screen.getByRole("button", { name: /Создать статью/ });

/** user-event treats { and [ as key descriptors; paste the JSON instead. */
const pasteJson = async (text: string) => {
    await userEvent.click(jsonInput());
    await userEvent.paste(text);
};

describe("CreateArticlePage", () => {
    beforeEach(() => {
        useCreateArticleStore.setState(useCreateArticleStore.getInitialState());
        createMock.mockReset();
        vi.mocked(fetchArticleBySlug).mockResolvedValue(makeArticle({ slug: "new" }));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("disables submit until there is valid JSON", async () => {
        renderPage();
        expect(submitButton()).toBeDisabled();

        await pasteJson("{ broken");

        expect(screen.getByRole("alert")).toHaveTextContent("Невалидный JSON");
        expect(submitButton()).toBeDisabled();
    });

    it("uploads the article and opens it", async () => {
        createMock.mockResolvedValue({ slug: "new" });
        renderPage();

        await pasteJson('{"slug":"new"}');
        expect(screen.getByText(/JSON валиден/)).toBeInTheDocument();
        await userEvent.click(submitButton());

        expect(createMock).toHaveBeenCalledWith({ slug: "new" });
        expect(await screen.findByText("article page")).toBeInTheDocument();
        expect(toast.success).toHaveBeenCalled();
        expect(useCreateArticleStore.getState().jsonInput).toBe("");
    });

    it("shows why the article was rejected and keeps the JSON", async () => {
        createMock.mockRejectedValue(new Error('Статья с slug "new" уже существует'));
        renderPage();

        await pasteJson('{"slug":"new"}');
        await userEvent.click(submitButton());

        expect(await screen.findByRole("alert")).toHaveTextContent("уже существует");
        expect(jsonInput()).toHaveValue('{"slug":"new"}');
    });

    it("keeps the draft when the admin leaves and comes back", async () => {
        const { unmount } = renderPage();
        await pasteJson('{"slug":"draft"}');
        unmount();

        renderPage();

        expect(jsonInput()).toHaveValue('{"slug":"draft"}');
    });

    it("previews the image URL and copies a prompt that includes it", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
        renderPage();

        await userEvent.type(screen.getByLabelText("URL изображения"), "https://img.example/a.png");
        expect(screen.getByRole("img", { name: "Превью" })).toHaveAttribute(
            "src",
            "https://img.example/a.png",
        );
        await userEvent.click(
            screen.getByRole("button", { name: "Скопировать промпт форматирования" }),
        );

        expect(writeText).toHaveBeenCalledWith(
            expect.stringContaining("https://img.example/a.png"),
        );
        expect(toast.success).toHaveBeenCalledWith("Шаблон успешно скопирован!");

        await userEvent.click(screen.getByRole("button", { name: "Удалить изображение" }));
        expect(screen.queryByRole("img", { name: "Превью" })).not.toBeInTheDocument();
    });

    it("warns when the prompt is copied without an image", async () => {
        vi.stubGlobal("navigator", {
            ...navigator,
            clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
        });
        renderPage();

        await userEvent.click(
            screen.getByRole("button", { name: "Скопировать промпт форматирования" }),
        );

        expect(toast).toHaveBeenCalledWith(expect.stringContaining("В промпте не указано"), {
            icon: "⚠️",
        });
    });

    it("reports a clipboard failure", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.stubGlobal("navigator", {
            ...navigator,
            clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
        });
        renderPage();

        await userEvent.click(screen.getByRole("button", { name: "Скопировать промпт для тг" }));

        expect(toast.error).toHaveBeenCalledWith("Ошибка копирования");
    });
});
