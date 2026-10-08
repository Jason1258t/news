import React from "react";
import { useParams } from "react-router-dom";
import ArticleRenderer from "widgets/article-view/ui/ArticleView";
import { ArticleMeta } from "./ArticleMeta";
import { useArticle } from "entities/article/api/useArticle";
import LoadingWidget from "shared/ui/loading-widget/LoadingWidget";
import ErrorWidget from "shared/ui/error-widget/ErrorWidget";
import NotFoundWidget from "shared/ui/not-found-widget/NotFoundWidget";
import { Content, SurfacePage } from "shared/ui/layout";

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
            <SurfacePage fullWidthOnMobile>
                <Content>
                    <ArticleRenderer article={article} />
                </Content>
            </SurfacePage>
        </>
    );
};

export default ArticlePage;
