import type { ArticleLikeCount } from "entities/article-like";
import styles from "./AnalyticsPage.module.css";
import { ArticleTitle } from "./ArticleTitle";

const LIMIT = 10;

/** Статьи с наибольшим числом лайков за всё время. */
export const TopLiked = ({ articles }: { articles: ArticleLikeCount[] }) => {
    if (articles.length === 0) {
        return <p className={styles.muted}>Лайков пока нет.</p>;
    }

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Статья</th>
                    <th scope="col" className={styles.numeric}>
                        Лайки
                    </th>
                </tr>
            </thead>
            <tbody>
                {articles.slice(0, LIMIT).map(({ slug, likes }, index) => (
                    <tr key={slug}>
                        <td className={styles.muted}>{index + 1}</td>
                        <td>
                            <ArticleTitle slug={slug} />
                        </td>
                        <td className={styles.numeric}>{likes.toLocaleString("ru-RU")}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
