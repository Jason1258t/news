import { useEffect } from "react";
import { getArticlePreview } from "entities/article";
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
                onArticleSelected={(article) =>
                    editorsPicksStore.addEditorsPick(getArticlePreview(article))
                }
            />
            <CurrentPicks store={editorsPicksStore} />
        </div>
    );
};
