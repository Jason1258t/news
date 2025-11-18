import React from "react";
import { useParams } from "react-router-dom";
import ArticleRenderer from "features/articles/ArticleRenderer";
import { ArticleMeta } from "./ArticleMeta";
import { useArticle } from "features/articles/hooks/useArticle";
import LoadingWidget from "../../shared/ui/status/loading";
import ErrorWidget from "../../shared/ui/status/error";
import NotFoundWidget from "../../shared/ui/status/not-found";
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
