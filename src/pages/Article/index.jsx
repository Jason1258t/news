import React from "react";
import { useParams } from "react-router-dom";
import ArticleRenderer from "features/articles/ArticleRenderer";
import { ArticleMeta } from "./ArticleMeta";
import { useArticle } from "features/articles/hooks/useArticle";
import LoadingWidget from "./components/LoadingWidget";
import ErrorWidget from "./components/ErrorWidget";
import NotFoundWidget from "./components/NotFoundWidget";

const Article = () => {
    const { slug } = useParams();

    const { data: article, isLoading, error } = useArticle(slug);

    if (isLoading) {
        return <LoadingWidget/>;
    }

    if (error) {
        return <ErrorWidget message={error?.message} onRetry={() => {}}/>;
    }

    // if (!article) {
        return <NotFoundWidget/>;
    // }

    if (!article) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>Статья не найдена</h1>
                <p>Статья с идентификатором "{slug}" не существует.</p>
            </div>
        );
    }

    const fullUrl = `https://jason1258t.github.io/news/#/articles/${article.slug}`;
    const imageUrl = article.hero.url;

    return (
        <>
            <ArticleMeta
                article={article}
                fullUrl={fullUrl}
                imageUrl={imageUrl}
            />
            <ArticleRenderer article={article} />
        </>
    );
};

export default Article;
