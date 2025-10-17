import React from "react";
import { useArticles } from "features/articles/hooks/useArticles";
import EditorsPickCard from "entities/editors-pick/ui";
import styles from "./ArticlesList.module.css";

const ArticlesList = ({ onArticleSelected }) => {
    const { data, isLoading, error } = useArticles(undefined, 50);

    const allArticles = data?.pages.flatMap((page) => page.data) || [];
    return (
        <div>
            <h2 style={{ margin: 0, marginBottom: "1rem" }}>Список статей</h2>
            <div className={styles.list}>
                {allArticles ? (
                    allArticles.map((article, i) => (
                        <div
                            className={styles.cardWrapper}
                            onClick={() => onArticleSelected(article)}
                        >
                            <EditorsPickCard key={i} pick={article.og} />
                        </div>
                    ))
                ) : (
                    <>
                        {isLoading && <div>Загрузка статей...</div>}
                        {error && <div>Ошибка: {error.message}</div>}
                    </>
                )}
            </div>
        </div>
    );
};

export default ArticlesList;
