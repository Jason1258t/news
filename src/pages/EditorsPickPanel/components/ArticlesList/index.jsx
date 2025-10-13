import React from "react";
import { useArticles } from "features/articles/hooks/useArticles";
import EditorsPickCard from "entities/editors-pick/ui";
import styles from "./ArticlesList.module.css";

const ArticlesList = () => {
    const { data: articles, isLoading, error } = useArticles();

    return (
        <div>
            <h2 style={{ margin: 0, marginBottom: "1rem" }}>Список статей</h2>
            <div className={styles.list}>
                {articles ? (
                    articles.map((article) => (
                        <EditorsPickCard pick={article.og} />
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
