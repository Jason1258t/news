import { useEffect, useState } from "react";
import {
    ArticleCard,
    ArticleCardSmall,
    deleteArticle,
    useArticles,
    type Article,
} from "entities/article";
import { LoadingSpinner } from "shared/ui/loading-widget";
import { ErrorWidget } from "shared/ui/error-widget";
import { useDeleteConfirmation, DeleteConfirmationModal } from "shared/ui/confirm-dialog";

import styles from "./ArticlesPanelPage.module.css";

import { Trash2, X } from "lucide-react";
import { EmptyArticleWidget } from "./EmptyArticleWidget";

import toast from "react-hot-toast";

import { Helmet } from "react-helmet-async";
import { PROJECT_NAME } from "shared/config";

export const ArticlesPanelPage = () => {
    const { data, isLoading, error } = useArticles({ limit: 50 });

    const [allArticles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        if (data?.pages) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- TODO(stage 2): move to react-query
            setArticles(data.pages.flatMap((page) => page.data));
        }
    }, [data]);

    const [selectedArticle, setArticle] = useState<Article | null>(null);

    const deleteConfirmation = useDeleteConfirmation();

    const onDeleteArticle = () => {
        if (!selectedArticle) return;
        deleteConfirmation.openModal({
            title: "Удалить статью?",
            description: "Это действие нельзя будет отменить. Статья будет удалена безвозвратно.",
            onConfirm: async () => {
                const result = await deleteArticle(selectedArticle.slug);

                if (result.success) {
                    setArticle(null);
                    setArticles((prev) => prev.filter((a) => a.slug !== selectedArticle.slug));
                    toast.success(`✅ Статья "${selectedArticle.title}" успешно удалена`);
                } else {
                    toast.error(`❌ Ошибка: ${result.error}`);
                }
            },
        });
    };

    return (
        <>
            <Helmet>
                <title>{`Управление статьями | ${PROJECT_NAME}`}</title>
                <meta name="description" content="Панель для управления статьями" />
            </Helmet>
            <div className={styles.page}>
                <div className={styles.listSection}>
                    <h2>Список статей</h2>
                    <div className={styles.list}>
                        {isLoading && <LoadingSpinner />}
                        {error && <ErrorWidget message={error?.message} />}
                        {allArticles.map((article) => (
                            <ArticleCardSmall
                                onClick={() => setArticle(article)}
                                key={article.slug}
                                title={article.title}
                                excerpt={article.description}
                                imageUrl={article.hero.url}
                                date={article.dateDisplay}
                                highlight={selectedArticle?.slug === article.slug}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.selectedArticleSection}>
                    <div className={styles.currentArticleHeader}>
                        <h2>Выбранная статья</h2>
                        {selectedArticle && (
                            <button
                                onClick={() => setArticle(null)}
                                className={styles.closeButton}
                                aria-label="Закрыть"
                            >
                                <X className={styles.icon} />
                            </button>
                        )}
                    </div>

                    <div className={styles.scrolled}>
                        {!selectedArticle && <EmptyArticleWidget />}
                        {selectedArticle && (
                            <ArticleCard
                                title={selectedArticle.title}
                                excerpt={selectedArticle.description}
                                date={selectedArticle.dateDisplay}
                                imageUrl={selectedArticle.hero.url}
                                category={selectedArticle.category}
                            />
                        )}

                        {selectedArticle && (
                            <div className={styles.selectedArticleActions}>
                                <button onClick={onDeleteArticle} className={styles.deleteButton}>
                                    <Trash2 size="1.25rem" />
                                    Удалить
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <DeleteConfirmationModal {...deleteConfirmation.modalProps} />
        </>
    );
};
