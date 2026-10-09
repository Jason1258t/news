import { act, renderHook, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addTodo, toggleTodo } from "entities/todo";
import { createWrapper } from "test/render";
import { useTodoActions } from "./useTodoActions";

vi.mock("entities/todo/api/todo-api", () => ({
    addTodo: vi.fn(),
    toggleTodo: vi.fn(),
    deleteTodo: vi.fn(),
    updateTodo: vi.fn(),
    onChange: vi.fn(),
}));
vi.mock("react-hot-toast", () => ({ default: { error: vi.fn(), success: vi.fn() } }));

describe("useTodoActions", () => {
    beforeEach(() => {
        vi.mocked(toast.error).mockReset();
    });

    it("passes arguments to the API", async () => {
        vi.mocked(toggleTodo).mockResolvedValue();
        const { result } = renderHook(() => useTodoActions(), { wrapper: createWrapper() });

        act(() => result.current.toggleTodo("id-1", false));

        await waitFor(() => expect(toggleTodo).toHaveBeenCalledWith("id-1", false));
        expect(toast.error).not.toHaveBeenCalled();
    });

    it("shows a toast when a write fails instead of an unhandled rejection", async () => {
        vi.mocked(addTodo).mockRejectedValue(new Error("permission-denied"));
        const { result } = renderHook(() => useTodoActions(), { wrapper: createWrapper() });

        act(() => result.current.addTodo("task"));

        await waitFor(() =>
            expect(toast.error).toHaveBeenCalledWith(
                "Не удалось добавить задачу: permission-denied",
            ),
        );
    });
});
