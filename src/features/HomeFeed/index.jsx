import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ArticleCard from "widgets/ArticleCard";
import { useArticles } from "features/articles/hooks/useArticles";
import styles from "./HomeFeed.module.css";
import { useSearchParams } from "react-router-dom";
import LoadingWidget, { LoadingSpinner } from "shared/ui/status/loading";
import ErrorWidget from "shared/ui/status/error";
import { useQueryTags } from "features/tags/hooks/useQueryTags";

const HomeFeed = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");
    const { selectedTags } = useQueryTags();
    const { ref, inView } = useInView();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useArticles({ category, tags: selectedTags });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allArticles = data?.pages.flatMap((page) => page.data) || [];

    if (isLoading) {
        return <LoadingWidget />;
    }

    if (isError) {
        return <ErrorWidget message={error?.message} />;
    }

    if (allArticles.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>Статьи не найдены</p>
            </div>
        );
    }

    return (
        <div className={styles.feedContainer}>
            <div className={styles.feedGrid}>
                {allArticles.map((article, index) => (
                    <div
                        key={article.slug}
                        className={styles.layoutSurface}
                        ref={index === allArticles.length - 1 ? ref : null}
                    >
                        <ArticleCard
                            to={`/articles/${article.slug}`}
                            title={article.title}
                            excerpt={article.description}
                            date={article.dateDisplay}
                            category={article.category}
                            imageUrl={article.hero.url}
                        />
                    </div>
                ))}
            </div>

            {isFetchingNextPage && <LoadingSpinner />}

            {!hasNextPage && (
                <div className={styles.endMessage}>
                    <p>
                        {allArticles.length > 0
                            ? "Больше ничего нет"
                            : "Здесь ничего"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default HomeFeed;
