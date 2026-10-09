import { useArticles, type Article } from "entities/article";
import { EditorsPickCard } from "entities/editors-pick";
import { Button } from "shared/ui/button";
import { ErrorWidget } from "shared/ui/error-widget";
import { LoadingSpinner } from "shared/ui/loading-widget";
import { clickableProps } from "shared/lib/a11y";
import styles from "./ArticlesList.module.css";

export const ArticlesList = ({
    onArticleSelected,
}: {
    onArticleSelected: (article: Article) => void;
}) => {
    const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useArticles({
        limit: 20,
    });

    const allArticles = data?.pages.flatMap((page) => page.data) ?? [];
    return (
        <div className={styles.panel}>
            <h2 className={styles.title}>Статьи</h2>
            <div className={styles.list}>
                {isLoading && <LoadingSpinner />}
                {error && <ErrorWidget message={error.message} />}
                {allArticles.map((article) => (
                    <div
                        key={article.slug}
                        className={styles.cardWrapper}
                        {...clickableProps(() => onArticleSelected(article))}
                    >
                        <EditorsPickCard pick={{ title: article.title }} />
                    </div>
                ))}
                {isFetchingNextPage && <LoadingSpinner />}
                {hasNextPage && !isFetchingNextPage && (
                    <Button variant="secondary" onClick={() => fetchNextPage()}>
                        Показать ещё
                    </Button>
                )}
            </div>
        </div>
    );
};
