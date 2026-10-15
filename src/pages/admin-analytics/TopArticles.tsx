import { Link } from "react-router-dom";
import { useArticle } from "entities/article";
import type { ArticleViews } from "entities/site-stats";
import styles from "./AnalyticsPage.module.css";

const LIMIT = 20;

const ArticleTitle = ({ slug }: { slug: string }) => {
    const { data: article, isLoading } = useArticle(slug);

    if (isLoading) return <span className={styles.muted}>{slug}</span>;
    if (!article) return <span className={styles.muted}>{slug} (удалена)</span>;
    return <Link to={`/articles/${slug}`}>{article.title}</Link>;
};

/** Топ статей за период: название, число просмотров и доля от самой популярной. */
export const TopArticles = ({ articles }: { articles: ArticleViews[] }) => {
    const max = articles[0]?.views;
    if (!max) {
        return <p className={styles.muted}>За этот период статьи не открывали.</p>;
    }

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Статья</th>
                    <th scope="col" className={styles.numeric}>
                        Просмотры
                    </th>
                </tr>
            </thead>
            <tbody>
                {articles.slice(0, LIMIT).map(({ slug, views }, index) => (
                    <tr key={slug}>
                        <td className={styles.muted}>{index + 1}</td>
                        <td>
                            <ArticleTitle slug={slug} />
                            <span
                                className={styles.share}
                                style={{ width: `${(views / max) * 100}%` }}
                                aria-hidden="true"
                            />
                        </td>
                        <td className={styles.numeric}>{views.toLocaleString("ru-RU")}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
