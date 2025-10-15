import React from "react";
import ArticleCard from "widgets/ArticleCard";
import { useArticles } from "features/articles/hooks/useArticles";
import styles from './HomeFeed.module.css';
import { useSearchParams } from "react-router-dom";
import LoadingWidget from "widgets/status/loading";
import ErrorWidget from "widgets/status/error";

const HomeFeed = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");

    const { data: articles, isLoading, error } = useArticles(category);

    if (isLoading) {
        return <LoadingWidget/>;
    }

    if (error) {
        return <ErrorWidget message={error?.message}/>;
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