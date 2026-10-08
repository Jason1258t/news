import type { FirestoreError } from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { seedEmulators, signInAsAdmin, signOutUser } from "test/emulator";
import type { Todo } from "../model/types";
import { addTodo, deleteTodo, onChange, toggleTodo, updateTodo } from "./todo-api";

// Real Firestore (emulator) with firestore.rules: npm run test:emulator.

/** Subscribes and resolves with the first snapshot that satisfies `until`. */
const nextTodos = (until: (todos: Todo[]) => boolean) =>
    new Promise<Todo[]>((resolve, reject) => {
        const unsubscribe = onChange(
            (todos) => {
                if (until(todos)) {
                    unsubscribe();
                    resolve(todos);
                }
            },
            (error) => {
                unsubscribe();
                reject(error);
            },
        );
    });

const byText = (todos: Todo[], text: string) => todos.find((todo) => todo.text === text);

describe("todo API on the emulator", () => {
    beforeEach(async () => {
        await seedEmulators();
        await signInAsAdmin();
    });

    afterEach(async () => {
        await signOutUser();
    });

    it("streams the seeded todos", async () => {
        const todos = await nextTodos((t) => t.length > 0);

        expect(todos).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: "todo-1",
                    text: "Проверить вёрстку",
                    completed: false,
                }),
                expect.objectContaining({ id: "todo-2", completed: true }),
            ]),
        );
        expect(todos[0]?.createdAt).toBeInstanceOf(Date);
    });

    it("adds, edits, toggles and deletes a todo", async () => {
        await addTodo("Новая задача");
        const added = byText(await nextTodos((t) => !!byText(t, "Новая задача")), "Новая задача");
        expect(added?.completed).toBe(false);

        await updateTodo(added!.id, "Изменённая задача");
        await toggleTodo(added!.id, false);
        const changed = await nextTodos((t) => byText(t, "Изменённая задача")?.completed === true);
        expect(byText(changed, "Изменённая задача")?.id).toBe(added!.id);

        await deleteTodo(added!.id);
        const after = await nextTodos((t) => !t.some((todo) => todo.id === added!.id));
        expect(after).toHaveLength(2);
    });

    it("reports a permission error to a signed-out subscriber", async () => {
        await signOutUser();

        // The SDK may first replay its local cache from earlier tests; the server then refuses.
        const error = await new Promise<FirestoreError>((resolve) => {
            const unsubscribe = onChange(
                () => {},
                (e) => {
                    unsubscribe();
                    resolve(e);
                },
            );
        });
        expect(error).toMatchObject({ code: "permission-denied" });
    });
});
