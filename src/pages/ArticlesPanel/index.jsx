import React, { useState } from "react";

import ArticleCardSmall from "widgets/ArticleCardSmall";
import { useArticles } from "features/articles/hooks/useArticles";
import { LoadingSpinner } from "shared/ui/status/loading";
import ErrorWidget from "shared/ui/status/error";
import { useDeleteConfirmation } from "widgets/modals/delete/useDeleteModal";
import { deleteArticle } from "features/articles/api/articles-api";
import { useEffect } from "react";

import styles from "./ArticlesPanel.module.css";
import ArticleCard from "widgets/ArticleCard";

import { Trash2, X } from "lucide-react";
import { DeleteConfirmationModal } from "widgets/modals/delete";
import EmptyArticleWidget from "./components/EmptyArticleWidget";

import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

import { Helmet } from "react-helmet-async";

const ArticlesPanel = () => {
    const { data, isLoading, error } = useArticles({ limit: 50 });

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
                    setArticle(null);
                    setArticles((prev) =>
                        prev.filter((a) => a.slug !== selectedArticle.slug)
                    );
                    toast.success(
                        `✅ Статья "${selectedArticle.title}" успешно удалена`
                    );
                } else {
                    toast.error(`❌ Ошибка: ${result.error}`);
                }
            },
        });
    };

    return (
        <>
            <Helmet>
                <title>Управление статьями | ПГТУ Breaking NEWS</title>
                <meta
                    name="description"
                    content="Панель для управления статьями"
                />
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
                                highlight={
                                    selectedArticle?.slug === article.slug
                                }
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
                                <button
                                    onClick={onDeleteArticle}
                                    className={styles.deleteButton}
                                >
                                    <Trash2 size="1.25rem" />
                                    Удалить
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <DeleteConfirmationModal {...deleteConfirmation.modalProps} />
            <Toaster />
        </>
    );
};

export default ArticlesPanel;
