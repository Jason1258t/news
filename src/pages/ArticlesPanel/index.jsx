import React, { useState } from "react";

import ArticleCardSmall from "widgets/ArticleCardSmall";
import { useArticles } from "features/articles/hooks/useArticles";
import { LoadingSpinner } from "widgets/status/loading";
import ErrorWidget from "widgets/status/error";
import { useDeleteConfirmation } from "widgets/modals/delete/useDeleteModal";
import { deleteArticle } from "features/articles/api/articles-api";
import { useEffect } from "react";

import styles from "./ArticlesPanel.module.css";
import ArticleCard from "widgets/ArticleCard";

import { Trash2, X } from "lucide-react";
import { DeleteConfirmationModal } from "widgets/modals/delete";
import EmptyArticleWidget from "./components/EmptyArticleWidget";

const ArticlesPanel = () => {
    const { data, isLoading, error } = useArticles(undefined, 50);

    const [allArticles, setArticles] = useState([]);

    useEffect(() => {
        if (data?.pages) {
            setArticles(data.pages.flatMap((page) => page.data));
        }
    }, [data]);

    const [selectedArticle, setArticle] = useState(null);

    const deleteConfirmation = useDeleteConfirmation();

    const onDeleteArticle = () => {
        if (!selectedArticle) return;
        deleteConfirmation.openModal({
            title: "Удалить статью?",
            description:
                "Это действие нельзя будет отменить. Статья будет удалена безвозвратно.",
            onConfirm: async () => {
                const result = await deleteArticle(selectedArticle.slug);

                if (result.success) {
                    deleteConfirmation.closeModal();
                    setArticle(null);
                    setArticles((prev) =>
                        prev.filter((a) => a.slug !== selectedArticle.slug)
                    );
                    alert(
                        `✅ Статья "${selectedArticle.title}" успешно удалена`
                    );
                } else {
                    alert(`❌ Ошибка: ${result.error}`);
                }
            },
        });
    };

    return (
        <>
            <div className={styles.page}>
                <div className={styles.listSection}>
                    <h2>Список статей</h2>
                    <div className={styles.list}>
                        {allArticles ? (
                            allArticles.map((article, i) => (
                                <ArticleCardSmall
                                    onClick={() => setArticle(article)}
                                    key={i}
                                    title={article.title}
                                    excerpt={article.description}
                                    imageUrl={article.hero.url}
                                    date={article.dateDisplay}
                                    highlight={
                                        selectedArticle?.slug === article.slug
                                    }
                                />
                            ))
                        ) : (
                            <>
                                {isLoading && <LoadingSpinner />}
                                {error && (
                                    <ErrorWidget message={error?.message} />
                                )}
                            </>
                        )}
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

                    <dib className={styles.scrolled}>
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
                                <button
                                    onClick={onDeleteArticle}
                                    className={styles.deleteButton}
                                >
                                    <Trash2 size="1.25rem" />
                                    Удалить
                                </button>
                            </div>
                        )}
                    </dib>
                </div>
            </div>
            <DeleteConfirmationModal {...deleteConfirmation.modalProps} />
        </>
    );
};

export default ArticlesPanel;
