import React from "react";
import { useParams } from "react-router-dom";
import ArticleRenderer from "features/articles/ArticleRenderer";
import { ArticleMeta } from "./ArticleMeta";
import { useArticle } from "features/articles/hooks/useArticle";
import LoadingWidget from "../../widgets/status/loading";
import ErrorWidget from "../../widgets/status/error";
import NotFoundWidget from "../../widgets/status/not-found";

const Article = () => {
    const { slug } = useParams();

    const { data: article, isLoading, error } = useArticle(slug);

    if (isLoading) {
        return <LoadingWidget message="Загрузка статьи..."/>;
    }

    if (error) {
        return <ErrorWidget message={error?.message} onRetry={() => {}}/>;
    }

    if (!article) {
        return <NotFoundWidget message="Статья не найдена"/>;
    }

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
