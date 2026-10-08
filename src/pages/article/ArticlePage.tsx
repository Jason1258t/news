import { useParams } from "react-router-dom";
import { ArticleView } from "widgets/article-view";
import { ArticleMeta } from "./ArticleMeta";
import { useArticle } from "entities/article";
import { LoadingWidget } from "shared/ui/loading-widget";
import { ErrorWidget } from "shared/ui/error-widget";
import { NotFoundWidget } from "shared/ui/not-found-widget";
import { Content, SurfacePage } from "shared/ui/layout";

export const ArticlePage = () => {
    const { slug = "" } = useParams();

    const { data: article, isLoading, error, refetch } = useArticle(slug);

    if (isLoading) {
        return <LoadingWidget message="Загрузка статьи..." />;
    }

    if (error) {
        return <ErrorWidget message={error.message} onRetry={() => refetch()} />;
    }

    if (!article) {
        return <NotFoundWidget message="Статья не найдена" />;
    }

    return (
        <>
            <ArticleMeta article={article} />
            <SurfacePage fullWidthOnMobile>
                <Content>
                    <ArticleView article={article} />
                </Content>
            </SurfacePage>
        </>
    );
};
