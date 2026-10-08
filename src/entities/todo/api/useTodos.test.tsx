import { act, renderHook, waitFor } from "@testing-library/react";
import type { FirestoreError } from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWrapper } from "../../../test/render";
import type { Todo } from "../model/types";
import { onChange } from "./todo-api";
import { useTodos } from "./useTodos";

vi.mock("./todo-api", () => ({ onChange: vi.fn() }));

let emit: (todos: Todo[]) => void;
let fail: (error: FirestoreError) => void;
const unsubscribe = vi.fn();

const todo = (id: string, completed: boolean, createdAt: number): Todo => ({
    id,
    text: id,
    completed,
    createdAt: new Date(createdAt),
});

describe("useTodos", () => {
    beforeEach(() => {
        unsubscribe.mockReset();
        vi.mocked(onChange).mockImplementation((onData, onError) => {
            emit = onData;
            fail = onError;
            return unsubscribe;
        });
    });

    it("is loading until the first snapshot", () => {
        const { result } = renderHook(() => useTodos(), { wrapper: createWrapper() });
        expect(result.current).toEqual({ todos: [], loading: true, error: null });
    });

    it("shows snapshots sorted: active first, newest first", async () => {
        const { result } = renderHook(() => useTodos(), { wrapper: createWrapper() });
        act(() => emit([todo("old", false, 1), todo("done", true, 3), todo("new", false, 2)]));

        // react-query notifies observers asynchronously
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.todos.map((item) => item.id)).toEqual(["new", "old", "done"]);
    });

    it("reports subscription errors", () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        const { result } = renderHook(() => useTodos(), { wrapper: createWrapper() });
        act(() => fail({ message: "permission-denied" } as FirestoreError));

        expect(result.current).toMatchObject({ loading: false, error: "permission-denied" });
    });

    it("unsubscribes on unmount", () => {
        const { unmount } = renderHook(() => useTodos(), { wrapper: createWrapper() });
        unmount();
        expect(unsubscribe).toHaveBeenCalled();
    });
});
