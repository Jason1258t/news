import { Link } from "react-router-dom";
import styles from "./ArticleCard.module.css";

interface ArticleCardProps {
    /** Link target; without it the card renders as a link to the current page. */
    to?: string;
    title: string;
    excerpt?: string;
    date?: string;
    /** Categories joined with " • "; the card shows only the first one. */
    category?: string;
    imageUrl?: string;
}

const CATEGORY_SEPARATOR = " • ";

export const ArticleCard = ({
    to = "",
    title,
    excerpt,
    date,
    category,
    imageUrl,
}: ArticleCardProps) => {
    const mainCategory = category?.split(CATEGORY_SEPARATOR)[0];

    return (
        <Link to={to} className={styles.card}>
            {imageUrl ? (
                <div className={styles.imageWrap}>
                    <img src={imageUrl} alt={title} className={styles.image} />
                </div>
            ) : null}
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
                {mainCategory || date ? (
                    <div className={styles.meta}>
                        {mainCategory ? (
                            <span className={styles.category}>{mainCategory}</span>
                        ) : null}
                        {mainCategory && date ? <span aria-hidden="true">·</span> : null}
                        {date ? <span className={styles.date}>{date}</span> : null}
                    </div>
                ) : null}
            </div>
        </Link>
    );
};
