import { useState } from "react";
import type { Todo } from "entities/todo";
import { TodoFilter, type TodoFilterValue } from "./TodoFilter";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";
import styles from "./TodoList.module.css";

interface TodoListProps {
    todos: Todo[];
    onAddTodo: (text: string) => void;
    onToggleTodo: (id: string, completed: boolean) => void;
    onDeleteTodo: (id: string) => void;
    onUpdateTodo: (id: string, text: string) => void;
}

export const TodoList = ({
    todos,
    onAddTodo,
    onToggleTodo,
    onDeleteTodo,
    onUpdateTodo,
}: TodoListProps) => {
    const [filter, setFilter] = useState<TodoFilterValue>("all");

    const filteredTodos = todos.filter((todo) => {
        if (filter === "active") return !todo.completed;
        if (filter === "completed") return todo.completed;
        return true;
    });

    const stats = {
        total: todos.length,
        active: todos.filter((t) => !t.completed).length,
        completed: todos.filter((t) => t.completed).length,
    };

    return (
        <>
            <div className={styles.stats}>
                Всего: {stats.total} | Активных: {stats.active} | Завершённых: {stats.completed}
            </div>

            <TodoForm onAdd={onAddTodo} />

            <TodoFilter filter={filter} onFilterChange={setFilter} />

            <div className={styles.todoList}>
                {filteredTodos.length === 0 ? (
                    <div className={styles.empty}>
                        {filter === "all"
                            ? "Нет задач. Добавьте новую!"
                            : filter === "active"
                              ? "Нет активных задач"
                              : "Нет завершённых задач"}
                    </div>
                ) : (
                    filteredTodos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={onToggleTodo}
                            onDelete={onDeleteTodo}
                            onUpdate={onUpdateTodo}
                        />
                    ))
                )}
            </div>
        </>
    );
};
