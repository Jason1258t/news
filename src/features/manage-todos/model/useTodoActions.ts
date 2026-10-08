import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addTodo, deleteTodo, toggleTodo, updateTodo } from "entities/todo";
import { getErrorMessage } from "shared/lib/error";

const notifyError = (action: string) => (error: unknown) => {
    toast.error(`Не удалось ${action}: ${getErrorMessage(error)}`);
};

/**
 * Todo mutations. The list itself updates through the Firestore subscription in
 * useTodos, so there is nothing to invalidate; failures are shown as toasts.
 */
export const useTodoActions = () => {
    const add = useMutation({ mutationFn: addTodo, onError: notifyError("добавить задачу") });
    const toggle = useMutation({
        mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
            toggleTodo(id, completed),
        onError: notifyError("обновить задачу"),
    });
    const remove = useMutation({ mutationFn: deleteTodo, onError: notifyError("удалить задачу") });
    const update = useMutation({
        mutationFn: ({ id, text }: { id: string; text: string }) => updateTodo(id, text),
        onError: notifyError("сохранить задачу"),
    });

    return {
        addTodo: (text: string) => add.mutate(text),
        toggleTodo: (id: string, completed: boolean) => toggle.mutate({ id, completed }),
        deleteTodo: (id: string) => remove.mutate(id),
        updateTodo: (id: string, text: string) => update.mutate({ id, text }),
    };
};
