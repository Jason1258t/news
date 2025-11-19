import { useTodos } from "features/todo/hooks/useTodos";
import TodoList from "features/todo/ui/TodoList";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Content, Main, Container, Surface } from "shared/ui/layout";
import ErrorWidget from "shared/ui/status/error";
import LoadingWidget from "shared/ui/status/loading";

const StudioPage = () => {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, updateTodo } =
    useTodos();

  return (
    <>
      <Helmet>
        <title>Студия | ПГТУ Breaking NEWS</title>
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

export default StudioPage;
