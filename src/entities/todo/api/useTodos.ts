import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Todo } from "../model/types";
import { onChange } from "./todo-api";
import { todoKeys } from "./todo-keys";

/** Active first, newest first within each group. */
export const sortTodos = (todos: Todo[]) =>
    [...todos]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .sort((a, b) => Number(a.completed) - Number(b.completed));

/**
 * Live list of studio todos. A Firestore subscription writes every snapshot into the
 * react-query cache; the query itself never fetches.
 */
export const useTodos = () => {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);

    useEffect(
        () =>
            onChange(
                (todos) => {
                    queryClient.setQueryData(todoKeys.all, sortTodos(todos));
                    setError(null);
                },
                (subscriptionError) => {
                    console.error("Error fetching todos:", subscriptionError);
                    setError(subscriptionError.message);
                },
            ),
        [queryClient],
    );

    const { data: todos } = useQuery<Todo[]>({
        queryKey: todoKeys.all,
        queryFn: () => Promise.reject(new Error("todos are filled by the subscription")),
        enabled: false,
        staleTime: Infinity,
    });

    return { todos: todos ?? [], loading: todos === undefined && !error, error };
};
