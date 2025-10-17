import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ArticleCard from "widgets/ArticleCard";
import { useArticles } from "features/articles/hooks/useArticles";
import styles from './HomeFeed.module.css';
import { useSearchParams } from "react-router-dom";
import LoadingWidget, { LoadingSpinner } from "widgets/status/loading";
import ErrorWidget from "widgets/status/error";

const HomeFeed = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");
    const { ref, inView } = useInView();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useArticles(category);

    useEffect(() => {
        console.log(inView, hasNextPage);
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allArticles = data?.pages.flatMap(page => page.data) || [];

    if (isLoading) {
        return <LoadingWidget/>;
    }

    if (isError) {
        return <ErrorWidget message={error?.message}/>;
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
                            date={article.date}
                            category={article.category}
                            imageUrl={article.hero.url}
                        />
                    </div>
                ))}
            </div>

            {isFetchingNextPage && (
                <LoadingSpinner/>
            )}

            {!hasNextPage && allArticles.length > 0 && (
                <div className={styles.endMessage}>
                    <p>Больше ничего нет</p>
                </div>
            )}
        </div>
    );
};

export default HomeFeed;