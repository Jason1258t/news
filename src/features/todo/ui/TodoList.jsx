import React, { useState } from "react";
import TodoForm from "./form/TodoForm";
import TodoItem from "./item/TodoItem";
import Filter from "./filter/Filter";
import styles from "./TodoList.module.css";

const TodoList = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
}) => {
  const [filter, setFilter] = useState("all");

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
        Всего: {stats.total} | Активных: {stats.active} | Завершённых:{" "}
        {stats.completed}
      </div>

      <TodoForm onAdd={onAddTodo} />

      <Filter filter={filter} onFilterChange={setFilter} />

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

export default TodoList;
