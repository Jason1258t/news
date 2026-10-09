import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchArticles } from "entities/article/api/articles-api";
import { fetchEditorsPicks, replaceEditorsPicks } from "entities/editors-pick/api/editors-pick-api";
import type { EditorsPick } from "entities/editors-pick";
import { makeArticle } from "test/fixtures";
import { renderWithProviders } from "test/render";
import { EditorsPickEditor } from "./EditorsPickEditor";

vi.mock("entities/article/api/articles-api", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    fetchArticles: vi.fn(),
}));
vi.mock("entities/editors-pick/api/editors-pick-api", () => ({
    fetchEditorsPicks: vi.fn(),
    replaceEditorsPicks: vi.fn(),
}));
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }));

const savedPick: EditorsPick = {
    id: "pick_0_000",
    title: "Сохранённая",
    description: "",
    badge: "Must Read",
    articleUrl: "https://vtech-news.ru/#/articles/saved",
    createdAt: new Date(0),
    updatedAt: new Date(0),
};

const current = () => screen.getByRole("region", { name: "Текущий выбор редакции" });
const pickTitles = () =>
    within(current())
        .queryAllByRole("heading", { level: 4 })
        .map((heading) => heading.textContent);
const saveButton = () => within(current()).getByRole("button", { name: "Подтвердить" });

describe("EditorsPickEditor", () => {
    beforeEach(() => {
        vi.mocked(fetchEditorsPicks).mockResolvedValue([savedPick]);
        vi.mocked(replaceEditorsPicks).mockReset().mockResolvedValue();
        vi.mocked(fetchArticles).mockResolvedValue({
            data: [makeArticle({ slug: "mars", title: "Марс", description: "Лид" })],
            hasMore: false,
        });
    });

    it("starts from the saved list with nothing to save", async () => {
        renderWithProviders(<EditorsPickEditor />);

        await waitFor(() => expect(pickTitles()).toEqual(["Сохранённая"]));
        expect(saveButton()).toBeDisabled();
    });

    it("adds an article, changes its badge and saves the whole list in order", async () => {
        renderWithProviders(<EditorsPickEditor />);
        await waitFor(() => expect(pickTitles()).toEqual(["Сохранённая"]));

        await userEvent.click(await screen.findByRole("button", { name: "Марс" }));
        await userEvent.click(
            within(current()).getAllByRole("button", { name: "Изменить бейдж" })[1]!,
        );
        const dialog = screen.getByRole("dialog", { name: "Выберите бейдж" });
        expect(within(dialog).getByRole("button", { name: "Подтвердить" })).toBeDisabled();
        await userEvent.click(within(dialog).getByRole("button", { name: "Deep Dive" }));
        await userEvent.click(within(dialog).getByRole("button", { name: "Подтвердить" }));
        await userEvent.click(saveButton());

        expect(replaceEditorsPicks).toHaveBeenCalledWith([
            {
                title: "Сохранённая",
                description: "",
                badge: "Must Read",
                articleUrl: savedPick.articleUrl,
            },
            {
                title: "Марс",
                description: "Лид",
                badge: "Deep Dive",
                articleUrl: "https://vtech-news.ru/#/articles/mars",
            },
        ]);
        await waitFor(() => expect(saveButton()).toBeDisabled());
    });

    it("removes a pick and resets the draft", async () => {
        renderWithProviders(<EditorsPickEditor />);
        await waitFor(() => expect(pickTitles()).toEqual(["Сохранённая"]));

        await userEvent.click(within(current()).getByRole("button", { name: "Удалить" }));
        expect(screen.getByText("Тут пока пусто")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: "Сбросить изменения" }));

        expect(pickTitles()).toEqual(["Сохранённая"]);
        expect(saveButton()).toBeDisabled();
    });

    it("keeps the draft and shows the error when saving fails", async () => {
        vi.mocked(replaceEditorsPicks).mockRejectedValue(
            new Error("Запись 1: поле 'title' обязательно"),
        );
        renderWithProviders(<EditorsPickEditor />);
        await userEvent.click(await screen.findByRole("button", { name: "Марс" }));

        await userEvent.click(saveButton());

        expect(await within(current()).findByText(/поле 'title' обязательно/)).toBeInTheDocument();
        expect(pickTitles()).toEqual(["Сохранённая", "Марс"]);
        expect(saveButton()).toBeEnabled();
    });
});
