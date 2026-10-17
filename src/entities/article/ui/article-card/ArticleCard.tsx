import type { ReactNode } from "react";
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
    tags?: string[];
    /** Makes the tags clickable; without it they are not rendered. */
    onTagClick?: (tag: string) => void;
    /** Counters at the end of the meta row (likes). */
    stats?: ReactNode;
}

const CATEGORY_SEPARATOR = " • ";
const MAX_TAGS = 2;

export const ArticleCard = ({
    to = "",
    title,
    excerpt,
    date,
    category,
    imageUrl,
    tags = [],
    onTagClick,
    stats,
}: ArticleCardProps) => {
    const mainCategory = category?.split(CATEGORY_SEPARATOR)[0];
    const visibleTags = onTagClick ? tags.slice(0, MAX_TAGS) : [];

    return (
        <article className={styles.card}>
            {imageUrl ? (
                <div className={styles.imageWrap}>
                    <img src={imageUrl} alt="" className={styles.image} />
                </div>
            ) : null}
            <div className={styles.content}>
                <h3 className={styles.title}>
                    {/* The ::after overlay makes the whole card the link target. */}
                    <Link to={to} className={styles.link}>
                        {title}
                    </Link>
                </h3>
                {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
                {mainCategory || date || stats ? (
                    <div className={styles.meta}>
                        {mainCategory ? (
                            <span className={styles.category}>{mainCategory}</span>
                        ) : null}
                        {mainCategory && date ? <span aria-hidden="true">·</span> : null}
                        {date ? <span className={styles.date}>{date}</span> : null}
                        {stats}
                    </div>
                ) : null}
                {visibleTags.length > 0 ? (
                    <ul className={styles.tags}>
                        {visibleTags.map((tag) => (
                            <li key={tag}>
                                <button
                                    type="button"
                                    className={styles.tag}
                                    onClick={() => onTagClick?.(tag)}
                                >
                                    #{tag}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </article>
    );
};
