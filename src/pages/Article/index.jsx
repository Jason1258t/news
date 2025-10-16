import React from "react";
import { useParams } from "react-router-dom";
import ArticleRenderer from "features/articles/ArticleRenderer";
import { ArticleMeta } from "./ArticleMeta";
import { useArticle } from "features/articles/hooks/useArticle";
import LoadingWidget from "../../widgets/status/loading";
import ErrorWidget from "../../widgets/status/error";
import NotFoundWidget from "../../widgets/status/not-found";

const ArticlePage = () => {
    const { slug } = useParams();

    const { data: article, isLoading, error } = useArticle(slug);

    if (isLoading) {
        return <LoadingWidget message="Загрузка статьи..." />;
    }

    if (error) {
        return <ErrorWidget message={error?.message} onRetry={() => {}} />;
    }

    if (!article) {
        return <NotFoundWidget message="Статья не найдена" />;
    }

    return (
        <>
            <ArticleMeta article={article} />

            <main className="main">
                <div className="container">
                    <div className="layout-surface">
                        <div className="layout-content">
                            <ArticleRenderer article={article} />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ArticlePage;
