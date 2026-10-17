import { Link } from "react-router-dom";
import { useArticle } from "entities/article";
import styles from "./AnalyticsPage.module.css";

/** Название статьи ссылкой; удалённые статьи — серым slug. */
export const ArticleTitle = ({ slug }: { slug: string }) => {
    const { data: article, isLoading } = useArticle(slug);

    if (isLoading) return <span className={styles.muted}>{slug}</span>;
    if (!article) return <span className={styles.muted}>{slug} (удалена)</span>;
    return <Link to={`/articles/${slug}`}>{article.title}</Link>;
};
