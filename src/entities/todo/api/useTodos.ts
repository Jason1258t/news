import { useEffect, useState } from "react";
import type { Todo } from "../model/types";
import { addTodo, deleteTodo, onChange, toggleTodo, updateTodo } from "./todo-api";

/** Active first, newest first within each group. */
const sortTodos = (todos: Todo[]) =>
    [...todos]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .sort((a, b) => Number(a.completed) - Number(b.completed));

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onChange(
            (todosData) => {
                setTodos(sortTodos(todosData));
                setLoading(false);
                setError(null);
            },
            (error) => {
                console.error("Error fetching todos:", error);
                setError(error.message);
                setLoading(false);
            },
        );

        return () => unsubscribe();
    }, []);

    return { todos, loading, error, addTodo, toggleTodo, deleteTodo, updateTodo };
};
