import { useTodos } from "entities/todo";
import { TodoList, useTodoActions } from "features/manage-todos";
import { AdminPage } from "widgets/admin-layout";
import { ErrorWidget } from "shared/ui/error-widget";
import { LoadingWidget } from "shared/ui/loading-widget";
import styles from "./StudioPage.module.css";

export const StudioPage = () => {
    const { todos, loading, error } = useTodos();
    const { addTodo, toggleTodo, deleteTodo, updateTodo } = useTodoActions();

    return (
        <AdminPage title="Студия" description="Задачи редакции" width="narrow">
            <div className={styles.card}>
                {loading && <LoadingWidget />}
                {error && <ErrorWidget message={error} />}
                <TodoList
                    todos={todos}
                    onAddTodo={addTodo}
                    onDeleteTodo={deleteTodo}
                    onToggleTodo={toggleTodo}
                    onUpdateTodo={updateTodo}
                />
            </div>
        </AdminPage>
    );
};
