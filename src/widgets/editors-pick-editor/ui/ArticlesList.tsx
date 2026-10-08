import { useArticles, type Article } from "entities/article";
import { EditorsPickCard } from "entities/editors-pick";
import { OutlinedButton } from "shared/ui/button";
import { ErrorWidget } from "shared/ui/error-widget";
import { LoadingSpinner } from "shared/ui/loading-widget";
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
        <div>
            <h2 style={{ margin: 0, marginBottom: "1rem" }}>Список статей</h2>
            <div className={styles.list}>
                {isLoading && <LoadingSpinner />}
                {error && <ErrorWidget message={error.message} />}
                {allArticles.map((article) => (
                    <div
                        key={article.slug}
                        className={styles.cardWrapper}
                        onClick={() => onArticleSelected(article)}
                    >
                        <EditorsPickCard pick={{ title: article.title }} />
                    </div>
                ))}
                {isFetchingNextPage && <LoadingSpinner />}
                {hasNextPage && !isFetchingNextPage && (
                    <OutlinedButton onClick={() => fetchNextPage()}>Показать ещё</OutlinedButton>
                )}
            </div>
        </div>
    );
};
