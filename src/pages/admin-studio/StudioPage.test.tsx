import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FirestoreError } from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addTodo, onChange } from "entities/todo/api/todo-api";
import type { Todo } from "entities/todo";
import { renderWithProviders } from "test/render";
import { StudioPage } from "./StudioPage";

vi.mock("entities/todo/api/todo-api", () => ({
    onChange: vi.fn(),
    addTodo: vi.fn().mockResolvedValue(undefined),
    toggleTodo: vi.fn(),
    deleteTodo: vi.fn(),
    updateTodo: vi.fn(),
}));

let emit: (todos: Todo[]) => void;
let fail: (error: FirestoreError) => void;

describe("StudioPage", () => {
    beforeEach(() => {
        vi.mocked(onChange).mockImplementation((onData, onError) => {
            emit = onData;
            fail = onError;
            return () => {};
        });
    });

    it("shows the live list, active todos first", async () => {
        renderWithProviders(<StudioPage />);

        act(() =>
            emit([
                { id: "1", text: "Готово", completed: true, createdAt: new Date(2) },
                { id: "2", text: "В работе", completed: false, createdAt: new Date(1) },
            ]),
        );

        // react-query notifies subscribers asynchronously.
        const checkboxes = await screen.findAllByRole("checkbox");
        expect(checkboxes.map((box) => box.getAttribute("aria-label"))).toEqual([
            "В работе",
            "Готово",
        ]);
    });

    it("adds a todo through the API", async () => {
        renderWithProviders(<StudioPage />);
        act(() => emit([]));

        await userEvent.type(screen.getByLabelText("Новая задача"), "Новая{Enter}");

        expect(vi.mocked(addTodo).mock.calls[0]?.[0]).toBe("Новая");
    });

    it("shows a subscription error", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        renderWithProviders(<StudioPage />);

        act(() => fail({ message: "Missing or insufficient permissions." } as FirestoreError));

        expect(screen.getByText(/Missing or insufficient permissions/)).toBeInTheDocument();
    });
});
