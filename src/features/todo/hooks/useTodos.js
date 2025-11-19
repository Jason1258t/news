import { useState, useEffect } from "react";
import {
  onChange,
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
} from "../api/todo-api";

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onChange(
      (todosData) => {
        setTodos(
          todosData
            .sort((a, b) => b.createdAt - a.createdAt)
            .sort((a, b) => a.completed - b.completed)
        );
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Error fetching todos:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo, updateTodo };
};
