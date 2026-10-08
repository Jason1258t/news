import { useTodos } from "entities/todo";
import { TodoList } from "features/manage-todos";
import React from "react";
import { Helmet } from "react-helmet-async";
import { PROJECT_NAME } from "shared/config";
import { Content, Main, Container, Surface } from "shared/ui/layout";
import { ErrorWidget } from "shared/ui/error-widget";
import { LoadingWidget } from "shared/ui/loading-widget";

export const StudioPage = () => {
    const { todos, loading, error, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos();

    return (
        <>
            <Helmet>
                <title>{`Студия | ${PROJECT_NAME}`}</title>
                <meta name="description" content="Творческая студия" />
            </Helmet>
            <Main spacing="compact">
                <Container>
                    <Surface>
                        <Content>
                            <h2>Студия</h2>
                            {loading && <LoadingWidget />}
                            {error && <ErrorWidget message={error?.message} />}
                            <TodoList
                                todos={todos}
                                onAddTodo={addTodo}
                                onDeleteTodo={deleteTodo}
                                onToggleTodo={toggleTodo}
                                onUpdateTodo={updateTodo}
                            />
                        </Content>
                    </Surface>
                </Container>
            </Main>
        </>
    );
};
