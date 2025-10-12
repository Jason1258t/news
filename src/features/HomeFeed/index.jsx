// HomeFeed.jsx
import React from "react";
import ArticleCard from "widgets/ArticleCard";
import { useArticles } from "features/articles/hooks/useArticles";
import styles from './HomeFeed.module.css';

const HomeFeed = () => {
    const { data: articles, isLoading, error } = useArticles();

    if (isLoading) {
        return <div className={styles.loading}>Загрузка статей...</div>;
    }

    if (error) {
        return <div className={styles.error}>Ошибка: {error.message}</div>;
    }

    return (
        <div className={styles.feedGrid}>
            {articles.map((article) => (
                <div key={article.slug} className={styles.layoutSurface}>
                    <ArticleCard
                        to={`/articles/${article.slug}`}
                        title={article.title}
                        excerpt={article.description}
                        date={article.date}
                        category={article.category}
                        imageUrl={article.hero.url}
                    />
                </div>
            ))}
        </div>
    );
};

export default HomeFeed;