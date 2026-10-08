import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ArticleCard, useArticles } from "entities/article";
import styles from "./ArticleFeed.module.css";
import { useSearchParams } from "react-router-dom";
import { LoadingWidget, LoadingSpinner } from "shared/ui/loading-widget";
import { ErrorWidget } from "shared/ui/error-widget";
import { useQueryTags } from "features/filter-by-tags";

export const ArticleFeed = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");
    const { selectedTags } = useQueryTags();
    const { ref, inView } = useInView();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
        useArticles({ category, tags: selectedTags });

    const allArticles = data?.pages.flatMap((page) => page.data) ?? [];
    // With category + tags the category is filtered on the client (B15), so a loaded page can
    // be empty while later pages still match; there is no last card to scroll to then.
    const needsMore = inView || allArticles.length === 0;

    useEffect(() => {
        if (needsMore && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [needsMore, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading || (allArticles.length === 0 && hasNextPage)) {
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
                    <p>Больше ничего нет</p>
                </div>
            )}
        </div>
    );
};
