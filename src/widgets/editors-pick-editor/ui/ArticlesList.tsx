import { useArticles, type Article } from "entities/article";
import { EditorsPickCard } from "entities/editors-pick";
import styles from "./ArticlesList.module.css";
import { LoadingSpinner } from "shared/ui/loading-widget";
import { ErrorWidget } from "shared/ui/error-widget";

export const ArticlesList = ({
    onArticleSelected,
}: {
    onArticleSelected: (article: Article) => void;
}) => {
    const { data, isLoading, error } = useArticles({ limit: 50 });

    const allArticles = data?.pages.flatMap((page) => page.data) || [];
    return (
        <div>
            <h2 style={{ margin: 0, marginBottom: "1rem" }}>Список статей</h2>
            <div className={styles.list}>
                {/* TODO(stage 1): allArticles is always truthy, so loading/error never show (B9) */}
                {allArticles ? (
                    allArticles.map((article, i) => (
                        <div
                            className={styles.cardWrapper}
                            onClick={() => onArticleSelected(article)}
                        >
                            <EditorsPickCard key={i} pick={article.og} />
                        </div>
                    ))
                ) : (
                    <>
                        {isLoading && <LoadingSpinner />}
                        {error && <ErrorWidget message={error?.message} />}
                    </>
                )}
            </div>
        </div>
    );
};
