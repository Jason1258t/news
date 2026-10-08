import { useEffect } from "react";
import { useEditorsPickStore } from "../model/useEditorsPickStore";
import { ArticlesList } from "./ArticlesList";
import { CurrentPicks } from "./CurrentPicks";
import styles from "./EditorsPickEditor.module.css";

export const EditorsPickEditor = () => {
    const editorsPicksStore = useEditorsPickStore();
    useEffect(() => {
        editorsPicksStore.loadEditorsPicks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.editor}>
            <ArticlesList
                onArticleSelected={(article) => editorsPicksStore.addEditorsPick(article.og)}
            />
            <CurrentPicks store={editorsPicksStore} />
        </div>
    );
};
