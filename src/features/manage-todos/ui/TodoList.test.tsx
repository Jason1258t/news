import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Todo } from "entities/todo";
import { TodoList } from "./TodoList";

const todo = (id: string, text: string, completed = false): Todo => ({
    id,
    text,
    completed,
    createdAt: new Date(0),
});

const renderList = (todos = [todo("1", "Купить хлеб"), todo("2", "Сдать отчёт", true)]) => {
    const actions = {
        onAddTodo: vi.fn(),
        onToggleTodo: vi.fn(),
        onDeleteTodo: vi.fn(),
        onUpdateTodo: vi.fn(),
    };
    render(<TodoList todos={todos} {...actions} />);
    return actions;
};

describe("TodoList", () => {
    it("shows counters", () => {
        renderList();

        expect(screen.getByText("Всего: 2 | Активных: 1 | Завершённых: 1")).toBeInTheDocument();
    });

    it("adds a trimmed todo and clears the input; ignores blank input", async () => {
        const { onAddTodo } = renderList();
        const input = screen.getByLabelText("Новая задача");

        await userEvent.type(input, "   {Enter}");
        await userEvent.type(input, "  Позвонить  {Enter}");

        expect(onAddTodo).toHaveBeenCalledExactlyOnceWith("Позвонить");
        expect(input).toHaveValue("");
    });

    it("toggles and deletes", async () => {
        const { onToggleTodo, onDeleteTodo } = renderList();

        await userEvent.click(screen.getByRole("checkbox", { name: "Сдать отчёт" }));
        await userEvent.click(screen.getByRole("button", { name: "Удалить: Купить хлеб" }));

        expect(onToggleTodo).toHaveBeenCalledWith("2", true);
        expect(onDeleteTodo).toHaveBeenCalledWith("1");
    });

    it("edits with Enter, cancels with Escape", async () => {
        const { onUpdateTodo } = renderList();

        await userEvent.click(screen.getByRole("button", { name: "Редактировать: Купить хлеб" }));
        await userEvent.keyboard("{Escape}");
        expect(screen.getByRole("checkbox", { name: "Купить хлеб" })).toBeInTheDocument();
        expect(onUpdateTodo).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole("button", { name: "Редактировать: Купить хлеб" }));
        const input = screen.getByLabelText("Текст задачи");
        await userEvent.clear(input);
        await userEvent.type(input, "Купить молоко{Enter}");
        expect(onUpdateTodo).toHaveBeenCalledWith("1", "Купить молоко");
    });

    it("filters by state and explains empty results", async () => {
        renderList([todo("1", "Активная")]);

        await userEvent.click(screen.getByRole("button", { name: "Завершённые" }));

        expect(screen.getByRole("button", { name: "Завершённые" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
        expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
        expect(screen.getByText("Нет завершённых задач")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: "Активные" }));
        expect(within(document.body).getByRole("checkbox", { name: "Активная" })).toBeVisible();
    });

    it("turns links in todo text into links", () => {
        renderList([todo("1", "Читать https://example.com")]);

        expect(screen.getByRole("link", { name: "https://example.com" })).toHaveAttribute(
            "target",
            "_blank",
        );
    });
});
