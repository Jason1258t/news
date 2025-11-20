import { useEffect } from "react";
import ArticlesList from "./components/ArticlesList";
import CurrentPicks from "./components/CurrentPicks";
import { useEditorsPickStore } from "features/editors-pick/data/useEditorsPicksStore";
import { Helmet } from "react-helmet-async";
import { Container, Main } from "shared/ui/layout";

const EditorsPickPanel = () => {
  const editorsPicksStore = useEditorsPickStore();
  useEffect(() => {
    editorsPicksStore.loadEditorsPicks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Helmet>
        <title>Выбор редакции | ПГТУ Breaking NEWS</title>
        <meta
          name="description"
          content="Панель для настройки выбора редакции"
        />
      </Helmet>
      <Main>
        <Container style={{ display: "flex", gap: "3rem" }}>
          <ArticlesList
            onArticleSelected={(article) =>
              editorsPicksStore.addEditorsPick(article.og)
            }
          />
          <CurrentPicks store={editorsPicksStore} />
        </Container>
      </Main>
    </>
  );
};

export default EditorsPickPanel;
