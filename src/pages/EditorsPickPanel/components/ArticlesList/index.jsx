import React from "react";
import { useArticles } from "features/articles/hooks/useArticles";
import EditorsPickCard from "entities/editors-pick/ui";
import styles from "./ArticlesList.module.css";
import { LoadingSpinner } from "widgets/status/loading";
import ErrorWidget from "widgets/status/error";

const ArticlesList = ({ onArticleSelected }) => {
    const { data, isLoading, error } = useArticles({ limit: 50 });

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
                        {isLoading && <LoadingSpinner />}
                        {error && <ErrorWidget message={error?.message} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default ArticlesList;
