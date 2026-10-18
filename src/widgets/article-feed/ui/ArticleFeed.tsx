import { Fragment, useEffect, type ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { ArticleCard, useArticles } from "entities/article";
import { LikeCount } from "entities/article-like";
import styles from "./ArticleFeed.module.css";
import { useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "shared/ui/loading-widget";
import { FeedSkeleton } from "./FeedSkeleton";
import { ErrorWidget } from "shared/ui/error-widget";
import { useQueryTags } from "features/filter-by-tags";
import { linkFrom } from "features/track-views";

/** Number of cards shown before the promo block. */
const PROMO_AFTER = 3;

interface ArticleFeedProps {
    /** Native block placed inside the feed after the third card (or the last one if fewer). */
    promo?: ReactNode;
}

export const ArticleFeed = ({ promo }: ArticleFeedProps) => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");
    const { selectedTags, addTag } = useQueryTags();
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
        return <FeedSkeleton />;
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
        <section className={styles.feedContainer} aria-label="Лента статей">
            <div className={styles.feedGrid}>
                {allArticles.map((article, index) => (
                    <Fragment key={article.slug}>
                        <div
                            className={styles.layoutSurface}
                            ref={index === allArticles.length - 1 ? ref : null}
                        >
                            <ArticleCard
                                to={`/articles/${article.slug}`}
                                linkState={linkFrom("feed")}
                                title={article.title}
                                excerpt={article.description}
                                date={article.dateDisplay}
                                category={article.category}
                                imageUrl={article.hero.url}
                                tags={article.tags}
                                onTagClick={addTag}
                                stats={<LikeCount slug={article.slug} />}
                            />
                        </div>
                        {promo && index === Math.min(PROMO_AFTER, allArticles.length) - 1
                            ? promo
                            : null}
                    </Fragment>
                ))}
            </div>

            {isFetchingNextPage && <LoadingSpinner />}

            {!hasNextPage && (
                <div className={styles.endMessage}>
                    <p>Больше ничего нет</p>
                </div>
            )}
        </section>
    );
};
