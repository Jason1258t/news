import type { ArticleViews } from "entities/site-stats";
import styles from "./AnalyticsPage.module.css";
import { ArticleTitle } from "./ArticleTitle";

const LIMIT = 20;

interface TopArticlesProps {
    articles: ArticleViews[];
    /** Лайки за всё время по slug; без них колонка показывает «—». */
    likes?: Map<string, number>;
}

/** Топ статей за период: название, просмотры (из них из Telegram), доля от самой популярной и лайки. */
export const TopArticles = ({ articles, likes }: TopArticlesProps) => {
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
                    <th scope="col" className={styles.numeric}>
                        из Telegram
                    </th>
                    <th scope="col" className={styles.numeric}>
                        Лайки
                    </th>
                </tr>
            </thead>
            <tbody>
                {articles.slice(0, LIMIT).map(({ slug, views, telegram }, index) => (
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
                        <td className={styles.numeric}>{telegram.toLocaleString("ru-RU")}</td>
                        <td className={styles.numeric}>
                            {likes ? (likes.get(slug) ?? 0).toLocaleString("ru-RU") : "—"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
