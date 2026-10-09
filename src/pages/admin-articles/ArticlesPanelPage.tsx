import { Trash2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArticleCard, ArticleCardSmall, useArticles } from "entities/article";
import { useDeleteArticle } from "features/article-delete";
import { AdminPage } from "widgets/admin-layout";
import { getErrorMessage } from "shared/lib/error";
import { Button } from "shared/ui/button";
import { DeleteConfirmationModal, useDeleteConfirmation } from "shared/ui/confirm-dialog";
import { ErrorWidget } from "shared/ui/error-widget";
import { LoadingSpinner } from "shared/ui/loading-widget";
import styles from "./ArticlesPanelPage.module.css";
import { EmptyArticleWidget } from "./EmptyArticleWidget";

const PAGE_SIZE = 20;

export const ArticlesPanelPage = () => {
    const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useArticles({
        limit: PAGE_SIZE,
    });
    const articles = data?.pages.flatMap((page) => page.data) ?? [];

    const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
    const selectedArticle = articles.find((article) => article.slug === selectedSlug) ?? null;

    const { mutateAsync: deleteArticle } = useDeleteArticle();
    const deleteConfirmation = useDeleteConfirmation();

    const onDeleteArticle = () => {
        if (!selectedArticle) return;
        deleteConfirmation.openModal({
            title: "Удалить статью?",
            description: "Это действие нельзя будет отменить. Статья будет удалена безвозвратно.",
            onConfirm: async () => {
                try {
                    await deleteArticle(selectedArticle.slug);
                    setSelectedSlug(null);
                    toast.success(`✅ Статья "${selectedArticle.title}" успешно удалена`);
                } catch (deleteError) {
                    toast.error(`❌ Ошибка: ${getErrorMessage(deleteError)}`);
                }
            },
        });
    };

    return (
        <AdminPage
            title="Управление статьями"
            description="Выберите статью в списке, чтобы открыть или удалить её"
        >
            <div className={styles.page}>
                <div className={styles.listSection}>
                    <h2 className={styles.sectionTitle}>Статьи</h2>
                    <div className={styles.list}>
                        {isLoading && <LoadingSpinner />}
                        {error && <ErrorWidget message={error.message} />}
                        {articles.map((article) => (
                            <ArticleCardSmall
                                onClick={() => setSelectedSlug(article.slug)}
                                key={article.slug}
                                title={article.title}
                                excerpt={article.description}
                                imageUrl={article.hero.url}
                                date={article.dateDisplay}
                                highlight={selectedSlug === article.slug}
                            />
                        ))}
                        {isFetchingNextPage && <LoadingSpinner />}
                        {hasNextPage && !isFetchingNextPage && (
                            <Button variant="ghost" size="sm" onClick={() => fetchNextPage()}>
                                Показать ещё
                            </Button>
                        )}
                    </div>
                </div>

                <div className={styles.selectedArticleSection}>
                    <div className={styles.currentArticleHeader}>
                        <h2 className={styles.sectionTitle}>Выбранная статья</h2>
                        {selectedArticle && (
                            <button
                                type="button"
                                onClick={() => setSelectedSlug(null)}
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
                            <>
                                <ArticleCard
                                    to={`/articles/${selectedArticle.slug}`}
                                    title={selectedArticle.title}
                                    excerpt={selectedArticle.description}
                                    date={selectedArticle.dateDisplay}
                                    imageUrl={selectedArticle.hero.url}
                                    category={selectedArticle.category}
                                />
                                <div className={styles.selectedArticleActions}>
                                    <Button variant="danger" size="sm" onClick={onDeleteArticle}>
                                        <Trash2 size="1rem" aria-hidden="true" />
                                        Удалить
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <DeleteConfirmationModal {...deleteConfirmation.modalProps} />
        </AdminPage>
    );
};
